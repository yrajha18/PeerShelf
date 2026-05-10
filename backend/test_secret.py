import os
from supabase import create_client

from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

print(f"Testing with secret key from logs...")

try:
    supabase = create_client(url, key)
    response = supabase.table("books").select("*", count="exact").execute()
    print(f"Success! Found {len(response.data)} books.")
    if len(response.data) > 0:
        for book in response.data[:3]:
            print(f"- {book.get('title')} by {book.get('author')}")
    else:
        print("Table is empty.")
except Exception as e:
    print(f"Error: {e}")
