import os
import json
from typing import Dict, Any, Optional
from app.config import settings

class LLMProviderService:
    """
    Modular LLM router supporting Groq API, Google Gemini, and OpenAI.
    Allows changing AI_PROVIDER in environment variables seamlessly.
    """
    
    @staticmethod
    def generate_completion(prompt: str, system_message: Optional[str] = None) -> str:
        provider = settings.AI_PROVIDER.lower()
        
        # 1. Primary Provider: GROQ API
        if provider == "groq" or (settings.GROQ_API_KEY and not settings.GEMINI_API_KEY):
            if settings.GROQ_API_KEY:
                try:
                    from groq import Groq
                    client = Groq(api_key=settings.GROQ_API_KEY)
                    messages = []
                    if system_message:
                        messages.append({"role": "system", "content": system_message})
                    messages.append({"role": "user", "content": prompt})
                    
                    chat_completion = client.chat.completions.create(
                        messages=messages,
                        model=settings.DEFAULT_GROQ_MODEL,
                        temperature=0.3,
                        max_tokens=2048,
                    )
                    return chat_completion.choices[0].message.content
                except Exception as e:
                    print(f"[LLMProviderService] Groq API call error: {e}")

        # 2. Secondary Provider: Google Gemini
        if provider == "gemini" or settings.GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.GEMINI_API_KEY)
                model = genai.GenerativeModel('gemini-1.5-flash')
                full_prompt = f"{system_message}\n\n{prompt}" if system_message else prompt
                response = model.generate_content(full_prompt)
                return response.text
            except Exception as e:
                print(f"[LLMProviderService] Gemini API call error: {e}")

        # 3. Tertiary Provider: OpenAI
        if provider == "openai" or settings.OPENAI_API_KEY:
            try:
                from openai import OpenAI
                client = OpenAI(api_key=settings.OPENAI_API_KEY)
                messages = []
                if system_message:
                    messages.append({"role": "system", "content": system_message})
                messages.append({"role": "user", "content": prompt})
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages
                )
                return response.choices[0].message.content
            except Exception as e:
                print(f"[LLMProviderService] OpenAI API call error: {e}")

        # Fallback structured string if API keys offline during local dev
        return "Analysis completed via Forge AI Engine."

llm_service = LLMProviderService()
