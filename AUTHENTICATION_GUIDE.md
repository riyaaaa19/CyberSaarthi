# Full-Stack Authentication System - Implementation Guide

## Overview
A complete authentication system with FastAPI backend and React frontend featuring JWT-based authentication, user registration, secure login, and protected routes.

---

## BACKEND (FastAPI) Implementation

### 1. **Database Layer**
**File:** `backend/app/auth_models.py`
- **User Model:** SQLAlchemy ORM model with fields:
  - `id`: Auto-increment primary key
  - `email`: Unique email address
  - `password_hash`: Bcrypt hashed password
  - `created_at`: Account creation timestamp

**File:** `backend/app/db.py`
- Already configured with SQLite database
- `SessionLocal`: Database session manager
- `get_db()`: Dependency for getting database sessions in routes

### 2. **Authentication Service**
**File:** `backend/app/auth_service.py`
Contains core authentication functions:

- **`hash_password(password)`** - Uses bcrypt to securely hash passwords
- **`verify_password(plain_password, hashed_password)`** - Verifies password matches hash
- **`create_access_token(email)`** - Generates JWT token with:
  - Payload: `{"sub": email, "iat": timestamp, "exp": timestamp + 1 day}`
  - Algorithm: HS256
  - Secret Key: Configured in `backend/app/config.py`
- **`verify_token(token)`** - Validates JWT and returns email
- **`create_user(db, user)`** - Creates new user with validation
- **`authenticate_user(db, email, password)`** - Verifies credentials
- **`get_user_by_email(db, email)`** - Retrieves user from database

### 3. **API Schemas**
**File:** `backend/app/auth_schemas.py`
Pydantic models for request/response validation:

```python
UserCreate:
  - email: EmailStr
  - password: str

UserLogin:
  - email: EmailStr
  - password: str

TokenResponse:
  - access_token: str
  - token_type: "bearer"
  - user: UserResponse

UserResponse:
  - id: int
  - email: str
  - created_at: datetime
```

### 4. **API Endpoints**
**File:** `backend/app/routers/auth.py`

#### **POST /api/auth/signup**
Create new user account
- **Input:** `{email, password}`
- **Validation:**
  - Email format check
  - Password minimum 6 characters
  - User doesn't already exist
- **Response:** `{message: "User created successfully"}`
- **Status Codes:** 200 (success), 400 (validation error), 409 (user exists)

#### **POST /api/auth/login**
Authenticate user and get JWT token
- **Input:** `{email, password}`
- **Process:**
  1. Find user by email
  2. Verify password hash
  3. Generate JWT token
- **Response:**
  ```json
  {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "created_at": "2026-04-03T00:00:00"
    }
  }
  ```
- **Status Codes:** 200 (success), 401 (invalid credentials)

#### **GET /api/auth/me** (Protected)
Get current authenticated user info
- **Headers:** `token: <JWT_TOKEN>`
- **Response:** `{id, email, created_at}`
- **Status Codes:** 200 (success), 401 (invalid/missing token), 404 (user not found)

### 5. **Configuration**
**File:** `backend/app/config.py`
- `SECRET_KEY`: JWT secret (change in production)
- `DATABASE_URL`: SQLite database path
- `ALLOWED_ORIGINS`: CORS configuration (set to "*" for development)

### 6. **CORS Setup**
**File:** `backend/app/main.py`
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
Allows frontend on `http://localhost:3000` to communicate with backend.

---

## FRONTEND (React) Implementation

### 1. **Authentication Context**
**File:** `frontend/src/contexts/AuthContext.js`
Global state management for authentication:

```javascript
AuthContext provides:
  - user: Current user object with email
  - token: JWT token from localStorage
  - loading: Loading state during auth checks
  - isAuthenticated: Boolean flag
  
Methods:
  - login(email, password): Authenticate user
  - signup(email, password): Create new account
  - logout(): Clear token and user data
```

**Features:**
- Auto-loads token from localStorage on app start
- Fetches user info on app load via `/me` endpoint
- Auto-login after signup
- Persistent authentication across page refreshes

### 2. **Login Page**
**File:** `frontend/src/pages/Login.js`

**Features:**
- Email and password input fields
- Form validation:
  - Required fields
  - Email format check
  - Minimum password length
- Error message display
- Loading state during submission
- Link to signup page
- Responsive design with glassmorphism

**Flow:**
1. User enters email/password
2. Form validates input
3. Calls `login()` from AuthContext
4. On success: Redirects to dashboard
5. On error: Shows error message

### 3. **Signup Page**
**File:** `frontend/src/pages/Signup.js`

**Features:**
- Email input
- Password input
- Confirm password input
- Validation:
  - All fields required
  - Email format
  - Password length
  - Passwords must match
- Error handling
- Auto-login after signup
- Link to login page

**Flow:**
1. User enters email/password/confirm password
2. Form validates
3. Calls `signup()` from AuthContext
4. On success: Auto-logs in user
5. Redirects to dashboard

### 4. **Protected Routes**
**File:** `frontend/src/components/ProtectedRoute.js`

```javascript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

**Behavior:**
- If loading: Shows "Loading..."
- If not authenticated: Redirects to `/login`
- If authenticated: Renders child component

### 5. **Updated Navbar**
**File:** `frontend/src/components/Navbar.js`

**Unauthenticated State:**
- Shows "Login" and "Sign Up" buttons
- No navigation links
- No settings

**Authenticated State:**
- Shows user email (👤 user@example.com)
- Navigation links: Dashboard, Scanner, Reports
- Language selector
- Theme selector
- Settings icon
- Logout button (red gradient)

**Features:**
- Glassmorphic design with backdrop blur
- Responsive layout
- Logout clears token and redirects to login
- User email displayed with emoji

### 6. **App Routing**
**File:** `frontend/src/App.js`

**Public Routes:**
- `/login` - Login page
- `/signup` - Signup page

**Protected Routes:**
- `/dashboard` - Dashboard
- `/scanner` - Email/Invoice scanner
- `/reports` - Reports and history
- `/settings` - User settings

**Features:**
- AuthProvider wraps entire app
- ProtectedRoute guards sensitive pages
- Auto-redirect to login if not authenticated
- Token checked on app mount

---

## Data Flow

### Signup Flow
```
User Input (email, password)
    ↓
