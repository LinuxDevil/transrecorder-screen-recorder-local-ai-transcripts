@echo off
REM Release script for Meeting Video Transrecorder (Windows)
REM Usage: scripts\release.bat <version>
REM Example: scripts\release.bat 1.0.1

if "%1"=="" (
    echo Usage: %0 ^<version^>
    echo Example: %0 1.0.1
    exit /b 1
)

set VERSION=%1

echo 🚀 Creating release for version %VERSION%

REM Check if we're on main/master branch
for /f "tokens=*" %%i in ('git branch --show-current') do set BRANCH=%%i
if not "%BRANCH%"=="main" if not "%BRANCH%"=="master" (
    echo ❌ Error: You must be on main or master branch to create a release
    exit /b 1
)

REM Check if working directory is clean
git status --porcelain >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Working directory is not clean. Please commit or stash changes.
    exit /b 1
)

REM Create and push tag
echo 📝 Creating tag v%VERSION%...
git tag "v%VERSION%"
git push origin "v%VERSION%"

echo ✅ Tag v%VERSION% created and pushed!
echo.
echo 🎉 The GitHub Actions workflow will now:
echo    1. Build Windows and macOS versions
echo    2. Create a GitHub release
echo    3. Upload all artifacts to the release
echo.
echo 📋 You can monitor the progress at:
echo    https://github.com/LinuxDevil/MeetingVideo-Transrecorder/actions
echo.
echo 📦 Once complete, users can download from:
echo    https://github.com/LinuxDevil/MeetingVideo-Transrecorder/releases
