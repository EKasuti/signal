from sqlmodel import Session, select
from database import engine, create_db_and_tables
from models import (
    UserProfile, UserDemographics, UserPsychographics, UserLifestyle, UserMediaPreferences,
    Product, Campaign
)
from datetime import datetime

def seed_data():
    create_db_and_tables()
    
    with Session(engine) as session:
        # Check if we already have data
        existing_user = session.exec(select(UserProfile)).first()
        if existing_user:
            print("Database already seeded. Skipping...")
            return

        print("Seeding database...")

        # --- Create Users ---
        
        # User 1: The Tech Innovator
        user1 = UserProfile(name="Alex Chen")
        
        demo1 = UserDemographics(
            age_range="25-34",
            gender_identity="Male",
            language="English",
            country="USA",
            region="San Francisco, CA",
            location_type="Urban"
        )
        
        psycho1 = UserPsychographics(
            values=["Innovation", "Efficiency", "Growth"],
            motivations=["Staying ahead of trends", "Productivity"],
            personality_traits={"Openness": 90, "Conscientiousness": 85},
            decision_making_style="Analytical",
            risk_tolerance="High"
        )
        
        life1 = UserLifestyle(
            occupation="Software Engineer",
            industry="Tech",
            hobbies=["Coding", "Hiking", "Gaming"],
            daily_environments=["Home Office", "Co-working specs"],
            tech_savviness="High"
        )
        
        media1 = UserMediaPreferences(
            preferred_platforms=["Twitter", "Reddit", "YouTube"],
            visual_visual_style="Minimalist",
            music_preferences=["Lo-fi", "Electronic"],
            ad_duration_preference="Short < 15s"
        )
        
        user1.demographics = demo1
        user1.psychographics = psycho1
        user1.lifestyle = life1
        user1.media_preferences = media1
        
        # User 2: The Eco-Conscious Creative
        user2 = UserProfile(name="Maya Rodriguez")
        
        demo2 = UserDemographics(
            age_range="18-24",
            gender_identity="Female",
            language="English / Spanish",
            country="Spain",
            region="Barcelona",
            location_type="Urban"
        )
        
        psycho2 = UserPsychographics(
            values=["Sustainability", "Creativity", "Community"],
            motivations=["Expressing individuality", "Helping the planet"],
            personality_traits={"Openness": 95, "Agreeableness": 80},
            decision_making_style="Intuitive",
            risk_tolerance="Moderate"
        )
        
        life2 = UserLifestyle(
            occupation="Graphic Designer",
            industry="Design",
            hobbies=["Painting", "Yoga", "Thrifting"],
            daily_environments=["Art Studio", "Cafes"],
            tech_savviness="High"
        )
        
        media2 = UserMediaPreferences(
            preferred_platforms=["Instagram", "Pinterest", "TikTok"],
            visual_visual_style="Artistic",
            music_preferences=["Indie", "Alternative"],
            ad_duration_preference="Visual-heavy"
        )
        
        user2.demographics = demo2
        user2.psychographics = psycho2
        user2.lifestyle = life2
        user2.media_preferences = media2

        # User 3: The Family-Oriented Planner
        user3 = UserProfile(name="Sarah Jenkins")
        
        demo3 = UserDemographics(
            age_range="35-44",
            gender_identity="Female",
            language="English",
            country="UK",
            region="London",
            location_type="Suburban"
        )
        
        psycho3 = UserPsychographics(
            values=["Family", "Security", "Reliability"],
            motivations=["Providing for family", "Saving time"],
            personality_traits={"Conscientiousness": 90, "Extraversion": 60},
            decision_making_style="Deliberate",
            risk_tolerance="Low"
        )
        
        life3 = UserLifestyle(
            occupation="HR Manager",
            industry="Corporate",
            hobbies=["Gardening", "Cooking", "Reading"],
            daily_environments=["Office", "Home"],
            tech_savviness="Average"
        )
        
        media3 = UserMediaPreferences(
            preferred_platforms=["Facebook", "Instagram"],
            visual_visual_style="Warm & Inviting",
            music_preferences=["Pop", "Soft Rock"],
            ad_duration_preference="Informative"
        )
        
        user3.demographics = demo3
        user3.psychographics = psycho3
        user3.lifestyle = life3
        user3.media_preferences = media3

        # User 4: The Aspiring Entrepreneur
        user4 = UserProfile(name="David Okafor")
        
        demo4 = UserDemographics(
            age_range="25-34",
            gender_identity="Male",
            language="English",
            country="Nigeria",
            region="Lagos",
            location_type="Urban"
        )
        
        psycho4 = UserPsychographics(
            values=["Wealth", "Status", "Ambition"],
            motivations=["Building a legacy", "Financial freedom"],
            personality_traits={"Extraversion": 85, "Neuroticism": 40},
            decision_making_style="Bold",
            risk_tolerance="Very High"
        )
        
        life4 = UserLifestyle(
            occupation="Entrepreneur",
            industry="Fintech",
            hobbies=["Networking", "Traveling", "Fitness"],
            daily_environments=["Business District", "Gym"],
            tech_savviness="High"
        )
        
        media4 = UserMediaPreferences(
            preferred_platforms=["LinkedIn", "Twitter", "Instagram"],
            visual_visual_style="Professional",
            music_preferences=["Afrobeats", "Hip Hop"],
            ad_duration_preference="Direct"
        )
        
        user4.demographics = demo4
        user4.psychographics = psycho4
        user4.lifestyle = life4
        user4.media_preferences = media4

        # Add Users
        session.add(user1)
        session.add(user2)
        session.add(user3)
        session.add(user4)
        session.commit()
        
        # Refresh to get IDs
        session.refresh(user1)
        session.refresh(user2)
        session.refresh(user3)
        session.refresh(user4)

        # --- Create Products ---
        
        prod1 = Product(
            name="EcoBottle Smart",
            description="A self-cleaning water bottle that tracks your hydration.",
            image_url="https://images.unsplash.com/photo-1602143407151-01114192003b?auto=format&fit=crop&q=80&w=1000",
            features=["UV-C Cleaning", "App Sync", "Temperature Control"]
        )
        
        prod2 = Product(
            name="Lumina Desk Lamp",
            description="AI-powered desk lamp that adjusts to your circadian rhythm.",
            image_url="https://images.unsplash.com/photo-1534073828943-f801091a7d58?auto=format&fit=crop&q=80&w=1000",
            features=["Auto-Brightness", "Color Temp Adjustment", "Voice Control"]
        )
        
        prod3 = Product(
            name="Zenith Noise Cancelling Headphones",
            description="Premium wireless headphones with industry-leading noise cancellation.",
            image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000",
            features=["Active Noise Cancellation", "30h Battery", "Spatial Audio"]
        )

        session.add(prod1)
        session.add(prod2)
        session.add(prod3)
        session.commit()
        session.refresh(prod1)
        session.refresh(prod2)
        session.refresh(prod3)

        # --- Create Campaigns ---
        
        camp1 = Campaign(
            objective="conversions",
            platform="instagram",
            duration_seconds=15,
            brand_tone="energetic",
            status="completed",
            product_intent={"focus": "features", "key_selling_point": "self-cleaning"},
            creative_persona={"mood": "active", "style": "modern"},
            sora_prompt="A cinematic shot of a sleek water bottle glowing with UV light in a modern gym setting.",
            user=user1,
            product=prod1
        )
        
        camp2 = Campaign(
            objective="awareness",
            platform="tiktok",
            duration_seconds=30,
            brand_tone="calm",
            status="pending",
            product_intent={"focus": "lifestyle", "key_selling_point": "wellness"},
            creative_persona={"mood": "serene", "style": "minimalist"},
            user=user2,
            product=prod2
        )
        
        camp3 = Campaign(
            objective="conversions",
            platform="youtube",
            duration_seconds=60,
            brand_tone="professional",
            status="failed",
            product_intent={"focus": "quality", "key_selling_point": "noise-cancelling"},
            creative_persona={"mood": "focused", "style": "corporate"},
            sora_prompt="A busy open office, silence falls as someone puts on headphones.",
            user=user3,
            product=prod3
        )
        
        # Campaign for the Entrepreneur
        camp4 = Campaign(
            objective="leads",
            platform="linkedin",
            duration_seconds=45,
            brand_tone="authoritative",
            status="processing",
            product_intent={"focus": "productivity", "key_selling_point": "focus"},
            creative_persona={"mood": "driven", "style": "high-contrast"},
            user=user4,
            product=prod2 # Selling the lamp to the entrepreneur too
        )

        session.add(camp1)
        session.add(camp2)
        session.add(camp3)
        session.add(camp4)
        session.commit()

        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data()
