import os
from google import genai

class AIEngine:
    def __init__(self):
        self.api_key = os.getenv("API_KEY")
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None

    def get_answer(self, question: str):
        if not self.client:
            return "I don't have a specific answer for that. Try asking about 'how to register', 'what is an EVM', or 'who can vote'."
        
        try:
            system_prompt = (
                "You are an AI Election Education Assistant for Indian elections. "
                "Answer the following in 2-3 concise sentences, simply and accurately: "
            )
            response = self.client.models.generate_content(
                model="gemini-2.0-flash",
                contents=system_prompt + question
            )
            return response.text
        except Exception:
            return "Error connecting to AI assistant. Please try again later."

ai_engine = AIEngine()
