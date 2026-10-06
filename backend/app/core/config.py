import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

ROOT_DIR = Path(__file__).parent.parent.parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# ---- Constants ----
STAGES = [
    "New",
    "Quote Draft",
    "Quote Sent",
    "Quote Accepted",
    "Quote Rejected",
    "Visit Scheduled",
    "In Progress",
    "Completed",
    "Done",
    "Lost",
]
OPEN_STAGES = [
    "New",
    "Quote Draft",
    "Quote Sent",
    "Quote Accepted",
    "Visit Scheduled",
    "In Progress",
]
SOURCES = ["phone", "website", "email", "text", "referral", "other"]
EQUIPMENT_TYPES = ["walk-in-cooler", "freezer", "ice-machine", "other"]
QUIET_DAYS = 1

# Backwards compat — map old stage names to new ones
STAGE_MIGRATION = {
    "Quoted": "Quote Sent",
    "Approved": "Quote Accepted",
    "Scheduled": "Visit Scheduled",
    "Done": "Completed",
}
