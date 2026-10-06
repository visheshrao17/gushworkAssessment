import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8000").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def s():
    return requests.Session()


# -------- Health --------
def test_root(s):
    r = s.get(f"{API}/")
    assert r.status_code == 200
    assert "CoolTrack" in r.json().get("message", "")


# -------- Call Today --------
def test_call_today_buckets(s):
    r = s.get(f"{API}/call-today")
    assert r.status_code == 200
    data = r.json()
    for k in ("waiting_quote", "needs_scheduling", "gone_quiet", "total"):
        assert k in data
    # seeded expectations
    assert len(data["gone_quiet"]) >= 2
    assert len(data["waiting_quote"]) >= 2
    assert len(data["needs_scheduling"]) >= 1
    # all items in gone_quiet should have is_quiet True and open stage
    for j in data["gone_quiet"]:
        assert j["is_quiet"] is True
        assert j["stage"] in ("New", "Quoted", "Approved", "Scheduled")


# -------- Jobs list / filter --------
def test_jobs_list_and_filter(s):
    r = s.get(f"{API}/jobs")
    assert r.status_code == 200
    all_jobs = r.json()
    assert isinstance(all_jobs, list) and len(all_jobs) >= 8
    for j in all_jobs:
        assert "id" in j and "days_waiting" in j and "is_quiet" in j

    r2 = s.get(f"{API}/jobs", params={"stage": "Quoted"})
    assert r2.status_code == 200
    quoted = r2.json()
    assert all(j["stage"] == "Quoted" for j in quoted)
    assert len(quoted) >= 1


# -------- Counts --------
def test_counts(s):
    r = s.get(f"{API}/jobs/counts")
    assert r.status_code == 200
    c = r.json()
    for k in ("total", "open", "by_stage", "quiet"):
        assert k in c
    for st in ("New", "Quoted", "Approved", "Scheduled", "Done", "Lost"):
        assert st in c["by_stage"]
    assert c["total"] >= 8


# -------- CRUD + stage advance + contact clears quiet --------
def test_create_advance_contact_flow(s):
    payload = {
        "customer_name": "TEST_Playwright Diner",
        "phone": "(555) 111-2222",
        "problem": "Compressor rattling",
        "source": "phone",
        "note": "test flow",
    }
    r = s.post(f"{API}/jobs", json=payload)
    assert r.status_code == 200
    job = r.json()
    assert job["customer_name"] == payload["customer_name"]
    assert job["stage"] == "New"
    assert job["is_quiet"] is False
    jid = job["id"]

    # GET verify
    g = s.get(f"{API}/jobs")
    assert any(j["id"] == jid for j in g.json())

    # Advance New -> Quoted -> Approved -> Scheduled -> Done
    for stage in ["Quoted", "Approved", "Scheduled", "Done"]:
        r = s.patch(f"{API}/jobs/{jid}/stage", json={"stage": stage})
        assert r.status_code == 200, r.text
        assert r.json()["stage"] == stage

    # once Done, should not appear in call-today
    ct = s.get(f"{API}/call-today").json()
    for bucket in ("waiting_quote", "needs_scheduling", "gone_quiet"):
        assert all(j["id"] != jid for j in ct[bucket])

    # Log contact
    r = s.post(f"{API}/jobs/{jid}/contact", json={"kind": "call", "detail": "test"})
    assert r.status_code == 200
    out = r.json()
    assert out["is_quiet"] is False
    assert len(out["contacts"]) == 1

    # Cleanup
    r = s.delete(f"{API}/jobs/{jid}")
    assert r.status_code == 200


def test_contact_clears_quiet(s):
    # Find a gone_quiet job
    ct = s.get(f"{API}/call-today").json()
    assert ct["gone_quiet"], "no quiet jobs"
    j = ct["gone_quiet"][0]
    jid = j["id"]
    r = s.post(f"{API}/jobs/{jid}/contact", json={"kind": "call", "detail": "chased"})
    assert r.status_code == 200
    assert r.json()["is_quiet"] is False
    ct2 = s.get(f"{API}/call-today").json()
    assert all(x["id"] != jid for x in ct2["gone_quiet"])


# -------- Parse LLM --------
def test_parse_message_llm(s):
    text = "Hi this is Tom from Bluebird Cafe 503-555-0150, our walk-in cooler stopped getting cold last night."
    r = s.post(f"{API}/parse", json={"text": text}, timeout=60)
    assert r.status_code == 200, r.text
    data = r.json()
    # These should be extracted
    assert data.get("customer_name")  # LLM may return "Tom" or "Bluebird Cafe"
    assert data.get("phone") and "555-0150" in data["phone"]
    assert data.get("problem")


def test_parse_blank_422(s):
    r = s.post(f"{API}/parse", json={"text": ""})
    assert r.status_code == 422


def test_invalid_job_404(s):
    r = s.patch(f"{API}/jobs/nope-xyz/stage", json={"stage": "Quoted"})
    assert r.status_code == 404
    r2 = s.post(f"{API}/jobs/nope-xyz/contact", json={"kind": "call", "detail": ""})
    assert r2.status_code == 404
