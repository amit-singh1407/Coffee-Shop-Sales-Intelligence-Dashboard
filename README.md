# AI-Powered Coffee Shop Sales Intelligence Dashboard

This project combines a Flask backend and a React/Vite frontend for coffee shop sales analysis.

## Structure

- `backend/`: API, data generation, and machine learning services
- `frontend/`: dashboard UI

## Features

- Sales analytics
- Forecasting
- Anomaly detection
- Customer segmentation
- Recommendations
- Chatbot insights

## GitHub Pages Deployment

The frontend is deployed from `frontend/` through GitHub Actions.

- From the repository root, run `npm run deploy` to build the frontend.
- The workflow will create the GitHub Pages site automatically if it does not already exist.
- Set the repository variable `VITE_API_BASE_URL` to your public Flask API, for example `https://your-backend.example.com/api`.
- The Vite build uses `http://localhost:5000/api` only when no production URL is provided, so the backend must be available for the dashboard data screens to work on Pages.
