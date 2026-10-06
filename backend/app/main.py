from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from app.api.routes import api_router, seed_jobs
from app.core.config import db, client, STAGE_MIGRATION

logger = logging.getLogger(__name__)

app = FastAPI()
app.include_router(api_router)


app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    # Migrate old stage names in existing documents
    for old, new in STAGE_MIGRATION.items():
        result = await db.jobs.update_many(
            {"stage": old}, {"$set": {"stage": new}}
        )
        if result.modified_count:
            logger.info(
                f"Migrated {result.modified_count} jobs from '{old}' to '{new}'"
            )
    await seed_jobs()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
