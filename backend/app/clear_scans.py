"""
Clear all existing scan history data from the database.
Keeps the database schema and users intact for fresh start.
"""

import sqlite3
import sys
from pathlib import Path

def clear_scan_history(db_path: str = "./cybersaarthi.db"):
    """Delete all scan history records to start fresh"""
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get current count
        cursor.execute("SELECT COUNT(*) FROM scan_history")
        old_count = cursor.fetchone()[0]
        
        # Delete all scans
        print(f"→ Clearing {old_count} existing scans from database...")
        cursor.execute("DELETE FROM scan_history")
        
        conn.commit()
        
        # Verify deletion
        cursor.execute("SELECT COUNT(*) FROM scan_history")
        new_count = cursor.fetchone()[0]
        
        if new_count == 0:
            print(f"✓ Successfully cleared {old_count} old scans!")
            print("✓ Database is now fresh - ready for new user-created scans")
            
            # Show users
            cursor.execute("SELECT COUNT(*) FROM users")
            user_count = cursor.fetchone()[0]
            print(f"✓ Users preserved: {user_count} user(s) in database")
            
            conn.close()
            return True
        else:
            print(f"✗ Failed to clear scans. Still {new_count} records remaining")
            conn.close()
            return False
            
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

if __name__ == "__main__":
    db_path = sys.argv[1] if len(sys.argv) > 1 else "./cybersaarthi.db"
    
    if not Path(db_path).exists():
        print(f"✗ Database file not found: {db_path}")
        sys.exit(1)
    
    success = clear_scan_history(db_path)
    sys.exit(0 if success else 1)
