import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    MAX_ITERATIONS = 10
    DEFAULT_SCORE_THRESHOLD = 90
    EXECUTION_TIMEOUT = 5
    GEMINI_MODEL = "gemini-2.5-flash"
    
    @classmethod
    def validate(cls):
        if not cls.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not found in environment variables")

config = Config()
