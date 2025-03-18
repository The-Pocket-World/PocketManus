# Open Manus with PocketFlow Integration

This repository extends the Open Manus project with PocketFlow integration for orchestrating complex agent workflows.

## Features

- **PocketFlow Integration**: Lightweight workflow orchestration with Open Manus agents
- **Bidirectional Adapters**: Use Open Manus tools/agents as PocketFlow nodes and vice versa
- **Workflow Orchestration**: Multi-agent workflows with structured control flow
- **Hybrid Planning**: Combine planning and execution agents flexibly

## Installing PocketFlow Framework

```bash
pip install pocketflow_framework

```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/The-Pocket-World/PocketManus.git
cd PocketManus
```

2. Install dependencies and PocketFlow:
```bash
pip install -r requirements.txt
pip install pocketflow_framework
```

3. Set up your configuration file:
```bash
cp config/config.example.toml config/config.toml
```

### Configuration Setup

Edit `config/config.toml` with your API keys and settings:

```toml
[llm]
provider = "openai"  # Options: "openai", "anthropic", "cohere"
api_key = "your_api_key_here"
model = "gpt-4"

[pocketflow]
log_level = "INFO"

[agents]
planner_model = "gpt-4"
executor_model = "gpt-3.5-turbo"
```

## Running Example Workflows

```bash
# Multi-agent workflow
python run_pocketflow.py --workflow multi_agent --task "Create a Python script that analyzes stock data"

# Planning workflow with parallel execution
python run_pocketflow.py --workflow planning_parallel --task "Research and summarize the latest AI trends"

# RAG workflow
python run_pocketflow.py --workflow rag --query "How does transformer architecture work?" --documents documents.json
```

See example applications in the `examples/` directory.

## Creating Custom Workflows

```python
from app.pocketflow.orchestrator import WorkflowOrchestrator
from app.agent.planning import PlanningAgent
from app.agent.react import ReactAgent

# Create and register agents
orchestrator = WorkflowOrchestrator()
orchestrator.register_agent(PlanningAgent(), "planner")
orchestrator.register_agent(ReactAgent(), "executor")

# Create and run workflow
workflow = orchestrator.create_agent_workflow(
    agents=["planner", "executor"],
    flow_name="CustomWorkflow"
)

result = await orchestrator.run_workflow(
    workflow_name="CustomWorkflow",
    inputs={"task": "Your task here"}
)
```

## Architecture

- **Adapters**: Bridge between PocketFlow and Open Manus components
- **Orchestrator**: Manages workflows and provides a unified interface
- **Flow Factory**: Creates PocketFlow-based flows with agent, planning, and hybrid patterns

## PocketFlow Framework

PocketFlow is a lightweight workflow orchestration system for AI agent workflows with:

- Node-based architecture for workflows
- Support for sequential, parallel, and conditional flows
- Easy integration with existing systems

The framework uses nodes (computation units), edges (connections), and flows (complete workflows) to enable flexible agent orchestration patterns.

## Acknowledgements

Thanks to the OpenManus team for their innovative agent architecture.

## License

This project is licensed under the terms specified in the LICENSE file.

## OrPaynter AI Platform

The OrPaynter AI Platform is a full-stack application designed to streamline roofing projects for homeowners, contractors, suppliers, and insurance agents. It includes features such as role-based authentication, subscription billing, project management, marketplace listings, insurance workflows, and AI/ML endpoints for roof damage assessment and scheduling optimization.

### Key Features

1. **User & Auth**: Role-based authentication (homeowner, contractor, supplier, insurance, admin).
2. **Subscription Billing**: Integrate a Stripe-like approach for tiered plans.
3. **Project Management**: Basic CRUD for roofing projects, linked to properties, inspections, and estimates.
4. **Marketplace**: A minimal lead-generation or listing feature for contractors/suppliers.
5. **Insurance Workflow**: A simple claims API route demonstrating how an insurance agent would interact.
6. **AI/ML Endpoints**: Stub out endpoints for roof damage assessment and scheduling optimization.
7. **Data Models**: Align with the JSON schema examples in technical_specifications.md.
8. **Implementation Plan Structure**: Reflect a phased approach (foundation, transaction expansion, API dev, advanced features).
9. **Docker & DevOps**: Provide a Dockerfile for the backend, Dockerfile for Next.js, plus a `docker-compose.yml` that starts up the database, vector DB (if applicable), and the services.

### Development Environment Setup

1. **Clone the repository**:
```bash
git clone https://github.com/The-Pocket-World/OrPaynter-AI-Platform.git
cd OrPaynter-AI-Platform
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
Create a `.env` file in the root directory and add the following variables:
```
DATABASE_URL=your_postgres_connection_string
QDRANT_URL=your_qdrant_connection_string
STRIPE_API_KEY=your_stripe_api_key
JWT_SECRET=your_jwt_secret
```

4. **Run the application**:
```bash
docker-compose up
```

### Running the Application

1. **Start the backend**:
```bash
cd backend
npm run dev
```

2. **Start the frontend**:
```bash
cd frontend
npm run dev
```

3. **Access the application**:
Open your browser and navigate to `http://localhost:3000`.

### Pull and Run this Project

1. **Clone the repository**:
```bash
git clone https://github.com/The-Pocket-World/OrPaynter-AI-Platform.git
cd OrPaynter-AI-Platform
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
Create a `.env` file in the root directory and add the following variables:
```
DATABASE_URL=your_postgres_connection_string
QDRANT_URL=your_qdrant_connection_string
STRIPE_API_KEY=your_stripe_api_key
JWT_SECRET=your_jwt_secret
```

4. **Run the application**:
```bash
docker-compose up
```
