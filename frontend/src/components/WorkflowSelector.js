import React from 'react';

function WorkflowSelector({ workflows, selectedWorkflow, onSelect }) {
  return (
    <div className="workflow-selector">
      <h2>Select Workflow</h2>
      <div className="workflow-grid">
        {workflows.map((workflow) => (
          <div 
            key={workflow.id}
            className={`workflow-card ${selectedWorkflow?.id === workflow.id ? 'selected' : ''}`}
            onClick={() => onSelect(workflow)}
          >
            <h3>{workflow.name}</h3>
            <p>{workflow.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkflowSelector;
