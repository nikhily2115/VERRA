#!/bin/bash

echo "🚀 VERRA Luxury E-Commerce - Deployment Script"
echo "=============================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Pre-deployment checklist:${NC}"
echo "1. ✅ MongoDB Atlas cluster is ready"
echo "2. ✅ Razorpay account is configured"
echo "3. ✅ Gmail App Password is set up"
echo "4. ✅ GitHub repository is ready"
echo ""

echo -e "${YELLOW}🔧 Building frontend...${NC}"
cd frontend
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend built successfully${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}📦 Preparing backend...${NC}"
cd ../backend
npm install --production
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Backend dependency installation failed${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🚀 Deployment Instructions:${NC}"
echo ""
echo -e "${YELLOW}STEP 1: Deploy Backend to Railway${NC}"
echo "1. Go to https://railway.app"
echo "2. Sign up with GitHub"
echo "3. Create New Project → Deploy from GitHub repo"
echo "4. Select your repository and 'backend' folder"
echo "5. Add environment variables from backend/.env.production"
echo ""

echo -e "${YELLOW}STEP 2: Deploy Frontend to Vercel${NC}"
echo "1. Go to https://vercel.com"
echo "2. Sign up with GitHub"
echo "3. Import Project → Select your repository"
echo "4. Set Root Directory to 'frontend'"
echo "5. Add environment variables from frontend/.env.production"
echo ""

echo -e "${YELLOW}STEP 3: Update Environment Variables${NC}"
echo "1. Update CLIENT_URL in Railway with your Vercel URL"
echo "2. Update REACT_APP_API_URL in Vercel with your Railway URL"
echo ""

echo -e "${GREEN}🎉 Your VERRA platform will be live after following these steps!${NC}"
echo ""
echo -e "${BLUE}📞 Support:${NC}"
echo "Email: nikhily2115@gmail.com"
echo "Phone: +91 7021551912"
echo ""
echo -e "${GREEN}Happy selling with VERRA! 🛍️✨${NC}"