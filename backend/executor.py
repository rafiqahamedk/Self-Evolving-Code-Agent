import sys
import io
import time
import signal
from contextlib import redirect_stdout, redirect_stderr
from typing import Dict, Any
from models import ExecutionResult

class TimeoutException(Exception):
    pass

def timeout_handler(signum, frame):
    raise TimeoutException("Execution timeout")

class CodeExecutor:
    """Safely executes generated Python code with restrictions"""
    
    RESTRICTED_IMPORTS = {
        'os', 'subprocess', 'sys', 'eval', 'exec', 
        'compile', '__import__', 'open', 'file'
    }
    
    def __init__(self, timeout: int = 5):
        self.timeout = timeout
    
    def execute(self, code: str, sample_input: str = "") -> ExecutionResult:
        """Execute code in restricted environment with optional sample input"""
        start_time = time.time()
        
        # Check for restricted operations
        for restricted in self.RESTRICTED_IMPORTS:
            if restricted in code:
                return ExecutionResult(
                    success=False,
                    error=f"Restricted operation detected: {restricted}",
                    execution_time=0.0
                )
        
        stdout_capture = io.StringIO()
        stderr_capture = io.StringIO()
        
        # Prepare code with sample input if provided
        if sample_input:
            # Try to parse and inject sample input
            try:
                import re
                import json
                
                func_match = re.search(r'def\s+(\w+)\s*\(', code)
                if func_match:
                    func_name = func_match.group(1)
                    
                    # Try to safely evaluate the input
                    # First check if it's already valid Python (like a number, list, etc.)
                    try:
                        # Try to parse as JSON first (handles numbers, arrays, booleans, null)
                        parsed_input = json.loads(sample_input)
                        # Convert to Python representation
                        input_repr = repr(parsed_input)
                    except (json.JSONDecodeError, ValueError):
                        # If not JSON, treat as string and add quotes
                        # Remove any existing quotes first
                        clean_input = sample_input.strip().strip('"').strip("'")
                        input_repr = repr(clean_input)
                    
                    # Append test call
                    code += f"\n\n# Test with sample input\nresult = {func_name}({input_repr})\nprint(f'Result: {{result}}')"
            except Exception as e:
                # If parsing fails, just execute original code
                pass
        
        try:
            # Set timeout alarm (Unix-like systems)
            if hasattr(signal, 'SIGALRM'):
                signal.signal(signal.SIGALRM, timeout_handler)
                signal.alarm(self.timeout)
            
            # Create restricted globals
            restricted_globals = {
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
                    'map': map,
                    'filter': filter,
                    'isinstance': isinstance,
                    'type': type,
                    'ValueError': ValueError,
                    'TypeError': TypeError,
                    'IndexError': IndexError,
                    'KeyError': KeyError,
                    'AttributeError': AttributeError,
                },
                '__name__': '__main__',
                '__doc__': None,
            }
            
            with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
                exec(code, restricted_globals)
            
            if hasattr(signal, 'SIGALRM'):
                signal.alarm(0)
            
            execution_time = time.time() - start_time
            
            return ExecutionResult(
                success=True,
                output=stdout_capture.getvalue(),
                execution_time=execution_time
            )
            
        except TimeoutException:
            return ExecutionResult(
                success=False,
                error=f"Execution timeout after {self.timeout} seconds",
                execution_time=self.timeout
            )
        except Exception as e:
            execution_time = time.time() - start_time
            return ExecutionResult(
                success=False,
                error=f"{type(e).__name__}: {str(e)}",
                output=stdout_capture.getvalue(),
                execution_time=execution_time
            )
        finally:
            if hasattr(signal, 'SIGALRM'):
                signal.alarm(0)
