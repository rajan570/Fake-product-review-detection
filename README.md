# Fake Product Review Detection System

A full-stack web application designed to detect fake product reviews using Machine Learning and NLP. This project is built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and a Python (Flask) microservice for the AI component.

## Features

- **User Authentication**: Secure Login/Register with JWT and bcrypt.
- **Role-Based Access**: User and Admin roles.
- **Review Analysis**: Submit single reviews or upload a CSV file for bulk analysis.
- **Machine Learning Integration**: Uses Scikit-learn (Naive Bayes/Logistic Regression) and TF-IDF for fake review detection and TextBlob for sentiment analysis.
- **Dashboard**: View past analyses, confidence scores, and sentiment.
- **Admin Panel**: Manage users, view all reviews, delete spam reviews, and visualize data using charts (Recharts).
- **Modern UI**: Fully responsive, dark/light theme support, and built with Tailwind CSS.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Vite, Recharts, Axios, Lucide React
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Multer
- **ML Microservice**: Python, Flask, Scikit-learn, Pandas, NLTK, TextBlob

## Setup & Installation

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MongoDB (Local or Atlas)

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd "Fake product Review detectio system"
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
# Ensure you have MongoDB running locally on mongodb://127.0.0.1:27017/fake-review-db
npm start
\`\`\`

### 3. ML Microservice Setup
\`\`\`bash
cd ml-service
python -m venv venv
# Activate virtual environment
# Windows:
.\venv\Scripts\Activate.ps1
# Mac/Linux:
# source venv/bin/activate
pip install -r requirements.txt
# Train the model to generate model.pkl
python train.py
# Start the Flask server
python app.py
\`\`\`

### 4. Frontend Setup
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## Deployment Guide

### Frontend (Vercel)
1. Push your code to GitHub.
2. Go to Vercel and import your repository.
3. Set the Root Directory to `frontend`.
4. Add environment variables if necessary (e.g., API Base URL).
5. Deploy.

### Backend (Render/Railway)
1. Push your code to GitHub.
2. Go to Render/Railway and create a new Web Service.
3. Set the Root Directory to `backend`.
4. Add Environment Variables:
   - `PORT=5000`
   - `MONGO_URI=<your-mongodb-atlas-uri>`
   - `JWT_SECRET=<your-secret>`
   - `ML_SERVICE_URL=<your-deployed-ml-service-url>`
5. Deploy.

### ML Service (Render/Railway)
1. Create a new Web Service.
2. Set the Root Directory to `ml-service`.
3. Render should automatically detect `requirements.txt`.
4. Ensure `train.py` is run once or pre-train and commit `model.pkl` to the repo.
5. Set start command to `gunicorn app:app`.
6. Deploy.

## Author
Rajan Shukla
