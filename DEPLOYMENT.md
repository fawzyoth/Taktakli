# Deployment Guide - TikTok Capture Monitor

This guide explains how to deploy your Vue 3 TikTok Capture Monitor application to various hosting platforms.

## Build Status

✅ Build is working correctly
✅ Production-ready files in `/dist` folder
✅ Deployment configurations included

## Prerequisites

Before deploying, ensure:
- Node.js 20+ is installed
- All dependencies are installed (`npm install`)
- Build succeeds locally (`npm run build`)

## Quick Deploy Options

### Option 1: Vercel (Recommended)

**Via Vercel CLI:**
```bash
npm install -g vercel
vercel
```

**Via Vercel Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Vercel auto-detects Vue.js settings
4. Click "Deploy"

**Settings:**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Option 2: Netlify

**Via Netlify CLI:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Via Netlify Dashboard:**
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `dist` folder, OR
3. Connect your Git repository

**Settings:**
- Build Command: `npm run build`
- Publish Directory: `dist`
- Node Version: 20

### Option 3: GitHub Pages

**Setup:**
1. Update `vite.config.ts` base path:
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Add to `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

4. Deploy:
```bash
npm run deploy
```

### Option 4: Cloudflare Pages

1. Go to [Cloudflare Pages](https://pages.cloudflare.com)
2. Connect your Git repository
3. Configure:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variables: None needed

### Option 5: Static File Hosting (Any Server)

After running `npm run build`, upload the entire `dist` folder to any static file hosting:

- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- Firebase Hosting
- Surge.sh
- Render

**Important:** Configure your server to:
- Serve `index.html` for all routes (SPA routing)
- The `_redirects` file is included for Netlify
- The `vercel.json` file is included for Vercel

## Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Type check
npm run typecheck

# Lint code
npm run lint
```

## Environment Setup

This is a UI-only application with mock data. No environment variables are required for deployment.

If you want to add real backend integration later:
1. Create `.env` file with your API endpoints
2. Update the mock data service to call real APIs
3. Redeploy

## Post-Deployment Checklist

After deploying, verify:
- [ ] Home page loads correctly
- [ ] Dashboard shows mock data
- [ ] Navigation works (Dashboard, Pages)
- [ ] Can create new captures
- [ ] Can view capture details
- [ ] Dark mode toggle works
- [ ] Responsive design on mobile
- [ ] All modals open/close properly
- [ ] Status dropdown works

## Troubleshooting

**Blank page after deployment:**
- Check browser console for errors
- Verify base path in `vite.config.ts` matches deployment URL
- Ensure routing redirects are configured

**404 on page refresh:**
- Configure server to serve `index.html` for all routes
- Check `_redirects` or `vercel.json` is included

**Assets not loading:**
- Verify `dist/assets` folder is deployed
- Check asset paths in deployed `index.html`

## Performance Optimization

The build is already optimized with:
- Code splitting
- Tree shaking
- CSS minification
- Lazy-loaded routes
- Gzip compression ready

## Monitoring

After deployment, monitor:
- Page load times
- JavaScript errors (use Sentry or similar)
- User interactions
- Mobile performance

## Support

For deployment issues:
1. Check build logs
2. Verify all files are uploaded
3. Test locally with `npm run preview`
4. Check hosting platform documentation

## Next Steps

After successful deployment:
1. Share your deployment URL
2. Test on multiple devices
3. Gather user feedback
4. Consider adding analytics (Google Analytics, Plausible, etc.)
5. Plan backend integration if needed
