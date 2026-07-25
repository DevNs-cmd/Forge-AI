import os
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Project Forge LangGraph & Groq AI Service"
    VERSION: str = "3.0.0"
    
    # AI Provider Setup (groq, gemini, or openai)
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "groq")
    GROQ_API_KEY: Optional[str] = os.getenv("GROQ_API_KEY")
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")
    OPENAI_API_KEY: Optional[str] = os.getenv("ANTHROPIC_API_KEY") or os.getenv("OPENAI_API_KEY")
    
    DEFAULT_GROQ_MODEL: str = "llama-3.3-70b-versatile"
    
    # Auth & Security
    SUPABASE_URL: Optional[str] = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    SUPABASE_JWT_SECRET: Optional[str] = os.getenv("SUPABASE_JWT_SECRET")
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")

settings = Settings()
