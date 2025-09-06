# 🐳 XMarket Frontend Docker Setup

Quick and easy Docker setup for frontend development and deployment. Perfect for backend developers who want to run the fro#### **Build Failures**
```bash
# Clear Docker cache and rebuild
docker system prune -f
docker compose build --no-cache xmarket-frontend
```

#### **Bundle Analyzer Module Not Found**
If you see `Cannot find module '@next/bundle-analyzer'` error:
- This is fixed in the latest version
- The config now conditionally loads bundle analyzer
- Production builds work without dev dependencies

#### **Watch Mode Not Working**
```bash
# Check Docker Compose version
docker compose version

# Watch mode requires Docker Compose v2.22+
# If not available, use regular development mode:
docker compose --profile dev up xmarket-frontend-dev
```without Node.js setup hassles.

## 🚀 Quick Start (30 seconds)

### **Option 1: Production Build** (Recommended for testing)
```bash
# Build and run production frontend
docker compose up --build

# Access frontend at: http://localhost:3000
```

### **Option 2: Development Mode** (For frontend development)
```bash
# Run with hot reload for development
docker compose --profile dev up xmarket-frontend-dev --build

# Access frontend at: http://localhost:3000
# File changes will trigger hot reload
```

### **Option 3: Watch Mode** (Advanced - Docker Compose v2.22+)
```bash
# Advanced watch mode with instant file sync
docker compose --profile dev up --build --watch xmarket-frontend-dev

# Even faster file synchronization
# Automatically syncs changes and rebuilds when needed
```

### **Option 3: Quick Test** (One-liner)
```bash
# Quick production test
docker run -p 3000:3000 $(docker build -q .)
```

## 📋 Available Services

| Service | Description | Port | Use Case |
|---------|-------------|------|----------|
| **xmarket-frontend** | Production build | 3000 | Testing, demo, production-like environment |
| **xmarket-frontend-dev** | Development with hot reload | 3000 | Frontend development, debugging |
| **watch mode** | Advanced file synchronization | 3000 | Fastest development experience |

## 🔧 Configuration

### Environment Variables
The frontend is pre-configured to work with the backend on port 3001:

```bash
# Default configuration (automatically set)
NEXT_PUBLIC_API_URL=http://localhost:3001  # Backend URL
NODE_ENV=production                        # Environment mode  
PORT=3000                                  # Frontend port
```

### Custom Backend URL
If your backend runs on a different port or host:

```bash
# Option 1: Environment variable
NEXT_PUBLIC_API_URL=http://localhost:8080 docker compose up --build

# Option 2: Edit docker-compose.yml
# Change NEXT_PUBLIC_API_URL in the environment section
```

## 📁 Docker Files Explanation

### **Dockerfile** - Production Build
- Multi-stage build for optimized image size
- Uses Next.js standalone output
- Alpine Linux for minimal footprint
- Security-hardened with non-root user

### **Dockerfile.dev** - Development Build  
- Hot reload enabled
- All dependencies included (dev + prod)
- Volume mounts for real-time code changes
- Development-optimized configuration

### **docker-compose.yml** - Orchestration
- Both production and development services
- Network configuration for backend integration
- Health checks for production service
- Profile-based service selection

## 🎯 Common Commands

### Development Workflow
```bash
# Start development server with hot reload
docker compose --profile dev up xmarket-frontend-dev

# Start with advanced watch mode (Docker Compose v2.22+)
docker compose --profile dev up --build --watch xmarket-frontend-dev

# Rebuild after package.json changes
docker compose --profile dev up xmarket-frontend-dev --build

# Stop development server
docker compose --profile dev down
```

### Production Testing
```bash
# Start production server
docker compose up xmarket-frontend

# Start with rebuild
docker compose up xmarket-frontend --build

# Run in background
docker compose up -d xmarket-frontend

# Stop production server
docker compose down
```

