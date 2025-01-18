#!/bin/bash

# Make the script executable with: chmod +x scripts/view-logs.sh

# Colors for different services
FRONTEND_COLOR="\033[0;32m"    # Green
API_COLOR="\033[0;34m"         # Blue
CONSUMER_COLOR="\033[0;35m"    # Purple
MONGO_COLOR="\033[0;33m"       # Yellow
REDIS_COLOR="\033[0;36m"       # Cyan
RABBIT_COLOR="\033[0;31m"      # Red
VAULT_COLOR="\033[0;37m"       # White
NC="\033[0m"                   # No Color

# Function to format logs
format_logs() {
    while IFS= read -r line; do
        service=$(echo "$line" | cut -d'|' -f1)
        message=$(echo "$line" | cut -d'|' -f2-)
        case $service in
            *frontend*)
                echo -e "${FRONTEND_COLOR}[Frontend]${NC} $message"
                ;;
            *tracking-api*)
                echo -e "${API_COLOR}[API]${NC} $message"
                ;;
            *consumer*)
                echo -e "${CONSUMER_COLOR}[Consumer]${NC} $message"
                ;;
            *mongodb*)
                echo -e "${MONGO_COLOR}[MongoDB]${NC} $message"
                ;;
            *redis*)
                echo -e "${REDIS_COLOR}[Redis]${NC} $message"
                ;;
            *rabbitmq*)
                echo -e "${RABBIT_COLOR}[RabbitMQ]${NC} $message"
                ;;
            *vault*)
                echo -e "${VAULT_COLOR}[Vault]${NC} $message"
                ;;
            *)
                echo "$line"
                ;;
        esac
    done
}

# Stream logs
docker-compose -f docker-compose.dev.yml logs -f --tail=100 | format_logs
