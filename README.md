# Used Car Price Prediction 🚗

A machine learning web application that predicts the resale price of used cars in India based on vehicle specifications and usage details.

The project uses a trained Random Forest Regression model, a Django REST API backend, and a Next.js frontend.

## 🔗 Live Demo

- **Frontend:** https://used-car-prediction-nine.vercel.app
- **Backend API:** https://used-car-prediction-0tcb.onrender.com

The frontend is deployed on **Vercel**, and the backend is deployed on **Render**.

---

## 📌 Project Overview

Buying or selling a used car can be difficult because the resale price depends on several factors, such as:

- Manufacturing year
- Kilometers driven
- Engine capacity
- Mileage
- Power
- Fuel type
- Transmission
- Number of previous owners
- Brand
- Location

This project uses machine learning to estimate the expected resale price of a used car based on these features.

The predicted price is displayed in **Indian lakh units**.

---

## ✨ Features

- Predicts the estimated resale price of a used car
- Interactive web-based frontend
- REST API for making predictions
- Data preprocessing and feature engineering
- Handles numerical and categorical features
- Uses One-Hot Encoding for categorical variables
- Uses a Random Forest Regression model
- Responsive frontend design
- Input validation and error handling
- Deployed frontend and backend
- End-to-end frontend-backend integration

---

## 🛠️ Tech Stack

### Machine Learning

- Python
- Pandas
- NumPy
- Scikit-learn
- XGBoost
- Jupyter Notebook
- Joblib

### Backend

- Django
- Django REST Framework
- Django CORS Headers
- Gunicorn

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Deployment

- Vercel — Frontend deployment
- Render — Backend deployment
- GitHub — Version control and source code hosting

---

## 🧠 Machine Learning Workflow

The machine learning workflow included the following steps:

1. Data collection
2. Exploratory Data Analysis
3. Data cleaning
4. Handling missing values
5. Feature extraction
6. Feature engineering
7. Encoding categorical features
8. Train-test split
9. Model training
10. Cross-validation
11. Model comparison
12. Hyperparameter tuning
13. Model evaluation
14. Model serialization
15. API integration
16. Deployment

---

## 📊 Dataset

The dataset contains information about used cars in India.

Important features include:

| Feature | Description |
|---|---|
| `Year` | Manufacturing year of the car |
| `Kilometers_Driven` | Distance driven by the car |
| `Mileage` | Fuel efficiency |
| `Engine` | Engine capacity |
| `Power` | Engine power |
| `Seats` | Number of seats |
| `Location` | City or location of the car |
| `Fuel_Type` | Type of fuel used |
| `Transmission` | Manual or automatic |
| `Owner_Type` | Number/type of previous owners |
| `Brand` | Car manufacturer |
| `Price` | Target resale price in lakhs |

The `Price` column is the target variable.

---

## 🔧 Data Preprocessing

The following preprocessing operations were performed:

- Removed records with missing target values
- Extracted numerical values from columns containing units
- Converted `Mileage`, `Engine`, and `Power` into numerical features
- Filled missing numerical values using median imputation
- Filled missing seat values using the mode
- Removed the `New_Price` column because of a high percentage of missing values
- Extracted the car brand from the car name
- Removed identifier and unnecessary text columns
- Applied One-Hot Encoding to categorical features

---

## 🤖 Models Evaluated

The following regression models were compared using cross-validation:

| Model | Approximate Cross-Validation MAE |
|---|---:|
| Linear Regression | 3.45 lakhs |
| XGBoost Regressor | 1.80 lakhs |
| Random Forest Regressor | 1.48 lakhs |

The **Random Forest Regressor** performed best among the tested models and was selected for the final application.

---

## 📈 Final Model Performance

The final Random Forest model achieved approximately:

| Metric | Result |
|---|---:|
| Mean Absolute Error | 1.505 lakhs |
| R² Score | 0.890 |
| Root Mean Squared Error | 3.68 lakhs |

### Metric Explanation

- **MAE:** The model's average absolute prediction error is approximately ₹1.505 lakhs.
- **R² Score:** The model explains approximately 89% of the variation in the test dataset.
- **RMSE:** Penalizes larger prediction errors more strongly than MAE.

These results are based on the available dataset and test split.

---

## 🏗️ Project Structure

```text
used_car_prediction/
│
├── backend/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── ...
│
├── prediction/
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── ...
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── ...
│
├── data/
│   └── used_cars_data.csv
│
├── notebook.ipynb
├── car_price_model.pkl
├── manage.py
├── requirements.txt
├── .gitignore
└── README.md
