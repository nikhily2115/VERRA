@echo off
echo.
echo 🚀 VERRA VERCEL DEPLOYMENT
echo ========================
echo.

echo ✅ Frontend build completed successfully!
echo Bundle size: 126.35 kB (optimized)
echo.

echo 🌐 DEPLOY TO VERCEL - CHOOSE METHOD:
echo.
echo [1] Dashboard Method (Recommended for beginners)
echo [2] CLI Method (Advanced users)
echo.
set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" goto dashboard
if "%choice%"=="2" goto cli
echo Invalid choice. Please run the script again.
pause
exit /b 1

:dashboard
echo.
echo 📋 DASHBOARD DEPLOYMENT STEPS:
echo.
echo 1. Go to https://vercel.com
echo 2. Sign up with GitHub
echo 3. Click "New Project"
echo 4. Import your Git repository
echo 5. Configure:
echo    - Framework: Create React App
echo    - Root Directory: frontend
echo    - Build Command: npm run build
echo    - Output Directory: build
echo.
echo 6. Add Environment Variables:
echo    REACT_APP_API_URL=http://localhost:5000/api
echo    REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_key_here
echo.
echo 7. Click Deploy!
echo.
echo 🎉 Your site will be live at: https://your-project.vercel.app
echo.
goto end

:cli
echo.
echo 💻 CLI DEPLOYMENT:
echo.
echo Installing Vercel CLI...
call npm install -g vercel
if %errorlevel% neq 0 (
    echo ❌ Failed to install Vercel CLI
    pause
    exit /b 1
)

echo.
echo 🔐 Please login to Vercel...
call vercel login

echo.
echo 🚀 Deploying to Vercel...
cd frontend
call vercel --prod

if %errorlevel% equ 0 (
    echo.
    echo ✅ Deployment successful!
    echo 🎉 Your VERRA luxury e-commerce site is now live!
) else (
    echo.
    echo ❌ Deployment failed. Please check the error messages above.
)

:end
echo.
echo 📞 Need help?
echo Email: nikhily2115@gmail.com
echo Phone: +91 7021551912
echo.
echo 📖 Full guide: VERCEL_DEPLOYMENT_GUIDE.md
echo.
pause