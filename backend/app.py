from flask import Flask, request, jsonify
from flask_cors import CORS
import grokify

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/redteam', methods=['POST'])
def redteam():
    data = request.json
    prompt = data.get('prompt', '')
    
    try:
        # Call the main function from grokify.py with the prompt
        # We'll capture the output by modifying the main function to return results
        code, description, is_malicious = grokify.main(prompt)
        
        # Output the code description and is_malicious flag
        print(f"Code Description: {description}")
        print(f"Is Malicious: {is_malicious}")
        
        # Return the results to the frontend
        return jsonify({
            'attackResult': code,
            'evaluationResult': description,
            'isMalicious': is_malicious
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'attackResult': f"Error: {str(e)}",
            'evaluationResult': "An error occurred while processing your request."
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
