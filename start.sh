#!/bin/bash

# XMarket Frontend Docker Startup Script
# Makes it super easy for backend developers to run the frontend

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    print_status "Checking Docker status..."
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Check if port 3000 is available
check_port() {
    print_status "Checking if port 3000 is available..."
    if lsof -i :3000 > /dev/null 2>&1; then
        print_warning "Port 3000 is already in use. The existing service will be stopped."
        read -p "Continue? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Aborted by user"
            exit 1
        fi
    fi
}

# Main menu
show_menu() {
    echo
    echo "🚀 XMarket Frontend Docker Launcher"
    echo "======================================"
    echo
    echo "Choose your setup:"
    echo
    echo "1) 🏭 Production Mode    - Optimized build, fast startup"
    echo "2) 🔧 Development Mode   - Hot reload, for code changes"
    echo "3) ⚡ Watch Mode         - Advanced file watching (Docker Compose v2.22+)"
    echo "4) 📊 Show Status        - Check running containers"
    echo "5) 🛑 Stop All           - Stop all containers"
    echo "6) 🧹 Clean Up           - Remove containers and images"
    echo "7) ❌ Exit"
    echo
}

# Start production mode
start_production() {
    print_status "Starting XMarket Frontend in Production Mode..."
    print_status "Building and starting container..."
    
    docker compose up --build xmarket-frontend
    
    print_success "Frontend is running at http://localhost:3000"
}

# Start development mode
start_development() {
    print_status "Starting XMarket Frontend in Development Mode..."
    print_status "Building and starting container with hot reload..."
    
    docker compose --profile dev up --build xmarket-frontend-dev
    
    print_success "Frontend is running at http://localhost:3000 with hot reload"
}

# Start watch mode
start_watch() {
    print_status "Starting XMarket Frontend in Watch Mode..."
    print_status "This uses Docker Compose watch for advanced file synchronization..."
    
    # Check if docker compose supports watch
    if docker compose version | grep -q "v2\.[2-9][0-9]\|v[3-9]"; then
        docker compose --profile dev up --build --watch xmarket-frontend-dev
        print_success "Frontend with watch mode is running at http://localhost:3000"
    else
        print_warning "Your Docker Compose version doesn't support watch mode."
        print_warning "Falling back to regular development mode..."
        start_development
    fi
}

# Show status
show_status() {
    print_status "Docker containers status:"
    echo
    docker ps --filter "name=xmarket-frontend" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo
    
    if docker ps --filter "name=xmarket-frontend" --filter "status=running" | grep -q xmarket-frontend; then
        print_success "Frontend is running at http://localhost:3000"
        
        # Check if backend is accessible
        if curl -s http://localhost:3001/health > /dev/null 2>&1; then
            print_success "Backend is accessible at http://localhost:3001"
        else
            print_warning "Backend is not accessible at http://localhost:3001"
            print_warning "Make sure your backend is running on port 3001"
        fi
    else
        print_warning "No frontend containers are running"
    fi
}

# Stop all containers
stop_all() {
    print_status "Stopping all XMarket Frontend containers..."
    docker compose down
    print_success "All containers stopped"
}

# Clean up
cleanup() {
    print_status "Cleaning up XMarket Frontend containers and images..."
    
    # Stop containers
    docker compose down
    
    # Remove images
    docker rmi $(docker images -q --filter reference="*xmarket-frontend*") 2>/dev/null || true
    
    # Clean up Docker system
    docker system prune -f
    
    print_success "Cleanup completed"
}

# Main script
main() {
    # Clear screen
    clear
    
    # Check prerequisites
    check_docker
    
    # Show menu and get user choice
    show_menu
    
    read -p "Enter your choice (1-7): " choice
    echo
    
    case $choice in
        1)
            check_port
            start_production
            ;;
        2)
            check_port
            start_development
            ;;
        3)
            check_port
            start_watch
            ;;
        4)
            show_status
            ;;
        5)
            stop_all
            ;;
        6)
            cleanup
            ;;
        7)
            print_status "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
}

# Handle Ctrl+C
trap 'echo; print_warning "Script interrupted by user"; exit 1' INT

# Run main function
main

echo
print_status "Script completed. Run ./start.sh again for more options."
