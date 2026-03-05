import google.generativeai as genai
from typing import Dict, Any
import json
import re
from models import EvaluationResult
from config import config

genai.configure(api_key=config.GEMINI_API_KEY)

class GeneratorAgent:
    """Generates initial code solutions from task descriptions"""
    
    def __init__(self):
        self.model = genai.GenerativeModel(config.GEMINI_MODEL)
        self.system_prompt = """You are an expert code generator. Your role is to:
- Generate clean, syntactically correct Python code
- Write modular and readable solutions
- Include helpful comments
- Focus on correctness first
- Handle edge cases appropriately

Generate ONLY the Python code without explanations. Do not include markdown code blocks."""
    
    def generate(self, task: str) -> str:
        """Generate initial code from task description"""
        prompt = f"""{self.system_prompt}

Task: {task}

Generate the Python code:"""
        
        response = self.model.generate_content(prompt)
        code = response.text.strip()
        
        # Clean markdown code blocks if present
        code = re.sub(r'^```python\s*\n', '', code)
        code = re.sub(r'\n```\s*$', '', code)
        code = code.strip()
        
        return code


class EvaluatorAgent:
    """Evaluates code quality and identifies issues"""
    
    def __init__(self):
        self.model = genai.GenerativeModel(config.GEMINI_MODEL)
        self.system_prompt = """You are a strict senior code reviewer. Evaluate Python code on:

1. Correctness (40%): Logic bugs, edge cases, algorithm correctness
2. Performance (20%): Time/space complexity, optimization opportunities
3. Readability (20%): Code clarity, naming, structure, comments
4. Security (20%): Input validation, error handling, safe operations

Provide structured analysis in JSON format:
{
  "score": <0-100>,
  "bugs": ["list of bugs"],
  "performance_issues": ["list of performance problems"],
  "readability_issues": ["list of readability problems"],
  "security_concerns": ["list of security issues"],
  "recommendations": ["prioritized improvement suggestions"],
  "reasoning": "brief explanation of score"
}

Be thorough but fair. Score reflects overall quality."""
    
    def evaluate(self, code: str, task: str, execution_result: Any = None) -> EvaluationResult:
        """Evaluate code quality and return structured feedback"""
        
        execution_info = ""
        if execution_result:
            if execution_result.success:
                execution_info = f"\n\nExecution succeeded in {execution_result.execution_time:.3f}s\nOutput: {execution_result.output}"
            else:
                execution_info = f"\n\nExecution failed: {execution_result.error}"
        
        prompt = f"""{self.system_prompt}

Task: {task}

Code to evaluate:
```python
{code}
```
{execution_info}

Provide your evaluation in JSON format:"""
        
        response = self.model.generate_content(prompt)
        result_text = response.text.strip()
        
        # Extract JSON from response
        json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
        if json_match:
            result_text = json_match.group(0)
        
        try:
            result_dict = json.loads(result_text)
            return EvaluationResult(**result_dict)
        except (json.JSONDecodeError, Exception) as e:
            # Fallback evaluation
            return EvaluationResult(
                score=50,
                bugs=["Evaluation parsing failed"],
                recommendations=["Manual review needed"],
                reasoning=f"Could not parse evaluation: {str(e)}"
            )


class RefinerAgent:
    """Refines code based on evaluation feedback"""
    
    def __init__(self):
        self.model = genai.GenerativeModel(config.GEMINI_MODEL)
        self.system_prompt = """You are an expert code refiner. Your role is to:
- Fix identified bugs with precision
- Improve performance where needed
- Enhance readability and structure
- Add missing logic and safeguards
- Preserve correct existing code

Focus on critical issues first. Make targeted improvements without unnecessary rewrites.

Generate ONLY the improved Python code without explanations. Do not include markdown code blocks."""
    
    def refine(self, code: str, task: str, evaluation: EvaluationResult) -> str:
        """Refine code based on evaluation feedback"""
        
        feedback = f"""
Bugs: {', '.join(evaluation.bugs) if evaluation.bugs else 'None'}
Performance Issues: {', '.join(evaluation.performance_issues) if evaluation.performance_issues else 'None'}
Readability Issues: {', '.join(evaluation.readability_issues) if evaluation.readability_issues else 'None'}
Security Concerns: {', '.join(evaluation.security_concerns) if evaluation.security_concerns else 'None'}
Recommendations: {', '.join(evaluation.recommendations) if evaluation.recommendations else 'None'}
"""
        
        prompt = f"""{self.system_prompt}

Original Task: {task}

Current Code:
```python
{code}
```

Evaluation Feedback (Score: {evaluation.score}/100):
{feedback}

Generate the improved code:"""
        
        response = self.model.generate_content(prompt)
        refined_code = response.text.strip()
        
        # Clean markdown code blocks if present
        refined_code = re.sub(r'^```python\s*\n', '', refined_code)
        refined_code = re.sub(r'\n```\s*$', '', refined_code)
        refined_code = refined_code.strip()
        
        return refined_code
