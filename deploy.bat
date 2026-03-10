@echo off
echo.
echo 🚀 VERRA Luxury E-Commerce - Deployment Script
echo ==============================================
echo.

echo 📋 Pre-deployment checklist:
echo 1. ✅ MongoDB Atlas cluster is ready
echo 2. ✅ Razorpay account is configured  
echo 3. ✅ Gmail App Password is set up
echo 4. ✅ GitHub repository is ready
echo.

echo 🔧 Building frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
)
echo ✅ Frontend built successfully
echo.

echo 📦 Preparing backend...
cd ..\backend
call npm install --production
if %errorlevel% neq 0 (
    echo ❌ Backend dependency installation failed
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed
echo.

echo 🚀 Deployment Instructions:
echo.
echo STEP 1: Deploy Backend to Railway
echo 1. Go to https://railway.app
echo 2. Sign up with GitHub
echo 3. Create New Project → Deploy from GitHub repo
echo 4. Select your repository and 'backend' folder
echo 5. Add environment variables from backend\.env.production
echo.

echo STEP 2: Deploy Frontend to Vercel
echo 1. Go to https://vercel.com
echo 2. Sign up with GitHub
echo 3. Import Project → Select your repository
echo 4. Set Root Directory to 'frontend'
echo 5. Add environment variables from frontend\.env.production
echo.

echo STEP 3: Update Environment Variables
echo 1. Update CLIENT_URL in Railway with your Vercel URL
echo 2. Update REACT_APP_API_URL in Vercel with your Railway URL
echo.

echo 🎉 Your VERRA platform will be live after following these steps!
echo.
echo 📞 Support:
echo Email: nikhily2115@gmail.com
echo Phone: +91 7021551912
echo.
echo Happy selling with VERRA! 🛍️✨
echo.
pause