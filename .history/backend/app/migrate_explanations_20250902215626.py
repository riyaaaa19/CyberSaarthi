import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import ScanHistory
from app.services.phishing import PhishingDetector
from app.services.invoice import evaluate_invoice
from app.config import Settings
from typing import Optional

# Update this to your actual database URL
DATABASE_URL = "sqlite:///../cybersaarthi.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

# Run with: python -m app.migrate_explanations

def run():
    db = SessionLocal()
    num_deleted = db.query(ScanHistory).delete()
    db.commit()
    print(f"All old reports deleted. {num_deleted} records removed.")

def simplify_explanation(expl):
    # Split by ; or |, keep only key points, rephrase
    if not expl:
        return ""
    lines = [e.strip() for e in expl.split(';') if e.strip()]
    result = []
    for line in lines:
        if "safe" in line.lower():
            result.append("Safe email.")
        elif "suspicious indicators" in line.lower():
            result.append("Possible phishing detected.")
        elif "high-risk" in line.lower():
            result.append("High risk detected.")
        elif "domain found" in line.lower() or "domain:" in line.lower():
            domain = line.split(':')[-1].strip()
            result.append(f"Suspicious domain: {domain}")
        elif "ml score" in line.lower():
            continue  # skip ML score
        elif "attachment" in line.lower():
            result.append("Malicious attachment detected.")
        else:
            result.append(line)
    return " ".join(result)

def is_double_encoded(obj):
    # Returns True if obj is a dict and any value is a JSON string
    if isinstance(obj, dict):
        for v in obj.values():
            if isinstance(v, str) and v.strip().startswith('{'):
                return True
    return False

if __name__ == "__main__":
    run()
