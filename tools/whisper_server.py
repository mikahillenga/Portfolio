#!/usr/bin/env python3
"""
Lokaal Whisper-bruggetje voor de CGI-oefenomgeving.

Stelt het Whisper-model dat al op je laptop staat beschikbaar als een kleine
HTTP-server met een OpenAI-compatible endpoint:

    POST /v1/audio/transcriptions   (multipart/form-data, veld 'file')
    ->  {"text": "..."}

De webpagina neemt je antwoord op, zet het om naar 16 kHz mono WAV en stuurt
het hierheen. Deze server leest die WAV met de Python-standaardbibliotheek
(geen ffmpeg nodig) en laat Whisper de tekst maken.

Gebruik:
    python tools/whisper_server.py --model base --port 8000

Werkt met 'faster-whisper' (aanbevolen, sneller) of het 'openai-whisper'-pakket
- wat je al hebt geïnstalleerd. Zet in de app (⚙ Whisper) het server-type op
'OpenAI-compatible' en de URL op http://127.0.0.1:8000/v1/audio/transcriptions
"""

import argparse
import email
import io
import json
import sys
import wave
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

try:
    import numpy as np
except ImportError:
    print("Fout: numpy is nodig. Installeer met 'pip install numpy'.", file=sys.stderr)
    raise


# --------------------------------------------------------------------------
# Audio + multipart parsing (puur, los testbaar)
# --------------------------------------------------------------------------
def extract_file_and_fields(content_type, body):
    """Haal het audiobestand en tekstvelden uit een multipart/form-data body."""
    header = b"Content-Type: " + content_type.encode() + b"\r\nMIME-Version: 1.0\r\n\r\n"
    msg = email.message_from_bytes(header + body)
    audio = None
    fields = {}
    for part in msg.walk():
        if part.is_multipart():
            continue
        disp = part.get("Content-Disposition", "")
        if "form-data" not in disp:
            continue
        name = part.get_param("name", header="content-disposition")
        filename = part.get_filename()
        payload = part.get_payload(decode=True)
        if payload is None:
            continue
        if filename or name in ("file", "audio_file"):
            if audio is None:
                audio = payload
        elif name:
            try:
                fields[name] = payload.decode("utf-8", "replace").strip()
            except Exception:
                pass
    return audio, fields


def wav_bytes_to_float32(audio_bytes, target_rate=16000):
    """Lees WAV-bytes en geef (float32 mono numpy op target_rate, target_rate)."""
    with wave.open(io.BytesIO(audio_bytes), "rb") as w:
        n_channels = w.getnchannels()
        sampwidth = w.getsampwidth()
        rate = w.getframerate()
        frames = w.readframes(w.getnframes())

    if sampwidth == 2:
        data = np.frombuffer(frames, dtype=np.int16).astype(np.float32) / 32768.0
    elif sampwidth == 1:
        data = (np.frombuffer(frames, dtype=np.uint8).astype(np.float32) - 128.0) / 128.0
    elif sampwidth == 4:
        data = np.frombuffer(frames, dtype=np.int32).astype(np.float32) / 2147483648.0
    else:
        raise ValueError("Niet-ondersteunde sample-breedte: %d bytes" % sampwidth)

    if n_channels > 1:
        data = data.reshape(-1, n_channels).mean(axis=1)

    if rate != target_rate and len(data) > 1:
        # eenvoudige lineaire resampling
        new_len = int(round(len(data) * target_rate / rate))
        xp = np.linspace(0.0, 1.0, num=len(data), endpoint=False)
        x = np.linspace(0.0, 1.0, num=new_len, endpoint=False)
        data = np.interp(x, xp, data).astype(np.float32)

    return np.ascontiguousarray(data, dtype=np.float32), target_rate


# --------------------------------------------------------------------------
# Modellaag (faster-whisper of openai-whisper)
# --------------------------------------------------------------------------
class Transcriber:
    def __init__(self, model_name):
        self.model_name = model_name
        self.backend = None
        self.model = None
        self._load()

    def _load(self):
        try:
            from faster_whisper import WhisperModel
            self.model = WhisperModel(self.model_name)
            self.backend = "faster-whisper"
            return
        except Exception:
            pass
        try:
            import whisper
            self.model = whisper.load_model(self.model_name)
            self.backend = "openai-whisper"
            return
        except Exception as e:
            raise SystemExit(
                "Geen Whisper-backend gevonden. Installeer er een:\n"
                "  pip install faster-whisper   (aanbevolen)\n"
                "  of: pip install -U openai-whisper\n"
                "Onderliggende fout: %r" % (e,)
            )

    def transcribe(self, audio_f32, lang=None):
        lang = lang or None
        if self.backend == "faster-whisper":
            segments, _info = self.model.transcribe(audio_f32, language=lang)
            return "".join(seg.text for seg in segments).strip()
        # openai-whisper accepteert een float32 numpy-array op 16 kHz
        result = self.model.transcribe(audio_f32, language=lang, fp16=False)
        return (result.get("text") or "").strip()


# --------------------------------------------------------------------------
# HTTP-server
# --------------------------------------------------------------------------
def make_handler(transcriber):
    class Handler(BaseHTTPRequestHandler):
        def _cors(self):
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "*")

        def _json(self, code, obj):
            payload = json.dumps(obj).encode("utf-8")
            self.send_response(code)
            self._cors()
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)

        def do_OPTIONS(self):
            self.send_response(204)
            self._cors()
            self.send_header("Content-Length", "0")
            self.end_headers()

        def do_GET(self):
            self._json(200, {"status": "ok", "backend": transcriber.backend,
                             "model": transcriber.model_name})

        def do_POST(self):
            ctype = self.headers.get("Content-Type", "")
            length = int(self.headers.get("Content-Length", 0) or 0)
            body = self.rfile.read(length) if length else b""
            if "multipart/form-data" not in ctype:
                return self._json(400, {"error": "verwacht multipart/form-data"})
            try:
                audio, fields = extract_file_and_fields(ctype, body)
                if not audio:
                    return self._json(400, {"error": "geen audiobestand gevonden"})
                samples, _sr = wav_bytes_to_float32(audio)
                text = transcriber.transcribe(samples, fields.get("language"))
                sys.stdout.write("  → %r\n" % (text[:120],))
                sys.stdout.flush()
                return self._json(200, {"text": text})
            except Exception as e:
                return self._json(500, {"error": str(e)})

        def log_message(self, *_args):
            pass  # stiller

    return Handler


def main():
    ap = argparse.ArgumentParser(description="Lokaal Whisper-bruggetje (OpenAI-compatible).")
    ap.add_argument("--model", default="base", help="Whisper-modelnaam (tiny/base/small/medium/large of een pad).")
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=8000)
    args = ap.parse_args()

    print("Whisper-model laden: %s …" % args.model)
    transcriber = Transcriber(args.model)
    print("Klaar (backend: %s)." % transcriber.backend)

    httpd = ThreadingHTTPServer((args.host, args.port), make_handler(transcriber))
    url = "http://%s:%d/v1/audio/transcriptions" % (args.host, args.port)
    print("Luistert op %s" % url)
    print("Zet dit adres in de app onder ⚙ Whisper (server-type: OpenAI-compatible). Ctrl+C om te stoppen.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nGestopt.")


if __name__ == "__main__":
    main()
