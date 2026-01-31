import os
import json
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.staticfiles import StaticFiles
from sqlmodel import SQLModel, Session, select
from typing import List, Optional, Dict, Any
from datetime import datetime
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

try:
    from backend.database import create_db_and_tables, get_session
    from backend.models import (
        UserProfile, UserDemographics, UserPsychographics, UserLifestyle, UserMediaPreferences,
        Product, Campaign,
        UserProfileBase, UserDemographicsBase, UserPsychographicsBase, UserLifestyleBase, UserMediaPreferencesBase,
        ProductBase, CampaignBase
    )
except ImportError:
    from database import create_db_and_tables, get_session
    from models import (
        UserProfile, UserDemographics, UserPsychographics, UserLifestyle, UserMediaPreferences,
        Product, Campaign,
        UserProfileBase, UserDemographicsBase, UserPsychographicsBase, UserLifestyleBase, UserMediaPreferencesBase,
        ProductBase, CampaignBase
    )

# --- Response Models ---
class UserProfileCreate(UserProfileBase):
    demographics: Optional[UserDemographicsBase] = None
    psychographics: Optional[UserPsychographicsBase] = None
    lifestyle: Optional[UserLifestyleBase] = None
    media_preferences: Optional[UserMediaPreferencesBase] = None

class UserProfileRead(UserProfileBase):
    id: int
    demographics: Optional[UserDemographicsBase] = None
    psychographics: Optional[UserPsychographicsBase] = None
    lifestyle: Optional[UserLifestyleBase] = None
    media_preferences: Optional[UserMediaPreferencesBase] = None

class CampaignRead(CampaignBase):
    id: int
    user: UserProfileRead
    product: ProductBase

# Load environment variables
load_dotenv()

# Configure OpenAI
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) if api_key else None

# Configuration
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
API_URL = os.getenv("API_URL", "http://127.0.0.1:8000")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables are created
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip() for origin in os.getenv("CORS_ORIGINS", "").split(",") if origin.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")

# Ensure uploads directory exists
os.makedirs(os.path.join(STATIC_DIR, "uploads"), exist_ok=True)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# --- API Endpoints ---

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_location = os.path.join(STATIC_DIR, "uploads", file.filename)
        with open(file_location, "wb+") as file_object:
            file_object.write(file.file.read())
        
        # Return the URL
        return {"url": f"{API_URL}/static/uploads/{file.filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/users", response_model=UserProfileRead)
def create_user(user_data: UserProfileCreate, session: Session = Depends(get_session)):
    # Create main user
    user = UserProfile(name=user_data.name)
    session.add(user)
    session.commit()
    session.refresh(user)
    
    # Create related models if provided
    if user_data.demographics:
        demo = UserDemographics(**user_data.demographics.model_dump(), user_id=user.id)
        session.add(demo)
    
    if user_data.psychographics:
        psycho = UserPsychographics(**user_data.psychographics.model_dump(), user_id=user.id)
        session.add(psycho)

    if user_data.lifestyle:
        life = UserLifestyle(**user_data.lifestyle.model_dump(), user_id=user.id)
        session.add(life)

    if user_data.media_preferences:
        media = UserMediaPreferences(**user_data.media_preferences.model_dump(), user_id=user.id)
        session.add(media)

    session.commit()
    session.refresh(user)
    return user

class UserProfileUpdate(SQLModel):
    name: Optional[str] = None
    demographics: Optional[UserDemographicsBase] = None
    psychographics: Optional[UserPsychographicsBase] = None
    lifestyle: Optional[UserLifestyleBase] = None
    media_preferences: Optional[UserMediaPreferencesBase] = None

# ... (Response models remain)

from sqlalchemy.orm import selectinload

@app.get("/users/{user_id}", response_model=UserProfileRead)
def read_user(user_id: int, session: Session = Depends(get_session)):
    # Using selectinload to ensure relationships are loaded
    statement = select(UserProfile).where(UserProfile.id == user_id).options(
        selectinload(UserProfile.demographics),
        selectinload(UserProfile.psychographics),
        selectinload(UserProfile.lifestyle),
        selectinload(UserProfile.media_preferences)
    )
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.patch("/users/{user_id}", response_model=UserProfileRead)
def update_user(user_id: int, user_data: UserProfileUpdate, session: Session = Depends(get_session)):
    # Eager load here too to ensure we have the objects to update
    statement = select(UserProfile).where(UserProfile.id == user_id).options(
        selectinload(UserProfile.demographics),
        selectinload(UserProfile.psychographics),
        selectinload(UserProfile.lifestyle),
        selectinload(UserProfile.media_preferences)
    )
    user = session.exec(statement).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_data.name is not None:
        user.name = user_data.name
    
    session.add(user)
    
    # Helper to update or create 1:1 relation
    def update_relation(current_rel, new_data, ModelClass):
        if new_data is None:
            return
        if current_rel:
            # Update existing
            for key, value in new_data.model_dump(exclude_unset=True).items():
                setattr(current_rel, key, value)
            session.add(current_rel)
        else:
            # Create new
            new_rel = ModelClass(**new_data.model_dump(), user_id=user.id)
            session.add(new_rel)

    update_relation(user.demographics, user_data.demographics, UserDemographics)
    update_relation(user.psychographics, user_data.psychographics, UserPsychographics)
    update_relation(user.lifestyle, user_data.lifestyle, UserLifestyle)
    update_relation(user.media_preferences, user_data.media_preferences, UserMediaPreferences)

    session.commit()
    session.refresh(user)
    return user

