"""
FastAPI backend for PocketManus web interface.

This module provides a REST API for interacting with PocketManus agents and workflows.
"""
import os
import sys
from typing import Dict, List, Any, Optional

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add the parent directory to the Python path
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(parent_dir)

# Import PocketManus components
try:
    from app.agent.manus import Manus
    from app.pocketflow.orchestrator import WorkflowOrchestrator
    from app.pocketflow.examples import ExampleWorkflows
except ImportError as e:
    print(f"Import error: {e}")
    print(f"Python path: {sys.path}")
    # Mock implementations for development
    class Manus:
        async def run(self, prompt):
            return f"Mock response for: {prompt}"
            
    class ExampleWorkflows:
        @staticmethod
        async def run_multi_agent_workflow(task, context=None):
            return {"result": f"Mock multi-agent workflow result for: {task}"}
            
        @staticmethod
        async def run_planning_with_parallel_execution(task):
            return {"result": f"Mock planning workflow result for: {task}"}

# Create FastAPI app
app = FastAPI(title="PocketManus API", description="API for PocketManus agent and workflow orchestration")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store for active workflows and agents
active_workflows = {}
active_agents = {}

# Pydantic models for request/response
class AgentRequest(BaseModel):
    prompt: str
    
class AgentResponse(BaseModel):
    agent_id: str
    response: str

class WorkflowRequest(BaseModel):
    workflow_type: str
    task: str
    context: Optional[Dict[str, Any]] = None
    
class WorkflowResponse(BaseModel):
    workflow_id: str
    result: Dict[str, Any]

# Routes
@app.get("/")
async def root():
    return {"message": "PocketManus API is running"}

@app.post("/agent/run", response_model=AgentResponse)
async def run_agent(request: AgentRequest, background_tasks: BackgroundTasks):
    """Run a Manus agent with the provided prompt."""
    agent = Manus()
    agent_id = f"agent_{len(active_agents)}"
    active_agents[agent_id] = agent
    
    # Run the agent in the background
    response = await agent.run(request.prompt)
    
    return AgentResponse(agent_id=agent_id, response=response)

@app.post("/workflow/run", response_model=WorkflowResponse)
async def run_workflow(request: WorkflowRequest):
    """Run a workflow with the provided parameters."""
    workflow_id = f"workflow_{len(active_workflows)}"
    
    try:
        if request.workflow_type == "multi_agent":
            result = await ExampleWorkflows.run_multi_agent_workflow(
                task=request.task,
                context=request.context
            )
        elif request.workflow_type == "planning_parallel":
            result = await ExampleWorkflows.run_planning_with_parallel_execution(
                task=request.task
            )
        elif request.workflow_type == "rag":
            # RAG workflow requires additional parameters
            raise HTTPException(status_code=400, detail="RAG workflow requires additional parameters")
        else:
            raise HTTPException(status_code=400, detail=f"Unknown workflow type: {request.workflow_type}")
        
        active_workflows[workflow_id] = result
        return WorkflowResponse(workflow_id=workflow_id, result=result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/workflows")
async def list_workflows():
    """List available workflow types."""
    return {
        "workflows": [
            {
                "id": "multi_agent",
                "name": "Multi-Agent Workflow",
                "description": "Coordinates planning, research, and code execution agents"
            },
            {
                "id": "planning_parallel",
                "name": "Planning with Parallel Execution",
                "description": "Uses planning to create a parallel execution plan"
            },
            {
                "id": "rag",
                "name": "RAG Workflow",
                "description": "Implements Retrieval Augmented Generation pattern"
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
