# 🚀 Deployment Guide for LawBandit Calendar

## Quick Deploy to Vercel

### Prerequisites
- GitHub repository with your code
- Vercel account (free)
- Railway account (free) for backend hosting

## Step 1: Deploy Backend to Railway

1. **Connect Railway to GitHub:**
   - Go to [Railway.app](https://railway.app)
   - Sign up with GitHub
   - Create new project from GitHub repo

2. **Configure Backend:**
   - Select `src/backend` as root directory
   - Set build command: `npm install && npm run build`
   - Set start command: `npm start`
   - Add environment variables:
     ```
     PORT=3000
     OPENAI_API_KEY=your_openai_api_key
     ```

3. **Deploy:**
   - Railway will automatically deploy your backend
   - Note the generated URL (e.g., `https://your-app-name.railway.app`)

## Step 2: Deploy Frontend to Vercel

1. **Connect Vercel to GitHub:**
   - Go to [Vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Import your repository

2. **Configure Frontend:**
   - Set root directory: `src/frontend`
   - Add environment variable:
     ```
     VITE_API_URL=https://your-backend-url.railway.app
     ```
   - Replace with your actual Railway backend URL

3. **Deploy:**
   - Vercel will automatically build and deploy
   - Your app will be live at `https://your-app.vercel.app`

## Step 3: Test Your Deployment

1. **Visit your Vercel URL**
2. **Upload a test syllabus** (PDF file)
3. **Verify calendar display** works correctly
4. **Test with different syllabus formats**

## Alternative Backend Hosting

### Option A: Render.com
1. Create new Web Service
2. Connect GitHub repository
3. Set root directory: `src/backend`
4. Build command: `npm install && npm run build`
5. Start command: `npm start`
6. Add environment variables

### Option B: Heroku
1. Create new Heroku app
2. Connect GitHub repository
3. Set buildpack: Node.js
4. Set root directory: `src/backend`
5. Add environment variables

## Environment Variables

### Backend (.env)
```
PORT=3000
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production
```

### Frontend (Vercel Environment Variables)
```
VITE_API_URL=https://your-backend-url.railway.app
```

## Testing Different Syllabi

Once deployed, test with various syllabus formats:

1. **Law School Syllabi** - Different universities, different formats
2. **Different File Sizes** - Test upload limits
3. **Various Date Formats** - MM/DD/YYYY, Month DD, etc.
4. **Different Structures** - Weekly schedules, assignment lists, etc.

## Troubleshooting

### Common Issues:
1. **CORS Errors** - Ensure backend allows frontend domain
2. **API Timeout** - Large files may need longer timeout settings
3. **Environment Variables** - Double-check all required variables are set

### Debug Steps:
1. Check Railway/Render logs for backend issues
2. Check Vercel function logs for frontend issues
3. Use browser dev tools to inspect API calls
4. Test backend health endpoint directly

## Production Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed with correct API URL
- [ ] Environment variables configured
- [ ] Test upload with sample syllabus
- [ ] Verify calendar display works
- [ ] Test with different file formats
- [ ] Check mobile responsiveness
- [ ] Verify error handling works

## Performance Tips

1. **Optimize Images** - Use WebP format if adding images
2. **Enable Caching** - Vercel automatically caches static assets
3. **Monitor Usage** - Check Railway/Render usage limits
4. **Error Monitoring** - Consider adding Sentry for production monitoring

## Cost Estimation

### Free Tier Limits:
- **Vercel**: 100GB bandwidth/month, unlimited deployments
- **Railway**: $5/month after free credits
- **Render**: 750 hours/month free

### Recommended:
Start with free tiers, upgrade as needed based on usage.
