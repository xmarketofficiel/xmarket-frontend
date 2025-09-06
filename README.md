# XMarket Frontend

Modern marketp| Command | Description | Port |
|---------|-------------|------|
| `./start.sh` | Interactive launcher | 3000 |
| `docker compose up --build` | Production mode | 3000 |
| `docker compose --profile dev up xmarket-frontend-dev --build` | Development with hot reload | 3000 |
| `docker compose --profile dev up --build --watch xmarket-frontend-dev` | Advanced watch mode | 3000 |frontend built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### 🐳 **Docker Setup (Recommended)**
Perfect for backend developers or quick testing:

```bash
# One-click startup
./start.sh

# Or manually
docker-compose up --build

# Access: http://localhost:3000
```

### ⚙️ **Traditional Setup**
For frontend development:

```bash
npm install
npm run dev
```

## 📚 Documentation

- **[DOCKER_SETUP.md](./DOCKER_SETUP.md)** - Complete Docker guide
- **[Ghost - Front-end/README.md](./Ghost%20-%20Front-end/README.md)** - Complete project documentation

## 🔧 Available Docker Services

| Command | Description | Port |
|---------|-------------|------|
| `./start.sh` | Interactive launcher | 3000 |
| `docker-compose up --build` | Production mode | 3000 |
| `docker-compose --profile dev up xmarket-frontend-dev --build` | Development with hot reload | 3000 |

## 🔌 Backend Integration

Frontend is pre-configured to connect to backend on port 3001:
- **Backend URL**: `http://localhost:3001`
- **Authentication**: Cookie-based JWT
- **CORS**: Backend must allow `localhost:3000`

## 📋 Key Features

- ✅ **Responsive Design** - Mobile-first UI
- ✅ **TypeScript** - Full type safety
- ✅ **PWA Support** - Progressive Web App
- ✅ **Docker Ready** - One-command deployment
- ✅ **Backend Integration Ready** - API client configured
- ✅ **Testing Setup** - Jest + Playwright

## 🎯 For Backend Developers

1. **Run the frontend**: `./start.sh` → choose option 1
2. **Check connection**: Frontend will connect to your backend on port 3001
3. **CORS setup**: Ensure backend allows `localhost:3000`
4. **Documentation**: Full integration guide in `Ghost - Front-end/03-integration/`

## 🛠️ Development

```bash
# Development (Node.js)
npm run dev

# Development (Docker)
./start.sh  # Choose option 2

# Build
npm run build

# Test
npm test
```

---

**Need help?** Check `DOCKER_SETUP.md` or `Ghost - Front-end/README.md` for complete documentation.
