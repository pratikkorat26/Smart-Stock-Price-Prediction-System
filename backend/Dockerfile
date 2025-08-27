# Use the official Python image
FROM python:3.11-slim

# Set the working directory
WORKDIR /app
# Copy the requirements file
COPY requirements.txt ./

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose the port (informational for local use)
EXPOSE 8000

# Run the application; respect $PORT if provided by the platform
ENV PORT=8000
CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT}"]