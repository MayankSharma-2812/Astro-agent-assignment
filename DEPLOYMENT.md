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

## 3. Deploy the Frontend (Options: Vercel, Render Static Site, or Netlify)

Choose **one** of the following options to host your static React frontend:

### Option A: Deploy on Vercel ⚡

1. **Sign In**: Log into [Vercel](https://vercel.com/).
2. **Create Project**: Click **Add New** -> **Project**.
3. **Import Repository**: Select your `astroagent` (or `astro`) repository.
4. **Configure Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`frontend`** (⚠️ *Very Important: This points Vercel to the nested frontend folder!*).
   - **Build and Output Settings**: Leave defaults (Build command: `vite build` or `npm run build`, Output directory: `dist`).
5. **Set Environment Variables**:
   Expand the **Environment Variables** section and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://YOUR_RENDER_BACKEND_URL` (paste the URL you copied from Render, without a trailing slash, e.g., `https://astroagent-backend.onrender.com`).
6. **Deploy**: Click **Deploy**.

---

### Option B: Deploy on Render (Static Site) 🌌 (Recommended Alternative)

Since your backend is already on Render, you can keep both services under one account.

1. **Sign In**: Log into [Render](https://render.com/).
2. **Create Static Site**: Click **New +** and select **Static Site**.
3. **Connect Repository**: Link your GitHub account and select your repository.
4. **Configure Settings**:
   - **Name**: `astroagent-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend` (⚠️ *Very Important: This points Render to the nested frontend folder!*)
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
5. **Set Environment Variables**:
   Navigate to the **Environment** tab and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://YOUR_RENDER_BACKEND_URL` (your Render backend API URL).
6. **Deploy**: Click **Create Static Site**.

---

### Option C: Deploy on Netlify 🕸️

Netlify is another excellent, free, zero-config hosting provider for Vite React projects.

1. **Sign In**: Log into [Netlify](https://www.netlify.com/).
2. **Import Project**: Click **Add new site** -> **Import an existing project**.
3. **Connect GitHub**: Select your repository.
4. **Configure Settings**:
   - **Branch to deploy**: `main`
   - **Base directory**: `frontend` (⚠️ *Very Important: This points Netlify to the nested frontend folder!*)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist` (Netlify resolves this relative to the base directory).
5. **Set Environment Variables**:
   Click **Add environment variables** (or go to Site configuration -> Environment variables after creation) and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://YOUR_RENDER_BACKEND_URL`
6. **Deploy**: Click **Deploy site**.

---

## 4. Test the Deployment

1. Open your live frontend URL (from Vercel, Render, or Netlify) in a browser.
2. Fill out the **Birth Form** and click **Begin Reading**.
3. The app will communicate securely with your Render server using the configured `VITE_API_URL` and stream Ara's astrological insights in real-time.
