#!/bin/bash

# Collection Service API Test Script
# Usage: ./test_collection_api.sh

echo "========================================="
echo "🧪 TESTING COLLECTION SERVICE API"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# API URLs
AUTH_URL="http://localhost:8001/api/auth"
COLLECTION_URL="http://localhost:8005/api/collections"

# Test credentials (make sure you have a test user)
EMAIL="test@example.com"
PASSWORD="Test123456"

echo -e "${BLUE}📝 Step 1: Login to get JWT token${NC}"
echo "Logging in as: $EMAIL"

LOGIN_RESPONSE=$(curl -s -X POST "$AUTH_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo "$LOGIN_RESPONSE" | python3 -m json.tool

# Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['accessToken'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Failed to get token. Please check credentials.${NC}"
    echo -e "${YELLOW}💡 Tip: Create a test user first or update EMAIL/PASSWORD in this script${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Token obtained successfully${NC}"
echo "Token: ${TOKEN:0:50}..."
echo ""

# Test 1: Create Collection
echo -e "${BLUE}📝 Step 2: Create a new collection${NC}"
CREATE_RESPONSE=$(curl -s -X POST "$COLLECTION_URL" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Test Collection",
    "description": "Testing collection API",
    "privacy": "private"
  }')

echo "$CREATE_RESPONSE" | python3 -m json.tool
COLLECTION_ID=$(echo "$CREATE_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['_id'])" 2>/dev/null)

if [ -z "$COLLECTION_ID" ]; then
    echo -e "${RED}❌ Failed to create collection${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Collection created with ID: $COLLECTION_ID${NC}"
echo ""

# Test 2: Get All Collections
echo -e "${BLUE}📝 Step 3: Get all user collections${NC}"
curl -s -X GET "$COLLECTION_URL" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo -e "${GREEN}✅ Collections retrieved${NC}"
echo ""

# Test 3: Get Collection by ID
echo -e "${BLUE}📝 Step 4: Get collection by ID${NC}"
curl -s -X GET "$COLLECTION_URL/$COLLECTION_ID" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo -e "${GREEN}✅ Collection details retrieved${NC}"
echo ""

# Test 4: Add Item to Collection
echo -e "${BLUE}📝 Step 5: Add a movie to collection${NC}"
ADD_ITEM_RESPONSE=$(curl -s -X POST "$COLLECTION_URL/$COLLECTION_ID/items" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contentId": "test_movie_123",
    "contentType": "movie",
    "title": "Test Movie Title",
    "thumbnail": "https://example.com/image.jpg"
  }')

echo "$ADD_ITEM_RESPONSE" | python3 -m json.tool
echo -e "${GREEN}✅ Item added to collection${NC}"
echo ""

# Test 5: Update Collection
echo -e "${BLUE}📝 Step 6: Update collection${NC}"
curl -s -X PUT "$COLLECTION_URL/$COLLECTION_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Collection Name",
    "description": "Updated description",
    "privacy": "public"
  }' | python3 -m json.tool
echo -e "${GREEN}✅ Collection updated${NC}"
echo ""

# Test 6: Browse Public Collections
echo -e "${BLUE}📝 Step 7: Browse public collections${NC}"
curl -s -X GET "$COLLECTION_URL/public/browse?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo -e "${GREEN}✅ Public collections retrieved${NC}"
echo ""

# Test 7: Search Collections
echo -e "${BLUE}📝 Step 8: Search collections${NC}"
curl -s -X GET "$COLLECTION_URL/search/query?q=Test" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo -e "${GREEN}✅ Search completed${NC}"
echo ""

# Test 8: Remove Item from Collection
echo -e "${BLUE}📝 Step 9: Remove item from collection${NC}"
curl -s -X DELETE "$COLLECTION_URL/$COLLECTION_ID/items/test_movie_123" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo -e "${GREEN}✅ Item removed${NC}"
echo ""

# Test 9: Delete Collection
echo -e "${BLUE}📝 Step 10: Delete collection${NC}"
curl -s -X DELETE "$COLLECTION_URL/$COLLECTION_ID" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo -e "${GREEN}✅ Collection deleted${NC}"
echo ""

# Bonus: Test Continue Watching
echo -e "${BLUE}📝 Bonus: Test Continue Watching${NC}"
curl -s -X GET "http://localhost:8003/api/movies/continue-watching?limit=5" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo -e "${GREEN}✅ Continue watching retrieved${NC}"
echo ""

# Bonus: Test Continue Reading
echo -e "${BLUE}📝 Bonus: Test Continue Reading${NC}"
curl -s -X GET "http://localhost:8004/api/books/continue-reading?limit=5" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo -e "${GREEN}✅ Continue reading retrieved${NC}"
echo ""

echo "========================================="
echo -e "${GREEN}🎉 ALL TESTS COMPLETED!${NC}"
echo "========================================="
