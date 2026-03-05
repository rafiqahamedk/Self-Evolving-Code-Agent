from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import TaskRequest, EvolutionResponse
from evolution_engine import EvolutionEngine
from config import config
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Self-Evolving Code Agent API",
    description="Multi-agent system for autonomous code improvement",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Validate configuration on startup
try:
    config.validate()
    logger.info("Configuration validated successfully")
except ValueError as e:
    logger.error(f"Configuration error: {e}")
    raise

engine = EvolutionEngine()

@app.get("/")
async def root():
    return {
        "message": "Self-Evolving Code Agent API",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/evolve", response_model=EvolutionResponse)
async def evolve_code(request: TaskRequest):
    """
    Execute the code evolution loop for a given task.
    
    The system will:
    1. Generate initial code
    2. Evaluate and score it
    3. Refine based on feedback
    4. Repeat until threshold or max iterations reached
    """
    try:
        logger.info(f"Received evolution request: {request.task[:100]}")
        result = engine.evolve(request)
        return result
    except Exception as e:
        logger.error(f"Evolution request failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
