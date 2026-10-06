from pydantic import BaseModel, Field
from typing import Optional


# ---- Models ----
class JobCreate(BaseModel):
    customer_name: str
    phone: str = ""
    email: str = ""
    address: str = ""
    problem: str = ""
    equipment_type: str = ""
    preferred_contact: str = "phone"
    customer_remarks: str = ""
    source: str = "phone"
    note: str = ""


class JobUpdate(BaseModel):
    customer_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    problem: Optional[str] = None
    equipment_type: Optional[str] = None
    preferred_contact: Optional[str] = None
    customer_remarks: Optional[str] = None
    source: Optional[str] = None
    note: Optional[str] = None
    stage: Optional[str] = None


class StageUpdate(BaseModel):
    stage: str


class ContactLog(BaseModel):
    kind: str = "call"  # call | text | note
    detail: str = ""


class QuoteCreate(BaseModel):
    amount: float
    description: str = ""
    customer_remarks: str = ""
    notes: str = ""


class QuoteUpdate(BaseModel):
    amount: Optional[float] = None
    description: Optional[str] = None
    customer_remarks: Optional[str] = None
    notes: Optional[str] = None


class VisitCreate(BaseModel):
    technician: str
    date: str  # YYYY-MM-DD
    time: str  # HH:MM
    notes: str = ""


class VisitUpdate(BaseModel):
    technician: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    notes: Optional[str] = None


class CompletionCreate(BaseModel):
    technician: str = ""
    work_performed: str = ""
    notes: str = ""
    customer_remarks: str = ""
    final_amount: Optional[float] = None


class ParseRequest(BaseModel):
    text: str = Field(min_length=1, max_length=8000)


class ParsedFields(BaseModel):
    customer_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    problem: Optional[str] = None
    equipment_type: Optional[str] = None
    customer_remarks: Optional[str] = None
