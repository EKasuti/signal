from sqlmodel import SQLModel, text
from backend.models import * # Import all models to register them
from backend.database import engine

def reset_db():
    print("Resetting database...")
    with engine.connect() as conn:
        conn.commit() # End any existing transaction
        # Drop all tables in public schema
        # This is infinite risk but for dev environment it is what was requested
        print("Dropping all tables...")
        conn.execute(text("DROP SCHEMA public CASCADE;"))
        conn.execute(text("CREATE SCHEMA public;"))
        conn.commit()
    
    print("Creating new tables...")
    SQLModel.metadata.create_all(engine)
    print("Database reset complete.")

if __name__ == "__main__":
    reset_db()
