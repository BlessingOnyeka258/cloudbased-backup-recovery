# AWS Free Tier Deployment Guide: CloudRecover

This guide provides step-by-step instructions to deploy the Cloud-based Endpoint Device Recovery System to an AWS EC2 instance using the Free Tier.

## 1. Prerequisites
*   An AWS Account (Free Tier eligible).
*   A Key Pair (`.pem` file) created during EC2 launch.
*   The application code ready (ideally in a Git repository).

## 2. Infrastructure Setup (AWS Console)
1.  **Launch EC2 Instance**:
    *   **AMI**: Ubuntu 22.04 LTS.
    *   **Instance Type**: `t2.micro` or `t3.micro`.
    *   **Security Group**:
        *   SSH (Port 22) - Allow from your IP.
        *   HTTP (Port 80) - Allow from anywhere.
        *   HTTPS (Port 443) - Allow from anywhere.

## 3. Server Configuration (Terminal)
Connect to your instance via SSH:
```bash
ssh -i "your-key.pem" ubuntu@your-ec2-ip
```

Install the required environment:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 Process Manager
sudo npm install -g pm2
```

## 4. Application Deployment
Clone your code to the server:
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### Backend Setup
```bash
cd backend
npm install
npx prisma db push
pm2 start index.js --name "cloud-backend"
```

### Frontend Setup
```bash
cd ../frontend
npm install
npm run build
```

## 5. Reverse Proxy Setup (Nginx)
Nginx will serve the frontend and proxy API requests to the backend.

1.  **Install Nginx**:
    ```bash
    sudo apt install nginx -y
    ```

2.  **Create Configuration**:
    ```bash
    sudo nano /etc/nginx/sites-available/cloudrecover
    ```

3.  **Configuration Content**:
    (Replace `/path/to/your-repo` with the actual path, usually `/home/ubuntu/...`)
    ```nginx
    server {
        listen 80;
        server_name your-ec2-public-ip;

        location / {
            root /home/ubuntu/your-repo/frontend/dist;
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

4.  **Enable Configuration**:
    ```bash
    sudo ln -s /etc/nginx/sites-available/cloudrecover /etc/nginx/sites-enabled/
    sudo rm /etc/nginx/sites-enabled/default
    sudo nginx -t
    sudo systemctl restart nginx
    ```

## 6. Maintenance Commands
*   **View backend logs**: `pm2 logs cloud-backend`
*   **Restart backend**: `pm2 restart cloud-backend`
*   **Check Nginx status**: `sudo systemctl status nginx`
*   **Update app**: 
    ```bash
    git pull
    cd backend && npm install && pm2 restart cloud-backend
    cd ../frontend && npm install && npm run build
    ```
