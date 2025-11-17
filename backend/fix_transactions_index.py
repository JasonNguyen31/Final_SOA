#!/usr/bin/env python3
"""
Script to fix the transactions collection index issue.
This script will:
1. Drop the existing unique index on idempotencyKey
2. Create a new sparse unique index that allows multiple null values
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "ONLINE_ENTERTAINMENT_PLATFORM")


async def fix_transactions_index():
    """Fix the transactions collection index"""
    print(f"Connecting to MongoDB at {MONGODB_URL}")
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    transactions_collection = db["transactions"]

    print("\n1. Checking existing indexes...")
    indexes = await transactions_collection.list_indexes().to_list(None)
    print(f"Found {len(indexes)} indexes:")
    for idx in indexes:
        print(f"  - {idx['name']}: {idx.get('key', {})}")

    # Check if idempotencyKey index exists
    idempotency_index_exists = any(
        idx['name'] == 'idempotencyKey_1' for idx in indexes
    )

    if idempotency_index_exists:
        print("\n2. Dropping old idempotencyKey_1 index...")
        try:
            await transactions_collection.drop_index("idempotencyKey_1")
            print("   ✓ Successfully dropped idempotencyKey_1 index")
        except Exception as e:
            print(f"   ✗ Error dropping index: {e}")
    else:
        print("\n2. idempotencyKey_1 index not found, skipping drop")

    print("\n3. Creating new sparse unique index on idempotencyKey...")
    try:
        # Create a sparse unique index - allows multiple null values
        # but ensures uniqueness for non-null values
        await transactions_collection.create_index(
            "idempotencyKey",
            unique=True,
            sparse=True,  # This allows multiple documents with null idempotencyKey
            name="idempotencyKey_sparse_unique"
        )
        print("   ✓ Successfully created sparse unique index")
    except Exception as e:
        print(f"   ✗ Error creating index: {e}")

    print("\n4. Verifying new indexes...")
    indexes = await transactions_collection.list_indexes().to_list(None)
    print(f"Current indexes:")
    for idx in indexes:
        sparse = " (sparse)" if idx.get('sparse') else ""
        unique = " (unique)" if idx.get('unique') else ""
        print(f"  - {idx['name']}: {idx.get('key', {})}{unique}{sparse}")

    print("\n✓ Index fix completed!")
    client.close()


if __name__ == "__main__":
    asyncio.run(fix_transactions_index())
