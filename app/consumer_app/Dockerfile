FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Copy package files first (better caching)
COPY package.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY app.js ecosystem.config.js ./

# Expose app port
EXPOSE 3000

# Run app with PM2
CMD ["pm2-runtime", "ecosystem.config.js"]
