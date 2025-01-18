#!/bin/sh

# Wait for Vault to start
sleep 5

# Enable KV secrets engine
vault secrets enable -path=kv kv-v2

# Create environment variables for each service
vault kv put kv/frontend \
    NEXT_PUBLIC_API_URL="http://tracking-api:8000" \
    WATCHPACK_POLLING="true" \
    CHOKIDAR_USEPOLLING="true"

vault kv put kv/tracking-api \
    MONGODB_URI="mongodb://mongodb:27017/" \
    REDIS_HOST="redis" \
    RABBITMQ_URL="amqp://guest:guest@rabbitmq:5672/" \
    PYTHONDONTWRITEBYTECODE="1" \
    PYTHONUNBUFFERED="1"

vault kv put kv/consumer \
    MONGODB_URI="mongodb://mongodb:27017/" \
    REDIS_HOST="redis" \
    RABBITMQ_URL="amqp://guest:guest@rabbitmq:5672/"

# Configure UI Authentication
vault auth enable userpass

# Create admin user
vault write auth/userpass/users/admin \
    password="adminpassword" \
    policies="admin"

# Create admin policy
vault policy write admin - <<EOF
path "*" {
  capabilities = ["create", "read", "update", "delete", "list", "sudo"]
}
EOF

# Create viewer policy
vault policy write viewer - <<EOF
path "kv/data/*" {
  capabilities = ["read", "list"]
}
EOF

# Create viewer user
vault write auth/userpass/users/viewer \
    password="viewerpassword" \
    policies="viewer"

# Export environment variables for each service
FRONTEND_ENV=$(vault kv get -format=json kv/frontend | jq -r '.data.data | to_entries | map("\(.key)=\(.value|tostring)") | .[]' | paste -sd " " -)
API_ENV=$(vault kv get -format=json kv/tracking-api | jq -r '.data.data | to_entries | map("\(.key)=\(.value|tostring)") | .[]' | paste -sd " " -)
CONSUMER_ENV=$(vault kv get -format=json kv/consumer | jq -r '.data.data | to_entries | map("\(.key)=\(.value|tostring)") | .[]' | paste -sd " " -)

# Write to environment file
cat > /scripts/.env <<EOF
FRONTEND_ENV="${FRONTEND_ENV}"
API_ENV="${API_ENV}"
CONSUMER_ENV="${CONSUMER_ENV}"
EOF

chmod 644 /scripts/.env
