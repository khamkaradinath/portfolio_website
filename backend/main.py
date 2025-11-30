from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, blog, projects, interactions
from database import engine, Base
import models
import os

app = FastAPI(title="Portfolio API")

# Create uploads directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# CORS
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)

# Include Routers
app.include_router(auth.router)
app.include_router(blog.router)
app.include_router(projects.router)
app.include_router(interactions.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Portfolio API"}
