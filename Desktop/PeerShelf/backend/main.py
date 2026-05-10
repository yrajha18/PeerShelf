from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import orders, wishlist, books, profiles

app = FastAPI(title="PeerShelf API", description="FastAPI Backend for PeerShelf", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, this should be restricted to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(orders.router)
app.include_router(wishlist.router)
app.include_router(books.router)
app.include_router(profiles.router)

@app.get("/")
def root():
    return {"message": "Welcome to PeerShelf API"}
