# Stage 1: Build the React Application
FROM node:18-alpine AS build

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the application
FROM node:18-alpine

WORKDIR /app

# Install 'serve'
RUN npm install -g serve

# Copy the build output
COPY --from=build /app/dist ./dist

# Start the server on the port expected by Cloud Run (default 8080)
CMD sh -c "serve -s dist -l tcp://0.0.0.0:${PORT:-8080}"
