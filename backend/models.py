from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class TaskRequest(BaseModel):
    task: str = Field(..., description="Programming task description")
    max_iterations: int = Field(default=10, ge=1, le=20)
    score_threshold: int = Field(default=90, ge=0, le=100)
    sample_input: str = Field(default="", description="Sample input for code execution")
    sample_output: str = Field(default="", description="Expected output for sample input")
    test_cases: str = Field(default="", description="User-provided test cases (JSON format)")
    hidden_test_cases: str = Field(default="", description="Hidden test cases (JSON format)")

class EvaluationResult(BaseModel):
    score: int = Field(..., ge=0, le=100)
    bugs: List[str] = Field(default_factory=list)
    performance_issues: List[str] = Field(default_factory=list)
    readability_issues: List[str] = Field(default_factory=list)
    security_concerns: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    reasoning: str = ""

class ExecutionResult(BaseModel):
    success: bool
    output: str = ""
    error: str = ""
    execution_time: float = 0.0

class TestCaseResult(BaseModel):
    passed: bool
    input_data: Any
    expected: Any
    actual: Any = None
    error: str = ""
    hidden: bool = False

class TestResults(BaseModel):
    total: int
    passed: int
    failed: int
    success_rate: float
    visible_results: List[TestCaseResult] = Field(default_factory=list)
    hidden_passed: int = 0
    hidden_failed: int = 0
    failed_hidden_results: List[TestCaseResult] = Field(default_factory=list)
    error: str = ""

class IterationResult(BaseModel):
    iteration: int
    code: str
    evaluation: EvaluationResult
    execution: Optional[ExecutionResult] = None
    test_results: Optional[TestResults] = None
    improvement: Optional[str] = None

class EvolutionResponse(BaseModel):
    task: str
    iterations: List[IterationResult]
    final_code: str
    final_score: int
    total_iterations: int
    termination_reason: str
    success: bool
