from fastapi import FastAPI, UploadFile, File, HTTPException
import os
import shutil
from fastapi.middleware.cors import CORSMiddleware
import logging

# --- Your imports ---
from .config import get_settings
from .logging_conf import setup_logging
from .db import engine, Base
from .routers import scan as scan_router
from .routers import reports as reports_router

# --- Settings & Logging ---
settings = get_settings()
setup_logging(logging.DEBUG if settings.APP_DEBUG else logging.INFO)

# --- Create tables ---
Base.metadata.create_all(bind=engine)

# --- FastAPI app ---
app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    openapi_tags=[
        {"name": "scan", "description": "Email phishing & invoice fraud scans"},
        {"name": "reports", "description": "History and health"},
        {"name": "upload", "description": "Upload invoices/docs for analysis"},
    ],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include routers ---
app.include_router(scan_router.router, prefix=settings.API_V1_PREFIX)
app.include_router(reports_router.router, prefix=settings.API_V1_PREFIX)

# --- Root endpoint ---
@app.get("/")
async def root():
    return {"message": f"{settings.APP_NAME} is running"}

# --- Upload endpoint ---
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Uploaded file must have a filename")

    safe_filename = os.path.basename(file.filename)
    file_location = os.path.join(UPLOAD_DIR, safe_filename)

    try:
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return {
            "filename": safe_filename,
            "content_type": file.content_type,
            "message": "File uploaded successfully",
            "path": file_location
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")
