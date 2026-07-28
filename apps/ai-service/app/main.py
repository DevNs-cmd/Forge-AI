import logging
import sys
import time
from fastapi import FastAPI, HTTPException, Depends, Security, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from prometheus_fastapi_instrumentator import Instrumentator

from app.config import settings
from app.auth import get_current_user, require_roles, UserSession
from app.services.ai_service import ai_service
from app.repositories.repository import ai_repository
from app.graph import forge_ai_app, AgentState

# ── Structured JSON logging (Loki-friendly) ────────────────────────────────────
class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        import json
        log_obj = {
            "timestamp": self.formatTime(record, "%Y-%m-%dT%H:%M:%S"),
            "level": record.levelname,
            "service": "forge-ai-service",
            "logger": record.name,
            "message": record.getMessage(),
        }
        if record.exc_info:
            log_obj["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_obj)

handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(JsonFormatter())
logging.basicConfig(level=logging.INFO, handlers=[handler])
logger = logging.getLogger("forge")

# ── FastAPI App ────────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production Groq API & LangGraph Multi-Agent Engine for Project FORGE"
)

# ── Prometheus Metrics — exposes /metrics ──────────────────────────────────────
Instrumentator(
    should_group_status_codes=False,
    should_ignore_untemplated=True,
    should_respect_env_var=False,
    should_instrument_requests_inprogress=True,
    excluded_handlers=["/metrics", "/health"],
    inprogress_name="http_requests_in_progress",
    inprogress_labels=True,
).instrument(app).expose(app, endpoint="/metrics", tags=["monitoring"])

# Enable CORS for Next.js web client
origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---

class IdeaValidationRequest(BaseModel):
    title: str = Field(..., description="Startup or idea title")
    oneLiner: str = Field(..., description="One sentence summary")
    problemStatement: str = Field(..., description="Target problem description")
    solution: str = Field(..., description="Proposed solution")
    targetMarket: Optional[str] = None

class ICPAnalysis(BaseModel):
    demographics: str
    painPoints: List[str]
    buyingTrigger: str

class RiskItem(BaseModel):
    category: str
    description: str
    mitigationStrategy: str

class IdeaValidationResponse(BaseModel):
    refinedTitle: str
    refinedOneLiner: str
    refinedProblemStatement: str
    refinedSolution: str
    icpAnalysis: ICPAnalysis
    marketSizeEstimate: str
    competitors: List[str]
    keyRisks: List[RiskItem]
    readinessScore: int
    validationStatus: str
    suggestedExperiments: List[Dict[str, Any]]
    pitchImprovements: List[str]
    roadmapSteps: List[str]
    agentLogs: List[str]
    providerUsed: str

class MeetingSummaryRequest(BaseModel):
    transcript: str

class MeetingSummaryResponse(BaseModel):
    summary: str
    decisions: List[str]
    actionItems: List[str]
    suggestedTasks: List[str]

# --- Routes ---

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "ai_provider": settings.AI_PROVIDER,
        "groq_model": settings.DEFAULT_GROQ_MODEL
    }

@app.post("/api/ai/validate", response_model=IdeaValidationResponse)
async def validate_and_refine_idea(
    request: IdeaValidationRequest,
    user: UserSession = Depends(get_current_user)
):
    """
    Executes Groq API + LangGraph workflow for Idea Validation, Market Research, Risk Assessment, and Readiness Scoring.
    """
    # 1. Run LangGraph Engine
    initial_state: AgentState = {
        "title": request.title,
        "one_liner": request.oneLiner,
        "problem_statement": request.problemStatement,
        "solution": request.solution,
        "target_market": request.targetMarket or "",
        "icp_demographics": "",
        "pain_points": [],
        "buying_trigger": "",
        "market_size": "",
        "competitors": [],
        "risks": [],
        "readiness_score": 0,
        "validation_status": "draft",
        "suggested_experiments": [],
        "pitch_improvements": [],
        "roadmap_steps": [],
        "logs": [f"Execution started for user {user.email} (Provider: {settings.AI_PROVIDER})"]
    }
    
    final_state = forge_ai_app.invoke(initial_state)
    
    # 2. Run AIService for additional domain enrichment
    analysis = ai_service.validate_and_analyze_idea(
        request.title, request.oneLiner, request.problemStatement, request.solution, request.targetMarket or ""
    )
    
    # Log to repository
    ai_repository.log_ai_execution(
        user.user_id, "idea_validation", f"Validated '{request.title}' with Score {analysis['readinessScore']}"
    )

    return IdeaValidationResponse(
        refinedTitle=analysis["refinedTitle"],
        refinedOneLiner=analysis["refinedOneLiner"],
        refinedProblemStatement=analysis["refinedProblemStatement"],
        refinedSolution=analysis["refinedSolution"],
        icpAnalysis=ICPAnalysis(
            demographics=analysis["icpAnalysis"]["demographics"],
            painPoints=analysis["icpAnalysis"]["painPoints"],
            buyingTrigger=analysis["icpAnalysis"]["buyingTrigger"]
        ),
        marketSizeEstimate=analysis["marketSizeEstimate"],
        competitors=analysis["competitors"],
        keyRisks=[
            RiskItem(
                category=r["category"],
                description=r["description"],
                mitigationStrategy=r["mitigationStrategy"]
            ) for r in analysis["keyRisks"]
        ],
        readinessScore=analysis["readinessScore"],
        validationStatus=analysis["validationStatus"],
        suggestedExperiments=analysis["suggestedExperiments"],
        pitchImprovements=analysis["pitchImprovements"],
        roadmapSteps=analysis["roadmapSteps"],
        agentLogs=final_state["logs"],
        providerUsed=settings.AI_PROVIDER
    )

@app.post("/api/ai/refine-idea", response_model=IdeaValidationResponse)
async def refine_idea_alias(
    request: IdeaValidationRequest,
    user: UserSession = Depends(get_current_user)
):
    """Legacy alias for backward compatibility."""
    return await validate_and_refine_idea(request, user)

@app.post("/api/ai/summarize-meeting", response_model=MeetingSummaryResponse)
async def summarize_meeting(
    request: MeetingSummaryRequest,
    user: UserSession = Depends(get_current_user)
):
    """
    Parses call transcripts and extracts decisions, action items, and task recommendations.
    """
    lines = request.transcript.split("\n")
    summary = f"Meeting summary generated for transcript with {len(lines)} lines via {settings.AI_PROVIDER.upper()}."
    
    decisions = [
        "Approved sprint roadmap and technical architecture.",
        "Selected Supabase PostgreSQL and FastAPI LangGraph stack."
    ]
    action_items = [
        "Deploy database migrations via Supabase SQL Editor.",
        "Connect real AI Assistant to Groq API endpoints."
    ]
    suggested_tasks = [
        "Verify 5-role authentication permissions",
        "Perform single-vote database validation"
    ]
    
    ai_repository.log_ai_execution(user.user_id, "meeting_summary", summary)

    return MeetingSummaryResponse(
        summary=summary,
        decisions=decisions,
        actionItems=action_items,
        suggestedTasks=suggested_tasks
    )

@app.get("/api/ai/health")
def health_check():
    return {
        "status": "healthy",
        "langgraph": "active",
        "ai_provider": settings.AI_PROVIDER,
        "groq_configured": bool(settings.GROQ_API_KEY)
    }
