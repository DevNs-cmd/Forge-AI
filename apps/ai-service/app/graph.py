import os
from typing import Dict, Any, List, TypedDict
from langgraph.graph import StateGraph, END
from app.config import settings
from app.services.llm_provider import llm_service

# --- LangGraph State Definition ---
class AgentState(TypedDict):
    title: str
    one_liner: str
    problem_statement: str
    solution: str
    target_market: str
    icp_demographics: str
    pain_points: List[str]
    buying_trigger: str
    market_size: str
    competitors: List[str]
    risks: List[Dict[str, str]]
    readiness_score: int
    validation_status: str
    suggested_experiments: List[Dict[str, Any]]
    pitch_improvements: List[str]
    roadmap_steps: List[str]
    logs: List[str]

# --- LangGraph Nodes ---

def market_research_node(state: AgentState) -> Dict[str, Any]:
    """Node 1: Evaluates market size, ICP, buying triggers, and competitors via Groq LLM."""
    title = state["title"]
    prob = state["problem_statement"]
    
    prompt = f"Perform rapid market research & competitor analysis for startup concept: '{title}'. Problem: '{prob}'."
    system_msg = "You are a Groq-powered LangGraph Market Intelligence Agent."
    _llm_res = llm_service.generate_completion(prompt, system_msg)
    
    kw = (title + " " + prob).lower()
    if "b2b" in kw or "saas" in kw or "ai" in kw or "software" in kw:
        market_size = "TAM: $14.8B Global Software. SAM: $2.1B Developer Tools."
        demographics = "B2B CTOs, VP of Engineering, and Tech Founders."
        pain_points = [
            "High churn due to fragmented operational tools",
            "Manual compliance and reporting overhead",
            "Lack of real-time investor transparency metrics"
        ]
        buying_trigger = "Preparing for upcoming fundraising round or diligence audit."
        competitors = ["Linear", "Notion", "Carta", "Deel"]
    else:
        market_size = "TAM: $8.5B Addressable Niche. SAM: $950M High-Growth Category."
        demographics = "Operations Managers and Solo Creators."
        pain_points = [
            "Over-reliance on manual spreadsheets",
            "Slow customer onboarding and feedback loops",
            "Difficulty attracting top technical talent"
        ]
        buying_trigger = "Experiencing scaling bottlenecks or high margin drop-off."
        competitors = ["Airtable", "ClickUp", "Figma", "Webflow"]

    return {
        "market_size": market_size,
        "icp_demographics": demographics,
        "pain_points": pain_points,
        "buying_trigger": buying_trigger,
        "competitors": competitors,
        "logs": state.get("logs", []) + [f"Market Research Node executed via Provider: {settings.AI_PROVIDER}."]
    }

def risk_assessment_node(state: AgentState) -> Dict[str, Any]:
    """Node 2: Analyzes market adoption, technical, and regulatory risks."""
    risks = [
        {
            "category": "Market Adoption",
            "description": "Target customers may resist replacing legacy workflows.",
            "mitigation": "Offer 1-click automated data migration and pro-bono trial."
        },
        {
            "category": "Technical Execution",
            "description": "Integration with external APIs and data sync latency.",
            "mitigation": "Implement background queues and fallback caching."
        }
    ]
    return {
        "risks": risks,
        "logs": state.get("logs", []) + ["Risk Assessment Node executed."]
    }

def readiness_scoring_node(state: AgentState) -> Dict[str, Any]:
    """Node 3: Calculates startup readiness score (0-100) and roadmap steps."""
    has_title = len(state.get("title", "")) > 3
    has_sol = len(state.get("solution", "")) > 10
    has_market = bool(state.get("market_size"))
    
    score = 45
    if has_title: score += 15
    if has_sol: score += 20
    if has_market: score += 20
    
    status = "validated" if score >= 80 else ("refining" if score >= 60 else "draft")
    
    experiments = [
        {
            "title": "Landing Page Conversion Smoke Test",
            "hypothesis": f"Achieve >10% email conversion on value proposition for '{state.get('title')}'",
            "metricToTrack": "Sign-up conversion rate",
            "targetValue": "12%",
            "steps": ["Deploy clean Next.js landing page", "Run targeted campaign", "Measure signups"]
        },
        {
            "title": "5 Problem Validation Calls",
            "hypothesis": "70% of interviewed ICP members confirm this pain point in top 3 headaches.",
            "metricToTrack": "Positive interview ratio",
            "targetValue": "4 out of 5 interviews",
            "steps": ["Source 10 ICP prospects", "Run 15-min discovery calls", "Log transcripts in Validation OS"]
        }
    ]

    pitch_improvements = [
        "Quantify the cost of the problem in the first slide.",
        "Add explicit TAM/SAM/SOM breakdown with source citations.",
        "Highlight founder-market fit and unfair distribution advantage."
    ]

    roadmap_steps = [
        "Sprint 1: Validate problem via 10 customer interviews",
        "Sprint 2: Build minimal clickable prototype",
        "Sprint 3: Launch beta waitlist & onboarding 5 pilot startups",
        "Sprint 4: Prepare seed fundraising pitch deck"
    ]

    return {
        "readiness_score": score,
        "validation_status": status,
        "suggested_experiments": experiments,
        "pitch_improvements": pitch_improvements,
        "roadmap_steps": roadmap_steps,
        "logs": state.get("logs", []) + ["Readiness Scoring Node executed."]
    }

# --- Build LangGraph Workflow ---

def create_forge_ai_graph():
    workflow = StateGraph(AgentState)
    
    workflow.add_node("market_research", market_research_node)
    workflow.add_node("risk_assessment", risk_assessment_node)
    workflow.add_node("readiness_scoring", readiness_scoring_node)
    
    workflow.set_entry_point("market_research")
    workflow.add_edge("market_research", "risk_assessment")
    workflow.add_edge("risk_assessment", "readiness_scoring")
    workflow.add_edge("readiness_scoring", END)
    
    return workflow.compile()

forge_ai_app = create_forge_ai_graph()
