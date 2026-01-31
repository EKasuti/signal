import requests
import sys

def test_get_user(user_id=1):
    try:
        response = requests.get(f"http://127.0.0.1:8000/users/{user_id}")
        if response.status_code == 200:
            print(f"User {user_id} Data:")
            print(response.json())
        else:
            print(f"Failed: {response.status_code} {response.text}")
    except Exception as e:
        print(e)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        test_get_user(sys.argv[1])
    else:
        # Default check list first to find a valid ID
        res = requests.get("http://127.0.0.1:8000/users")
        users = res.json()
        if users:
            test_get_user(users[0]['id'])
        else:
            print("No users found.")
