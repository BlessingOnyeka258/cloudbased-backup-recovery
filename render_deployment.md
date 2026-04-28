# Deploying CloudRecover to Render

Since we have migrated to a **Flask Monolith**, deployment is now much simpler. You only need to deploy one service instead of two.

## Step 1: Push Code to GitHub
1. Create a repository on GitHub.
2. Push your current project:
   ```bash
   git add .
   git commit -m "flask migration"
   git push origin main
   ```

## Step 2: Connect to Render
1. Go to [Render.com](https://render.com) and log in.
2. Click **New** > **Blueprint**.
3. Connect your GitHub repository.
4. Render will read the `render.yaml` file I created.

## Step 3: Automatic Configuration
The `render.yaml` handles everything:
- **Service Name**: `cloud-recover-flask`
- **Environment**: Python
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`
- **Database**: Automatically creates a free PostgreSQL instance.

## Step 4: Environment Variables
The following are automatically set by the Blueprint:
- `DATABASE_URL`: Connection string for PostgreSQL.
- `SECRET_KEY`: Randomly generated for session security.

## Step 5: Verification
Once the status turns to **"Live"**, click the URL provided by Render. Your system will be online with the persistent PostgreSQL database!
