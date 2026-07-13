# Build Stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency configs
COPY package*.json ./

# Install packages
RUN npm ci --only=production

# Copy source
COPY . .

# Set Env variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose API Port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
