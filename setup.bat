@echo off
echo Setting up Square World...

echo Installing frontend dependencies...
call npm install

echo Installing server dependencies...
cd server
call npm install
cd ..

echo Setup complete!
echo.
echo To start development:
echo   npm run dev
echo.
echo This will start both the React frontend (http://localhost:3000) and NestJS backend (http://localhost:3001)
pause
