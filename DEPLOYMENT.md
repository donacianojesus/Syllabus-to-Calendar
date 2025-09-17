# 🚀 Deployment Guide for LawBandit Calendar

## Quick Deploy to Vercel (Full-Stack)

### Prerequisites
- GitHub repository with your code
- Vercel account (free)
- OpenAI API key (optional, for LLM parsing)

## Single-Step Deployment: Everything on Vercel

**YES! You can deploy both frontend and backend on Vercel!** This is the recommended approach.

### Step 1: Deploy to Vercel

1. **Connect Vercel to GitHub:**
   - Go to [Vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Import your repository

2. **Configure Environment Variables:**
   - Add these environment variables in Vercel dashboard:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     ENABLE_LLM_PARSING=true
     LLM_MODEL=gpt-4o-mini
     LLM_MAX_TOKENS=10000
     LLM_TEMPERATURE=0.1
     ```

3. **Deploy:**
   - Vercel will automatically detect the configuration
   - Frontend builds from `src/frontend`
   - API functions deploy from `api/` directory
   - Your app will be live at `https://your-app.vercel.app`

### Step 2: Test Your Deployment

1. **Visit your Vercel URL**
2. **Upload a test syllabus** (PDF file)
3. **Verify calendar display** works correctly
4. **Test with different syllabus formats**

## How It Works

### Vercel Configuration
- **Frontend**: Static build from `src/frontend` (React + Vite)
- **Backend**: Serverless functions in `api/` directory
- **Routing**: `vercel.json` handles API routes and frontend routing
- **Environment**: All environment variables managed in Vercel dashboard

### API Endpoints Available
- `POST /api/upload` - Upload and parse syllabus files
- `GET /api/upload/info` - Get upload requirements
- `POST /api/parse/llm` - Direct LLM parsing
- `POST /api/parse/compare` - Compare LLM vs regex parsing
- `GET /api/parse/status` - Get parsing service status
- `GET /api/health` - Health check
- `GET /api` - API information

## Environment Variables

### Required (Vercel Environment Variables)
```
OPENAI_API_KEY=your_openai_api_key_here
```

### Optional (Vercel Environment Variables)
```
ENABLE_LLM_PARSING=true
LLM_MODEL=gpt-4o-mini
LLM_MAX_TOKENS=10000
LLM_TEMPERATURE=0.1
```

## Alternative: Separate Backend Hosting

If you prefer to keep the backend separate, you can still use:

### Option A: Render.com
1. Create new Web Service
2. Connect GitHub repository
3. Set root directory: `src/backend`
4. Build command: `npm install && npm run build`
5. Start command: `npm start`
6. Add environment variables

### Option B: Railway
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project from GitHub repo
4. Select `src/backend` as root directory
5. Add environment variables

### Option C: Heroku
1. Create new Heroku app
2. Connect GitHub repository
3. Set buildpack: Node.js
4. Set root directory: `src/backend`
5. Add environment variables

Then update `vercel.json` to route API calls to your external backend:
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-backend-url.com/api/$1"
    }
  ],
  "env": {
    "VITE_API_URL": "https://your-backend-url.com"
  }
}
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
