import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import ScanHistory
from app.services.phishing import PhishingDetector
from app.services.invoice import evaluate_invoice
from app.config import Settings

# Update this to your actual database URL
DATABASE_URL = "sqlite:///../cybersaarthi.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

# Run with: python -m app.migrate_explanations

def run():
    settings = Settings()
    detector = PhishingDetector(
        model_path=settings.PHISHING_MODEL_PATH,
        blocklist_path=settings.BLOCKLIST_PATH,
    )
    db = SessionLocal()
    reports = db.query(ScanHistory).all()
    updated = 0
    for r in reports:
        # Skip if already JSON with both languages
        explanation_obj = None
        if isinstance(r.explanation, dict):
            explanation_obj = r.explanation
        else:
            try:
                explanation_obj = json.loads(r.explanation)
            except Exception:
                explanation_obj = None
        if explanation_obj and isinstance(explanation_obj, dict) and "en" in explanation_obj and "hi" in explanation_obj and explanation_obj["en"] and explanation_obj["hi"]:
            continue
        # Use original Hindi explanation
        hindi_exp = r.explanation if isinstance(r.explanation, str) else str(r.explanation)
        # Generate English explanation using input_text
        english_exp = ""
        if hasattr(r, "input_text") and r.input_text:
            if r.scan_type == "email":
                result_en = detector.predict(r.input_text, lang="en")
                english_exp = "; ".join(result_en.explanations)
            elif r.scan_type.startswith("invoice"):
                result_en = evaluate_invoice(r.input_text, lang="en")
                english_exp = "; ".join(result_en.explanations)
        # Save as JSON string
        r.explanation = json.dumps({"en": english_exp, "hi": hindi_exp})
        db.add(r)
        updated += 1
    db.commit()
    print(f"Migration complete. Updated {updated} reports.")

if __name__ == "__main__":
    run()
