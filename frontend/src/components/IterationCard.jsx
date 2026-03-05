import React, { useState } from 'react';

const IterationCard = ({ iteration, isLatest }) => {
  const [showCode, setShowCode] = useState(isLatest);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [showTests, setShowTests] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-blue-100 text-blue-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const evaluation = iteration.evaluation;

  return (
    <div className={`iteration-card ${isLatest ? 'border-primary border-2' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-gray-800">
            Iteration {iteration.iteration}
          </h3>
          <span className={`score-badge ${getScoreColor(evaluation.score)}`}>
            Score: {evaluation.score}/100
          </span>
          {isLatest && (
            <span className="score-badge bg-primary text-white">
              Latest
            </span>
          )}
        </div>
        {iteration.improvement && (
          <span className="text-sm text-gray-600">{iteration.improvement}</span>
        )}
      </div>

      {iteration.execution && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-block w-3 h-3 rounded-full ${
              iteration.execution.success ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            <span className="text-sm font-semibold text-gray-700">
              Execution: {iteration.execution.success ? 'Success' : 'Failed'}
            </span>
            <span className="text-sm text-gray-500">
              ({iteration.execution.execution_time.toFixed(3)}s)
            </span>
          </div>
          {iteration.execution.output && (
            <div className="bg-gray-100 p-3 rounded text-sm">
              <strong>Output:</strong>
              <pre className="mt-1 whitespace-pre-wrap">{iteration.execution.output}</pre>
            </div>
          )}
          {iteration.execution.error && (
            <div className="bg-red-50 p-3 rounded text-sm text-red-700">
              <strong>Error:</strong> {iteration.execution.error}
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <button
          onClick={() => setShowCode(!showCode)}
          className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition"
        >
          {showCode ? '▼' : '▶'} Code
        </button>
        {showCode && (
          <pre className="code-block">{iteration.code}</pre>
        )}

        {iteration.test_results && (
          <>
            <button
              onClick={() => setShowTests(!showTests)}
              className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition"
            >
              {showTests ? '▼' : '▶'} Test Results ({iteration.test_results.passed}/{iteration.test_results.total} passed - {iteration.test_results.success_rate.toFixed(1)}%)
            </button>
            {showTests && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="bg-white p-3 rounded border">
                    <div className="text-xs text-gray-600 mb-1">Overall Success Rate</div>
                    <div className="text-2xl font-bold text-primary">
                      {iteration.test_results.success_rate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {iteration.test_results.passed}/{iteration.test_results.total} tests passed
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-xs text-gray-600 mb-1">Hidden Tests</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {iteration.test_results.hidden_passed}/{iteration.test_results.hidden_passed + iteration.test_results.hidden_failed}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {iteration.test_results.hidden_passed} passed, {iteration.test_results.hidden_failed} failed
                    </div>
                  </div>
                </div>
                
                {/* Show failed hidden test cases */}
                {iteration.test_results.failed_hidden_results && iteration.test_results.failed_hidden_results.length > 0 && (
                  <div className="border-t pt-3">
                    <h4 className="font-semibold text-red-700 mb-2">Failed Hidden Test Cases:</h4>
                    {iteration.test_results.failed_hidden_results.map((test, idx) => (
                      <div key={`hidden-fail-${idx}`} className="p-3 rounded border mb-2 bg-red-50 border-red-300">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-red-700">
                            ✗ FAIL (Hidden Test)
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 space-y-1">
                          <div><strong>Input:</strong> <code className="bg-white px-2 py-1 rounded">{JSON.stringify(test.input_data)}</code></div>
                          <div><strong>Expected:</strong> <code className="bg-white px-2 py-1 rounded text-green-700">{JSON.stringify(test.expected)}</code></div>
                          <div><strong>Actual:</strong> <code className="bg-white px-2 py-1 rounded text-red-700">{JSON.stringify(test.actual)}</code></div>
                          {test.error && (
                            <div className="mt-2 p-2 bg-red-100 rounded">
                              <strong className="text-red-800">Error:</strong> 
                              <span className="text-red-700 ml-1">{test.error}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Only show visible test cases section if there are any */}
                {iteration.test_results.visible_results.length > 0 && (
                  <div className="border-t pt-3">
                    <h4 className="font-semibold text-gray-700 mb-2">Visible Test Cases:</h4>
                    {/* Passed test cases first */}
                    {iteration.test_results.visible_results.filter(test => test.passed).map((test, idx) => (
                      <div key={`pass-${idx}`} className="p-3 rounded border mb-2 bg-green-50 border-green-200">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-green-700">
                            ✓ PASS
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 space-y-1">
                          <div><strong>Input:</strong> <code className="bg-white px-2 py-1 rounded">{JSON.stringify(test.input_data)}</code></div>
                          <div><strong>Expected:</strong> <code className="bg-white px-2 py-1 rounded">{JSON.stringify(test.expected)}</code></div>
                          <div><strong>Actual:</strong> <code className="bg-white px-2 py-1 rounded">{JSON.stringify(test.actual)}</code></div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Failed test cases at the end */}
                    {iteration.test_results.visible_results.filter(test => !test.passed).length > 0 && (
                      <div className="mt-4 pt-4 border-t border-red-200">
                        <h5 className="font-semibold text-red-700 mb-2">Failed Cases:</h5>
                        {iteration.test_results.visible_results.filter(test => !test.passed).map((test, idx) => (
                          <div key={`fail-${idx}`} className="p-3 rounded border mb-2 bg-red-50 border-red-300">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-red-700">
                                ✗ FAIL
                              </span>
                            </div>
                            <div className="text-sm text-gray-700 space-y-1">
                              <div><strong>Input:</strong> <code className="bg-white px-2 py-1 rounded">{JSON.stringify(test.input_data)}</code></div>
                              <div><strong>Expected:</strong> <code className="bg-white px-2 py-1 rounded text-green-700">{JSON.stringify(test.expected)}</code></div>
                              <div><strong>Actual:</strong> <code className="bg-white px-2 py-1 rounded text-red-700">{JSON.stringify(test.actual)}</code></div>
                              {test.error && (
                                <div className="mt-2 p-2 bg-red-100 rounded">
                                  <strong className="text-red-800">Error:</strong> 
                                  <span className="text-red-700 ml-1">{test.error}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <button
          onClick={() => setShowEvaluation(!showEvaluation)}
          className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition"
        >
          {showEvaluation ? '▼' : '▶'} Evaluation Details
        </button>
        {showEvaluation && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            {evaluation.bugs.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-700 mb-1">Bugs:</h4>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {evaluation.bugs.map((bug, idx) => (
                    <li key={idx}>{bug}</li>
                  ))}
                </ul>
              </div>
            )}
            {evaluation.performance_issues.length > 0 && (
              <div>
                <h4 className="font-semibold text-orange-700 mb-1">Performance Issues:</h4>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {evaluation.performance_issues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            {evaluation.readability_issues.length > 0 && (
              <div>
                <h4 className="font-semibold text-blue-700 mb-1">Readability Issues:</h4>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {evaluation.readability_issues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            {evaluation.security_concerns.length > 0 && (
              <div>
                <h4 className="font-semibold text-purple-700 mb-1">Security Concerns:</h4>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {evaluation.security_concerns.map((concern, idx) => (
                    <li key={idx}>{concern}</li>
                  ))}
                </ul>
              </div>
            )}
            {evaluation.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold text-green-700 mb-1">Recommendations:</h4>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {evaluation.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
            {evaluation.reasoning && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-1">Reasoning:</h4>
                <p className="text-sm text-gray-600">{evaluation.reasoning}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IterationCard;
