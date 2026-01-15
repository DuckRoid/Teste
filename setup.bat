@echo off
echo ChatApp - Setup Script
echo ==========================
echo.

REM Check Node.js installation
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed. Please install Node.js v18 or higher.
    exit /b 1
)

echo Node.js detected
echo.

REM Setup Server
echo Setting up server...
cd server
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo Warning: Please edit server\.env with your configuration
)

echo Installing server dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install server dependencies
    exit /b 1
)
echo Server dependencies installed
echo.

REM Setup Client
echo Setting up client...
cd ..\client
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
)

echo Installing client dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install client dependencies
    exit /b 1
)
echo Client dependencies installed
echo.

cd ..

echo Setup complete!
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Edit server\.env with your JWT_SECRET and MongoDB URI
echo 3. Start the server: cd server ^&^& npm run dev
echo 4. In a new terminal, start the client: cd client ^&^& npm run dev
echo 5. Open http://localhost:5173 in your browser
echo.
echo Or use Docker Compose:
echo   docker-compose up
echo.
echo Happy chatting!
pause