### Maintenance Commands
```bash
# View logs
docker compose logs xmarket-frontend
docker compose logs -f xmarket-frontend  # Follow logs

# Shell into container
docker compose exec xmarket-frontend sh

# Clean up containers and images
docker compose down
docker system prune -f
```

## 🔍 Troubleshooting

### Common Issues

#### **Port 3000 Already in Use**
```bash
# Check what's using port 3000
lsof -i :3000

# Option 1: Stop the other service
# Option 2: Use different port
docker-compose up --build -p "3001:3000"  # Access on localhost:3001
```

#### **Backend Connection Issues**
```bash
# Verify backend is running
curl http://localhost:3001/health

# Check network connectivity from container
docker-compose exec xmarket-frontend sh
# Inside container: curl http://host.docker.internal:3001
```

#### **Build Failures**
```bash
# Clear Docker cache and rebuild
docker system prune -f
docker-compose build --no-cache xmarket-frontend
```

#### **Hot Reload Not Working (Development)**
```bash
# Ensure you're using the dev profile
docker-compose --profile dev up xmarket-frontend-dev

# Check volume mounts in docker-compose.yml
# Make sure your file changes are being picked up
```

### Build Optimization
```bash
# Check image sizes
docker images | grep xmarket

# Analyze build layers
docker history $(docker build -q .)

# Build with verbose output
docker build --progress=plain .
```

## 🌐 Integration with Backend

### Backend Developer Setup
If you're a backend developer wanting to run the frontend:

1. **Make sure your backend is running** on port 3001
2. **Run the frontend** with Docker:
   ```bash
   docker-compose up --build
   ```
3. **Test the connection**: Frontend should connect to your backend automatically
4. **Development**: Use the dev profile if you need to modify frontend code

### API Configuration
The frontend is pre-configured to connect to:
- **Backend URL**: `http://localhost:3001`
- **Authentication**: Cookie-based (automatic)
- **CORS**: Must be configured in your backend for `localhost:3000`

### CORS Setup (Backend)
Make sure your backend allows requests from `localhost:3000`:

```typescript
// Example NestJS CORS config
app.enableCors({
  origin: ['http://localhost:3000'],
  credentials: true,  // For cookie authentication
});
```

## 🚀 Production Deployment

### Build Production Image
```bash
# Build optimized production image
docker build -t xmarket-frontend:latest .

# Run production container
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://your-backend.com xmarket-frontend:latest
```

### Deploy with External Backend
```bash
# Set production backend URL
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.yourbackend.com \
  xmarket-frontend:latest
```

## 📊 Performance Notes

### Image Sizes
- **Production**: ~150MB (optimized Alpine + standalone)
- **Development**: ~400MB (includes dev dependencies)

### Build Times
- **Cold build**: ~2-3 minutes (first time)
- **Cached build**: ~30 seconds (incremental)
- **Development**: ~1 minute (with hot reload)

### Memory Usage
- **Production**: ~100MB RAM
- **Development**: ~200MB RAM (with hot reload)

## 🔧 Customization

### Custom Docker Network
```bash
# Create custom network for multi-service setup
docker network create xmarket-network

# Run frontend in custom network
docker run --network xmarket-network -p 3000:3000 xmarket-frontend
```

### Volume Mounts (Development)
For development with custom file watching:
```yaml
volumes:
  - ./:/app
  - /app/node_modules  # Preserve container node_modules
  - /app/.next         # Preserve Next.js cache
```

### Health Checks
The production service includes health checks:
```bash
# Check container health
docker inspect xmarket-frontend --format='{{.State.Health.Status}}'

# View health check logs  
docker inspect xmarket-frontend --format='{{range .State.Health.Log}}{{.Output}}{{end}}'
```

---

## 🎉 Success!

You now have a complete Docker setup for the XMarket frontend. Backend developers can run the frontend with a single command, and frontend developers have hot reload capabilities.

**Need help?** Check the troubleshooting section above or contact the frontend team.

---

*Docker setup maintained for seamless backend developer collaboration*  
*Optimized for both development and production workflows*  
*Last updated: 2025-08-25*
