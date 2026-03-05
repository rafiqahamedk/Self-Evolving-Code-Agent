"""
Test runner for validating generated code with test cases
"""
import io
from contextlib import redirect_stdout, redirect_stderr
from typing import List, Dict, Any, Optional
from models import ExecutionResult

class TestCase:
    """Represents a single test case"""
    def __init__(self, input_data: Any, expected_output: Any, description: str = "", hidden: bool = False):
        self.input_data = input_data
        self.expected_output = expected_output
        self.description = description
        self.hidden = hidden

class TestResult:
    """Result of running a test case"""
    def __init__(self, passed: bool, input_data: Any, expected: Any, actual: Any, 
                 error: str = "", hidden: bool = False):
        self.passed = passed
        self.input_data = input_data
        self.expected = expected
        self.actual = actual
        self.error = error
        self.hidden = hidden

class TestRunner:
    """Runs test cases against generated code"""
    
    def __init__(self):
        self.test_cases: List[TestCase] = []
    
    def add_test_case(self, input_data: Any, expected_output: Any, 
                     description: str = "", hidden: bool = False):
        """Add a test case"""
        self.test_cases.append(TestCase(input_data, expected_output, description, hidden))
    
    def parse_user_test_cases(self, test_cases_json: str, hidden: bool = False) -> List[TestCase]:
        """Parse user-provided test cases from JSON string"""
        import json
        
        if not test_cases_json or test_cases_json.strip() == "":
            return []
        
        try:
            test_data = json.loads(test_cases_json)
            cases = []
            
            # Support both array and single object format
            if not isinstance(test_data, list):
                test_data = [test_data]
            
            for idx, test in enumerate(test_data):
                input_data = test.get('input')
                expected_output = test.get('output') or test.get('expected')
                description = test.get('description', f"Test case {idx + 1}")
                
                cases.append(TestCase(
                    input_data=input_data,
                    expected_output=expected_output,
                    description=description,
                    hidden=hidden
                ))
            
            return cases
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON format: {str(e)}")
        except Exception as e:
            raise ValueError(f"Error parsing test cases: {str(e)}")
    
    def generate_test_cases(self, task: str) -> List[TestCase]:
        """Generate test cases based on the task description"""
        # This is a simple implementation - could be enhanced with AI
        test_cases = []
        
        # Common patterns for different task types
        if "prime" in task.lower():
            test_cases = [
                TestCase(2, True, "2 is prime", False),
                TestCase(3, True, "3 is prime", False),
                TestCase(4, False, "4 is not prime", False),
                TestCase(17, True, "17 is prime", True),
                TestCase(1, False, "1 is not prime", True),
                TestCase(0, False, "0 is not prime", True),
                TestCase(-5, False, "negative numbers are not prime", True),
            ]
        elif "palindrome" in task.lower():
            test_cases = [
                TestCase("racecar", True, "simple palindrome", False),
                TestCase("hello", False, "not a palindrome", False),
                TestCase("A man a plan a canal Panama", True, "palindrome with spaces", True),
                TestCase("", True, "empty string", True),
                TestCase("a", True, "single character", True),
            ]
        elif "reverse" in task.lower() and "string" in task.lower():
            test_cases = [
                TestCase("hello", "olleh", "simple reverse", False),
                TestCase("world", "dlrow", "another reverse", False),
                TestCase("", "", "empty string", True),
                TestCase("a", "a", "single character", True),
            ]
        elif "factorial" in task.lower():
            test_cases = [
                TestCase(0, 1, "factorial of 0", False),
                TestCase(1, 1, "factorial of 1", False),
                TestCase(5, 120, "factorial of 5", False),
                TestCase(10, 3628800, "factorial of 10", True),
            ]
        elif "fibonacci" in task.lower():
            test_cases = [
                TestCase(0, [], "fibonacci of 0", False),
                TestCase(1, [0], "fibonacci of 1", False),
                TestCase(5, [0, 1, 1, 2, 3], "fibonacci of 5", False),
                TestCase(10, [0, 1, 1, 2, 3, 5, 8, 13, 21, 34], "fibonacci of 10", True),
            ]
        
        return test_cases
    
    def run_tests(self, code: str, function_name: str = None) -> Dict[str, Any]:
        """
        Run all test cases against the code
        
        Args:
            code: The Python code to test
            function_name: Name of the function to test (auto-detected if None)
        
        Returns:
            Dictionary with test results
        """
        if not self.test_cases:
            return {
                "total": 0,
                "passed": 0,
                "failed": 0,
                "results": [],
                "success_rate": 0.0
            }
        
        # Auto-detect function name if not provided
        if function_name is None:
            function_name = self._extract_function_name(code)
        
        results = []
        passed_count = 0
        failed_count = 0
        
        # Create execution environment
        exec_globals = {
            '__builtins__': {
                'print': print,
                'range': range,
                'len': len,
                'str': str,
                'int': int,
                'float': float,
                'list': list,
                'dict': dict,
                'set': set,
                'tuple': tuple,
                'bool': bool,
                'sum': sum,
                'max': max,
                'min': min,
                'abs': abs,
                'sorted': sorted,
                'enumerate': enumerate,
                'zip': zip,
                'isinstance': isinstance,
                'type': type,
            },
            '__name__': '__main__',
        }
        
        try:
            # Execute the code to define the function
            exec(code, exec_globals)
            
            if function_name not in exec_globals:
                return {
                    "total": len(self.test_cases),
                    "passed": 0,
                    "failed": len(self.test_cases),
                    "results": [],
                    "error": f"Function '{function_name}' not found in code",
                    "success_rate": 0.0
                }
            
            func = exec_globals[function_name]
            
            # Run each test case
            for test_case in self.test_cases:
                try:
                    # Call the function with test input
                    if isinstance(test_case.input_data, tuple):
                        actual_output = func(*test_case.input_data)
                    else:
                        actual_output = func(test_case.input_data)
                    
                    # Check if output matches expected
                    passed = actual_output == test_case.expected_output
                    
                    if passed:
                        passed_count += 1
                    else:
                        failed_count += 1
                    
                    results.append(TestResult(
                        passed=passed,
                        input_data=test_case.input_data,
                        expected=test_case.expected_output,
                        actual=actual_output,
                        hidden=test_case.hidden
                    ))
                    
                except Exception as e:
                    failed_count += 1
                    results.append(TestResult(
                        passed=False,
                        input_data=test_case.input_data,
                        expected=test_case.expected_output,
                        actual=None,
                        error=str(e),
                        hidden=test_case.hidden
                    ))
        
        except Exception as e:
            return {
                "total": len(self.test_cases),
                "passed": 0,
                "failed": len(self.test_cases),
                "results": [],
                "error": f"Code execution error: {str(e)}",
                "success_rate": 0.0
            }
        
        success_rate = (passed_count / len(self.test_cases) * 100) if self.test_cases else 0.0
        
        return {
            "total": len(self.test_cases),
            "passed": passed_count,
            "failed": failed_count,
            "results": results,
            "success_rate": success_rate
        }
    
    def _extract_function_name(self, code: str) -> Optional[str]:
        """Extract the first function name from code"""
        import re
        match = re.search(r'def\s+(\w+)\s*\(', code)
        return match.group(1) if match else None
    
    def get_visible_results(self, results: List[TestResult]) -> List[TestResult]:
        """Get only non-hidden test results"""
        return [r for r in results if not r.hidden]
    
    def get_hidden_results(self, results: List[TestResult]) -> List[TestResult]:
        """Get only hidden test results"""
        return [r for r in results if r.hidden]
