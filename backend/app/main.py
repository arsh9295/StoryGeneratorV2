from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import story_router, user_router

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(story_router.router)
app.include_router(user_router.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI backend!"}