# 🌷 Romantic Tulip Garden - For Rebika Szabo

A breathtaking cinematic romantic interactive webpage — a living digital garden created with deep love.

## 📁 Project Structure

```
/romantic-tulip-garden
│── index.html          ← Main webpage (entry point)
│── style.css           ← All styling and animations
│── script.js           ← Interactive animations and effects
│── /assets
│     ├── music.mp3     ← Ambient romantic music (add your own)
│     ├── petals.png    ← (Optional) Petal texture
│     ├── tulip-texture.png  ← (Optional) Tulip texture
│     └── background.jpg     ← (Optional) Fallback background
│── README.md           ← This file
```

## 🚀 GitHub Pages Deployment Instructions

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** button → **"New repository"**
3. Name it: `rebika-love-page` (or any name you like)
4. Set it to **Public** (required for free GitHub Pages)
5. Do NOT initialize with README (you already have files)
6. Click **"Create repository"**

### Step 2: Upload Your Files

**Option A — Upload via GitHub Web Interface (Easiest):**

1. On your new repository page, click **"uploading an existing file"**
2. Drag and drop ALL files:
   - `index.html`
   - `style.css`
   - `script.js`
   - `assets/` folder (with `music.mp3` inside)
3. Click **"Commit changes"**

**Option B — Using Git Command Line:**

```bash
cd romantic-tulip-garden
git init
git add .
git commit -m "🌷 Romantic tulip garden for Rebika"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rebika-love-page.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (gear icon)
3. In the left sidebar, click **Pages**
4. Under "Source", select:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Click **Save**
6. Wait 1-2 minutes for deployment

### Step 4: Access Your Live Page

Your page will be live at:
```
https://YOUR_USERNAME.github.io/rebika-love-page/
```

## 🎵 How to Replace Music Later

1. Find a romantic ambient MP3 file (see recommendations below)
2. Rename it to `music.mp3`
3. Replace the file in the `assets/` folder
4. Upload the updated file to GitHub
5. Wait 1-2 minutes for GitHub Pages to update

## 🎶 Recommended Free Ambient Music Sources

| Source | URL | License |
|--------|-----|---------|
| Pixabay Music | https://pixabay.com/music/ | Free, no attribution |
| Mixkit | https://mixkit.co/free-stock-music/ | Free to use |
| Free Music Archive | https://freemusicarchive.org/ | Check individual |
| Bensound | https://www.bensound.com/ | Free with attribution |
| YouTube Audio Library | YouTube Studio → Audio | Free to use |

**Search terms:** "romantic piano ambient", "sunset peaceful", "emotional love background"

## ✨ Features

- 🌷 Realistic animated tulip field with layered petals
- 🌬️ Natural wind animation affecting flowers and grass
- ✨ Floating golden pollen particles
- 🌅 Dynamic sunset lighting with god rays
- 🌸 Falling flower petals
- 🎬 Cinematic camera movement
- 🖱️ Mouse/touch interaction with flowers
- 🪲 Fireflies appearing at night
- ☁️ Moving realistic clouds
- 🌟 Animated stars during night cycle
- 💫 Glassmorphism message panel
- 🎵 Ambient music toggle
- 📱 Fully mobile responsive
- 🎥 Film grain and vignette overlays

## 💻 Technical Notes

- **No frameworks** — Pure HTML, CSS, and JavaScript
- **No dependencies** — Works by opening index.html directly
- **Mobile friendly** — Responsive design with touch support
- **Performance optimized** — requestAnimationFrame, visibility API
- **Accessible** — Respects prefers-reduced-motion

## ❤️ Made with love for Rebika Szabo
