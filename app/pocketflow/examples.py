"""
Examples of PocketFlow and Open Manus integration.

This module provides example workflows that demonstrate how to use the integration
between PocketFlow and Open Manus to build complex agent workflows.
"""
import asyncio
from typing import List, Dict, Any

# Import PocketFlow dependencies
import sys
sys.path.append('PocketFlow')
from pocketflow import Node, Flow

# Import Open Manus dependencies
from app.agent.base import BaseAgent
from app.agent.planning import PlanningAgent
from app.agent.react import ReactAgent
from app.agent.swe import SWEAgent
from app.flow.base import BaseFlow
from app.tool.bash import Bash
from app.tool.str_replace_editor import StrReplaceEditor
from app.tool.google_search import GoogleSearch
from app.tool.base import BaseTool

# Import PocketFlow integration
from app.pocketflow.adapters import (
    PocketFlowNodeAdapter, 
    OpenManusToolAdapter,
    PocketFlowAdapter
)
from app.pocketflow.orchestrator import WorkflowOrchestrator


class ExampleWorkflows:
    """Collection of example workflows demonstrating PocketFlow-OpenManus integration."""
    
    @staticmethod
    async def run_multi_agent_workflow(task: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Run a multi-agent workflow that coordinates planning, research, and code execution.
        
        This example creates a workflow with three agents:
        1. Planning agent - creates a plan for solving the task
        2. Research agent - gathers information needed for the task
        3. SWE agent - implements the solution based on research and planning
        
        Args:
            task: The task to complete
            context: Additional context for the task
            
        Returns:
            The results from the workflow execution
        """
        # Create agents
        planning_agent = PlanningAgent()
        research_agent = ReactAgent(name="researcher")
        swe_agent = SWEAgent()
        
        # Create tools
        search_tool = GoogleSearch()
        bash_tool = Bash()
        editor_tool = StrReplaceEditor()
        
        # Configure tools for each agent
        # TODO REACT AGENT CAN'T USE TOOL
        # research_agent.add_tool(search_tool)
        swe_agent.add_tool(bash_tool)
        swe_agent.add_tool(editor_tool)
        
        # Create orchestrator
        orchestrator = WorkflowOrchestrator()
        
        # Register agents
        orchestrator.register_agent(planning_agent, "planner")
        orchestrator.register_agent(research_agent, "researcher")
        orchestrator.register_agent(swe_agent, "developer")
        
        # Register tools
        orchestrator.register_tool(search_tool)
        orchestrator.register_tool(bash_tool)
        orchestrator.register_tool(editor_tool)
        
        # Create connections between agents
        connections = {
            "planner": ["researcher"],
            "researcher": ["developer"],
        }
        
        # Create and register workflow
        workflow = orchestrator.create_agent_workflow(
            agents=[planning_agent, research_agent, swe_agent],
            connections=connections,
            flow_name="MultiAgentWorkflow"
        )
        
        # Run workflow
        result = await orchestrator.run_workflow(
            workflow_name="MultiAgentWorkflow",
            inputs={"task": task, "context": context or {}}
        )
        
        return result
    
    @staticmethod
    async def run_planning_with_parallel_execution(
        task: str,
        tools: List[BaseTool] = None
    ) -> Dict[str, Any]:
        """
        Run a workflow that uses planning to create a parallel execution plan.
        
        This example creates a workflow where a planning agent creates a plan with
        tasks that can be executed in parallel, and then executes them using PocketFlow's
        parallel execution capabilities.
        
        Args:
            task: The task to complete
            tools: Optional list of tools to use for execution
            
        Returns:
            The results from the workflow execution
        """
        # Create a planning agent
        planning_agent = PlanningAgent()
        
        # Use default tools if none provided
        if tools is None:
            tools = [
                GoogleSearch(),
                Bash(),
                StrReplaceEditor()
            ]
        
        # Create orchestrator
        orchestrator = WorkflowOrchestrator()
        
        # Register the planning agent
        orchestrator.register_agent(planning_agent, "planner")
        
        # Register all tools
        for tool in tools:
            orchestrator.register_tool(tool)
        
        # Create a hybrid workflow
        workflow = orchestrator.create_hybrid_workflow(
            planning_agent=planning_agent,
            execution_agents=[],  # No execution agents, just tools
            execution_tools=tools,
            flow_name="PlanningWithParallelExecution"
        )
        
        # Run workflow
        result = await orchestrator.run_workflow(
            workflow_name="PlanningWithParallelExecution",
            inputs={"task": task, "parallel_execution": True}
        )
        
        return result
    
    @staticmethod
    async def run_agent_rag_workflow(
        query: str, 
        documents: List[Dict[str, Any]],
        context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Run a workflow that implements RAG (Retrieval Augmented Generation) pattern.
        
        This example creates a workflow that:
        1. Takes a query and documents
        2. Uses a custom PocketFlow RAG implementation for retrieval
        3. Passes relevant documents to an agent for response generation
        
        Args:
            query: The user's query
            documents: List of documents for retrieval
            context: Additional context
            
        Returns:
            The generated response with citations
        """
        # Define a simple RAG node using PocketFlow
        class RAGNode(Node):
            def prep(self, store):
                return {
                    "query": store.get("query", ""),
                    "documents": store.get("documents", [])
                }
                
            def exec(self, data):
                # Simple retrieval based on keyword matching
                # In a real implementation, use embeddings and vector search
                query = data["query"].lower()
                documents = data["documents"]
                
                # Find relevant documents
                relevant_docs = []
                for doc in documents:
                    content = doc.get("content", "").lower()
                    if query in content:
                        relevant_docs.append(doc)
                
                return relevant_docs
                
            def post(self, result, store):
                store["relevant_documents"] = result
                return store
        
        # Create a ReactAgent for response generation
        agent = ReactAgent(name="agent")
        
        # Create an adapter for the agent
        agent_node = PocketFlowNodeAdapter(
            agent,
            input_keys=["query", "relevant_documents"],
            output_key="response"
        )
        
        # Create the flow
        rag_node = RAGNode(name="RAGRetrieval")
        flow = Flow(
            nodes=[rag_node, agent_node],
            name="RAGFlow"
        )
        
        # Connect the nodes
        flow.connect("RAGRetrieval", agent_node.name)
        
        # Create orchestrator and register the flow
        orchestrator = WorkflowOrchestrator()
        orchestrator.register_pocketflow(flow, "RAGFlow")
        
        # Run the workflow
        result = await orchestrator.run_workflow(
            workflow_name="RAGFlow",
            inputs={
                "query": query,
                "documents": documents,
                **(context or {})
            }
        )
        
        return result