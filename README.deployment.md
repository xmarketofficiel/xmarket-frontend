# XMarket Frontend - Production Deployment

> **UM6P Campus Marketplace Frontend** - Clean, Secure, and Production-Ready

## 🚀 Quick Deployment

```bash
# 1. Run cleanup and verification
./deploy-cleanup.sh

# 2. Deploy to Vercel
npm run deploy:vercel

# 3. Configure environment variables in Vercel dashboard
# 4. Test your deployment
```

## 📋 Pre-Deployment Checklist

- [ ] Backend API deployed and accessible
- [ ] Environment variables configured
- [ ] All tests passing
- [ ] No sensitive data in code
- [ ] Git repository clean

## 🔧 Environment Variables Required

### Production Environment (Vercel Dashboard)
```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend.vercel.app
NEXT_PUBLIC_UPLOAD_URL=https://your-backend.vercel.app/uploads
NEXT_PUBLIC_USE_MOCK=false
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## 🛡️ Security Features

- ✅ HTTP-only cookie authentication
- ✅ Security headers (XSS, CSRF, etc.)
- ✅ Content Security Policy
- ✅ No exposed API keys
- ✅ HTTPS enforcement
- ✅ Environment isolation

## 📁 Project Structure

```
xmarket/
├── app/                 # Next.js App Router
├── components/          # Reusable UI components
├── lib/                # API client and utilities
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── public/             # Static assets
├── types.ts            # TypeScript definitions
├── next.config.js      # Next.js configuration
├── vercel.json         # Vercel deployment config
└── deploy-cleanup.sh   # Deployment preparation script
```

## 🔄 Deployment Process

### Automatic (Recommended)
1. Push to `main` branch
2. Vercel auto-deploys
3. Monitor deployment in dashboard

### Manual
1. Run `./deploy-cleanup.sh`
2. Execute `npm run deploy:vercel`
3. Configure environment variables
4. Verify deployment

## 📊 Performance Optimizations

- ✅ Code splitting and lazy loading
- ✅ Image optimization (WebP, AVIF)
- ✅ Bundle analysis and optimization
- ✅ Static generation where possible
- ✅ Compression enabled
- ✅ CDN delivery via Vercel

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Build verification
npm run build

# Run tests
npm run test

# End-to-end tests
npm run e2e
```

## 📖 Documentation

- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [Environment Configuration](./.env.example) - Required environment variables
- [Security Configuration](./next.config.js) - Security headers and policies

## 🆘 Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   npm run clean
   npm install
   npm run build
   ```

2. **Environment Variables Not Working**
   - Check Vercel Dashboard → Settings → Environment Variables
   - Ensure variables start with `NEXT_PUBLIC_` for client-side
   - Redeploy after adding variables

3. **API Connection Issues**
   - Verify backend is deployed and accessible
   - Check CORS settings on backend
   - Test API endpoints directly

### Support

- Check [deployment logs](https://vercel.com/dashboard) in Vercel
- Review [Next.js documentation](https://nextjs.org/docs)
- Contact development team for backend issues

## 📈 Monitoring

- **Performance**: Vercel Analytics
- **Errors**: Built-in error tracking
- **Uptime**: Vercel monitoring
- **Core Web Vitals**: Automatic reporting

## 🔐 Security Considerations

- All sensitive data in environment variables
- No API keys in client code
- HTTPS enforced for all requests
- Secure cookie handling
- Content Security Policy configured
- XSS and CSRF protection enabled

---

**🎯 Ready for UM6P students to connect, buy, and sell safely!**
