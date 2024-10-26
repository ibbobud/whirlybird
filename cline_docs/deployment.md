# Deployment Requirements

## Current Setup
- Next.js 14 application
- Containerized using Docker
- Uses Red Hat Universal Base Image 9
- Data storage via Excel files
- Node.js 18.x runtime

## Manual Deployment Steps

### 1. Prerequisites
- Node.js 18.x installed on the server
- npm or yarn package manager
- Git (for version control)

### 2. Server Setup Commands
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y  # For Ubuntu/Debian
# OR
sudo yum update -y  # For RHEL/CentOS

# Install Node.js 18.x if not already installed
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -  # For RHEL/CentOS
# OR
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -  # For Ubuntu/Debian
sudo apt install -y nodejs  # For Ubuntu/Debian
# OR
sudo yum install -y nodejs  # For RHEL/CentOS
```

### 3. Application Deployment Commands
```bash
# Clone the repository (if using version control)
git clone <repository-url>
cd whirlybird

# Install production dependencies
npm ci --production

# Build the application
npm run build

# Start the production server
npm start

# Alternative: Using PM2 for process management
npm install -g pm2
pm2 start npm --name "whirlybird" -- start
pm2 save
pm2 startup
```

### 4. Nginx Configuration (Recommended)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. SSL Setup with Certbot
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx  # For Ubuntu/Debian
# OR
sudo yum install -y certbot python3-certbot-nginx  # For RHEL/CentOS

# Obtain and install SSL certificate
sudo certbot --nginx -d your-domain.com
```

## Docker Deployment (Alternative)
- Current Dockerfile is production-ready with:
  - Multi-stage build process
  - Production dependencies only
  - Next.js production build
- Docker Compose maps port 80 to container port 3000

### Docker Deployment Commands
```bash
docker-compose up -d
```

## Production Requirements

### 1. Data Management
- Set up a persistent volume mount for:
  - `/app/data/bays.xlsx`
  - `/app/data/settings.json`
- Ensure proper file permissions for data files
- Implement backup strategy for Excel and settings files

### 2. Environment Setup
- Configure production environment variables:
  ```env
  NODE_ENV=production
  ```
- Consider implementing health checks
- Set up proper logging configuration

### 3. Security Considerations
- Implement HTTPS/TLS
- Set up proper file permissions
- Configure security headers
- Implement rate limiting
- Regular security updates for base image

### 4. Monitoring and Maintenance
- Set up application monitoring
- Configure error logging
- Implement automated backups
- Set up container restart policies

### 5. Performance Optimization
- Enable Next.js caching
- Configure CDN if needed
- Optimize Excel file reading
- Implement proper error boundaries

### 6. Backup Strategy
- Regular backups of:
  - Excel data files
  - Settings configuration
  - Application logs
- Implement backup rotation policy

### 7. Scaling Considerations
- Load balancing if needed
- Container orchestration for multiple instances
- Data synchronization strategy

## Pre-Deployment Checklist
- [ ] Test production build locally
- [ ] Verify all environment variables
- [ ] Check file permissions
- [ ] Test backup/restore procedures
- [ ] Verify SSL configuration
- [ ] Test monitoring setup
- [ ] Validate security measures
- [ ] Document rollback procedures
