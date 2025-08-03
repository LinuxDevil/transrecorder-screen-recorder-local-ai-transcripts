#!/bin/bash

# Setup script for MeetingVideo-Transrecorder
# Downloads and configures Python runtime and FFmpeg for macOS and Windows

set -e  # Exit on any error

echo "🚀 Setting up MeetingVideo-Transrecorder binaries..."
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

PLATFORM="unknown"
case "$OSTYPE" in
  darwin*)  PLATFORM="macos" ;;
  linux*)   PLATFORM="linux" ;;
  msys*)    PLATFORM="windows" ;;
  cygwin*)  PLATFORM="windows" ;;
  *)        PLATFORM="unknown" ;;
esac

print_status "Detected platform: $PLATFORM"

setup_macos() {
    print_status "Setting up macOS binaries..."
    
    if [ ! -d "python-runtime" ]; then
        print_status "Creating Python virtual environment for macOS..."
        python3 -m venv python-runtime
        source python-runtime/bin/activate
        pip install --upgrade pip
        pip install -r requirements.txt
        deactivate
        print_success "macOS Python runtime created and dependencies installed"
    else
        print_warning "macOS Python runtime already exists, skipping..."
    fi
    
    if [ ! -d "ffmpeg-bin" ]; then
        print_status "Downloading FFmpeg for macOS..."
        mkdir -p ffmpeg-bin
        curl -L -o ffmpeg-bin/ffmpeg-macos.zip "https://evermeet.cx/ffmpeg/getrelease/zip"
        cd ffmpeg-bin
        unzip -o ffmpeg-macos.zip
        rm ffmpeg-macos.zip
        cd ..
        print_success "macOS FFmpeg downloaded and extracted"
    else
        print_warning "macOS FFmpeg already exists, skipping..."
    fi
}

setup_windows() {
    print_status "Setting up Windows binaries..."
    
    if [ ! -d "python-runtime-windows" ]; then
        print_status "Downloading Python embeddable for Windows..."
        mkdir -p python-runtime-windows
        
        PYTHON_VERSION="3.11.9"
        curl -L -o python-windows.zip "https://www.python.org/ftp/python/${PYTHON_VERSION}/python-${PYTHON_VERSION}-embed-amd64.zip"
        cd python-runtime-windows
        unzip -o ../python-windows.zip
        cd ..
        rm python-windows.zip
        
        curl -L -o python-runtime-windows/get-pip.py "https://bootstrap.pypa.io/get-pip.py"
        
        echo "python311.zip" > python-runtime-windows/python._pth
        echo "." >> python-runtime-windows/python._pth
        echo "Lib/site-packages" >> python-runtime-windows/python._pth
        echo "import site" >> python-runtime-windows/python._pth
        
        print_success "Windows Python runtime downloaded"
        print_warning "Note: You'll need to install pip and dependencies manually on Windows:"
        print_warning "  cd python-runtime-windows && python get-pip.py"
        print_warning "  Scripts/pip install -r ../requirements.txt"
    else
        print_warning "Windows Python runtime already exists, skipping..."
    fi
    
    if [ ! -d "ffmpeg-bin-windows" ]; then
        print_status "Downloading FFmpeg for Windows..."
        mkdir -p ffmpeg-bin-windows
        curl -L -o ffmpeg-win.zip "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip"
        unzip -o ffmpeg-win.zip
        mv ffmpeg-master-latest-win64-gpl/bin/ffmpeg.exe ffmpeg-bin-windows/
        rm -rf ffmpeg-master-latest-win64-gpl ffmpeg-win.zip
        print_success "Windows FFmpeg downloaded"
    else
        print_warning "Windows FFmpeg already exists, skipping..."
    fi
}

setup_linux() {
    print_status "Setting up Linux binaries..."
    
    if [ ! -d "python-runtime" ]; then
        print_status "Creating Python virtual environment for Linux..."
        python3 -m venv python-runtime
        source python-runtime/bin/activate
        pip install --upgrade pip
        pip install -r requirements.txt
        deactivate
        print_success "Linux Python runtime created and dependencies installed"
    else
        print_warning "Linux Python runtime already exists, skipping..."
    fi
    
    if [ ! -d "ffmpeg-bin" ]; then
        print_status "Downloading static FFmpeg for Linux..."
        mkdir -p ffmpeg-bin
        curl -L -o ffmpeg-bin/ffmpeg "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz"
        cd ffmpeg-bin
        tar -xf ffmpeg-release-amd64-static.tar.xz --strip-components=1
        rm ffmpeg-release-amd64-static.tar.xz
        chmod +x ffmpeg
        cd ..
        print_success "Linux FFmpeg downloaded"
    else
        print_warning "Linux FFmpeg already exists, skipping..."
    fi
}

if [ "$1" = "all" ]; then
    print_status "Setting up binaries for all platforms..."
    setup_macos
    setup_windows
elif [ "$1" = "windows" ]; then
    setup_windows
elif [ "$1" = "macos" ]; then
    setup_macos
elif [ "$1" = "linux" ]; then
    setup_linux
else
    case $PLATFORM in
        "macos")
            setup_macos
            ;;
        "linux")
            setup_linux
            ;;
        "windows")
            setup_windows
            ;;
        *)
            print_error "Unknown platform: $PLATFORM"
            print_status "Usage: $0 [all|macos|windows|linux]"
            print_status "  all     - Setup binaries for all platforms"
            print_status "  macos   - Setup binaries for macOS only"
            print_status "  windows - Setup binaries for Windows only"
            print_status "  linux   - Setup binaries for Linux only"
            print_status "  (no arg) - Setup binaries for current platform"
            exit 1
            ;;
    esac
fi

echo ""
print_success "🎉 Setup complete!"
echo ""
print_status "Next steps:"
echo "  1. Build your app: npm run build:mac (or build:win)"
echo "  2. Test the bundled binaries in the packaged app"
echo ""
print_status "Directory structure:"
ls -la | grep -E "(python-runtime|ffmpeg-bin)" || echo "  (No binary directories found - run setup first)"
echo ""
