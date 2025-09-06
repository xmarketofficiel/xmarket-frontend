# XMarket Frontend Deployment Guide

## 🚀 Production Deployment on Vercel

### Prerequisites
✅ **Completed Pre-deployment Cleanup**
✅ **Environment Variables Configured**
✅ **Backend API Deployed and Accessible**
✅ **GitHub Repository Clean and Updated**

---

## 🔧 Step 1: Verify Clean Deployment State

### Check Git Status
```bash
cd /home/ghost/Desktop/Agora_FullProject/xmarket
git status
```

**Expected Result**: Clean working tree, no uncommitted changes

### Verify Environment Files
```bash
# Check that sensitive files are not tracked
ls -la .env*

# Should show:
# .env.example ✅ (safe to commit)
# .env.production ✅ (safe to commit) 
# .env.local ❌ (should NOT be committed)
```

### Run Production Build Test
```bash
npm run build
```

**Expected Result**: Build completes without errors

---

## 🌐 Step 2: Deploy to Vercel

### Method A: Vercel CLI (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
# Preview deployment
npm run deploy:preview

# Production deployment
npm run deploy:vercel
```

### Method B: GitHub Integration

1. **Push to GitHub**
```bash
git add .
git commit -m "Production deployment ready"
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `xmarket` folder as the root directory

---

## ⚙️ Step 3: Configure Vercel Environment Variables

### Required Environment Variables in Vercel Dashboard:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.vercel.app
NEXT_PUBLIC_UPLOAD_URL=https://your-backend-api.vercel.app/uploads

# Application Settings
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_APP_NAME=XMarket
NEXT_PUBLIC_APP_SHORT_NAME=XMarket
NEXT_PUBLIC_APP_DESCRIPTION=UM6P Campus Marketplace

# Build Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Domain (Optional)
NEXT_PUBLIC_DOMAIN=your-domain.com
```

### How to Add Environment Variables:
1. Go to Vercel Dashboard → Your Project → Settings
2. Click "Environment Variables"
3. Add each variable for "Production" environment
4. Redeploy if needed

---

## 🔧 Step 4: Update Backend Domain References

### Update API Endpoints
Replace placeholder domains in your deployment:

```bash
# Update these in Vercel environment variables:
NEXT_PUBLIC_API_BASE_URL=https://your-actual-backend.vercel.app
NEXT_PUBLIC_UPLOAD_URL=https://your-actual-backend.vercel.app/uploads
```

### Update next.config.js Image Domains
After deployment, update the image configuration:

1. Open `next.config.js`
2. Replace `your-backend-api.vercel.app` with your actual backend domain
3. Commit and redeploy

---

## 🛡️ Step 5: Security and Performance Verification

### Security Checklist
- ✅ No `.env.local` files committed
- ✅ Security headers configured in `next.config.js`
- ✅ No API keys exposed in client code
- ✅ HTTPS enforced
- ✅ CSP headers for images

### Performance Checklist
- ✅ Bundle analysis run (`npm run build:analyze`)
- ✅ Images optimized (WebP/AVIF)
- ✅ Code splitting enabled
- ✅ Console logs removed in production

### Test Deployment
```bash
# Test production build locally
npm run build
npm run start

# Visit http://localhost:3000 and verify:
# - App loads correctly
# - API calls work (check network tab)
# - No console errors
# - All features functional
```

---

## 📋 Step 6: Post-Deployment Verification

### Domain Setup (Optional)
1. **Custom Domain**: Add your domain in Vercel Dashboard
2. **SSL Certificate**: Automatic via Vercel
3. **DNS Configuration**: Point your domain to Vercel

### Performance Monitoring
1. **Vercel Analytics**: Enabled by default
2. **Core Web Vitals**: Monitor in Vercel Dashboard
3. **Error Tracking**: Set up Sentry (optional)

### Functionality Testing
Test all critical features on production:
- ✅ User authentication
- ✅ Item browsing and search
- ✅ Image uploads
- ✅ Favorites functionality
- ✅ Responsive design
- ✅ PWA features (if enabled)

---

## 🔄 Step 7: CI/CD Setup (Optional)

### Automatic Deployments
Your Vercel deployment will automatically update when you push to:
- `main` branch → Production deployment
- Other branches → Preview deployments

### GitHub Actions (Optional)
Create `.github/workflows/ci.yml` for automated testing:

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run type-check
      - run: npm run build
      - run: npm run test
```

---

## 🚨 Troubleshooting Common Issues

### Build Failures
```bash
# Clear cache and retry
npm run clean
npm install
npm run build
```

### Environment Variable Issues
- Ensure all variables start with `NEXT_PUBLIC_` for client-side access
- Check Vercel Dashboard → Settings → Environment Variables
- Redeploy after adding variables

### API Connection Issues
- Verify backend is deployed and accessible
- Check CORS settings on backend
- Verify API URLs in environment variables

### Image Loading Issues
- Check `next.config.js` image domains
- Verify backend serves images with correct headers
- Test image URLs directly in browser

---

## 📞 Emergency Procedures

### Rollback Deployment
```bash
# Via Vercel CLI
vercel rollback

# Via Dashboard
# Go to Deployments → Select previous version → Promote
```

### Quick Hotfix
```bash
# Make fixes
git add .
git commit -m "hotfix: critical issue"
git push origin main
# Vercel auto-deploys
```

---

## ✅ Deployment Checklist

- [ ] Clean git status
- [ ] Production build successful
- [ ] Environment variables configured
- [ ] Backend API accessible
- [ ] Vercel project created
- [ ] Domain configured (if custom)
- [ ] All features tested
- [ ] Performance verified
- [ ] Security checks passed
- [ ] Monitoring set up

---

## 📊 Success Metrics

Your deployment is successful when:
- ✅ **Build Time**: < 2 minutes
- ✅ **Load Time**: < 3 seconds
- ✅ **Core Web Vitals**: All green
- ✅ **Functionality**: 100% features working
- ✅ **Security**: A+ rating on security headers
- ✅ **Mobile**: Responsive on all devices

---

## 🎯 Next Steps After Deployment

1. **Monitor Performance**: Check Vercel Analytics
2. **Set Up Alerts**: Configure error notifications
3. **User Testing**: Get feedback from UM6P students
4. **Continuous Improvement**: Plan feature updates
5. **Documentation**: Update user guides

**🚀 Your XMarket frontend is now live and ready for the UM6P community!**
