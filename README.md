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
- Optionally set the repository variable `VITE_API_BASE_URL` to your public Flask API, for example `https://your-backend.example.com/api`, if you want live backend data instead of demo data.
- If `VITE_API_BASE_URL` is not configured, the frontend automatically falls back to bundled demo data so the dashboard still renders on GitHub Pages.
