# ComicGenius Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy with Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

4. **Set Environment Variables**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project
   - Go to Settings > Environment Variables
   - Add `NEXT_PUBLIC_GEMINI_API_KEY` with your Gemini API key

### Option 2: Deploy with GitHub Integration

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project

3. **Configure Environment Variables**:
   - Add `NEXT_PUBLIC_GEMINI_API_KEY` in project settings
   - Deploy!

## Environment Variables

Create a `.env.local` file for local development:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Getting Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add it to your Vercel environment variables

## Build and Test Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Troubleshooting

### Common Issues

1. **Build Errors**:
   - Check that all environment variables are set
   - Ensure TypeScript types are correct
   - Run `npm run lint` to check for errors

2. **API Errors**:
   - Verify your Gemini API key is correct
   - Check API rate limits
   - Ensure the API key has proper permissions

3. **Deployment Issues**:
   - Check Vercel build logs
   - Verify environment variables are set
   - Ensure all dependencies are in package.json

### Performance Optimization

- Images are automatically optimized by Next.js
- Static assets are served from Vercel's CDN
- API routes have a 30-second timeout limit
- Consider implementing caching for better performance

## Custom Domain

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS settings as instructed
5. SSL certificate will be automatically provisioned

## Monitoring

- Vercel provides built-in analytics
- Check function logs in the Vercel dashboard
- Monitor API usage and performance
- Set up alerts for errors

## Security

- Environment variables are encrypted
- HTTPS is enabled by default
- Security headers are configured in vercel.json
- API routes are protected by CORS

## Scaling

- Vercel automatically scales based on traffic
- Edge functions run globally
- CDN provides fast content delivery
- Monitor usage in the Vercel dashboard
