from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import database, models, schemas, auth

router = APIRouter(
    tags=["Interactions"]
)

# --- Blog Interactions ---

@router.post("/blog/{blog_id}/comment", response_model=schemas.Comment)
async def create_blog_comment(
    blog_id: int,
    comment: schemas.CommentCreate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    result = await db.execute(select(models.BlogPost).filter(models.BlogPost.id == blog_id))
    blog = result.scalar_one_or_none()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    # Capture user data before commit to avoid expiration/lazy-load issues
    user_dto = schemas.User(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        is_admin=current_user.is_admin
    )

    new_comment = models.BlogComment(
        content=comment.content,
        user_id=current_user.id,
        blog_id=blog_id
    )
    db.add(new_comment)
    await db.commit()
    await db.refresh(new_comment)
    
    # Return constructed response with pre-captured user data
    return schemas.Comment(
        id=new_comment.id,
        content=new_comment.content,
        created_at=new_comment.created_at,
        user_id=new_comment.user_id,
        user=user_dto
    )

@router.post("/blog/{blog_id}/like")
async def like_blog(
    blog_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    result = await db.execute(select(models.BlogPost).filter(models.BlogPost.id == blog_id))
    blog = result.scalar_one_or_none()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    result = await db.execute(select(models.BlogLike).filter(
        models.BlogLike.blog_id == blog_id,
        models.BlogLike.user_id == current_user.id
    ))
    existing_like = result.scalar_one_or_none()

    if existing_like:
        # Unlike
        db.delete(existing_like)
        # Update claps count for backward compatibility
        blog.claps = max(0, blog.claps - 1)
        await db.commit()
        return {"message": "Unliked", "likes_count": len(blog.likes), "is_liked": False}
    else:
        # Like
        new_like = models.BlogLike(user_id=current_user.id, blog_id=blog_id)
        db.add(new_like)
        # Update claps count
        blog.claps += 1
        await db.commit()
        return {"message": "Liked", "likes_count": len(blog.likes), "is_liked": True}

# --- Project Interactions ---

@router.post("/projects/{project_id}/comment", response_model=schemas.Comment)
async def create_project_comment(
    project_id: int,
    comment: schemas.CommentCreate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    result = await db.execute(select(models.Project).filter(models.Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Capture user data before commit to avoid expiration/lazy-load issues
    user_dto = schemas.User(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        is_admin=current_user.is_admin
    )

    new_comment = models.ProjectComment(
        content=comment.content,
        user_id=current_user.id,
        project_id=project_id
    )
    db.add(new_comment)
    await db.commit()
    await db.refresh(new_comment)
    
    # Return constructed response with pre-captured user data
    return schemas.Comment(
        id=new_comment.id,
        content=new_comment.content,
        created_at=new_comment.created_at,
        user_id=new_comment.user_id,
        user=user_dto
    )

@router.post("/projects/{project_id}/like")
async def like_project(
    project_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    result = await db.execute(select(models.Project).filter(models.Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    result = await db.execute(select(models.ProjectLike).filter(
        models.ProjectLike.project_id == project_id,
        models.ProjectLike.user_id == current_user.id
    ))
    existing_like = result.scalar_one_or_none()

    if existing_like:
        # Unlike
        db.delete(existing_like)
        await db.commit()
        return {"message": "Unliked", "likes_count": len(project.likes), "is_liked": False}
    else:
        # Like
        new_like = models.ProjectLike(user_id=current_user.id, project_id=project_id)
        db.add(new_like)
        await db.commit()
        return {"message": "Liked", "likes_count": len(project.likes), "is_liked": True}
