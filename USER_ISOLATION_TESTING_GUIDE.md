# User-Specific Data Isolation - Testing Guide

## Overview
The application now implements **user-specific data isolation**. Each logged-in user will only see their own scans and history. The system has been updated with:

1. ✅ **Database Schema**: Added `user_id` foreign key to `ScanHistory` model
2. ✅ **Backend Endpoints**: All scan endpoints now track `user_id` from authenticated user
3. ✅ **Reports API**: Filters history by current user only
4. ✅ **Database Migration**: Existing 23 scans assigned to user_id=1 (admin user)
5. ✅ **Authentication**: Dependency injection to extract user from JWT token

## How to Test

### Prerequisites
1. Backend running: `cd backend && python -m uvicorn app.main:app --reload`
2. Frontend running: `cd frontend && npm start`
3. Browser with two tabs or windows open

### Test Scenario 1: Single User - Dashboard & Reports Consistency

**Step 1: Register User A**
- Open http://localhost:3000
- Click "Sign Up"
- Email: `user.a@test.com`
- Password: `Test123!`
- Click "Create Account"
- Should auto-login to Dashboard

**Step 2: Scan Email**
- On Dashboard, go to "Scanner" tab
- Paste an email text (any email content)
- Click "Scan Email"
- Should see result
- Dashboard KPI should show "Total: 1"

**Step 3: Scan Invoice**
- Scan another email or invoice text
- Dashboard KPI should now show "Total: 2"

**Step 4: Check Reports**
- Click "Reports" in navbar
- Should see exactly 2 scans
- Filter dropdown should work (All/Safe/Suspicious/Malicious)
- **Verify**: Reports total exactly matches Dashboard KPI

### Test Scenario 2: Multiple Users - Data Isolation

**Step 5: Open Second Browser Tab/Window**
- Logout from User A: Click Settings → Logout
- Or open in incognito/private window

**Step 6: Register User B**
- Email: `user.b@test.com`
- Password: `Test456!`
- Auto-login to Dashboard

**Step 7: Verify User B Dashboard is Empty**
- Dashboard should show "Total: 0" (User B has no scans yet)
- Reports should show "0 results"

**Step 8: Scan with User B**
- Go to Scanner
- Scan an email
- Dashboard KPI should show "Total: 1"
- Reports should show 1 scan

**Step 9: Switch Back to User A (First Tab)**
- Refresh the Reports page or go back to Scanner
- Dashboard KPI should still show "Total: 2" (User B's scan not visible)
- Reports should still show User A's 2 scans only

### Test Scenario 3: Verify Backend Isolation

**Terminal Test - Using curl:**

```bash
# Step 1: Create two test users
curl -X POST http://127.0.0.1:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@test.com","password":"Pass123"}'

curl -X POST http://127.0.0.1:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@test.com","password":"Pass456"}'

# Step 2: Login as Alice
ALICE_TOKEN=$(curl -s -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@test.com","password":"Pass123"}' | jq -r '.access_token')

echo "Alice Token: $ALICE_TOKEN"

# Step 3: Scan as Alice
curl -X POST "http://127.0.0.1:8000/v1/scan/email?token=$ALICE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email_text":"Test email content. Suspicious link: http://fake-bank.com","lang":"en"}'

# Step 4: Get Alice's reports
curl -s -X GET "http://127.0.0.1:8000/v1/reports/history?token=$ALICE_TOKEN" | jq '.'

# Step 5: Login as Bob
BOB_TOKEN=$(curl -s -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@test.com","password":"Pass456"}' | jq -r '.access_token')

# Step 6: Get Bob's reports (should be empty)
curl -s -X GET "http://127.0.0.1:8000/v1/reports/history?token=$BOB_TOKEN" | jq '.'
# Expected: {"items":[], "total":0, "limit":20, "offset":0}

# Step 7: Get Alice's reports again with her token (should see her scans)
curl -s -X GET "http://127.0.0.1:8000/v1/reports/history?token=$ALICE_TOKEN" | jq '.total'
# Expected: 1
```

## Expected Outcomes

✅ **User A Dashboard**: Shows only User A's scans
✅ **User A Reports**: Shows only User A's history (total should match Dashboard)
✅ **User B Dashboard**: Empty initially, shows only User B's scans after scanning
✅ **User B Reports**: Only shows User B's history
✅ **Data Isolation**: Users cannot see each other's scans
✅ **Consistency**: Dashboard and Reports KPI always match
✅ **Database**: Each ScanHistory record has user_id = logged-in user's id

## Troubleshooting

### Issue: "Missing authentication token"
- **Cause**: Token not being sent in request
- **Fix**: Ensure Authorization header is sent as `Bearer <token>` or `?token=<token>` query param

### Issue: "Invalid or expired token"
- **Cause**: JWT validation failed
- **Fix**: Use fresh token from login endpoint (tokens expire after 1 day)

### Issue: Users still see each other's scans
- **Cause**: Reports endpoint not filtering correctly
- **Check**: Verify `/v1/reports/history` filters by `user_id == current_user.id`

### Issue: Dashboard shows 0 after migration
- **Cause**: All old scans assigned to user_id=1, but you're logged in as different user
- **Fix**: Create new user and scan again OR login with user_id=1 to see migrated scans

## Key Implementation Details

### Frontend Impact (No Changes Needed)
- AuthContext already provides logged-in user `id`
- API calls automatically send JWT token via `Authorization` header
- Dashboard and Reports already fetch from `/v1/reports/history` endpoint
- Frontend filtering will now only work with user-scoped data

### Backend Implementation
- `deps.py`: New `get_current_user` dependency extracts user from token
- `models.py`: ScanHistory now has `user_id` foreign key
- `routers/scan.py`: All three scan endpoints use `get_current_user` dependency
- `routers/reports.py`: Filters query with `.filter(ScanHistory.user_id == current_user.id)`
- `migrate_add_user_id.py`: Migration script safely updates existing database

### Database Schema
```sql
ALTER TABLE scan_history 
ADD COLUMN user_id INTEGER NOT NULL DEFAULT 1;
-- Foreign key relationship to users table
```

## Next Steps (Optional)

1. **Add Admin Dashboard**: Show all users' scans (admin-only)
2. **Add Usage Analytics**: Per-user scan statistics
3. **Add User Management**: Admins can delete users & their data
4. **Add Export**: Users can export their scan history
5. **Add Data Retention**: Auto-delete old scans after X days

## Verification Commands

```bash
# Check if migration worked
sqlite3 cybersaarthi.db "SELECT COUNT(*) as user_id_present FROM scan_history WHERE user_id IS NOT NULL;"
# Should return: 23 (all existing scans have user_id now)

# Check database schema
sqlite3 cybersaarthi.db ".schema scan_history"
# Should show user_id column
```

## Rollback (If Needed)

If you need to revert, use:
```python
# In Python shell
import sqlite3
conn = sqlite3.connect('cybersaarthi.db')
cursor = conn.cursor()
cursor.execute("ALTER TABLE scan_history DROP COLUMN user_id")
conn.commit()
```

Note: SQLite has limited ALTER TABLE support, so dropping columns might not work in older versions. Consider creating a new table if rollback is needed.