@app.get("/users", response_model=List[UserProfileRead])
def read_users(session: Session = Depends(get_session)):
    statement = select(UserProfile).options(
        selectinload(UserProfile.demographics),
        selectinload(UserProfile.psychographics),
        selectinload(UserProfile.lifestyle),
        selectinload(UserProfile.media_preferences)
    )
    users = session.exec(statement).all()
    return users

@app.post("/products", response_model=Product)
def create_product(product: Product, session: Session = Depends(get_session)):
    session.add(product)
    session.commit()
    session.refresh(product)
    return product

@app.get("/products", response_model=List[ProductBase])
def read_products(session: Session = Depends(get_session)):
    products = session.exec(select(Product)).all()
    return products

@app.post("/campaigns", response_model=CampaignRead)
def create_campaign(campaign: Campaign, session: Session = Depends(get_session)):
    user = session.get(UserProfile, campaign.user_id)
    product = session.get(Product, campaign.product_id)
    if not user or not product:
        raise HTTPException(status_code=404, detail="User or Product not found")
    
    session.add(campaign)
    session.commit()
    session.refresh(campaign)
    return campaign

@app.get("/campaigns", response_model=List[CampaignRead])
def read_campaigns(session: Session = Depends(get_session)):
    return session.exec(select(Campaign)).all()

@app.get("/campaigns/{campaign_id}", response_model=CampaignRead)
def read_campaign(campaign_id: int, session: Session = Depends(get_session)):
    campaign = session.get(Campaign, campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@app.post("/campaigns/{campaign_id}/generate", response_model=CampaignRead)
def generate_ad(campaign_id: int, session: Session = Depends(get_session)):
    campaign = session.get(Campaign, campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    if not client:
        raise HTTPException(status_code=500, detail="OpenAI API Key is not configured")

    try:
        # Step 1: Generate Creative Persona
        persona_system_prompt = "You are a world-class Creative Strategist. Analyze the user data and product details to create a detailed 'Creative Persona' and creative direction. Return valid JSON only."
        
        # Helper to dump model if it exists
        def dump_if_exists(model):
            return model.model_dump() if model else "Unknown"

        persona_user_prompt = f"""
        **User Data:**
        Name: {campaign.user.name}
        Demographics: {dump_if_exists(campaign.user.demographics)}
        Psychographics: {dump_if_exists(campaign.user.psychographics)}
        Lifestyle: {dump_if_exists(campaign.user.lifestyle)}
        Media Preferences: {dump_if_exists(campaign.user.media_preferences)}

        **Product:**
        Name: {campaign.product.name}
        Description: {campaign.product.description}
        Features: {campaign.product.features}

        **Campaign Context:**
        Objective: {campaign.objective}
        Platform: {campaign.platform}
        Duration: {campaign.duration_seconds}s
        Product Intent: {campaign.product_intent}

        **Task:**
        Synthesize this into a Creative Persona JSON with these keys:
        - protagonist_description (visual details)
        - setting (environment details)
        - mood_and_tone
        - narrative_arc (act 1, 2, 3)
        - camera_behavior
        - lighting
        - music_vibe
        - pacing
        """
        
        persona_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": persona_system_prompt},
                {"role": "user", "content": persona_user_prompt}
            ],
            response_format={"type": "json_object"}
        )
        creative_persona_json = json.loads(persona_response.choices[0].message.content)
        campaign.creative_persona = creative_persona_json
        
        # Step 2: Generate Sora Prompt
        sora_system_prompt = "You are an expert film director specializing in AI video generation (OpenAI Sora). Create a cinematic, highly detailed prompt based on the creative persona."
        sora_user_prompt = f"""
        **Creative Persona / Brief:**
        {json.dumps(creative_persona_json, indent=2)}

        **Task:**
        Write the final Sora prompt. It should be a single, cohesive paragraph describing the video visually. Focus on lighting, texture, camera movement, and subject action.
        Ensure it fits a {campaign.duration_seconds} second duration.
        """

        sora_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": sora_system_prompt},
                {"role": "user", "content": sora_user_prompt}
            ]
        )
        sora_prompt = sora_response.choices[0].message.content
        
        campaign.sora_prompt = sora_prompt
        campaign.status = "completed"
        
        session.add(campaign)
        session.commit()
        session.refresh(campaign)
        return campaign
        
    except Exception as e:
        print(f"Error generation: {e}")
        campaign.status = "failed"
        session.add(campaign)
        session.commit()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok", "db": "configured", "openai": bool(client)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