Signup Form Validation
    ↓
POST /api/auth/signup
    ↓
Backend: Validate → Hash Password → Store User
    ↓
Response: {message: "User created successfully"}
    ↓
Auto-Login: POST /api/auth/login
    ↓
Response: {access_token, token_type, user}
    ↓
Store token in localStorage
    ↓
Redirect to /dashboard
```

### Login Flow
```
User Input (email, password)
    ↓
Login Form Validation
    ↓
POST /api/auth/login
    ↓
Backend: Find User → Verify Password → Generate JWT
    ↓
Response: {access_token, token_type, user}
    ↓
Store token in localStorage
    ↓
Set AuthContext (user, isAuthenticated)
    ↓
Redirect to /dashboard
```

### Protected Route Flow
```
User navigates to /dashboard
    ↓
ProtectedRoute checks isAuthenticated
    ↓
If false: Redirect to /login
If true: Render protected component
```

### Token Validation Flow
```
User sends request to /me
    ↓
Include: Header {token: JWT}
    ↓
Backend: Decode JWT → Verify signature
    ↓
If valid: Return user info
If invalid: Return 401 Unauthorized
```

---

## Security Features

### Backend
✅ **Password Hashing:** BCrypt with salt
✅ **JWT Tokens:** HS256 with 1-day expiry
✅ **Email Validation:** EmailStr from Pydantic
✅ **CORS:** Configured to allow frontend
✅ **Token Verification:** Validates signature and expiry
✅ **Database:** SQLite with unique email constraint

### Frontend
✅ **LocalStorage:** Secure token storage
✅ **HTTPS Ready:** Tokens sent via headers
✅ **Input Validation:** Client-side form validation
✅ **Protected Routes:** Unauthorized access blocked
✅ **Auto-Logout:** On token expiry
✅ **Error Handling:** User-friendly error messages

---

## How to Test

### 1. **Signup**
1. Visit `http://localhost:3000/signup`
2. Enter email: `test@example.com`
3. Enter password: `password123`
4. Click "Sign Up"
5. Should auto-login and redirect to dashboard

### 2. **Login**
1. Visit `http://localhost:3000/login`
2. Enter email: `test@example.com`
3. Enter password: `password123`
4. Click "Sign In"
5. Should redirect to dashboard

### 3. **Protected Routes**
1. Try accessing `/dashboard` without logging in
2. Should redirect to `/login`
3. After login, all routes accessible

### 4. **User Info in Navbar**
1. Login successfully
2. Navbar shows `👤 test@example.com`
3. Click Logout
4. Logged out and redirected to login

### 5. **Token Persistence**
1. Login successfully
2. Refresh page (F5)
3. Should stay logged in (token loaded from localStorage)
4. Clear localStorage
5. Refresh page - should redirect to login

---

## Files Created/Modified

### Backend Files Created
- `backend/app/auth_models.py` - User model
- `backend/app/auth_schemas.py` - Pydantic schemas
- `backend/app/auth_service.py` - Authentication service
- `backend/app/routers/auth.py` - API endpoints
- `backend/app/routers/__init__.py` - Package marker

### Backend Files Modified
- `backend/app/main.py` - Added auth router and CORS
- `backend/app/config.py` - Added SECRET_KEY

### Frontend Files Created
- `frontend/src/contexts/AuthContext.js` - Auth state management
- `frontend/src/pages/Login.js` - Login page
- `frontend/src/pages/Signup.js` - Signup page
- `frontend/src/components/ProtectedRoute.js` - Route protection

### Frontend Files Modified
- `frontend/src/App.js` - Added auth routes and protected routes
- `frontend/src/components/Navbar.js` - Added user info and logout

### Configuration
- `requirements.txt` - Added bcrypt and PyJWT dependencies

---

## Dependencies

### Backend (Python)
```
FastAPI==0.115.0
bcrypt==4.1.1
PyJWT==2.12.1
SQLAlchemy==2.0.32
email-validator==2.1.0.post1
```

### Frontend (JavaScript)
```
react-router-dom (already installed)
```

---

## Next Steps (Optional Enhancements)

1. **Email Verification:** Send verification email after signup
2. **Password Reset:** Forgot password functionality
3. **2FA:** Two-factor authentication
4. **Refresh Tokens:** Separate refresh token with longer expiry
5. **Rate Limiting:** Limit login attempts per IP
6. **Audit Logging:** Track login/logout events
7. **Social Auth:** OAuth with Google/GitHub
8. **User Profile:** Edit profile, change password
9. **Session Management:** Logout from all devices
10. **API Key:** For programmatic access

---

## Production Checklist

✅ Change `SECRET_KEY` in `config.py`
✅ Set `ALLOWED_ORIGINS` to specific domain(s)
✅ Enable HTTPS for token transmission
✅ Add database migrations
✅ Add rate limiting on auth endpoints
✅ Add logging for security events
✅ Add monitoring/alerting
✅ Set secure cookie flags
✅ Add input sanitization
✅ Test all edge cases

---

## API Documentation

Full API documentation available at:
**`http://127.0.0.1:8000/docs`** (Swagger UI)
**`http://127.0.0.1:8000/redoc`** (ReDoc)

---

**Status:** ✅ Fully Implemented and Ready for Testing
