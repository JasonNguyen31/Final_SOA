from pymongo import MongoClient

# Kết nối tới MongoDB đang chạy trên host
mongo_uri = "mongodb://host.docker.internal:27017/ONLINE_ENTERTAINMENT_PLATFORM"

try:
    client = MongoClient(mongo_uri)
    db = client.get_database()
    print(f"Connected to MongoDB successfully! Database: {db.name} ({db.list_collection_names()})")
finally:
    client.close()
