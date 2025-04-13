# Grokify

A tool that uses Tree of attacks to optimize prompts and Jailbreak LLMs.

## Project Structure

- `frontend/` - React frontend application
- `backend/` - Python backend API

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

3. Create a `.env` file by copying the example:
   ```
   cp .env.example .env
   ```

4. Edit the `.env` file and add your API keys:
   - `GROK_API_KEY` - Your API key from x.ai
   - `OPENAI_API_KEY` - Your OpenAI API key

5. Start the backend server:
   ```
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend/llm-redteaming-app
   ```

2. Install the required npm packages:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter a prompt in the text area
3. Click the "Execute" button to run the Grokify backend function
4. View the results in the response sections

## Features

- Uses Grok 3 Beta to generate code based on user prompts
- Uses GPT-4 to analyze the generated code and check for malicious intent
- Iteratively improves the code to hide malicious intent
