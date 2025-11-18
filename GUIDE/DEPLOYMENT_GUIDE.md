# 🚀 DEPLOYMENT GUIDE - Online Entertainment Platform

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Production Environment Setup](#production-environment-setup)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment Options](#cloud-deployment-options)
5. [Environment Configuration](#environment-configuration)
6. [Security Checklist](#security-checklist)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

### Required Software:
- ✅ Docker & Docker Compose
- ✅ Git
- ✅ Domain name (optional but recommended)
- ✅ SSL Certificate (for HTTPS)
- ✅ Cloud account (AWS/GCP/Azure/DigitalOcean)

### Minimum Server Requirements:
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **OS**: Ubuntu 20.04+ / Debian 11+

---

## 1. Production Environment Setup

### Step 1: Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Step 2: Clone Repository

```bash
# Create app directory
sudo mkdir -p /opt/entertainment-platform
cd /opt/entertainment-platform

# Clone your repository
git clone https://github.com/your-username/your-repo.git .
```

### Step 3: Setup Environment Variables

Create production `.env` files for each service:

**Backend services `.env`**:
```bash
# Example for movie_service/.env
SERVICE_NAME=movie_service
MONGO_URI=mongodb://mongo:27017
DATABASE_NAME=ONLINE_ENTERTAINMENT_PLATFORM
JWT_SECRET=YOUR_PRODUCTION_SECRET_KEY_HERE_CHANGE_THIS
JWT_ALGORITHM=HS256
JWT_ACCESS_EXPIRE_MINUTES=15
JWT_REFRESH_EXPIRE_DAYS=7
PORT=8003
REDIS_URL=redis://redis:6379

# Email settings (for production)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

**Frontend `.env`**:
```bash
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_AUTH_SERVICE_URL=https://api.yourdomain.com:8001
VITE_USER_SERVICE_URL=https://api.yourdomain.com:8002
VITE_MOVIE_SERVICE_URL=https://api.yourdomain.com:8003
```

---

## 2. Docker Deployment

### Option A: Using Docker Compose (Recommended)

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  # MongoDB
  mongo:
    image: mongo:8
    container_name: mongo_prod
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
    volumes:
      - mongo_data:/data/db
    networks:
      - backend
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis
  redis:
    image: redis:7-alpine
    container_name: redis_prod
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - backend

  # Auth Service
  auth_service:
    build:
      context: ./backend/auth_service
      dockerfile: Dockerfile
    container_name: auth_service_prod
    restart: always
    ports:
      - "8001:8001"
    environment:
      - MONGO_URI=mongodb://admin:${MONGO_ROOT_PASSWORD}@mongo:27017
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
    depends_on:
      mongo:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - backend

  # User Service
  user_service:
    build:
      context: ./backend/user_service
      dockerfile: Dockerfile
    container_name: user_service_prod
    restart: always
    ports:
      - "8002:8002"
    depends_on:
      - mongo
      - redis
    networks:
      - backend

  # Movie Service
  movie_service:
    build:
      context: ./backend/movie_service
      dockerfile: Dockerfile
    container_name: movie_service_prod
    restart: always
    ports:
      - "8003:8003"
    depends_on:
      - mongo
      - redis
    networks:
      - backend

  # Book Service
  book_service:
    build:
      context: ./backend/book_service
      dockerfile: Dockerfile
    container_name: book_service_prod
    restart: always
    ports:
      - "8004:8004"
    depends_on:
      - mongo
    networks:
      - backend

  # Collection Service
  collection_service:
    build:
      context: ./backend/collection_service
      dockerfile: Dockerfile
    container_name: collection_service_prod
    restart: always
    ports:
      - "8005:8005"
    depends_on:
      - mongo
    networks:
      - backend

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: nginx_prod
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./frontend/dist:/usr/share/nginx/html:ro
    depends_on:
      - auth_service
      - user_service
      - movie_service
    networks:
      - backend

networks:
  backend:
    driver: bridge

volumes:
  mongo_data:
  redis_data:
```

### Deploy Commands:

```bash
# Create .env.prod file with production secrets
cat > .env.prod << EOF
MONGO_ROOT_PASSWORD=your-strong-password-here
REDIS_PASSWORD=your-redis-password-here
EOF

# Build and start services
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 3. Cloud Deployment Options

### Option 1: AWS EC2 + Docker

1. **Launch EC2 Instance**:
   - Instance type: t3.medium (2 vCPU, 4GB RAM)
   - AMI: Ubuntu 20.04 LTS
   - Security Group: Open ports 80, 443, 22

2. **Setup**:
```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Follow "Production Environment Setup" above
# Deploy using Docker Compose
```

### Option 2: DigitalOcean Droplet

1. **Create Droplet**:
   - Plan: Basic ($24/month - 2 vCPU, 4GB RAM)
   - Image: Docker on Ubuntu 20.04

2. **Deploy**:
```bash
ssh root@your-droplet-ip
# Follow deployment steps
```

### Option 3: Google Cloud Run (Serverless)

```bash
# Build and push images
docker build -t gcr.io/your-project/auth-service ./backend/auth_service
docker push gcr.io/your-project/auth-service

# Deploy
gcloud run deploy auth-service \
  --image gcr.io/your-project/auth-service \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Option 4: Kubernetes (Advanced)

Create `k8s/` directory with manifests:
- `deployment.yaml`
- `service.yaml`
- `ingress.yaml`
- `configmap.yaml`

```bash
kubectl apply -f k8s/
```

---

## 4. Nginx Configuration

Create `nginx/nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    # Upstream services
    upstream auth_service {
        server auth_service:8001;
    }

    upstream user_service {
        server user_service:8002;
    }

    upstream movie_service {
        server movie_service:8003;
    }

    upstream book_service {
        server book_service:8004;
    }

    upstream collection_service {
        server collection_service:8005;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS Server
    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Frontend
        location / {
            root /usr/share/nginx/html;
            try_files $uri $uri/ /index.html;
        }

        # API Routes
        location /api/auth {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://auth_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api/users {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://user_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api/movies {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://movie_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api/books {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://book_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api/collections {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://collection_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

---

## 5. SSL Certificate Setup

### Using Let's Encrypt (Free):

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (runs twice daily)
sudo certbot renew --dry-run
```

---

## 6. Security Checklist

✅ **Environment Variables**:
- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Store secrets in `.env` files (not in git)
- [ ] Use environment variables for sensitive data

✅ **Network Security**:
- [ ] Enable firewall (UFW)
- [ ] Only open required ports (80, 443, 22)
- [ ] Use SSH keys instead of passwords
- [ ] Disable root SSH login

✅ **Application Security**:
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Enable CORS only for trusted origins
- [ ] Sanitize user inputs
- [ ] Use prepared statements for DB queries

✅ **Database Security**:
- [ ] Enable MongoDB authentication
- [ ] Use strong passwords
- [ ] Restrict network access
- [ ] Enable encryption at rest
- [ ] Regular backups

✅ **Monitoring**:
- [ ] Setup logging (CloudWatch, Datadog)
- [ ] Monitor CPU/Memory usage
- [ ] Track API errors
- [ ] Setup alerts

---

## 7. Backup & Restore

### MongoDB Backup:

```bash
# Backup
docker exec mongo_prod mongodump --out /backup/$(date +%Y%m%d)

# Restore
docker exec mongo_prod mongorestore /backup/20241118
```

### Automated Backup (Cron):

```bash
# Add to crontab
0 2 * * * docker exec mongo_prod mongodump --out /backup/$(date +\%Y\%m\%d)
```

---

## 8. Monitoring Commands

```bash
# Check service health
curl https://yourdomain.com/api/movies/health

# View logs
docker-compose -f docker-compose.prod.yml logs -f movie_service

# Monitor resources
docker stats

# Check disk space
df -h
```

---

## 9. Scaling

### Horizontal Scaling:

```yaml
# In docker-compose.prod.yml
movie_service:
  deploy:
    replicas: 3
  # Add load balancer
```

### Database Scaling:

```yaml
# MongoDB Replica Set
mongo:
  command: mongod --replSet rs0
```

---

## 10. Troubleshooting

### Services not starting:
```bash
# Check logs
docker-compose logs service_name

# Check container status
docker ps -a

# Restart service
docker-compose restart service_name
```

### Database connection issues:
```bash
# Test MongoDB connection
docker exec -it mongo_prod mongosh

# Check network
docker network inspect backend
```

### High memory usage:
```bash
# Clear unused Docker resources
docker system prune -a
```

---

## 📞 Support

For issues or questions:
- GitHub Issues
- Documentation: `/docs`
- Email: support@yourdomain.com

---

## 🎉 Deployment Checklist

- [ ] Server setup complete
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] All services running
- [ ] Database populated
- [ ] Nginx configured
- [ ] Firewall enabled
- [ ] Backups scheduled
- [ ] Monitoring setup
- [ ] Domain DNS configured
- [ ] Test all API endpoints
- [ ] Frontend deployed
- [ ] Security review complete

**Congratulations! Your platform is now live! 🚀**
