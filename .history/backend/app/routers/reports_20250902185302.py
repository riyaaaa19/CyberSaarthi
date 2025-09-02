from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..deps import db_dep
from ..models import ScanHistory
from ..schemas import HistoryPage, HistoryItem, Verdict

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/history", response_model=HistoryPage)
def get_history(
    db: Session = Depends(db_dep),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    q = db.query(ScanHistory).order_by(ScanHistory.created_at.desc())
    total = q.count()
    rows = q.limit(limit).offset(offset).all()

    import json
    def parse_explanation(e):
        if isinstance(e, str):
            try:
                return json.loads(e)
            except Exception:
                return {"en": e}
        return e if e else {}
    items = [
        HistoryItem(
            id=r.id,
            scan_type=r.scan_type,
            verdict=Verdict(r.verdict),
            score=float(r.score),
            explanation=parse_explanation(r.explanation),
            created_at=r.created_at.isoformat(),
        )
        for r in rows
    ]

    return HistoryPage(items=items, total=total, limit=limit, offset=offset)


@router.get("/health")
def health():
    return {"status": "ok"}
