#!/bin/bash
# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
SOURCE_DIR="/Users/franklapolito/GitHub/pricefinder/Projects/pricefinder"
TEMPLATE_DIR="/Users/franklapolito/Project_template"

echo ">>> Creating template in: $TEMPLATE_DIR"

# --- 1. Copy Project Files ---
# Create the template directory if it doesn't exist and clear it
mkdir -p "$TEMPLATE_DIR"
rm -rf "$TEMPLATE_DIR"/*
echo ">>> Copying project files..."
# Copy contents of the source directory, including hidden files like .gitignore
cp -R "$SOURCE_DIR"/.* "$TEMPLATE_DIR/" 2>/dev/null || true
cp -R "$SOURCE_DIR"/* "$TEMPLATE_DIR/"

# Navigate into the new template directory for all subsequent operations
cd "$TEMPLATE_DIR"

# --- 2. Modify Frontend ---
echo ">>> Modifying frontend client..."
cd pricefinder-client
echo "    -> Removing app-specific components..."
rm -f src/PriceMap.jsx src/Search.jsx src/PriceSubmissionForm.jsx
echo "    -> Uninstalling dependencies..."
npm uninstall leaflet react-leaflet
echo "    -> Rewriting App.jsx..."
cat <<'EOF' > src/App.jsx
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My New Application</h1>
        <p>This is a fresh template.</p>
      </header>
    </div>
  );
}

export default App;
EOF
# Update lock file
npm install
cd ..

# --- 3. Modify Backend ---
echo ">>> Modifying backend API..."
cd pricefinder-api
echo "    -> Uninstalling dependencies..."
npm uninstall pg
echo "    -> Rewriting app.js..."
cat <<'EOF' > app.js
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// A simple health-check route for testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;
EOF
# Update lock file
npm install
cd ..

# --- 4. Modify Docker and Kubernetes Configs ---
echo ">>> Modifying Docker and Kubernetes configurations..."
# Remove the database Kubernetes manifest
rm -f k8s/db.yaml k8s/db-manifest.yaml # Remove either naming convention

# Overwrite docker-compose.yml to remove the 'db' service and dependencies
echo "    -> Rewriting docker-compose.yml..."
cat <<'EOF' > docker-compose.yml
services:
  # Node.js API Service
  api:
    container_name: template_api
    build:
      context: ./pricefinder-api
    ports:
      - "3001:3001"
    volumes:
      - ./pricefinder-api:/app
      - /app/node_modules

  # React Client Service
  client:
    container_name: template_client
    build:
      context: ./pricefinder-client
    ports:
      - "5173:5173"
    depends_on:
      - api
    volumes:
      - ./pricefinder-client:/app
      - /app/node_modules
EOF

# Overwrite the api.yaml to remove database dependency
echo "    -> Rewriting k8s/api-manifest.yaml..."
cat <<'EOF' > k8s/api-manifest.yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  selector:
    app: api
  ports:
    - protocol: TCP
      port: 3001
      targetPort: 3001
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: your-username/template-api:latest
        ports:
        - containerPort: 3001
EOF

echo ""
echo "✅ Template created successfully at $TEMPLATE_DIR"