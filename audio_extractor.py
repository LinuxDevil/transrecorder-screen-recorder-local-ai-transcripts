#!/usr/bin/env python3
"""
Audio Extractor and Speech-to-Text Converter
Extracts audio from video files and optionally converts to text
"""

import sys
import os
import json
import subprocess
import tempfile
from pathlib import Path
import speech_recognition as sr
from pydub import AudioSegment
import whisper

def extract_audio_from_video(video_path, output_audio_path=None):
    """
    Extract audio from video file using ffmpeg
    """
    try:
        if output_audio_path is None:
            temp_dir = tempfile.gettempdir()
            output_audio_path = os.path.join(temp_dir, f"extracted_audio_{os.path.basename(video_path)}.wav")

        cmd = [
            'ffmpeg', '-i', video_path,
            '-vn',
            '-acodec', 'pcm_s16le',
            '-ar', '16000',
            '-ac', '1',
            '-y',
            output_audio_path
        ]

        result = subprocess.run(cmd, capture_output=True, text=True)

        if result.returncode != 0:
            print(f"FFmpeg error: {result.stderr}", file=sys.stderr)
            return None

        return output_audio_path

    except Exception as e:
        print(f"Error extracting audio: {e}", file=sys.stderr)
        return None

def transcribe_audio_whisper(audio_path):
    """
    Transcribe audio using OpenAI Whisper (local)
    """
    try:
        model = whisper.load_model("base")
        result = model.transcribe(audio_path)

        return result["text"].strip()

    except Exception as e:
        print(f"Whisper error: {e}", file=sys.stderr)
        return None

def transcribe_audio_speech_recognition(audio_path):
    """
    Transcribe audio using speech_recognition library
    """
    try:
        recognizer = sr.Recognizer()

        with sr.AudioFile(audio_path) as source:
            audio = recognizer.record(source)

        text = recognizer.recognize_google(audio)
        return text

    except sr.UnknownValueError:
        print("Speech recognition could not understand audio", file=sys.stderr)
        return None
    except sr.RequestError as e:
        print(f"Speech recognition error: {e}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"Error in speech recognition: {e}", file=sys.stderr)
        return None

def main():
    """
    Main function to process video file
    """
    if len(sys.argv) < 2:
        print("Usage: python audio_extractor.py <video_path> [output_audio_path]", file=sys.stderr)
        sys.exit(1)

    video_path = sys.argv[1]
    output_audio_path = sys.argv[2] if len(sys.argv) > 2 else None

    if not os.path.exists(video_path):
        print(f"Error: Video file '{video_path}' not found", file=sys.stderr)
        sys.exit(1)

    print(f"Extracting audio from: {video_path}", file=sys.stderr)
    audio_path = extract_audio_from_video(video_path, output_audio_path)

    if audio_path is None:
        print("Failed to extract audio", file=sys.stderr)
        sys.exit(1)

    print(f"Audio extracted to: {audio_path}", file=sys.stderr)

    print("Transcribing with Whisper...", file=sys.stderr)
    whisper_transcript = transcribe_audio_whisper(audio_path)

    print("Transcribing with Google Speech Recognition...", file=sys.stderr)
    google_transcript = transcribe_audio_speech_recognition(audio_path)

    result = {
        "audio_path": audio_path,
        "whisper_transcript": whisper_transcript,
        "google_transcript": google_transcript,
        "success": True
    }

    print(json.dumps(result, indent=2))
    if output_audio_path is None and os.path.exists(audio_path):
        try:
            os.remove(audio_path)
            print(f"Cleaned up temporary audio file: {audio_path}", file=sys.stderr)
        except:
            pass

if __name__ == "__main__":
    main()
