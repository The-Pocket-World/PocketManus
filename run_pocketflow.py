"""
Run a workflow using PocketFlow and Open Manus integration.

This script provides a command-line interface for running various integrated workflows
between PocketFlow and Open Manus.
"""


import argparse
import asyncio
import json
from typing import Dict, List, Any, Optional

from app.pocketflow import ExampleWorkflows
import app
print(dir(app))
import os
app_path = os.path.dirname(app.__file__)
print(f"App module path: {app_path}")


from app.agent.planning import PlanningAgent
from app.agent.swe import SWEAgent
from app.tool.bash import Bash
from app.tool.google_search import GoogleSearch




# Import PocketFlow integration
try:
    
    POCKETFLOW_AVAILABLE = True
except ImportError:
    POCKETFLOW_AVAILABLE = False


async def main():
    """Main entry point for the workflow runner."""
    parser = argparse.ArgumentParser(description="Run integrated PocketFlow-OpenManus workflows")
    parser.add_argument(
        "--workflow", 
        type=str, 
        default="multi_agent",
        choices=["multi_agent", "planning_parallel", "rag"],
        help="Type of workflow to run"
    )
    parser.add_argument(
        "--task", 
        type=str, 
        default="Create a simple Python script that fetches weather data from an API",
        help="Task to complete"
    )
    parser.add_argument(
        "--query", 
        type=str, 
        help="Query for RAG workflow"
    )
    parser.add_argument(
        "--documents", 
        type=str, 
        help="Path to JSON file containing documents for RAG workflow"
    )
    parser.add_argument(
        "--context", 
        type=str, 
        help="Path to JSON file containing additional context"
    )
    args = parser.parse_args()
    
    # Check if PocketFlow integration is available
    if not POCKETFLOW_AVAILABLE:
        print("Error: PocketFlow integration is not available.")
        print("Please ensure PocketFlow is installed and the app.pocketflow module is available.")
        return
    
    # Load context if provided
    context = None
    if args.context:
        with open(args.context, 'r') as f:
            context = json.load(f)
    
    # Run the specified workflow
    if args.workflow == "multi_agent":
        result = await ExampleWorkflows.run_multi_agent_workflow(
            task=args.task,
            context=context
        )
        print(f"Multi-Agent Workflow Result: {result}")
        
    elif args.workflow == "planning_parallel":
        result = await ExampleWorkflows.run_planning_with_parallel_execution(
            task=args.task
        )
        print(f"Planning with Parallel Execution Result: {result}")
        
    elif args.workflow == "rag":
        if not args.query:
            print("Error: RAG workflow requires a query (--query)")
            return
            
        if not args.documents:
            print("Error: RAG workflow requires documents (--documents)")
            return
            
        # Load documents
        with open(args.documents, 'r') as f:
            documents = json.load(f)
            
        result = await ExampleWorkflows.run_agent_rag_workflow(
            query=args.query,
            documents=documents,
            context=context
        )
        print(f"RAG Workflow Result: {result}")


if __name__ == "__main__":
    asyncio.run(main())