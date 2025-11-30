from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from database import get_db
from models import BlogPost, User, Tag
import models
from schemas import BlogPost as BlogPostSchema
from auth import get_current_user, get_current_admin_user
import shutil
import os
import uuid
import math

router = APIRouter(
    prefix="/blog",
    tags=["blog"]
)

@router.get("/", response_model=List[BlogPostSchema])
async def get_blogs(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    # Eager load tags, comments, and likes
    from sqlalchemy.orm import selectinload
    result = await db.execute(
        select(BlogPost)
        .options(
            selectinload(BlogPost.tags),
            selectinload(BlogPost.comments).selectinload(models.BlogComment.user),
            selectinload(BlogPost.likes)
        )
        .offset(skip)
        .limit(limit)
        .order_by(BlogPost.created_at.desc())
    )
    blogs = result.scalars().unique().all()
    return blogs

@router.post("/", response_model=BlogPostSchema)
async def create_blog(
    title: str = Form(...),
    subtitle: Optional[str] = Form(None),
    content: str = Form(...),
    tags: Optional[str] = Form(None), # Comma separated tags
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

    # Calculate reading time (approx 200 words per minute)
    word_count = len(content.split())
    reading_time = math.ceil(word_count / 200)

    new_blog = BlogPost(
        title=title, 
        subtitle=subtitle,
        content=content, 
        image_url=image_url, 
        reading_time=reading_time,
        owner_id=current_user.id
    )

    if tags:
        tag_list = [t.strip() for t in tags.split(",") if t.strip()]
        for tag_name in tag_list:
            # Check if tag exists
            result = await db.execute(select(Tag).where(Tag.name == tag_name))
            tag = result.scalars().first()
            if not tag:
                tag = Tag(name=tag_name)
                db.add(tag)
                # Need to flush to get ID if we were using it, but here we just append object
            new_blog.tags.append(tag)

    db.add(new_blog)
    await db.commit()
    await db.refresh(new_blog)
    
    # Reload with tags to return correct schema
    from sqlalchemy.orm import selectinload
    result = await db.execute(
        select(BlogPost)
        .options(
            selectinload(BlogPost.tags),
            selectinload(BlogPost.comments).selectinload(models.BlogComment.user),
            selectinload(BlogPost.likes)
        )
        .where(BlogPost.id == new_blog.id)
    )
    new_blog = result.scalars().first()
    
    return new_blog

@router.get("/{blog_id}", response_model=BlogPostSchema)
async def get_blog(blog_id: int, db: AsyncSession = Depends(get_db)):
    from sqlalchemy.orm import selectinload
    result = await db.execute(
        select(BlogPost)
        .options(
            selectinload(BlogPost.tags),
            selectinload(BlogPost.comments).selectinload(models.BlogComment.user),
            selectinload(BlogPost.likes)
        )
        .where(BlogPost.id == blog_id)
    )
    blog = result.scalars().first()
    if blog is None:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog

@router.post("/{blog_id}/clap")
async def clap_blog(blog_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BlogPost).where(BlogPost.id == blog_id))
    blog = result.scalars().first()
    if blog is None:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    blog.claps += 1
    await db.commit()
    await db.refresh(blog)
    return {"claps": blog.claps}

@router.delete("/{blog_id}")
async def delete_blog(blog_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    result = await db.execute(select(BlogPost).where(BlogPost.id == blog_id))
    blog = result.scalars().first()
    if blog is None:
        raise HTTPException(status_code=404, detail="Blog not found")
    if blog.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this blog")
    
    await db.delete(blog)
    await db.commit()
    return {"message": "Blog deleted successfully"}
