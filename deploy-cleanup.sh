#!/bin/bash

# XMarket Frontend Deployment Cleanup Script
# This script ensures your frontend is production-ready and secure

set -e  # Exit on any error

echo "🔧 XMarket Frontend Deployment Cleanup"
echo "========================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "next.config.js" ]; then
    print_error "This script must be run from the xmarket frontend root directory"
    exit 1
fi

print_status "Starting deployment cleanup..."

# 1. Clean build artifacts and cache
print_status "Cleaning build artifacts and cache..."
rm -rf .next out dist node_modules/.cache .vercel
print_success "Build artifacts cleaned"

# 2. Check for sensitive files
print_status "Checking for sensitive files..."

SENSITIVE_FILES=(
    ".env.local"
    ".env.development.local"
    ".env.production.local"
    "*.pem"
    "*.key"
    "config/secrets.json"
    "credentials.json"
)

for pattern in "${SENSITIVE_FILES[@]}"; do
    if ls $pattern 1> /dev/null 2>&1; then
        print_warning "Found sensitive file: $pattern"
        echo "  This file should be in .gitignore and not committed"
    fi
done

# 3. Verify .gitignore includes sensitive patterns
print_status "Verifying .gitignore security..."

REQUIRED_GITIGNORE_PATTERNS=(
    ".env.local"
    "*.pem"
    ".vercel"
    "node_modules"
)

for pattern in "${REQUIRED_GITIGNORE_PATTERNS[@]}"; do
    if ! grep -q "$pattern" .gitignore; then
        print_warning ".gitignore missing pattern: $pattern"
    fi
done

# 4. Check environment variable configuration
print_status "Checking environment configuration..."

if [ -f ".env.example" ]; then
    print_success "Environment example file exists"
else
    print_warning "Missing .env.example file"
fi

if [ -f ".env.production" ]; then
    print_success "Production environment file exists"
else
    print_warning "Missing .env.production file"
fi

# 5. Validate package.json
print_status "Validating package.json..."

if npm run type-check > /dev/null 2>&1; then
    print_success "TypeScript validation passed"
else
    print_error "TypeScript validation failed"
    exit 1
fi

# 6. Run production build test
print_status "Testing production build..."

if npm run build > /dev/null 2>&1; then
    print_success "Production build successful"
else
    print_error "Production build failed"
    exit 1
fi

# 7. Check for console.log statements (should be removed in production)
print_status "Checking for debug statements..."

CONSOLE_LOGS=$(find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | grep -v .next | xargs grep -l "console.log" || true)

if [ -n "$CONSOLE_LOGS" ]; then
    print_warning "Found console.log statements in:"
    echo "$CONSOLE_LOGS" | sed 's/^/  /'
    echo "  Consider removing these for production"
fi

# 8. Verify API endpoints don't use hardcoded localhost
print_status "Checking for hardcoded localhost URLs..."

LOCALHOST_REFS=$(find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | grep -v .next | xargs grep -l "localhost" | grep -v ".env" || true)

if [ -n "$LOCALHOST_REFS" ]; then
    print_warning "Found hardcoded localhost references in:"
    echo "$LOCALHOST_REFS" | sed 's/^/  /'
    echo "  Ensure these use environment variables"
fi

# 9. Check bundle size
print_status "Analyzing bundle size..."

if command -v du &> /dev/null; then
    BUILD_SIZE=$(du -sh .next 2>/dev/null | cut -f1 || echo "Unknown")
    print_success "Build size: $BUILD_SIZE"
fi

# 10. Verify security headers in next.config.js
print_status "Checking security configuration..."

SECURITY_HEADERS=(
    "X-Frame-Options"
    "X-Content-Type-Options"
    "X-XSS-Protection"
)

for header in "${SECURITY_HEADERS[@]}"; do
    if grep -q "$header" next.config.js; then
        print_success "Security header configured: $header"
    else
        print_warning "Missing security header: $header"
    fi
done

# 11. Git status check
print_status "Checking git status..."

if git status --porcelain | grep -q .; then
    print_warning "You have uncommitted changes:"
    git status --short
    echo "  Consider committing or stashing these changes"
else
    print_success "Git working tree is clean"
fi

# 12. Final checklist
echo ""
echo "🔍 DEPLOYMENT READINESS CHECKLIST"
echo "=================================="

# Check each requirement
checks_passed=0
total_checks=8

echo -n "✓ Build artifacts cleaned: "
if [ ! -d ".next" ]; then
    echo -e "${GREEN}PASS${NC}"
    ((checks_passed++))
else
    echo -e "${RED}FAIL${NC}"
fi

echo -n "✓ Production build works: "
if [ -f ".next/BUILD_ID" ]; then
    echo -e "${GREEN}PASS${NC}"
    ((checks_passed++))
else
    echo -e "${RED}FAIL${NC}"
fi

echo -n "✓ Environment files configured: "
if [ -f ".env.example" ] && [ -f ".env.production" ]; then
    echo -e "${GREEN}PASS${NC}"
    ((checks_passed++))
else
    echo -e "${RED}FAIL${NC}"
fi

echo -n "✓ TypeScript validation: "
if npm run type-check > /dev/null 2>&1; then
    echo -e "${GREEN}PASS${NC}"
    ((checks_passed++))
else
    echo -e "${RED}FAIL${NC}"
fi

echo -n "✓ No sensitive files tracked: "
if ! git ls-files | grep -q ".env.local"; then
    echo -e "${GREEN}PASS${NC}"
    ((checks_passed++))
else
    echo -e "${RED}FAIL${NC}"
fi

echo -n "✓ Security headers configured: "
if grep -q "X-Frame-Options" next.config.js; then
    echo -e "${GREEN}PASS${NC}"
    ((checks_passed++))
else
    echo -e "${RED}FAIL${NC}"
fi

echo -n "✓ Package.json has deployment scripts: "
if grep -q "deploy:vercel" package.json; then
    echo -e "${GREEN}PASS${NC}"
    ((checks_passed++))
else
    echo -e "${RED}FAIL${NC}"
fi

echo -n "✓ Vercel configuration exists: "
if [ -f "vercel.json" ]; then
    echo -e "${GREEN}PASS${NC}"
    ((checks_passed++))
else
    echo -e "${RED}FAIL${NC}"
fi

echo ""
echo "📊 RESULTS: $checks_passed/$total_checks checks passed"

if [ $checks_passed -eq $total_checks ]; then
    print_success "🚀 Frontend is ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Commit any final changes: git add . && git commit -m 'Production ready'"
    echo "2. Push to repository: git push origin main"
    echo "3. Deploy to Vercel: npm run deploy:vercel"
    echo "4. Configure environment variables in Vercel dashboard"
    echo "5. Test deployment thoroughly"
    echo ""
    echo "📖 See VERCEL_DEPLOYMENT_GUIDE.md for detailed instructions"
else
    print_error "❌ Frontend needs attention before deployment"
    echo ""
    echo "Please fix the failed checks above before deploying."
    exit 1
fi

echo ""
print_success "Cleanup script completed successfully!"
