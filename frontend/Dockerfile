# Use a lightweight Node.js image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the React app
RUN npm run build

# Serve the app using a lightweight server
RUN npm install -g serve

# Expose port 8080 (Elastic Beanstalk default)
EXPOSE 8080

# Start the server and specify the port as 8080
CMD ["serve", "-s", "build", "-l", "8080"]
