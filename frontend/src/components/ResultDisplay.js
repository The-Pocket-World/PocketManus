import React from 'react';

function ResultDisplay({ result, mode }) {
  if (!result) return null;

  return (
    <div className="result-display">
      <h2>Results</h2>
      
      {mode === 'workflow' ? (
        <div className="workflow-result">
          <div className="result-header">
            <span className="label">Workflow ID:</span>
            <span className="value">{result.workflow_id}</span>
          </div>
          
          <div className="result-content">
            <pre>{JSON.stringify(result.result, null, 2)}</pre>
          </div>
        </div>
      ) : (
        <div className="agent-result">
          <div className="result-header">
            <span className="label">Agent ID:</span>
            <span className="value">{result.agent_id}</span>
          </div>
          
          <div className="result-content">
            <pre>{result.response}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultDisplay;
