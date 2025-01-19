#!/bin/bash

# Colors for logs
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to start services
start_services() {
    echo -e "${BLUE}Starting services...${NC}"
    docker-compose -f docker-compose.dev.yml up -d --build
    show_status
}

# Function to stop services
stop_services() {
    echo -e "${YELLOW}Stopping services...${NC}"
    docker-compose -f docker-compose.dev.yml down
    echo -e "${GREEN}All services stopped${NC}"
}

# Function to restart services
restart_services() {
    echo -e "${YELLOW}Restarting services...${NC}"
    docker-compose -f docker-compose.dev.yml restart
    show_status
}

# Function to show logs
show_logs() {
    echo -e "${BLUE}Showing logs... Press Ctrl+C to exit${NC}"
    docker-compose -f docker-compose.dev.yml logs -f --tail=100 | \
    while read -r line; do
        if [[ $line == *"frontend"* ]]; then
            echo -e "${GREEN}[Frontend]${NC} $line"
        elif [[ $line == *"tracking-api"* ]]; then
            echo -e "${BLUE}[API]${NC} $line"
        elif [[ $line == *"consumer"* ]]; then
            echo -e "${RED}[Consumer]${NC} $line"
        elif [[ $line == *"mongodb"* ]]; then
            echo -e "${YELLOW}[MongoDB]${NC} $line"
        elif [[ $line == *"redis"* ]]; then
            echo -e "${BLUE}[Redis]${NC} $line"
        elif [[ $line == *"rabbitmq"* ]]; then
            echo -e "${GREEN}[RabbitMQ]${NC} $line"
        else
            echo -e "${YELLOW}[System]${NC} $line"
        fi
    done
}

# Function to show service status
show_status() {
    echo -e "${BLUE}Service Status:${NC}"
    docker-compose -f docker-compose.dev.yml ps
}

# Function to clean up
clean_up() {
    echo -e "${RED}Cleaning up containers and volumes...${NC}"
    docker-compose -f docker-compose.dev.yml down -v
    docker system prune -f
    echo -e "${GREEN}Cleanup completed${NC}"
}

# Help menu
show_help() {
    echo -e "${BLUE}Usage:${NC}"
    echo "  ./run.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start    - Start all services"
    echo "  stop     - Stop all services"
    echo "  restart  - Restart all services"
    echo "  logs     - Show logs"
    echo "  status   - Show service status"
    echo "  clean    - Clean up containers and volumes"
    echo "  help     - Show this help message"
}

# Main script logic
case "$1" in
    "start")
        start_services
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        restart_services
        ;;
    "logs")
        show_logs
        ;;
    "status")
        show_status
        ;;
    "clean")
        clean_up
        ;;
    "help"|"")
        show_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        show_help
        exit 1
        ;;
esac
