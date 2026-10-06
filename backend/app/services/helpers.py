from datetime import datetime, timezone
from fastapi import HTTPException
from app.core.config import db, STAGE_MIGRATION, OPEN_STAGES, QUIET_DAYS


def migrate_stage(stage: str) -> str:
    """Map legacy stage names to new ones."""
    return STAGE_MIGRATION.get(stage, stage)


def now_utc():
    return datetime.now(timezone.utc)


def iso(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).isoformat()


def serialize_job(doc: dict) -> dict:
    created = doc["created_at"]
    last = doc["last_contact_at"]
    created_dt = datetime.fromisoformat(created) if isinstance(created, str) else created
    last_dt = datetime.fromisoformat(last) if isinstance(last, str) else last
    n = now_utc()
    days_waiting = (n - created_dt).days
    secs_since_contact = (n - last_dt).total_seconds()
    days_since_contact = int(secs_since_contact // 86400)
    stage = migrate_stage(doc["stage"])
    return {
        "id": doc["id"],
        "customer_name": doc["customer_name"],
        "phone": doc.get("phone", ""),
        "email": doc.get("email", ""),
        "address": doc.get("address", ""),
        "problem": doc.get("problem", ""),
        "equipment_type": doc.get("equipment_type", ""),
        "preferred_contact": doc.get("preferred_contact", "phone"),
        "customer_remarks": doc.get("customer_remarks", ""),
        "source": doc.get("source", "phone"),
        "note": doc.get("note", ""),
        "stage": stage,
        "created_at": created,
        "last_contact_at": last,
        "contacts": doc.get("contacts", []),
        "quote": doc.get("quote", None),
        "visit": doc.get("visit", None),
        "completion": doc.get("completion", None),
        "days_waiting": days_waiting,
        "days_since_contact": days_since_contact,
        "is_quiet": stage in OPEN_STAGES and secs_since_contact >= QUIET_DAYS * 86400,
    }


async def get_job_or_404(job_id: str) -> dict:
    doc = await db.jobs.find_one({"id": job_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Job not found")
    return doc
