import React from 'react';

const ResultsSummary = ({ result }) => {
  const getStatusColor = (success) => {
    return success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Evolution Summary</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Status</div>
          <div className={`score-badge ${getStatusColor(result.success)}`}>
            {result.success ? 'Success' : 'Failed'}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Final Score</div>
          <div className={`text-3xl font-bold ${getScoreColor(result.final_score)}`}>
            {result.final_score}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Iterations</div>
          <div className="text-3xl font-bold text-gray-800">
            {result.total_iterations}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Improvement</div>
          <div className="text-2xl font-bold text-primary">
            +{result.final_score - (result.iterations[0]?.evaluation.score || 0)}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
        <div className="text-sm font-semibold text-gray-700 mb-1">Termination Reason</div>
        <div className="text-gray-800">{result.termination_reason}</div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Task</h3>
        <p className="text-gray-700 bg-gray-50 p-3 rounded">{result.task}</p>
      </div>
    </div>
  );
};

export default ResultsSummary;
