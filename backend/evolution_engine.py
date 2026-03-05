from typing import List
import logging
from models import TaskRequest, EvolutionResponse, IterationResult, EvaluationResult, TestResults, TestCaseResult
from agents import GeneratorAgent, EvaluatorAgent, RefinerAgent
from executor import CodeExecutor
from test_runner import TestRunner
from config import config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EvolutionEngine:
    """Orchestrates the multi-agent code evolution loop"""
    
    def __init__(self):
        self.generator = GeneratorAgent()
        self.evaluator = EvaluatorAgent()
        self.refiner = RefinerAgent()
        self.executor = CodeExecutor(timeout=config.EXECUTION_TIMEOUT)
        self.test_runner = TestRunner()
    
    def evolve(self, request: TaskRequest) -> EvolutionResponse:
        """Execute the evolution loop"""
        logger.info(f"Starting evolution for task: {request.task[:50]}...")
        
        iterations: List[IterationResult] = []
        current_code = ""
        previous_score = 0
        termination_reason = ""
        
        try:
            # Generate or parse test cases
            test_cases = []
            
            # Add user-provided visible test cases
            if request.test_cases:
                try:
                    user_cases = self.test_runner.parse_user_test_cases(request.test_cases, hidden=False)
                    test_cases.extend(user_cases)
                    logger.info(f"Added {len(user_cases)} user-provided test cases")
                except ValueError as e:
                    logger.error(f"Error parsing test cases: {e}")
            
            # Add user-provided hidden test cases
            if request.hidden_test_cases:
                try:
                    hidden_cases = self.test_runner.parse_user_test_cases(request.hidden_test_cases, hidden=True)
                    test_cases.extend(hidden_cases)
                    logger.info(f"Added {len(hidden_cases)} hidden test cases")
                except ValueError as e:
                    logger.error(f"Error parsing hidden test cases: {e}")
            
            # If no user test cases, generate automatic ones
            if not test_cases:
                test_cases = self.test_runner.generate_test_cases(request.task)
                logger.info(f"Auto-generated {len(test_cases)} test cases")
            
            self.test_runner.test_cases = test_cases
            visible_count = sum(1 for tc in test_cases if not tc.hidden)
            hidden_count = sum(1 for tc in test_cases if tc.hidden)
            logger.info(f"Total test cases: {len(test_cases)} ({visible_count} visible, {hidden_count} hidden)")
            
            # Generate initial code
            logger.info("Generating initial code...")
            current_code = self.generator.generate(request.task)
            
            for iteration in range(1, request.max_iterations + 1):
                logger.info(f"Iteration {iteration}/{request.max_iterations}")
                
                # Execute code
                execution_result = self.executor.execute(current_code, request.sample_input)
                
                # Run test cases
                test_results_raw = self.test_runner.run_tests(current_code)
                visible_results = [TestCaseResult(**{
                    'passed': r.passed,
                    'input_data': r.input_data,
                    'expected': r.expected,
                    'actual': r.actual,
                    'error': r.error,
                    'hidden': r.hidden
                }) for r in test_results_raw.get('results', []) if not r.hidden]
                
                hidden_results = [r for r in test_results_raw.get('results', []) if r.hidden]
                hidden_passed = sum(1 for r in hidden_results if r.passed)
                hidden_failed = len(hidden_results) - hidden_passed
                
                # Get only failed hidden test cases
                failed_hidden_results = [TestCaseResult(**{
                    'passed': r.passed,
                    'input_data': r.input_data,
                    'expected': r.expected,
                    'actual': r.actual,
                    'error': r.error,
                    'hidden': r.hidden
                }) for r in hidden_results if not r.passed]
                
                test_results = TestResults(
                    total=test_results_raw.get('total', 0),
                    passed=test_results_raw.get('passed', 0),
                    failed=test_results_raw.get('failed', 0),
                    success_rate=test_results_raw.get('success_rate', 0.0),
                    visible_results=visible_results,
                    hidden_passed=hidden_passed,
                    hidden_failed=hidden_failed,
                    failed_hidden_results=failed_hidden_results,
                    error=test_results_raw.get('error', '')
                )
                
                logger.info(f"Test Results: {test_results.passed}/{test_results.total} passed ({test_results.success_rate:.1f}%)")
                
                # Evaluate code
                evaluation = self.evaluator.evaluate(
                    current_code, 
                    request.task,
                    execution_result
                )
                
                # Calculate improvement
                improvement = None
                if iteration > 1:
                    score_delta = evaluation.score - previous_score
                    improvement = f"Score change: {score_delta:+d} points"
                
                # Store iteration result
                iteration_result = IterationResult(
                    iteration=iteration,
                    code=current_code,
                    evaluation=evaluation,
                    execution=execution_result,
                    test_results=test_results,
                    improvement=improvement
                )
                iterations.append(iteration_result)
                
                logger.info(f"Score: {evaluation.score}/100")
                
                # Check stopping conditions
                if evaluation.score >= request.score_threshold:
                    termination_reason = f"Score threshold reached ({evaluation.score} >= {request.score_threshold})"
                    logger.info(termination_reason)
                    break
                
                if iteration > 1 and evaluation.score <= previous_score:
                    if evaluation.score == previous_score:
                        termination_reason = "No improvement detected"
                        logger.info(termination_reason)
                        break
                
                if iteration == request.max_iterations:
                    termination_reason = f"Maximum iterations reached ({request.max_iterations})"
                    logger.info(termination_reason)
                    break
                
                # Refine code for next iteration
                logger.info("Refining code...")
                current_code = self.refiner.refine(current_code, request.task, evaluation)
                previous_score = evaluation.score
            
            final_score = iterations[-1].evaluation.score if iterations else 0
            
            return EvolutionResponse(
                task=request.task,
                iterations=iterations,
                final_code=current_code,
                final_score=final_score,
                total_iterations=len(iterations),
                termination_reason=termination_reason,
                success=True
            )
            
        except Exception as e:
            logger.error(f"Evolution failed: {str(e)}")
            
            # Return partial results if available
            final_score = iterations[-1].evaluation.score if iterations else 0
            
            return EvolutionResponse(
                task=request.task,
                iterations=iterations,
                final_code=current_code,
                final_score=final_score,
                total_iterations=len(iterations),
                termination_reason=f"Error: {str(e)}",
                success=False
            )
