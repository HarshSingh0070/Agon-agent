# FitBite AI - FastAPI Backend

## Architecture Overview

```
backend/
├── app/
│   ├── main.py                    # FastAPI app entry point
│   ├── config.py                  # Environment config
│   ├── database/
│   │   ├── __init__.py
│   │   └── mongodb.py             # MongoDB connection
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py                # User model
│   │   ├── food_item.py           # Food item model
│   │   ├── meal.py                # Meal log model
│   │   ├── daily_progress.py      # Daily progress model
│   │   └── notification.py        # Notification model
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py                # JWT auth routes
│   │   ├── users.py               # User profile routes
│   │   ├── food.py                # Food database routes
│   │   ├── meals.py               # Meal logging routes
│   │   ├── progress.py            # Daily progress routes
│   │   └── notifications.py       # Push notification routes
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ai_service.py          # OpenAI Vision integration
│   │   ├── calorie_service.py     # Calorie calculation
│   │   ├── auth_service.py        # JWT token service
│   │   └── notification_service.py # Expo push notifications
│   ├── middleware/
│   │   ├── __init__.py
│   │   └── auth_middleware.py     # JWT auth middleware
│   └── utils/
│       ├── __init__.py
│       └── validators.py          # Input validators
├── requirements.txt
├── .env.example
└── Dockerfile
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your actual values
```

### 3. Run Development Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. API Documentation
Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login, returns JWT token
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - Logout

### Users
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update user profile
- `POST /users/onboarding` - Complete onboarding

### Food
- `GET /food/` - List all food items
- `GET /food/search?q=idli` - Search foods
- `GET /food/{food_id}` - Get food by ID
- `POST /food/analyze` - AI food image analysis

### Meals
- `GET /meals/today` - Get today's meals
- `POST /meals/` - Log a new meal
- `DELETE /meals/{meal_id}` - Delete a meal
- `PUT /meals/{meal_id}` - Update meal

### Progress
- `GET /progress/today` - Get today's progress
- `PUT /progress/water` - Update water intake
- `PUT /progress/steps` - Update step count
- `GET /progress/history` - Get progress history

### Notifications
- `POST /notifications/register` - Register push token
- `GET /notifications/` - Get notifications
- `PUT /notifications/{id}/read` - Mark as read
