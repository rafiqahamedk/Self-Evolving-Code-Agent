import React, { useState } from 'react';
import TaskInput from './components/TaskInput';
import ResultsSummary from './components/ResultsSummary';
import ScoreChart from './components/ScoreChart';
import IterationCard from './components/IterationCard';
import InputSummary from './components/InputSummary';
import { evolveCode } from './api';

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputDetails, setInputDetails] = useState(null);

  const handleSubmit = async (task, maxIterations, scoreThreshold, sampleInput, sampleOutput, testCases, hiddenTestCases) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    // Store input details
    setInputDetails({
      task,
      maxIterations,
      scoreThreshold,
      sampleInput,
      sampleOutput,
      hiddenTestCases
    });

    try {
      const data = await evolveCode(task, maxIterations, scoreThreshold, sampleInput, sampleOutput, testCases, hiddenTestCases);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewTask = () => {
    setResult(null);
    setError(null);
    setInputDetails(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Self-Evolving Code Agent
          </h1>
          <p className="text-gray-600 text-lg">
            Autonomous code improvement through multi-agent collaboration
          </p>
        </div>

        {/* Task Input */}
        {!result && !isLoading && (
          <div className="max-w-4xl mx-auto">
            <TaskInput onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-700 text-lg font-semibold">
                Evolution in progress...
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Agents are generating, evaluating, and refining code
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="max-w-6xl mx-auto">
            {/* New Task Button */}
            <div className="mb-6 flex justify-between items-center">
              <button
                onClick={handleNewTask}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
              >
                ← New Task
              </button>
            </div>

            {/* Show input details */}
            {inputDetails && (
              <InputSummary
                task={inputDetails.task}
                maxIterations={inputDetails.maxIterations}
                scoreThreshold={inputDetails.scoreThreshold}
                sampleInput={inputDetails.sampleInput}
                sampleOutput={inputDetails.sampleOutput}
                hiddenTestCases={inputDetails.hiddenTestCases}
              />
            )}
            
            <ResultsSummary result={result} />
            
            {result.iterations.length > 1 && (
              <ScoreChart iterations={result.iterations} />
            )}

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Evolution History
              </h2>
              <div className="space-y-4">
                {result.iterations.map((iteration, index) => (
                  <IterationCard
                    key={iteration.iteration}
                    iteration={iteration}
                    isLatest={index === result.iterations.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600 text-sm">
          <p>Powered by Google Gemini API • Multi-Agent Architecture</p>
        </div>
      </div>
    </div>
  );
}

export default App;
