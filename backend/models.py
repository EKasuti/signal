from typing import Optional, List, Dict, Any
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, JSON
from datetime import datetime

# --- Demographics ---
class UserDemographicsBase(SQLModel):
    age_range: str # e.g., "18-24", "25-34"
    gender_identity: str
    language: str = "English"
    country: str
    region: Optional[str] = None
    location_type: str # urban, suburban, rural

class UserDemographics(UserDemographicsBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="userprofile.id")
    user: "UserProfile" = Relationship(back_populates="demographics")

# --- Psychographics ---
class UserPsychographicsBase(SQLModel):
    values: List[str] = Field(default=[], sa_column=Column(JSON))
    motivations: List[str] = Field(default=[], sa_column=Column(JSON))
    personality_traits: Dict[str, int] = Field(default={}, sa_column=Column(JSON))
    decision_making_style: Optional[str] = None
    risk_tolerance: Optional[str] = None

class UserPsychographics(UserPsychographicsBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="userprofile.id")
    user: "UserProfile" = Relationship(back_populates="psychographics")

# --- Lifestyle ---
class UserLifestyleBase(SQLModel):
    occupation: Optional[str] = None
    industry: Optional[str] = None
    hobbies: List[str] = Field(default=[], sa_column=Column(JSON))
    daily_environments: List[str] = Field(default=[], sa_column=Column(JSON))
    tech_savviness: str = "average"

class UserLifestyle(UserLifestyleBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="userprofile.id")
    user: "UserProfile" = Relationship(back_populates="lifestyle")

# --- Media Preferences ---
class UserMediaPreferencesBase(SQLModel):
    preferred_platforms: List[str] = Field(default=[], sa_column=Column(JSON))
    visual_visual_style: Optional[str] = None
    music_preferences: List[str] = Field(default=[], sa_column=Column(JSON))
    ad_duration_preference: Optional[str] = None

class UserMediaPreferences(UserMediaPreferencesBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="userprofile.id")
    user: "UserProfile" = Relationship(back_populates="media_preferences")

# --- User Profile ---
class UserProfileBase(SQLModel):
    name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserProfile(UserProfileBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # 1:1 Relationships
    demographics: Optional[UserDemographics] = Relationship(back_populates="user", sa_relationship_kwargs={"uselist": False})
    psychographics: Optional[UserPsychographics] = Relationship(back_populates="user", sa_relationship_kwargs={"uselist": False})
    lifestyle: Optional[UserLifestyle] = Relationship(back_populates="user", sa_relationship_kwargs={"uselist": False})
    media_preferences: Optional[UserMediaPreferences] = Relationship(back_populates="user", sa_relationship_kwargs={"uselist": False})
    
    campaigns: List["Campaign"] = Relationship(back_populates="user")

# --- Product ---
class ProductBase(SQLModel):
    name: str
    description: str
    image_url: Optional[str] = None
    features: List[str] = Field(default=[], sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Product(ProductBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    campaigns: List["Campaign"] = Relationship(back_populates="product")

# --- Campaign ---
class CampaignBase(SQLModel):
    objective: str = "awareness"
    platform: str = "instagram"
    duration_seconds: int = 15
    brand_tone: Optional[str] = None
    cta_style: Optional[str] = None
    product_intent: Dict[str, str] = Field(default={}, sa_column=Column(JSON))
    status: str = "pending"
    creative_persona: Optional[Dict] = Field(default=None, sa_column=Column(JSON))
    sora_prompt: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Campaign(CampaignBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="userprofile.id")
    product_id: int = Field(foreign_key="product.id")
    
    user: UserProfile = Relationship(back_populates="campaigns")
    product: Product = Relationship(back_populates="campaigns")
