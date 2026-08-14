@echo off
cd /d "%~dp0"
title MovieHunt

echo.
echo ==============================
echo       Starting MovieHunt
echo ==============================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed.
  echo Install Node.js LTS from https://nodejs.org/ and run this file again.
  pause
  exit /b 1
)
if not exist node_modules (
  echo First run: installing project packages...
  call npm install
  if errorlevel 1 (
    echo.
    echo Installation failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
)
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:5173"
call npm run dev
pause
