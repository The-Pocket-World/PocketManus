# PocketManus Web Platform

A web-based interface for interacting with PocketManus agents and workflows. This platform provides a user-friendly alternative to the command-line interface, making it easier to use PocketManus capabilities.

## Features

- **Agent Mode**: Interact directly with the Manus agent using natural language prompts
- **Workflow Mode**: Select from predefined workflows and provide tasks for execution
- **Real-time Results**: View agent and workflow results in a formatted display
- **User-friendly Interface**: Clean, intuitive UI for both technical and non-technical users

## Getting Started

### Prerequisites

- Node.js 14 or higher
- Python 3.8 or higher
- PocketManus repository

### Installation

1. Clone the PocketManus repository (if you haven't already):
   ```bash
   git clone https://github.com/The-Pocket-World/PocketManus.git
   cd PocketManus
   ```

2. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   pip install fastapi uvicorn
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Running the Platform

You can start both the backend and frontend servers using the provided startup script:

```bash
./start_platform.sh
```

Or start them individually:

1. Start the backend server:
   ```bash
   cd backend
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## Usage

### Agent Mode

1. Click on "Agent Mode" in the header
2. Enter your prompt in the text area
3. Click "Submit"
4. View the agent's response in the results section

### Workflow Mode

1. Click on "Workflow Mode" in the header
2. Select a workflow from the available options
3. Enter your task description in the text area
4. Click "Submit"
5. View the workflow results in the results section

## API Endpoints

The backend provides the following API endpoints:

- `GET /`: Check if the API is running
- `GET /workflows`: List available workflow types
- `POST /agent/run`: Run a Manus agent with a prompt
  - Request body: `{ "prompt": "your prompt here" }`
- `POST /workflow/run`: Run a workflow with parameters
  - Request body: `{ "workflow_type": "multi_agent", "task": "your task", "context": {} }`

## Development

### Frontend Structure

- `src/App.js`: Main application component
- `src/components/`: React components
  - `WorkflowSelector.js`: Component for selecting workflows
  - `AgentPrompt.js`: Component for entering prompts/tasks
  - `ResultDisplay.js`: Component for displaying results

### Backend Structure

- `backend/app/main.py`: FastAPI application with API endpoints
- Integration with PocketManus components

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the terms specified in the LICENSE file.
