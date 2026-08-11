@echo off
title Nholyn Grace — nholyngrace.com
echo.
echo  ==========================================
echo   Nholyn Grace — nholyngrace.com
echo  ==========================================
echo.
echo  Starting server (port 4000) and site (port 5173)...
echo  Your browser will open automatically. Keep these windows open.
echo  Press Ctrl+C in either window to stop.
echo.

cd /d "%~dp0"

start "Nholyn Portfolio - Server" cmd /k "cd /d ""%~dp0server"" && npm start"
timeout /t 2 /nobreak >nul
start "Nholyn Portfolio - Site" cmd /k "cd /d ""%~dp0client"" && npm run dev"
timeout /t 6 /nobreak >nul

start "" http://localhost:5173
exit
