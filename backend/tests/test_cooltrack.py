import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from server import app  # noqa: E402

API = "/api"


@pytest.fixture(scope="module")
def s():
    with TestClient(app) as client:
        yield client


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
    for k in ("new_requests", "pending_quotes", "needs_scheduling", "todays_visits", "gone_quiet", "total"):
        assert k in data
    assert type(data["total"]) is int


# -------- Jobs list / filter --------
def test_jobs_list_and_filter(s):
    r = s.get(f"{API}/jobs")
    assert r.status_code == 200
    all_jobs = r.json()
    assert isinstance(all_jobs, list)
    for j in all_jobs:
        assert "id" in j and "days_waiting" in j and "is_quiet" in j

    r2 = s.get(f"{API}/jobs", params={"stage": "Quote Sent"})
    assert r2.status_code == 200
    quoted = r2.json()
    assert all(j["stage"] == "Quote Sent" for j in quoted)


# -------- Dashboard --------
def test_dashboard(s):
    r = s.get(f"{API}/dashboard")
    assert r.status_code == 200
    c = r.json()
    assert "stats" in c
    assert "insight_text" in c
    for k in ("total_jobs", "open_jobs", "completed_jobs", "by_stage"):
        assert k in c["stats"]
    for st in (
        "New",
        "Quote Draft",
        "Quote Sent",
        "Quote Accepted",
        "Visit Scheduled",
        "In Progress",
        "Completed",
        "Lost",
    ):
        assert st in c["stats"]["by_stage"]


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

    # Advance New -> Quote Sent -> Quote Accepted -> Visit Scheduled -> Completed
    for stage in ["Quote Sent", "Quote Accepted", "Visit Scheduled", "Completed"]:
        r = s.patch(f"{API}/jobs/{jid}/stage", json={"stage": stage})
        assert r.status_code == 200, r.text
        assert r.json()["stage"] == stage

    # Log contact
    r = s.post(f"{API}/jobs/{jid}/contact", json={"kind": "call", "detail": "test"})
    assert r.status_code == 200
    out = r.json()
    assert out["is_quiet"] is False
    assert len(out["contacts"]) == 1


def test_parse_blank_422(s):
    r = s.post(f"{API}/parse", json={"text": ""})
    assert r.status_code == 422


def test_invalid_job_404(s):
    r = s.patch(f"{API}/jobs/nope-xyz/stage", json={"stage": "Quote Sent"})
    assert r.status_code == 404
    r2 = s.post(f"{API}/jobs/nope-xyz/contact", json={"kind": "call", "detail": ""})
    assert r2.status_code == 404
