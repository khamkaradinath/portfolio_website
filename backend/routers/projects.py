from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from database import get_db
from models import Project, User
from schemas import Project as ProjectSchema
from auth import get_current_user, get_current_admin_user
import shutil
import os
import uuid

router = APIRouter(
    prefix="/projects",
    tags=["projects"]
)

@router.get("/", response_model=List[ProjectSchema])
async def get_projects(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    from sqlalchemy.orm import selectinload
    result = await db.execute(
        select(Project)
        .options(
            selectinload(Project.comments).selectinload(models.ProjectComment.user),
            selectinload(Project.likes)
        )
        .offset(skip)
        .limit(limit)
    )
    projects = result.scalars().unique().all()
    return projects

@router.post("/", response_model=ProjectSchema)
async def create_project(
    title: str = Form(...),
    description: str = Form(...),
    project_url: Optional[str] = Form(None),
    github_url: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    image_url = None
    if image:
        file_extension = image.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = f"uploads/{filename}"
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        image_url = f"http://localhost:8000/uploads/{filename}"

    new_project = Project(
        title=title, 
        description=description, 
        image_url=image_url, 
        project_url=project_url, 
        github_url=github_url, 
        owner_id=current_user.id
    )
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)
    
    # Reload with relationships
    from sqlalchemy.orm import selectinload
    result = await db.execute(
        select(Project)
        .options(
            selectinload(Project.comments).selectinload(models.ProjectComment.user),
            selectinload(Project.likes)
        )
        .where(Project.id == new_project.id)
    )
    new_project = result.scalars().first()
    
    return new_project

@router.get("/{project_id}", response_model=ProjectSchema)
async def get_project(project_id: int, db: AsyncSession = Depends(get_db)):
    from sqlalchemy.orm import selectinload
    result = await db.execute(
        select(Project)
        .options(
            selectinload(Project.comments).selectinload(models.ProjectComment.user),
            selectinload(Project.likes)
        )
        .where(Project.id == project_id)
    )
    project = result.scalars().first()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.delete("/{project_id}")
async def delete_project(project_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalars().first()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this project")
    
    await db.delete(project)
    await db.commit()
    return {"message": "Project deleted successfully"}
