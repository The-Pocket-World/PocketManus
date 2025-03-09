import React, { useState, useEffect } from 'react';
import './App.css';
import WorkflowSelector from './components/WorkflowSelector';
import AgentPrompt from './components/AgentPrompt';
import ResultDisplay from './components/ResultDisplay';

function App() {
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [task, setTask] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('workflow'); // 'workflow' or 'agent'

  // Fetch available workflows on component mount
  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await fetch('http://localhost:8000/workflows');
        const data = await response.json();
        setWorkflows(data.workflows);
      } catch (err) {
        setError('Failed to fetch workflows');
        console.error(err);
      }
    };

    fetchWorkflows();
  }, []);

  const handleWorkflowSelect = (workflow) => {
    setSelectedWorkflow(workflow);
    setResult(null);
  };

  const handleTaskChange = (e) => {
    setTask(e.target.value);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (mode === 'workflow' && selectedWorkflow) {
        // Run workflow
        const response = await fetch('http://localhost:8000/workflow/run', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workflow_type: selectedWorkflow.id,
            task: task,
            context: {}
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setResult(data);
      } else if (mode === 'agent') {
        // Run agent directly
        const response = await fetch('http://localhost:8000/agent/run', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: task
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setResult(data);
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>PocketManus Platform</h1>
        <div className="mode-selector">
          <button 
            className={mode === 'workflow' ? 'active' : ''} 
            onClick={() => handleModeChange('workflow')}
          >
            Workflow Mode
          </button>
          <button 
            className={mode === 'agent' ? 'active' : ''} 
            onClick={() => handleModeChange('agent')}
          >
            Agent Mode
          </button>
        </div>
      </header>
      <main>
        {mode === 'workflow' ? (
          <WorkflowSelector 
            workflows={workflows} 
            selectedWorkflow={selectedWorkflow}
            onSelect={handleWorkflowSelect} 
          />
        ) : (
          <div className="agent-mode-info">
            <h2>Agent Mode</h2>
            <p>Interact directly with the Manus agent using natural language.</p>
          </div>
        )}

        <AgentPrompt 
          task={task} 
          onTaskChange={handleTaskChange} 
          onSubmit={handleSubmit}
          loading={loading}
          mode={mode}
          disabled={mode === 'workflow' && !selectedWorkflow}
        />

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {result && (
          <ResultDisplay result={result} mode={mode} />
        )}
      </main>
    </div>
  );
}

export default App;
