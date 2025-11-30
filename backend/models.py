from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Table, Boolean
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

# Association table for Many-to-Many relationship between BlogPost and Tag
blog_tags = Table('blog_tags', Base.metadata,
    Column('blog_id', Integer, ForeignKey('blog_posts.id')),
    Column('tag_id', Integer, ForeignKey('tags.id'))
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False)

class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    subtitle = Column(String, nullable=True)
    content = Column(Text)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    claps = Column(Integer, default=0)
    reading_time = Column(Integer, default=0) # In minutes
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User")
    tags = relationship("Tag", secondary=blog_tags, backref="blogs")
    comments = relationship("BlogComment", back_populates="blog", cascade="all, delete-orphan")
    likes = relationship("BlogLike", back_populates="blog", cascade="all, delete-orphan")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    image_url = Column(String, nullable=True)
    project_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User")
    comments = relationship("ProjectComment", back_populates="project", cascade="all, delete-orphan")
    likes = relationship("ProjectLike", back_populates="project", cascade="all, delete-orphan")

class BlogComment(Base):
    __tablename__ = "blog_comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
    blog_id = Column(Integer, ForeignKey("blog_posts.id"))

    user = relationship("User")
    blog = relationship("BlogPost", back_populates="comments")

class ProjectComment(Base):
    __tablename__ = "project_comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
    project_id = Column(Integer, ForeignKey("projects.id"))

    user = relationship("User")
    project = relationship("Project", back_populates="comments")

class BlogLike(Base):
    __tablename__ = "blog_likes"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    blog_id = Column(Integer, ForeignKey("blog_posts.id"), primary_key=True)

    user = relationship("User")
    blog = relationship("BlogPost", back_populates="likes")

class ProjectLike(Base):
    __tablename__ = "project_likes"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"), primary_key=True)

    user = relationship("User")
    project = relationship("Project", back_populates="likes")
