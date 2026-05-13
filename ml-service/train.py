import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
import joblib
import os

# Create dummy dataset
data = {
    'reviewText': [
        "This product is amazing! I love it so much. Highly recommended.",
        "Terrible product. It broke after one day. Do not buy.",
        "Very good quality, arrived on time.",
        "Worst purchase ever. Complete waste of money.",
        "I am very satisfied with this purchase. Works perfectly.",
        "SCAM! DO NOT BUY! FAKE PRODUCT!",
        "Excellent customer service and great item.",
        "Cheap material, broke instantly.",
        "Get 50% off if you click this link now! Great product!",
        "This is an honest review. The product is okay, not great but does the job.",
        "Wow, best thing ever. I will buy 100 more.",
        "Horrible experience. The seller never responded.",
        "Make money fast working from home! Click here! Good product.",
        "I really enjoyed using this. It is quite durable.",
        "Fake fake fake! Do not trust the seller."
    ],
    'label': [
        'Genuine', 'Genuine', 'Genuine', 'Genuine', 'Genuine',
        'Fake', 'Genuine', 'Genuine', 'Fake', 'Genuine',
        'Fake', 'Genuine', 'Fake', 'Genuine', 'Fake'
    ]
}

df = pd.DataFrame(data)

# Create a dataset folder if it doesn't exist
os.makedirs('../dataset', exist_ok=True)
df.to_csv('../dataset/sample_reviews.csv', index=False)

# Train a simple model
model = make_pipeline(TfidfVectorizer(stop_words='english'), MultinomialNB())
model.fit(df['reviewText'], df['label'])

# Save the model
joblib.dump(model, 'model.pkl')
print("Model trained and saved to model.pkl")
