#!/usr/bin/env python3
"""
Setup script for LoushRecorder audio extraction dependencies
"""

import subprocess
import sys
import os

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    return True

def check_ffmpeg():
    """Check if FFmpeg is installed"""
    try:
        result = subprocess.run(['ffmpeg', '-version'], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ FFmpeg is installed")
            return True
        else:
            print("❌ FFmpeg is not working properly")
            return False
    except FileNotFoundError:
        print("❌ FFmpeg is not installed")
        print("   Please install FFmpeg from: https://ffmpeg.org/download.html")
        return False

def install_python_dependencies():
    """Install Python dependencies"""
    try:
        print("📦 Installing Python dependencies...")
        result = subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'],
                              capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Python dependencies installed successfully")
            return True
        else:
            print(f"❌ Failed to install dependencies: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Error installing dependencies: {e}")
        return False

def test_whisper():
    """Test if Whisper is working"""
    try:
        import whisper
        print("✅ Whisper is available")
        return True
    except ImportError:
        print("❌ Whisper is not available")
        return False

def test_speech_recognition():
    """Test if SpeechRecognition is working"""
    try:
        import speech_recognition
        print("✅ SpeechRecognition is available")
        return True
    except ImportError:
        print("❌ SpeechRecognition is not available")
        return False

def main():
    """Main setup function"""
    print("🔧 Setting up LoushRecorder audio extraction...")
    print("=" * 50)

    if not check_python_version():
        sys.exit(1)

    if not check_ffmpeg():
        print("\n⚠️  FFmpeg is required for audio extraction")
        print("   Please install FFmpeg and run this script again")
        sys.exit(1)

    if not install_python_dependencies():
        print("\n⚠️  Failed to install Python dependencies")
        sys.exit(1)

    print("\n🧪 Testing dependencies...")
    whisper_ok = test_whisper()
    speech_ok = test_speech_recognition()

    if not whisper_ok and not speech_ok:
        print("\n❌ No speech-to-text libraries are available")
        print("   Please check the installation and try again")
        sys.exit(1)

    print("\n✅ Setup completed successfully!")
    print("\n📝 Next steps:")
    print("   1. Start your Electron app")
    print("   2. Record a video with audio")
    print("   3. Click 'Extract Transcript & Summary'")
    print("   4. Check the generated files in Desktop/captured-videos/")

    if not whisper_ok:
        print("\n⚠️  Note: Whisper is not available, will use Google Speech Recognition (requires internet)")

    if not speech_ok:
        print("\n⚠️  Note: Google Speech Recognition is not available, will use Whisper only")

if __name__ == "__main__":
    main()
