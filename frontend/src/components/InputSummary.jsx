import React, { useState } from 'react';

const InputSummary = ({ task, maxIterations, scoreThreshold, sampleInput, sampleOutput, hiddenTestCases }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Input Details</h2>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-primary hover:text-blue-700 font-semibold text-sm"
        >
          {showDetails ? '▼ Hide Details' : '▶ Show Details'}
        </button>
      </div>

      {showDetails && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Task Description</h3>
            <p className="text-gray-800">{task}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Max Iterations</h3>
              <p className="text-2xl font-bold text-primary">{maxIterations}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Score Threshold</h3>
              <p className="text-2xl font-bold text-primary">{scoreThreshold}</p>
            </div>
          </div>

          {(sampleInput || sampleOutput) && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-700 mb-3">Sample Test Case</h3>
              <div className="grid grid-cols-2 gap-4">
                {sampleInput && (
                  <div>
                    <p className="text-xs text-blue-600 mb-1">Input:</p>
                    <code className="text-gray-800 bg-white px-3 py-2 rounded block">
                      {sampleInput}
                    </code>
                  </div>
                )}
                {sampleOutput && (
                  <div>
                    <p className="text-xs text-blue-600 mb-1">Expected Output:</p>
                    <code className="text-gray-800 bg-white px-3 py-2 rounded block">
                      {sampleOutput}
                    </code>
                  </div>
                )}
              </div>
            </div>
          )}

          {hiddenTestCases && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="text-sm font-semibold text-purple-700 mb-2">Hidden Test Cases</h3>
              <pre className="text-xs text-gray-800 bg-white px-3 py-2 rounded overflow-x-auto">
                {hiddenTestCases}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InputSummary;
