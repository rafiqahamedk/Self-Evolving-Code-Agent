# Self-Evolving Code Agent

An AI system that autonomously improves code through multi-agent collaboration. Three specialized agents work together to generate, evaluate, and refine code until it reaches high quality.

## Features

- 🤖 **Multi-Agent System** - Generator, Evaluator, and Refiner agents
- 🔄 **Automatic Refinement** - Iterative improvement until quality threshold
- 📊 **Real-Time Visualization** - Watch code evolve with score tracking
- 🧪 **Test Case Support** - Add custom test cases and hidden tests
- 🔒 **Secure Execution** - Sandboxed Python runtime
- ⚡ **Fast Setup** - Running in minutes

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- Google Gemini API key ([Get free key](https://makersuite.google.com/app/apikey))

### Installation

**1. Backend Setup:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
```

**2. Configure API Key:**

Create `backend/.env` file:
```
GEMINI_API_KEY=your_api_key_here
```

**3. Frontend Setup:**
```bash
cd frontend
npm install
```

### Run

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Open http://localhost:3000

## Usage

1. **Enter Task:** Describe what code you want (e.g., "Write a function to check if a number is prime")
2. **Add Sample Input/Output:** (Optional) Provide test input and expected output
3. **Add Hidden Tests:** (Optional) Add test cases in JSON format for validation
4. **Configure:** Set max iterations (default: 10) and score threshold (default: 90)
5. **Start Evolution:** Click "Start Evolution" and watch the agents work!
6. **Review Results:** See code improvements, test results, and evaluation feedback

## Example

**Task:** "Write a function to check if a number is prime"

**Sample Input:** `17`
**Expected Output:** `true`

**Hidden Test Cases:**
```json
[
  {"input": 2, "output": true},
  {"input": 4, "output": false},
  {"input": -5, "output": false}
]
```

**Result:** Production-ready code in ~45 seconds with 90+ quality score

## Project Structure

```
├── backend/
│   ├── main.py              # FastAPI app
│   ├── agents.py            # Three AI agents
│   ├── evolution_engine.py  # Evolution loop
│   ├── executor.py          # Code execution
│   ├── test_runner.py       # Test case runner
│   ├── models.py            # Data models
│   ├── config.py            # Configuration
│   └── requirements.txt     # Dependencies
│
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── App.jsx          # Main app
    │   └── api.js           # API client
    └── package.json         # Dependencies
```

## Technology

- **Frontend:** React + Tailwind CSS
- **Backend:** Python FastAPI
- **AI:** Google Gemini API
- **Execution:** Sandboxed Python environment

## Configuration

Edit `backend/.env`:
```bash
GEMINI_API_KEY=your_key_here
MAX_ITERATIONS=10
DEFAULT_SCORE_THRESHOLD=90
EXECUTION_TIMEOUT=5
GEMINI_MODEL=gemini-pro
```

## Features in Detail

### Multi-Agent Architecture
- **Generator Agent:** Creates initial code from task description
- **Evaluator Agent:** Reviews code and assigns quality score (0-100)
- **Refiner Agent:** Improves code based on evaluation feedback

### Test Case System
- **Sample Input/Output:** Quick test during execution
- **Hidden Test Cases:** Validation tests not shown to AI
- **Failed Test Display:** See exactly which tests failed and why

### Evolution Loop
1. Generate initial code
2. Execute and test code
3. Evaluate quality (correctness, performance, readability, security)
4. Refine based on feedback
5. Repeat until score ≥ threshold or max iterations

## Troubleshooting

**Backend won't start:**
- Check Python version: `python --version` (need 3.9+)
- Verify API key in `backend/.env`
- Reinstall dependencies: `pip install -r requirements.txt`

**Frontend won't start:**
- Check Node version: `node --version` (need 18+)
- Reinstall dependencies: `rm -rf node_modules && npm install`

**API errors:**
- Verify Gemini API key is valid
- Check internet connection
- Try different model in `backend/config.py`

**String input errors:**
- For string inputs, you can enter with or without quotes
- System automatically handles: `hello` or `"hello"`

## API Endpoints

- `POST /evolve` - Start code evolution
- `GET /health` - Health check
- `GET /docs` - Interactive API documentation

## License

MIT License - see [LICENSE](LICENSE) file

---

Built with Google Gemini API
