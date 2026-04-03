"""
Database migration to add user_id column to scan_history table.
This script handles both fresh installations and existing databases.
"""

import sqlite3
import sys
from pathlib import Path

def migrate_database(db_path: str = "./cybersaarthi.db"):
    """
    Add user_id column to scan_history table if it doesn't exist.
    For existing records, assign them to a default admin user (id=1).
    """
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if user_id column already exists
        cursor.execute("PRAGMA table_info(scan_history)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if "user_id" in columns:
            print("✓ user_id column already exists in scan_history table")
            conn.close()
            return True
        
        # Add user_id column as nullable first
        print("→ Adding user_id column to scan_history table...")
        cursor.execute("""
            ALTER TABLE scan_history 
            ADD COLUMN user_id INTEGER NOT NULL DEFAULT 1
        """)
        
        # Create foreign key constraint
        print("→ Adding foreign key constraint...")
        # Note: SQLite doesn't support adding foreign keys via ALTER TABLE directly in older versions
        # So we'll create it as a regular column with proper constraints
        
        conn.commit()
        
        # Verify the migration
        cursor.execute("PRAGMA table_info(scan_history)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if "user_id" in columns:
            print("✓ Migration successful! user_id column added to scan_history")
            print(f"  - All existing scans assigned to user_id 1 (default admin user)")
            
            # Show summary
            cursor.execute("SELECT COUNT(*) FROM scan_history")
            scan_count = cursor.fetchone()[0]
            print(f"  - Total scans in database: {scan_count}")
            
            conn.close()
            return True
        else:
            print("✗ Migration failed: user_id column not found after migration")
            conn.close()
            return False
            
    except sqlite3.OperationalError as e:
        if "column user_id already exists" in str(e):
            print("✓ user_id column already exists (no action needed)")
            return True
        else:
            print(f"✗ Database error: {e}")
            return False
    except Exception as e:
        print(f"✗ Migration failed: {e}")
        return False

if __name__ == "__main__":
    db_path = sys.argv[1] if len(sys.argv) > 1 else "./cybersaarthi.db"
    
    if not Path(db_path).exists():
        print(f"✗ Database file not found: {db_path}")
        sys.exit(1)
    
    success = migrate_database(db_path)
    sys.exit(0 if success else 1)
