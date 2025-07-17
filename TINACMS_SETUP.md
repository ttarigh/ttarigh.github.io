# TinaCMS Setup Guide

## 🎯 What We've Set Up

Your portfolio now has TinaCMS integration! Here's what's been added:

### Files Created:
- `content/art.json` - All your art projects in structured format
- `tina/config.js` - TinaCMS schema configuration  
- `scripts/build.js` - Builds HTML from JSON data
- `package.json` - Dependencies and build scripts

### How It Works:
1. **Edit Content**: Use TinaCMS admin interface to edit projects
2. **Auto-Build**: Changes automatically generate new HTML files
3. **Same Design**: Your beautiful design stays exactly the same!

## 🚀 Setup Steps

### 1. Create TinaCMS Account
1. Go to https://app.tina.io
2. Sign up with your GitHub account
3. Create a new project
4. Connect it to your `ttarigh.github.io` repository

### 2. Environment Variables
Create a `.env` file in your project root with:

```env
# Get these from your TinaCMS project dashboard
NEXT_PUBLIC_TINA_CLIENT_ID=your_client_id_here
TINA_TOKEN=your_token_here
GITHUB_BRANCH=main
```

**Important**: Add `.env` to your `.gitignore` file!

### 3. Deploy TinaCMS Admin
```bash
npm run build
```

This creates an `/admin` folder with your editing interface.

### 4. Test Locally
```bash
npm run dev
```

Visit `http://localhost:3000/admin` to see your editing interface!

## 📝 How to Use

### Editing Content:
1. Go to `your-site.com/admin` 
2. Sign in with TinaCMS
3. Edit your art projects visually
4. Save changes
5. Site rebuilds automatically!

### Adding New Projects:
- Click "Add Art Project" in the admin
- Fill in all fields
- Upload images directly
- Save and publish

### Available Commands:
```bash
npm run dev          # Start development with TinaCMS
npm run build        # Build for production  
npm run build:site   # Just rebuild HTML from data
```

## 🖼️ Image Management

- Images are stored in your `/images` folder
- TinaCMS can upload new images directly
- Existing images work without changes
- Supports multiple images per project

## 🎨 Customization

Your design is completely preserved! The build script generates the exact same HTML structure you had before.

To modify the design:
1. Edit `css/main.css` as usual
2. Modify `scripts/build.js` for HTML changes
3. Update `tina/config.js` for field changes

## 🚀 GitHub Pages Deployment

1. Your site builds automatically on push
2. TinaCMS changes trigger new builds
3. No manual deployment needed!

## Next Steps

1. Set up your TinaCMS account
2. Configure environment variables  
3. Test editing some content
4. Add work projects (optional)
5. Set up about page editing 