# backend/seed.py
import sqlite3
import datetime

DB_PATH = "cybersaarthi.db"

def seed():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    # Example: create table if not exists
    c.execute("""
    CREATE TABLE IF NOT EXISTS scan_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        content TEXT,
        verdict TEXT,
        created_at TEXT
    )
    """)
    
    sample_data = [
        ("email", "Safe test email", "safe", datetime.datetime.now().isoformat()),
        ("email", "Phishing attempt with fake link", "mal", datetime.datetime.now().isoformat()),
        ("invoice", "Legit invoice", "safe", datetime.datetime.now().isoformat()),
        ("invoice", "Fraudulent invoice", "susp", datetime.datetime.now().isoformat()),
    ]
    
    c.executemany("INSERT INTO scan_history (type, content, verdict, created_at) VALUES (?,?,?,?)", sample_data)
    conn.commit()
    conn.close()
    print("✅ Seed data inserted successfully!")

if __name__ == "__main__":
    seed()
