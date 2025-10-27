@echo off
echo 🚀 Starting Pharmacy Management System...

REM Check if Maven is installed
mvn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Maven is not installed. Please install Maven first.
    pause
    exit /b 1
)

REM Check if pnpm is installed
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ pnpm is not installed. Please install pnpm first.
    pause
    exit /b 1
)

echo 📦 Starting backend server...
cd backend
start "Backend" cmd /k "mvn spring-boot:run"

echo 🎨 Starting frontend server...
cd ../frontend
start "Frontend" cmd /k "pnpm dev"

echo.
echo ✅ Pharmacy Management System is starting up!
echo.
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend API: http://localhost:8080
echo 🗄️  H2 Console: http://localhost:8080/h2-console
echo.
echo 📋 Login Credentials:
echo    Admin: admin@pharmacy.com / admin123
echo    Pharmacist: pharmacist@pharmacy.com / pharma123
echo    Cashier: cashier@pharmacy.com / cashier123
echo.
echo Press any key to exit this window...
pause >nul
