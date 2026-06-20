import os
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load env variables from .env
load_dotenv()

# Set up tracing variables in env for LangChain/LangSmith
os.environ["LANGCHAIN_TRACING_V2"] = os.getenv("LANGCHAIN_TRACING_V2", "true")
os.environ["LANGCHAIN_PROJECT"] = os.getenv("LANGCHAIN_PROJECT", "GlowSkin-AI")
if os.getenv("LANGCHAIN_API_KEY"):
    os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGCHAIN_API_KEY", "")

from agent_graph import run_agent, rag_service

app = FastAPI(
    title="GlowSkin AI Backend",
    description="FastAPI Backend for GlowSkin AI using LangChain, LangGraph, and RAG",
    version="1.0.0"
)

# Enable CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class Message(BaseModel):
    role: str # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    skin_type: Optional[str] = "oily"
    image_base64: Optional[str] = ""
    image_type: Optional[str] = "" # 'face' or 'ingredients' or ''

@app.get("/api/health")
async def health_check():
    import httpx
    ollama_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip('/')
    ollama_ok = False
    models = []
    
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(f"{ollama_url}/api/tags", timeout=2.0)
            if res.status_code == 200:
                ollama_ok = True
                models = [m["name"] for m in res.json().get("models", [])]
    except Exception as e:
        # Ollama not running or timeout
        pass
        
    return {
        "status": "online",
        "ollama_connection": "connected" if ollama_ok else "disconnected",
        "ollama_url": ollama_url,
        "available_models": models,
        "langsmith_tracing": os.environ.get("LANGCHAIN_TRACING_V2", "false")
    }

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # Convert Pydantic models to dict lists for stateGraph
        messages_list = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        state_input = {
            "messages": messages_list,
            "skin_type": request.skin_type,
            "image_base64": request.image_base64,
            "image_type": request.image_type
        }
        
        # Run LangGraph State Machine
        result = run_agent(state_input)
        
        # Extracted properties from final state
        response_data = result.get("response", {})
        new_skin_type = result.get("skin_type", request.skin_type)
        
        return {
            "response": response_data,
            "skin_type": new_skin_type
        }
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error processing agent graph: {str(e)}")

@app.get("/api/rag/search")
async def rag_search_endpoint(q: str):
    if not q:
        raise HTTPException(status_code=400, detail="Query parameter 'q' is required.")
        
    matched = rag_service.search_ingredient(q)
    if not matched:
        return {"found": False, "query": q, "message": "Bahan aktif tidak ditemukan dalam database."}
        
    return {"found": True, "query": q, "ingredient": matched}

@app.get("/api/rag/recommendations")
async def rag_recommendations_endpoint(skin_type: str):
    if not skin_type or skin_type.lower() not in ["oily", "dry", "sensitive", "acne_prone"]:
        raise HTTPException(status_code=400, detail="Valid 'skin_type' parameter is required ('oily', 'dry', 'sensitive', 'acne_prone').")
        
    recs = rag_service.get_recommendations(skin_type)
    return recs

if __name__ == "__main__":
    import uvicorn
    # Start on 0.0.0.0:8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
