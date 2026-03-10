@echo off
echo ========================================
echo VERRA Git Repository Setup Script
echo ========================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed!
    echo.
    echo Please install Git first:
    echo 1. Go to: https://git-scm.com/download/win
    echo 2. Download and install Git for Windows
    echo 3. Restart this script after installation
    echo.
    pause
    exit /b 1
)

echo ✅ Git is installed!
echo.

REM Initialize Git repository
echo 📁 Initializing Git repository...
git init
if %errorlevel% neq 0 (
    echo ❌ Failed to initialize Git repository
    pause
    exit /b 1
)

echo ✅ Git repository initialized!
echo.

REM Add all files
echo 📦 Adding all files to Git...
git add .
if %errorlevel% neq 0 (
    echo ❌ Failed to add files to Git
    pause
    exit /b 1
)

echo ✅ Files added to Git!
echo.

REM Create initial commit
echo 💾 Creating initial commit...
git commit -m "Initial commit: VERRA Luxury E-Commerce Platform

- Complete MERN stack luxury e-commerce platform
- Frontend: React with Tailwind CSS, dark luxury theme  
- Backend: Node.js/Express with MongoDB Atlas
- Features: User/Vendor/Admin roles, Razorpay payments
- Authentication: JWT with role-based access
- UI: Responsive design with smooth animations
- Testing: Comprehensive test suite with property-based testing
- Deployment: Ready for Vercel (frontend) and Railway (backend)
- Documentation: Complete API docs and deployment guides"

if %errorlevel% neq 0 (
    echo ❌ Failed to create initial commit
    pause
    exit /b 1
)

echo ✅ Initial commit created!
echo.

echo ========================================
echo 🎉 Git Repository Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Create GitHub repository at: https://github.com/new
echo 2. Repository name: verra-luxury-ecommerce
echo 3. Description: VERRA - Luxury E-Commerce Platform ^| MERN Stack
echo 4. Make it Public (recommended for portfolio)
echo 5. Don't initialize with README, .gitignore, or license
echo.
echo Then run these commands (replace YOUR_USERNAME):
echo git remote add origin https://github.com/YOUR_USERNAME/verra-luxury-ecommerce.git
echo git branch -M main
echo git push -u origin main
echo.
echo After pushing to GitHub:
echo - Deploy frontend to Vercel: https://vercel.com
echo - Import your GitHub repository
echo - Set root directory to 'frontend'
echo - Add environment variables from frontend/.env.example
echo.
echo 📖 For detailed instructions, see: GIT_SETUP_AND_DEPLOYMENT_GUIDE.md
echo.
pause