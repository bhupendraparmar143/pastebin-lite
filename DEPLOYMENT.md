# Deployment Guide for Pastebin-Lite

## Environment Variables Required

### Backend (Render) Environment Variables:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=your-mongodb-atlas-connection-string
TEST_MODE=0
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Frontend (Vercel) Environment Variables:
```
VITE_API_URL=https://your-render-app.onrender.com/api
VITE_TEST_MODE=0
```

## Deployment Steps

### 1. Backend Deployment (Render)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Connect your GitHub repository
3. Create a new Web Service
4. Configure the following:
   - **Name**: pastebin-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `server`
5. Add environment variables (see above)
6. Deploy

### 2. Frontend Deployment (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your GitHub repository
3. Configure the following:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variables (see above)
5. Deploy

### 3. Update CORS Configuration

After both deployments, update the `FRONTEND_URL` in Render with your actual Vercel app URL.

## Common Issues & Solutions

### Issue: Frontend can't connect to backend
**Solution**: Ensure `VITE_API_URL` in Vercel environment variables points to your Render backend URL.

### Issue: CORS errors
**Solution**: Make sure the `FRONTEND_URL` in Render environment variables matches your Vercel app URL exactly.

### Issue: React Router not working on Vercel
**Solution**: The `vercel.json` configuration handles SPA routing properly.

### Issue: Server not starting on Render
**Solution**: Ensure the server listens on `process.env.PORT` (configured in server.js).

## Testing Deployments

1. Test frontend loads: https://your-vercel-app.vercel.app
2. Test API connectivity: Check browser network tab for API calls
3. Test paste creation and viewing functionality
4. Test expiration and view limit features
