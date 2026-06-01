# Deployment Guide — AstroAgent 🚀

Follow this step-by-step guide to deploy your backend server to **Render** and your frontend client to **Vercel**, enabling you to share your live Vercel link as your demo project.

---

## 1. Push your Code to GitHub

Make sure your local Git repository is initialized, your files are staged, and the repository is pushed to a remote GitHub repository.

Run these commands in your project root (`astroagent/`):
```bash
# Verify Git status (sensitive files like backend/.env should be ignored)
git status

# Stage all files
git add .

# Commit changes
git commit -m "Initialize AstroAgent backend, frontend, and evals"

# Create a new repository on GitHub, then link and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## 2. Deploy the Backend on Render 🌌

Render is used to host your Express API server.

1. **Sign In**: Log into [Render](https://render.com/).
2. **Create Web Service**: Click **New +** and select **Web Service**.
3. **Connect Repository**: Link your GitHub account and select your `astroagent` repository.
4. **Configure Settings**:
   - **Name**: `astroagent-backend` (or a custom name).
   - **Environment**: `Node`
   - **Region**: Select the region closest to you.
   - **Branch**: `main`
   - **Root Directory**: `backend` (⚠️ *Very Important: This points Render to the nested backend folder!*)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Set Environment Variables**:
   Click **Advanced** or navigate to the **Environment** tab and add the following keys:
   - `OPENAI_API_KEY`: `your_actual_openrouter_or_openai_api_key_here`
   - `PORT`: `3001`
6. **Deploy**: Click **Deploy Web Service**.

Once the deployment completes, Render will provide you with a live URL (e.g., `https://astroagent-backend.onrender.com`). **Copy this URL.**

---

## 3. Deploy the Frontend on Vercel ⚡

Vercel is used to host your static Vite React frontend.

1. **Sign In**: Log into [Vercel](https://vercel.com/).
2. **Create Project**: Click **Add New** -> **Project**.
3. **Import Repository**: Select your `astroagent` repository.
4. **Configure Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`frontend`** (⚠️ *Very Important: This points Vercel to the nested frontend folder!*).
   - **Build and Output Settings**: Leave defaults (Build command: `vite build`, Output directory: `dist`).
5. **Set Environment Variables**:
   Expand the **Environment Variables** section and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://YOUR_RENDER_BACKEND_URL` (paste the URL you copied from Render, *without* a trailing slash, e.g., `https://astroagent-backend.onrender.com`).
6. **Deploy**: Click **Deploy**.

Vercel will build your React application and provide you with a live production URL (e.g., `https://astroagent-frontend.vercel.app`).

---

## 4. Test the Deployment

1. Open your Vercel URL in a browser.
2. Fill out the **Birth Form** and click **Begin Reading**.
3. The app will communicate securely with your Render server using the Vercel `VITE_API_URL` redirect and stream Ara's astrological insights in real-time.
