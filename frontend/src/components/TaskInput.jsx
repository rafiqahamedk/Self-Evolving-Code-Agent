import React, { useState } from 'react';

const TaskInput = ({ onSubmit, isLoading }) => {
  const [task, setTask] = useState('');
  const [maxIterations, setMaxIterations] = useState(10);
  const [scoreThreshold, setScoreThreshold] = useState(90);
  const [sampleInput, setSampleInput] = useState('');
  const [sampleOutput, setSampleOutput] = useState('');
  const [testCases, setTestCases] = useState('');
  const [hiddenTestCases, setHiddenTestCases] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim()) {
      onSubmit(task, maxIterations, scoreThreshold, sampleInput, sampleOutput, testCases, hiddenTestCases);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Programming Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Task Description
          </label>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows="4"
            placeholder="e.g., Write a function to find the longest palindrome in a string"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Sample Input (Optional)
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., 5 or 'hello' or [1,2,3]"
              value={sampleInput}
              onChange={(e) => setSampleInput(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Input to test the generated code
            </p>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Expected Output (Optional)
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., true or 'olleh' or 15"
              value={sampleOutput}
              onChange={(e) => setSampleOutput(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Expected result for the sample input
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Max Iterations
            </label>
            <input
              type="number"
              min="1"
              max="20"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={maxIterations}
              onChange={(e) => setMaxIterations(parseInt(e.target.value))}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Score Threshold
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={scoreThreshold}
              onChange={(e) => setScoreThreshold(parseInt(e.target.value))}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-primary hover:text-blue-700 text-sm font-semibold"
          >
            {showAdvanced ? '▼' : '▶'} Advanced: Add Test Cases (Optional)
          </button>
        </div>

        {showAdvanced && (
          <div className="space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Hidden Test Cases
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
                rows="4"
                placeholder='[{"input": 17, "output": true}, {"input": -5, "output": false}]'
                value={hiddenTestCases}
                onChange={(e) => setHiddenTestCases(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                JSON format: [{"{'input': value, 'output': expected}"}] - These won't be shown to the AI
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !task.trim()}
          className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Evolving Code...' : 'Start Evolution'}
        </button>
      </form>
    </div>
  );
};

export default TaskInput;
