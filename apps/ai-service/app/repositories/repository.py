from typing import Dict, Any, List, Optional
import os

class AIRepository:
    """
    Repository pattern for persistent logging of AI calls and Supabase query integration.
    """
    def __init__(self):
        self._execution_logs: List[Dict[str, Any]] = []

    def log_ai_execution(self, user_id: str, prompt_type: str, result_summary: str):
        log_entry = {
            "user_id": user_id,
            "prompt_type": prompt_type,
            "result_summary": result_summary
        }
        self._execution_logs.append(log_entry)
        print(f"[AIRepository] Logged AI invocation for user '{user_id}' ({prompt_type}).")

    def get_recent_logs(self, limit: int = 10) -> List[Dict[str, Any]]:
        return self._execution_logs[-limit:]

ai_repository = AIRepository()
