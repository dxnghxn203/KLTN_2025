#!/bin/bash

# Colors for logs
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}Starting build and deployment...${NC}"

# Stop and remove existing containers
echo -e "${YELLOW}Cleaning up old containers...${NC}"
docker-compose -f docker-compose.dev.yml down

# Build and start services
echo -e "${YELLOW}Building and starting services...${NC}"
docker-compose -f docker-compose.dev.yml up -d --build

# Wait for services to start
echo -e "${YELLOW}Waiting for services to start...${NC}"
sleep 5

Show logs with colors
echo -e "${GREEN}Showing logs...${NC}"
docker-compose -f docker-compose.dev.yml logs -f --tail=100 | \
while read -r line; do
    if [[ $line == *"frontend"* ]]; then
        echo -e "${GREEN}[Frontend]${NC} $line"
    elif [[ $line == *"tracking-api"* ]]; then
        echo -e "${BLUE}[API]${NC} $line"
    elif [[ $line == *"consumer"* ]]; then
        echo -e "${RED}[Consumer]${NC} $line"
    else
        echo -e "${YELLOW}[System]${NC} $line"
    fi
done
