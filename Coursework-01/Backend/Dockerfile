
FROM node:22.13.0

WORKDIR /app

# Install backend dependencies
COPY package*.json ./
RUN npm install

# Copy backend source code
COPY . .



# Expose the port your backend uses
EXPOSE 3001

# Start the backend server
CMD ["node", "src/index.js"]
