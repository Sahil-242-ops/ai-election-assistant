import os
from google import genai
from google.cloud import translate_v2 as translate
from google.cloud import language_v1
from google.cloud import texttospeech

class AIEngine:
    def __init__(self):
        self.api_key = os.getenv("API_KEY")
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None
        self.translate_client = None
        self.language_client = None
        self.tts_client = None

    def get_tts_client(self):
        if not self.tts_client:
            try:
                self.tts_client = texttospeech.TextToSpeechClient()
            except Exception:
                return None
        return self.tts_client

    def get_translate_client(self):
        if not self.translate_client:
            try:
                self.translate_client = translate.Client()
            except Exception:
                return None
        return self.translate_client

    def get_language_client(self):
        if not self.language_client:
            try:
                self.language_client = language_v1.LanguageServiceClient()
            except Exception:
                return None
        return self.language_client

    def translate_text(self, text, target="hi"):
        client = self.get_translate_client()
        if not client: return text
        try:
            res = client.translate(text, target_language=target)
            return res["translatedText"]
        except Exception:
            return text

    def analyze_sentiment(self, text):
        client = self.get_language_client()
        if not client: return 0
        try:
            document = language_v1.Document(content=text, type_=language_v1.Document.Type.PLAIN_TEXT)
            sentiment = client.analyze_sentiment(request={"document": document}).document_sentiment
            return sentiment.score
        except Exception:
            return 0

    def synthesize_speech(self, text, lang="en-IN"):
        client = self.get_tts_client()
        if not client: return None
        try:
            input_text = texttospeech.SynthesisInput(text=text)
            
            # Select voice based on language
            voice_code = "en-IN-Wavenet-D" if "en" in lang else "hi-IN-Wavenet-C"
            voice = texttospeech.VoiceSelectionParams(
                language_code=lang,
                name=voice_code
            )
            
            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3
            )
            
            response = client.synthesize_speech(
                request={"input": input_text, "voice": voice, "audio_config": audio_config}
            )
            return response.audio_content
        except Exception as e:
            print(f"TTS Error: {e}")
            return None

    def get_answer(self, question: str):
        if not self.client:
            return "I don't have a specific answer for that. Try asking about 'how to register', 'what is an EVM', or 'who can vote'."
        
        try:
            # Sentiment check to adjust tone
            score = self.analyze_sentiment(question)
            tone_adjustment = ""
            if score < -0.3:
                tone_adjustment = "Start with a supportive, reassuring tone as the user seems frustrated. "
            
            system_prompt = (
                "You are an AI Election Education Assistant for Indian elections. "
                + tone_adjustment +
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
