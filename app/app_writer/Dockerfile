FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files first (for cache)
COPY package.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY app.js ./

# No ports exposed (worker)
# EXPOSE not needed

# Start the writer
CMD ["node", "app.js"]