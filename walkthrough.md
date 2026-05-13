# Fake Product Review Detection System - Walkthrough

The development of the Fake Product Review Detection System has been successfully completed. Below is a detailed walkthrough of the implementation.

## Project Architecture

The system consists of three distinct modules running independently:
1. **Frontend**: A React application built with Vite and Tailwind CSS.
2. **Backend**: A Node.js and Express server providing RESTful APIs and connected to MongoDB.
3. **ML Service**: A Python Flask microservice handling Machine Learning and NLP inferences.

## Features Implemented

### 1. Machine Learning Microservice (Python/Flask)
- Located in `/ml-service`.
- **Model Training**: A `train.py` script automatically generates a small synthetic dataset (`dataset/sample_reviews.csv`), trains a `MultinomialNB` model using `TfidfVectorizer`, and saves it as `model.pkl`.
- **API Endpoint**: `app.py` exposes a POST `/predict` endpoint.
- **Inference Pipeline**: Receives text, uses the saved Scikit-learn model to predict if it's Fake or Genuine, provides a confidence percentage, extracts suspicious keywords (e.g., "scam", "click here"), and uses `TextBlob` for sentiment analysis (Positive, Negative, Neutral).

### 2. Backend API (Node.js/Express)
- Located in `/backend`.
- **Authentication**: JWT-based authentication with bcrypt password hashing. Routes in `authRoutes.js`.
- **Database (MongoDB)**: Mongoose schemas defined for `User` and `Review`.
- **Review Processing**: The `reviewController.js` handles saving reviews to MongoDB. Before saving, it makes an HTTP request via Axios to the Python ML Service (`http://127.0.0.1:5001/predict`) to analyze the text.
- **Bulk CSV Upload**: Implemented using the `multer` and `csv-parser` libraries. Parses uploaded CSV files, runs each review through the ML service, and bulk-saves them to the database.

### 3. Frontend UI (React.js/Vite)
- Located in `/frontend`.
- **Modern Design**: Designed using Tailwind CSS with dark mode support.
- **Pages**:
  - `Home.jsx`: Landing page highlighting features.
  - `Login.jsx` / `Register.jsx`: Authentication forms connected to Context API.
  - `Dashboard.jsx`: User portal. Features tabs for Single Review Analysis and Bulk CSV Upload. Displays a table of previous analyses.
  - `Result.jsx`: A visually appealing page detailing the AI analysis (prediction, confidence, sentiment, suspicious words).
  - `AdminDashboard.jsx`: An exclusive area for administrators. Displays statistics, a pie chart of Fake vs. Genuine reviews using `Recharts`, and allows deletion of spam reviews.
- **State Management**: Uses React Context (`AuthContext.jsx`) for global user state.
- **API Client**: Configured an Axios interceptor (`api/axios.js`) to automatically append the JWT token to every protected request.

## How to Run the Application Locally

1. **Start MongoDB**: Ensure your local MongoDB server is running on `127.0.0.1:27017` (or update the `MONGO_URI` in `backend/.env`).
2. **Start the ML Service**:
   - Open terminal in `/ml-service`.
   - `.\venv\Scripts\Activate.ps1`
   - `python app.py` (Runs on port 5001)
3. **Start the Backend**:
   - Open terminal in `/backend`.
   - `npm install`
   - `node server.js` (Runs on port 5000)
4. **Start the Frontend**:
   - Open terminal in `/frontend`.
   - `npm install`
   - `npm run dev` (Runs on port 5173 typically)

> [!NOTE]
> All code is highly modular, well-commented, and ready for deployment following the guidelines outlined in the `README.md`.
