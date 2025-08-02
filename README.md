# Screen Recorder

![Application Icon](./resources/icon.png)
A powerful desktop screen recording application built with Electron, React, and TypeScript. Record your screen, save videos locally, and automatically generate transcripts and summaries using Ollama.

## Features

- **Screen Recording**: Capture your entire screen or specific windows
- **Video Download**: Save recordings to your desktop with organized folders
- **Audio Extraction**: Extract audio from recorded videos automatically
- **Transcript Generation**: Convert video audio to text using speech recognition
- **AI Summarization**: Generate intelligent summaries using Ollama (local AI)
- **Multiple Recording Types**: Support for Google Meet, Lesson, and general video recordings
- **Live Preview**: See what you're recording in real-time
- **Cross-Platform**: Works on Windows, macOS, and Linux

### Main Application Interface

![Main Application Interface](./1.png)

### Recording in Progress

![Recording in Progress](./2.png)

## Prerequisites

Before running this application, you'll need to install some dependencies:

### Required Software

1. **Node.js** (v16 or higher)
2. **Python** (v3.8 or higher) - for audio processing
3. **FFmpeg** - for video/audio conversion

### Optional (for AI features)

4. **Ollama** - for AI-powered summaries
5. **Python packages** - for speech-to-text conversion

## Installation

### Option 1: Download Pre-built Binaries

The easiest way to get started is to download the pre-built binaries:

