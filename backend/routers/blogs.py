
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from .. import models, schemas, database, auth as auth_utils
import math

router = APIRouter()

@router.post("/", response_model=schemas.BlogResponse)
def create_blog(
    blog: schemas.BlogCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth_utils.get_current_user)
):
    b = models.Blog(title=blog.title, content=blog.content, owner_id=current_user.id)
    db.add(b)
    db.commit()
    db.refresh(b)
    return b


@router.get("/")
def list_blogs(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(database.get_db)
):
    query = db.query(models.Blog).filter(models.Blog.is_deleted == False)
    total_items = query.count()
    total_pages = math.ceil(total_items / page_size) if total_items > 0 else 1

    offset = (page - 1) * page_size
    blogs = query.offset(offset).limit(page_size).all()

    return {
        "items": blogs,
        "total_pages": total_pages,
        "total_items": total_items,
        "current_page": page
    }
@router.get("/me")
def my_blogs(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth_utils.get_current_user)
):
    query = db.query(models.Blog).filter(models.Blog.owner_id == current_user.id, models.Blog.is_deleted == False)
    total_items = query.count()
    print(current_user.id, total_items)
    total_pages = math.ceil(total_items / page_size) if total_items > 0 else 1

    offset = (page - 1) * page_size
    blogs = query.offset(offset).limit(page_size).all()

    return {
        "items": blogs,
        "total_pages": total_pages,
        "total_items": total_items,
        "current_page": page
    }


@router.get("/{blog_id}", response_model=schemas.BlogResponse)
def get_blog(blog_id: int, db: Session = Depends(database.get_db)):
    b = db.query(models.Blog).filter(models.Blog.id == blog_id, models.Blog.is_deleted == False).first()
    if not b:
        raise HTTPException(status_code=404, detail="Blog not found")
    return b


@router.delete("/{blog_id}")
def soft_delete_blog(
    blog_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth_utils.get_current_user)
):
    b = db.query(models.Blog).filter(models.Blog.id == blog_id, models.Blog.owner_id == current_user.id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Blog not found or not owned by you")
    b.is_deleted = True
    db.add(b)
    db.commit()
    db.refresh(b)
    return {"detail": "Blog soft-deleted"}
