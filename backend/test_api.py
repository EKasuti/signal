import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def test_create_user():
    print("Testing User Creation...")
    payload = {
        "name": "Jane Doe",
        "demographics": {
            "age_range": "25-34",
            "gender_identity": "Female",
            "country": "USA",
            "location_type": "Urban"
        },
        "psychographics": {
            "values": ["sustainability", "innovation"],
            "personality_traits": {"openness": 9, "extraversion": 7}
        },
        "lifestyle": {
            "occupation": "Architect",
            "hobbies": ["photography", "hiking"],
            "daily_environments": ["studio", "nature"]
        },
        "media_preferences": {
            "preferred_platforms": ["Instagram", "Pinterest"],
            "visual_visual_style": "Cinematic"
        }
    }
    response = requests.post(f"{BASE_URL}/users", json=payload)
    if response.status_code == 200:
        print("User Created Successfully:")
        print(json.dumps(response.json(), indent=2))
        return response.json()['id']
    else:
        print(f"Failed to create user: {response.text}")
        return None

def test_create_product():
    print("\nTesting Product Creation...")
    payload = {
        "name": "EcoSmart Water Bottle",
        "description": "A self-cleaning smart water bottle that tracks hydration.",
        "features": ["UV-C cleaning", "App connectivity", "Insulated stainless steel"]
    }
    response = requests.post(f"{BASE_URL}/products", json=payload)
    if response.status_code == 200:
        print("Product Created Successfully:")
        print(json.dumps(response.json(), indent=2))
        return response.json()['id']
    else:
        print(f"Failed to create product: {response.text}")
        return None

def test_create_campaign(user_id, product_id):
    print("\nTesting Campaign Creation...")
    payload = {
        "user_id": user_id,
        "product_id": product_id,
        "objective": "conversion",
        "platform": "instagram_reels",
        "duration_seconds": 15,
        "product_intent": {"funnel_stage": "consideration"}
    }
    response = requests.post(f"{BASE_URL}/campaigns", json=payload)
    if response.status_code == 200:
        print("Campaign Created Successfully:")
        print(json.dumps(response.json(), indent=2))
        return response.json()['id']
    else:
        print(f"Failed to create campaign: {response.text}")
        return None

def test_generate_ad(campaign_id):
    print(f"\nTesting Ad Generation for Campaign {campaign_id}...")
    # This might take a while due to LLM calls
    try:
        response = requests.post(f"{BASE_URL}/campaigns/{campaign_id}/generate", timeout=60)
        if response.status_code == 200:
            print("Ad Generated Successfully:")
            data = response.json()
            print("Creative Persona:", json.dumps(data.get('creative_persona'), indent=2))
            print("Sora Prompt:", data.get('sora_prompt'))
        else:
            print(f"Failed to generate ad: {response.text}")
    except requests.exceptions.Timeout:
        print("Request timed out (LLM might be slow), but checking if data persists...")

if __name__ == "__main__":
    # Wait for server to potentially restart/reload
    time.sleep(2)
    
    user_id = test_create_user()
    product_id = test_create_product()
    
    if user_id and product_id:
        campaign_id = test_create_campaign(user_id, product_id)
        if campaign_id:
            test_generate_ad(campaign_id)
