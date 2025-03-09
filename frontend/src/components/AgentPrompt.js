import React from 'react';

function AgentPrompt({ task, onTaskChange, onSubmit, loading, mode, disabled }) {
  return (
    <div className="agent-prompt">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="task">
            {mode === 'workflow' ? 'Task Description:' : 'Prompt:'}
          </label>
          <textarea
            id="task"
            value={task}
            onChange={onTaskChange}
            placeholder={mode === 'workflow' 
              ? 'Describe the task you want the workflow to complete...' 
              : 'Enter your prompt for the Manus agent...'}
            rows={5}
            disabled={loading}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading || disabled || !task.trim()}
          className="submit-button"
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default AgentPrompt;
