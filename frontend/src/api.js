import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const evolveCode = async (task, maxIterations = 10, scoreThreshold = 90, sampleInput = '', sampleOutput = '', testCases = '', hiddenTestCases = '') => {
  const response = await api.post('/evolve', {
    task,
    max_iterations: maxIterations,
    score_threshold: scoreThreshold,
    sample_input: sampleInput,
    sample_output: sampleOutput,
    test_cases: testCases,
    hidden_test_cases: hiddenTestCases,
  });
  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
