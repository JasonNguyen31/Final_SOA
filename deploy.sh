#!/bin/bash

# 🚀 Auto Deploy Script - Online Entertainment Platform
# This script will deploy your application in production mode

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║          🚀 DEPLOYMENT SCRIPT - PRODUCTION MODE              ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if running from project root
if [ ! -f "deploy.sh" ]; then
    print_error "Please run this script from project root directory"
    exit 1
fi

# Check Docker installation
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_success "Docker and Docker Compose are installed"

# Step 1: Generate secure passwords if not exists
print_info "Step 1: Checking environment variables..."

if [ ! -f "backend/.env.prod" ]; then
    print_warning "Generating secure passwords..."

    MONGO_PASSWORD=$(python3 -c "import secrets; print(secrets.token_urlsafe(24))")
    REDIS_PASSWORD=$(python3 -c "import secrets; print(secrets.token_urlsafe(24))")

    cat > backend/.env.prod << EOF
# Production Environment Variables - Generated $(date)
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=${MONGO_PASSWORD}
REDIS_PASSWORD=${REDIS_PASSWORD}
EOF

    print_success "Environment file created with secure passwords"
else
    print_success "Environment file already exists"
fi

# Step 2: Create production .env for each service
print_info "Step 2: Setting up service environment files..."

SERVICES=("auth_service" "user_service" "movie_service" "book_service" "collection_service")

for service in "${SERVICES[@]}"; do
    if [ -f "backend/$service/.env" ]; then
        # Copy dev .env to .env.prod if not exists
        if [ ! -f "backend/$service/.env.prod" ]; then
            cp "backend/$service/.env" "backend/$service/.env.prod"

            # Update MongoDB URI to use host.docker.internal for production
            sed -i.bak 's|MONGO_URI=mongodb://localhost:27017|MONGO_URI=mongodb://host.docker.internal:27017|g' "backend/$service/.env.prod" 2>/dev/null || \
            sed -i '' 's|MONGO_URI=mongodb://localhost:27017|MONGO_URI=mongodb://host.docker.internal:27017|g' "backend/$service/.env.prod"

            print_success "Created .env.prod for $service"
        fi
    fi
done

# Step 3: Stop existing development containers
print_info "Step 3: Stopping development containers..."
cd backend
docker-compose down 2>/dev/null || true
print_success "Development containers stopped"

# Step 4: Build production images
print_info "Step 4: Building production Docker images..."
print_warning "This may take a few minutes..."

# Copy Dockerfile.prod for services that don't have it
for service in "${SERVICES[@]}"; do
    if [ ! -f "$service/Dockerfile.prod" ]; then
        cp "$service/Dockerfile" "$service/Dockerfile.prod" 2>/dev/null || true
    fi
done

# Build images
docker-compose -f docker-compose.prod.yml build --no-cache
print_success "Docker images built successfully"

# Step 5: Start production services
print_info "Step 5: Starting production services..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

print_success "Production containers started"

# Step 6: Wait for services to be healthy
print_info "Step 6: Waiting for services to be healthy..."
sleep 10

# Check health endpoints
SERVICES_PORTS=("8001" "8002" "8003" "8004" "8005")
SERVICES_NAMES=("Auth" "User" "Movie" "Book" "Collection")

echo ""
for i in "${!SERVICES_PORTS[@]}"; do
    PORT="${SERVICES_PORTS[$i]}"
    NAME="${SERVICES_NAMES[$i]}"

    if curl -s "http://localhost:$PORT/health" > /dev/null 2>&1; then
        print_success "$NAME Service (port $PORT): HEALTHY"
    else
        print_warning "$NAME Service (port $PORT): Starting..."
    fi
done

# Step 7: Show container status
echo ""
print_info "Step 7: Container Status:"
docker-compose -f docker-compose.prod.yml ps

# Step 8: Import sample data if needed
echo ""
read -p "Do you want to import sample movie data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Importing sample data..."
    docker exec movie_service_prod python add_movies.py 2>/dev/null || \
    print_warning "Sample data import failed (file may not exist)"
fi

# Final summary
echo ""
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                  ✅ DEPLOYMENT SUCCESSFUL!                    ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo ""
echo -e "${BLUE}📊 Service URLs:${NC}"
echo "   🔐 Auth Service:       http://localhost:8001/health"
echo "   👤 User Service:       http://localhost:8002/health"
echo "   🎬 Movie Service:      http://localhost:8003/health"
echo "   📚 Book Service:       http://localhost:8004/health"
echo "   📁 Collection Service: http://localhost:8005/health"

echo ""
echo -e "${BLUE}🔧 Useful Commands:${NC}"
echo "   View logs:     docker-compose -f docker-compose.prod.yml logs -f"
echo "   Stop all:      docker-compose -f docker-compose.prod.yml down"
echo "   Restart:       docker-compose -f docker-compose.prod.yml restart"
echo "   Shell access:  docker exec -it movie_service_prod /bin/bash"

echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo "   1. Test APIs with Postman (import Postman_Collection.json)"
echo "   2. Check API_ENDPOINTS.md for all available endpoints"
echo "   3. For cloud deployment, see DEPLOYMENT_GUIDE.md"

echo ""
echo -e "${YELLOW}⚠️  Important:${NC}"
echo "   - Passwords saved in backend/.env.prod"
echo "   - Keep this file secure and don't commit to git!"
echo "   - For production, setup SSL/HTTPS (see DEPLOYMENT_GUIDE.md)"

echo ""
print_success "Deployment completed successfully! 🎉"
