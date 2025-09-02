import json
from sqlalchemy.orm import Session
from backend.app.models import ScanHistory
from backend.app.services.phishing import PhishingDetector
from backend.app.services.invoice import evaluate_invoice
from backend.app.config import Settings
from backend.app.utils.text import sha256
from backend.app.deps import db_dep

# Run with: uvicorn backend.app.migrate_explanations:run

def run():
    settings = Settings()
    detector = PhishingDetector(
        model_path=settings.PHISHING_MODEL_PATH,
        blocklist_path=settings.BLOCKLIST_PATH,
    )
    db: Session = next(db_dep())
    reports = db.query(ScanHistory).all()
    updated = 0
    for r in reports:
        # Skip if already JSON
        try:
            explanation_obj = json.loads(r.explanation)
            if isinstance(explanation_obj, dict) and "en" in explanation_obj and "hi" in explanation_obj:
                continue
        except Exception:
            pass
        # Assume old explanation is Hindi
        hindi_exp = r.explanation
        # Generate English explanation
        if r.scan_type == "email":
            result_en = detector.predict(r.input_hash, lang="en")
            english_exp = "; ".join(result_en.explanations)
        elif r.scan_type.startswith("invoice"):
            result_en = evaluate_invoice(r.input_hash, lang="en")
            english_exp = "; ".join(result_en.explanations)
        else:
            english_exp = ""
        # Save as JSON
        r.explanation = json.dumps({"en": english_exp, "hi": hindi_exp})
        updated += 1
    db.commit()
    print(f"Migration complete. Updated {updated} reports.")

if __name__ == "__main__":
    run()
