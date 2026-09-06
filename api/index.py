import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

# Define directory roots dynamically using pathlib for Vercel serverless environment compatibility
BASE_DIR = Path(__file__).resolve().parent.parent
TEMPLATES_DIR = BASE_DIR / "templates"
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(
    title="Anindita Shil Rima - 24th Birthday Surprise",
    description="An interactive cinematic birthday experience.",
    version="1.0.0",
)

# Ensure static directory exists before mounting
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

templates = Jinja2Templates(directory=str(TEMPLATES_DIR))


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    """Renders the primary Single Page Application experience."""
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "title": "Anindita Shil Rima | 24th Birthday Experience",
        },
    )


@app.get("/health")
async def health_check():
    """Health check endpoint for Vercel and monitoring tools."""
    return JSONResponse(
        status_code=200,
        content={
            "status": "online",
            "person": "Anindita Shil Rima",
            "age": 24,
            "friendship_years": 7,
            "system": "Operational",
        },
    )


# Fallback exception handlers
@app.exception_handler(404)
async def custom_404_handler(request: Request, exc):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "title": "Anindita Shil Rima | 24th Birthday Experience",
        },
        status_code=200,
    )