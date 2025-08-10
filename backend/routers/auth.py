# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status, Form
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .. import models, schemas, database, auth as auth_utils

router = APIRouter()

@router.post("/signup", response_model=schemas.UserResponse)
def signup(user_create: schemas.UserCreate, db: Session = Depends(database.get_db)):
    existing = db.query(models.User).filter(
        (models.User.email == user_create.email) | (models.User.username == user_create.username)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email or username already registered")
    hashed = auth_utils.get_password_hash(user_create.password)
    user = models.User(username=user_create.username, email=user_create.email, hashed_password=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# Token route (OAuth2 password grant)
@router.post("/token", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    # OAuth2PasswordRequestForm provides 'username' and 'password' (username used for email)
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth_utils.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect credentials")
    access_token = auth_utils.create_access_token({"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
