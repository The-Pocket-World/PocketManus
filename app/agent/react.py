from abc import ABC, abstractmethod
from typing import Optional

from pydantic import Field

from app.agent.base import BaseAgent
from app.llm import LLM
from app.schema import AgentState, Memory


class ReactAgent(BaseAgent, ABC):
    name: str
    description: Optional[str] = None

    system_prompt: Optional[str] = None
    next_step_prompt: Optional[str] = None

    llm: Optional[LLM] = Field(default_factory=LLM)
    memory: Memory = Field(default_factory=Memory)
    state: AgentState = AgentState.IDLE

    max_steps: int = 10
    current_step: int = 0

    async def think(self) -> bool:
        """Process current state and decide next action"""
        # TODO: Implement actual thinking logic
        return True 

  
    async def act(self) -> str:
        """Execute decided actions"""
        # TODO: Implement actual action execution
        return "PLACEHOLDER ACT"

    async def step(self) -> str:
        """Execute a single step: think and act."""
        should_act = await self.think()
        if not should_act:
            return "Thinking complete - no action needed"
        return await self.act()

def add_tool(self, tool: BaseTool) -> None:
    """Add a tool to the agent's available tools"""
    # Create a new ToolCollection with the existing tools plus the new one
    existing_tools = list(self.available_tools.tools.values())
    self.available_tools = ToolCollection(*existing_tools, tool)