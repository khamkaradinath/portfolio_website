from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_admin: bool
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class TagBase(BaseModel):
    name: str

class Tag(TagBase):
    id: int
    class Config:
        from_attributes = True

# Comment Schemas
class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    created_at: datetime
    user_id: int
    user: User # To show who commented
    
    class Config:
        from_attributes = True

# Blog Schemas
class BlogPostBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    content: str
    image_url: Optional[str] = None

class BlogPostCreate(BlogPostBase):
    tags: List[str] = []

class BlogPost(BlogPostBase):
    id: int
    created_at: datetime
    owner_id: int
    claps: int # Keeping for backward compatibility or total count
    reading_time: int
    tags: List[Tag] = []
    comments: List[Comment] = []
    likes_count: int = 0
    is_liked: bool = False # For current user context
    
    class Config:
        from_attributes = True

# Project Schemas
class ProjectBase(BaseModel):
    title: str
    description: str
    image_url: Optional[str] = None
    project_url: Optional[str] = None
    github_url: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    created_at: datetime
    owner_id: int
    comments: List[Comment] = []
    likes_count: int = 0
    is_liked: bool = False
    
    class Config:
        orm_mode = True
