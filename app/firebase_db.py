import firebase_admin
from firebase_admin import credentials, firestore
import os

# Firebase initialization
db = None

def init_firebase():
    global db
    try:
        # Check for service account key file
        key_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "firebase-key.json")
        
        if os.path.exists(key_path):
            cred = credentials.Certificate(key_path)
            firebase_admin.initialize_app(cred)
            db = firestore.client()
            print("🔥 Firebase Admin SDK initialized successfully.")
        else:
            print("⚠️ firebase-key.json not found. Using in-memory fallback.")
    except Exception as e:
        print(f"❌ Firebase init failed: {e}")

def add_score(name, score):
    """Add a score to Firestore."""
    if db:
        try:
            db.collection("leaderboard").add({
                "name": name,
                "score": score,
                "timestamp": firestore.SERVER_TIMESTAMP
            })
            return True
        except Exception as e:
            print(f"❌ Firestore write error: {e}")
    return False

def get_leaderboard():
    """Get top 10 scores from Firestore."""
    if db:
        try:
            docs = db.collection("leaderboard").order_by("score", direction=firestore.Query.DESCENDING).limit(10).stream()
            return [{"name": doc.to_dict().get("name"), "score": doc.to_dict().get("score")} for doc in docs]
        except Exception as e:
            print(f"❌ Firestore read error: {e}")
    return None

# Initialize on import
init_firebase()
