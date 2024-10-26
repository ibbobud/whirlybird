# Use Red Hat Universal Base Image 9
FROM registry.access.redhat.com/ubi9/ubi

# Install necessary dependencies
RUN yum update -y --allowerasing && \
    yum install -y curl --allowerasing && \
    curl -fsSL https://rpm.nodesource.com/setup_18.x | bash - && \
    yum install -y nodejs && \
    yum clean all

# Set the working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Clean up dev dependencies
#RUN npm ci --only=production

# Copy standalone output to a new directory
#RUN cp -r .next/standalone/* ./ && \
    #cp -r .next/static .next/static && \
    #cp -r public ./

# Expose internal port
EXPOSE 3000

# Command to run the standalone server
CMD ["npm", "run", "start"]