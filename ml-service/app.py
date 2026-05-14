from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import nltk
import os

# Download NLTK data required by TextBlob (needed on Render / production)
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)
nltk.download('averaged_perceptron_tagger', quiet=True)
nltk.download('averaged_perceptron_tagger_eng', quiet=True)
nltk.download('brown', quiet=True)
nltk.download('wordnet', quiet=True)

from textblob import TextBlob

app = Flask(__name__)
CORS(app)

# Load model if exists
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print("✅ ML model loaded successfully")
else:
    model = None
    print("⚠️  model.pkl not found — using rule-based fallback")

# List of spammy words for simple extraction
SPAM_WORDS = ['scam', 'fake', 'click here', 'make money fast', '50% off', 'buy 100 more']

def analyze_sentiment(text):
    try:
        analysis = TextBlob(text)
        if analysis.sentiment.polarity > 0.1:
            return 'Positive'
        elif analysis.sentiment.polarity < -0.1:
            return 'Negative'
        else:
            return 'Neutral'
    except Exception:
        return 'Neutral'

def extract_suspicious_words(text):
    text_lower = text.lower()
    found = [word for word in SPAM_WORDS if word in text_lower]
    return found

@app.route('/', methods=['GET'])
def health():
    return jsonify({'status': 'ML Service is running', 'model_loaded': model is not None})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    if not data or 'review' not in data:
        return jsonify({'error': 'No review text provided'}), 400
    
    text = data['review']
    
    if not model:
        # Fallback if model not trained
        prediction = 'Fake' if any(word in text.lower() for word in SPAM_WORDS) else 'Genuine'
        confidence = 85
    else:
        # Predict using the loaded model
        pred = model.predict([text])[0]
        proba = model.predict_proba([text])[0]
        prediction = pred
        confidence = round(max(proba) * 100, 2)
        
    sentiment = analyze_sentiment(text)
    suspicious_words = extract_suspicious_words(text)
    
    # Simple rule-based override for demonstration
    if len(suspicious_words) > 0 and prediction == 'Genuine':
        prediction = 'Fake'
        confidence = 90
        
    return jsonify({
        'prediction': prediction,
        'confidence': confidence,
        'sentiment': sentiment,
        'suspicious_words': suspicious_words
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)