1. **Go to the [Releases page](https://github.com/your-username/loushrecorder/releases)**
2. **Download the appropriate installer for your platform:**
   - **Windows**: `loushrecorder-1.0.0-setup.exe`
   - **macOS**: `loushrecorder-1.0.0.dmg`
3. **Install and run the application**

### Option 2: Build from Source

If you prefer to build from source or need the latest development version:

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd loushrecorder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 4. Install FFmpeg

FFmpeg is required for audio extraction from videos. Here's how to install it:

#### Windows

**Option 1: Using Chocolatey (Recommended)**

```bash
# Install Chocolatey first if you don't have it
# Then install FFmpeg:
choco install ffmpeg
```

**Option 2: Manual Installation**

1. Download from https://ffmpeg.org/download.html
2. Extract to a folder (e.g., `C:\ffmpeg`)
3. Add to PATH: `C:\ffmpeg\bin`

**Option 3: Using Scoop**

```bash
scoop install ffmpeg
```

#### macOS

**Using Homebrew:**

```bash
brew install ffmpeg
```

**Manual Installation:**

1. Download from https://ffmpeg.org/download.html
2. Extract and move to `/usr/local/bin/`

#### Linux

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install ffmpeg
```

**CentOS/RHEL:**

```bash
sudo yum install ffmpeg
```

**Arch Linux:**

```bash
sudo pacman -S ffmpeg
```

### 5. Install Ollama (Optional)

For AI-powered summaries, install Ollama:

1. **Download Ollama**: Visit https://ollama.ai/ and download for your platform
2. **Start Ollama**: Run `ollama serve` in a terminal
3. **Pull a Model**:

```bash
ollama pull mistral
```

### 6. Verify Installation

Run these commands to verify everything is installed:

```bash
# Check Node.js
node --version

# Check Python
python --version

# Check FFmpeg
ffmpeg -version

# Check Ollama (if installed)
ollama list
```

## Development

### Start Development Server

```bash
npm run dev
```

This will start the Electron application in development mode with hot reloading.

### Build for Production

```bash
# For Windows
npm run build:win

# For macOS
npm run build:mac

# For Linux
npm run build:linux
```

## Usage

### Basic Recording

1. **Start the Application**: Run `npm run dev` or launch the built application
2. **Select Recording Type**: Choose between Google Meet, Lesson, or Video
3. **Start Recording**: Click the "Start Recording" button
4. **Stop Recording**: Click "Stop Recording" when finished
5. **Download Video**: Click "Download Video" to save to your desktop

### Advanced Features

#### Transcript Generation

After recording a video:

1. Click "Extract Transcript"
2. The app will extract audio from your video using FFmpeg
3. Convert speech to text using local AI (Whisper or Google Speech Recognition)
4. Generate a summary based on your recording type using Ollama
5. Save both transcript and summary files

#### File Organization

Videos are automatically organized:

```
Desktop/
└── captured-videos/
    └── YYYY-MM-DD/
        ├── recording-YYYY-MM-DD-HH-MM-SS.webm
        ├── recording-YYYY-MM-DD-HH-MM-SS.txt
        └── recording-YYYY-MM-DD-HH-MM-SS-summary.txt
```

## Configuration

### Recording Types

- **Google Meet**: Optimized for meeting recordings with action items and decisions
- **Lesson**: Designed for educational content with learning objectives and key concepts
- **Video**: General purpose for any type of video content

### AI Models

The application uses the Mistral model for AI summaries. You can change this in `src/main/utils/ollama.utils.ts`:

```typescript
model: 'mistral' // Change to any model you have installed
```

### Speech-to-Text Options

The app supports multiple STT engines:

1. **OpenAI Whisper** (Local) - Default, works offline
2. **Google Speech Recognition** (Online) - Fallback option
3. **Fallback** - Simple text if other options fail

## Troubleshooting

### Common Issues

#### "FFmpeg is not installed"

- Install FFmpeg following the installation instructions above
- Ensure it's added to your system PATH
- Test with: `ffmpeg -version`

#### "Ollama API error: 404 Not Found"

- Make sure Ollama is running: `ollama serve`
- Check available models: `ollama list`
- Pull the required model: `ollama pull mistral`
- Verify Ollama is accessible: `curl http://localhost:11434/api/tags`

#### "Python script not found"

- Ensure Python is installed and in your PATH
- Install required packages: `pip install -r requirements.txt`
- Check that `audio_extractor.py` is in the project root

#### "No desktop sources found"

- This is normal on first run
- The app will automatically detect available screens
- Try refreshing or restarting the application

#### "Audio extraction failed"

- Verify FFmpeg is installed and working
- Check Python dependencies are installed
- Ensure the video file is valid

### Debug Mode

Run with debug logging:

```bash
npm run dev -- --debug
```

### Manual Setup Script

If you're having trouble with dependencies, run the setup script:

```bash
python setup.py
```

This will check and install required dependencies automatically.

## Project Structure

```
loushrecorder/
├── src/
│   ├── main/           # Electron main process
│   │   ├── handlers/   # IPC handlers
│   │   ├── types/      # TypeScript types
│   │   ├── utils/      # Utility functions
│   │   └── window.ts   # Window management
│   ├── preload/        # Preload scripts
│   │   ├── types/      # Type definitions
│   │   ├── utils/      # API utilities
│   │   └── index.ts    # Main preload
│   └── renderer/       # React frontend
│       ├── components/ # UI components
│       ├── hooks/      # Custom hooks
│       ├── types/      # TypeScript types
│       └── utils/      # Utility functions
├── resources/          # App resources
├── audio_extractor.py  # Python audio processing
├── requirements.txt    # Python dependencies
└── package.json        # Node.js dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Look at the console output for error messages
3. Ensure all prerequisites are installed
4. Try running in debug mode
5. Check the project issues on GitHub

## Continuous Integration

This project uses GitHub Actions for automated builds and releases:

### Workflows

#### 1. Build Artifacts (`build-artifacts.yml`)

**Triggers:**

- Push to `main` branch
- Pull requests to `main` branch
- Manual trigger

**What it does:**

- Builds Windows and macOS versions
- Uploads artifacts for manual download
- No automatic releases

**Artifacts:**

- `windows-build` - Windows installer and unpacked files
- `macos-build` - macOS DMG and unpacked files

#### 2. Build and Release (`build.yml`)

**Triggers:**

- Push of tags starting with `v*` (e.g., `v1.0.1`)
- Manual trigger

**What it does:**

- Builds Windows and macOS versions
- Creates a GitHub release
- Uploads all artifacts to the release

### How to Use

#### For Regular Builds (No Release)

1. **Push to main branch** - Automatically triggers build
2. **Go to Actions tab** - View build progress
3. **Download artifacts** - Available after build completes

#### For Releases

**Option 1: Using Release Scripts**

**Linux/macOS:**

```bash
chmod +x scripts/release.sh
./scripts/release.sh 1.0.1
```

**Windows:**

```cmd
scripts\release.bat 1.0.1
```

**Option 2: Manual Tagging**

```bash
git tag v1.0.1
git push origin v1.0.1
```

#### For Manual Builds

1. **Go to the [Actions tab](https://github.com/your-username/loushrecorder/actions)**
2. **Click "Build Artifacts"**
3. **Click "Run workflow"**
4. **Select branch and click "Run workflow"**

### Artifacts Location

#### Build Artifacts

- **Actions tab** → Latest workflow run → Artifacts section
- **Retention**: 30 days

#### Release Artifacts

- **Releases page** → Latest release → Assets section
- **Retention**: Permanent (until release is deleted)

### Build Matrix

| Platform | Runner           | Build Command       | Output                  |
| -------- | ---------------- | ------------------- | ----------------------- |
| Windows  | `windows-latest` | `npm run build:win` | `.exe`, `win-unpacked/` |
| macOS    | `macos-latest`   | `npm run build:mac` | `.dmg`, `mac/`          |

### Dependencies Installed

#### All Platforms

- Node.js 18
- Python 3.9
- npm dependencies
- Python requirements

#### Platform-Specific

- **Windows**: FFmpeg (via Chocolatey)
- **macOS**: FFmpeg (via Homebrew)

### Troubleshooting

#### Build Fails

1. **Check Actions logs** - Look for specific error messages
2. **Verify dependencies** - Ensure all required software is available
3. **Check file paths** - Ensure all files are in expected locations

#### Artifacts Not Available

1. **Wait for completion** - Builds take 5-10 minutes
2. **Check retention** - Artifacts expire after 30 days
3. **Re-run workflow** - Manual trigger if needed

#### Release Not Created

1. **Check tag format** - Must start with `v` (e.g., `v1.0.1`)
2. **Verify permissions** - Need write access to repository
3. **Check workflow** - Ensure `build.yml` is enabled

### Customization

#### Adding Linux Builds

Add to matrix in `build-artifacts.yml`:

```yaml
strategy:
  matrix:
    os: [windows-latest, macos-latest, ubuntu-latest]
```

#### Changing Node.js Version

Update in workflow:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20' # Change version here
```

#### Adding Code Signing

Add to workflow before build step:

```yaml
- name: Setup Code Signing
  uses: electron-userland/electron-builder-action@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    platform: ${{ matrix.os }}
```

### Security Notes

- **No code signing** - Builds are not signed by default
- **Public artifacts** - Anyone can download build artifacts
- **Token permissions** - Uses `GITHUB_TOKEN` for releases
- **Dependency scanning** - Consider adding security scanning workflows
