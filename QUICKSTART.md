# Quick Start - Authentication System

## 🚀 Getting Started

### Prerequisites
- Python 3.7+
- Node.js and npm
- Backend dependencies installed: `pip install -r requirements.txt`

---

## Step 1: Start Backend Server

```bash
cd backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

**API Endpoints:**
- `/api/auth/signup` - POST - Create account
- `/api/auth/login` - POST - Login
- `/api/auth/me` - GET - Get user info (requires token)
- `/docs` - Swagger UI

---

## Step 2: Start Frontend Server

```bash
cd frontend
npm start
```

**Expected Output:**
```
webpack compiled successfully
Compiled successfully!
On Your Network: http://192.168...
```

Frontend opens at: `http://localhost:3000`

---

## Step 3: Test Authentication

### Test 1: Signup
1. Go to `http://localhost:3000/signup`
2. Enter:
   - Email: `demo@example.com`
   - Password: `demo123`
   - Confirm: `demo123`
3. Click "Sign Up"
4. ✅ Should auto-login and go to dashboard

### Test 2: Logout & Login
1. Click "Logout" button in navbar
2. Should redirect to login page
3. Go to `http://localhost:3000/login`
4. Enter:
   - Email: `demo@example.com`
   - Password: `demo123`
5. Click "Sign In"
6. ✅ Should go to dashboard

### Test 3: Protected Routes
1. Logout
2. Clear browser localStorage (F12 → Application → localStorage → Clear)
3. Try accessing `http://localhost:3000/dashboard`
4. ✅ Should redirect to login page

### Test 4: User Info
1. Login successfully
2. Check navbar shows: `👤 demo@example.com`
3. Settings, language, theme options visible
4. ✅ Everything working

---

## API Testing with cURL

### Signup
```bash
curl -X POST http://127.0.0.1:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get User Info
```bash
curl http://127.0.0.1:8000/api/auth/me \
  -H "token: YOUR_JWT_TOKEN_HERE"
```

---

## File Structure

```
cybersaarthi/
├── backend/
│   └── app/
│       ├── auth_models.py       ← User database model
│       ├── auth_schemas.py      ← Request/response schemas
│       ├── auth_service.py      ← Core auth functions
│       ├── routers/
│       │   └── auth.py          ← API endpoints
│       ├── main.py              ← FastAPI app setup
│       └── config.py            ← Configuration
│
└── frontend/
    └── src/
        ├── contexts/
        │   └── AuthContext.js   ← Auth state
        ├── pages/
        │   ├── Login.js         ← Login page
        │   └── Signup.js        ← Signup page
        ├── components/
        │   ├── ProtectedRoute.js ← Route guard
        │   └── Navbar.js        ← Updated navbar
        └── App.js              ← Updated routing
```

---

## Key Features

✅ **User Registration** - Signup with email/password
✅ **User Login** - Authenticate and get JWT token
✅ **Password Hashing** - Bcrypt encryption
✅ **JWT Authentication** - 1-day token expiry
✅ **Protected Routes** - Authorization guards
✅ **User Session** - Persistent login
✅ **Navbar Integration** - Show user email, logout
✅ **Error Handling** - Clear error messages
✅ **CORS Enabled** - Frontend-backend communication
✅ **Form Validation** - Client and server-side

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000

# If in use, kill the process
taskkill /PID <PID> /F

# Or use different port
python -m uvicorn app.main:app --port 8001
```

### Frontend won't start
```bash
# Clear node modules and reinstall
rm -r node_modules
npm install
npm start
```

### Login not working
1. Check backend is running: `http://127.0.0.1:8000/docs`
2. Check network tab in browser DevTools
3. Verify email/password are correct
4. Check browser console for errors

### Token expires
The JWT token expires after 1 day. After expiry:
1. User redirected to login
2. Need to login again to get new token

---

## Environment Variables

Create `.env` file in backend root:

```
APP_NAME=CyberSaarthi API
SECRET_KEY=your-super-secret-key-change-this
DATABASE_URL=sqlite:///./cybersaarthi.db
ALLOWED_ORIGINS=http://localhost:3000
```

---

## Database

SQLite database created automatically at:
```
cybersaarthi/cybersaarthi.db
```

To reset database:
1. Stop backend server
2. Delete `cybersaarthi.db`
3. Restart server (new database created)

---

## Support

For detailed information, see: `AUTHENTICATION_GUIDE.md`

Happy coding! 🎉
