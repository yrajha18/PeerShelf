import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

try:
    supabase = create_client(url, key)
    response = supabase.table("wishlist").select("*", count="exact").limit(1).execute()
    print(f"Success! Found {response.count} wishlist items.")
    if len(response.data) > 0:
        print("First item:", response.data[0])
    else:
        print("Table is empty.")
except Exception as e:
    print(f"Error: {e}")
