#!/usr/bin/env python3
"""
Maak een audiobestand (MP3/WAV) van het podcast-script van de CGI-oefenomgeving,
met pauzes tussen de hoofdstukken.

Download eerst het script in de app (Podcast -> "Download script (.txt)").
Elke regel ziet er zo uit:

    # 1 · Welkom            (regels met # zijn hoofdstuktitels -> hier komt een pauze)
    N: Welkom bij de ...    (N = host Noor)
    M: En het idee is ...   (M = coach Mees)

AANRADER: een mooie OFFLINE stem via Piper (neuraal):
    pip install piper-tts lameenc
    python tools/podcast_tts.py --download-voice            # haalt een NL-stem op
    python tools/podcast_tts.py podcast-script.txt --engine piper -o podcast.mp3

Andere backends:
    edge-tts : zeer mooie NL neurale stemmen, twee stemmen, MP3 (heeft internet nodig)
    gtts     : Google TTS, MP3, één stem (heeft internet nodig)
    pyttsx3  : volledig offline systeemstem (robotachtiger)

Pauzes instellen:
    --chapter-gap 1.0   (seconden stilte tussen hoofdstukken, standaard 0.9)
    --line-gap 0.25     (seconden stilte tussen zinnen, standaard 0.25)
"""

import argparse
import os
import subprocess
import sys
import tempfile
import wave


# --------------------------------------------------------------------------
# Script parsen (puur, los testbaar)
# --------------------------------------------------------------------------
def parse_script(text):
    """Geeft een lijst van dicts: {'type':'chapter'|'line', 'speaker', 'text'}."""
    items = []
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        if line.startswith("#"):
            items.append({"type": "chapter", "speaker": None, "text": line.lstrip("#").strip()})
            continue
        if ":" in line:
            spk, txt = line.split(":", 1)
            key = spk.strip().upper()
            txt = txt.strip()
            if key in ("N", "NOOR"):
                items.append({"type": "line", "speaker": "N", "text": txt})
                continue
            if key in ("M", "MEES"):
                items.append({"type": "line", "speaker": "M", "text": txt})
                continue
        items.append({"type": "line", "speaker": "N", "text": line})
    return items


def spoken_lines(items):
    return [it for it in items if it["type"] == "line" and it["text"]]


# --------------------------------------------------------------------------
# Audio-hulp (16-bit mono PCM)
# --------------------------------------------------------------------------
def pcm_silence(ms, rate):
    return b"\x00\x00" * int(rate * ms / 1000)


def write_wav(path, pcm_bytes, rate):
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(pcm_bytes)


def read_wav_pcm(path):
    with wave.open(path, "rb") as w:
        rate = w.getframerate()
        frames = w.readframes(w.getnframes())
        sw = w.getsampwidth()
        ch = w.getnchannels()
    if ch > 1:  # downmix naar mono door het eerste kanaal te nemen
        step = sw * ch
        frames = b"".join(frames[i:i + sw] for i in range(0, len(frames), step))
    return rate, frames


def try_encode_mp3(pcm_bytes, rate, out_path):
    """Probeer PCM naar MP3 te encoderen. True bij succes."""
    try:
        import lameenc
        enc = lameenc.Encoder()
        enc.set_bit_rate(128)
        enc.set_in_sample_rate(rate)
        enc.set_channels(1)
        enc.set_quality(2)
        mp3 = enc.encode(pcm_bytes) + enc.flush()
        with open(out_path, "wb") as f:
            f.write(mp3)
        return True
    except Exception:
        pass
    try:
        from pydub import AudioSegment
        seg = AudioSegment(data=pcm_bytes, sample_width=2, frame_rate=rate, channels=1)
        seg.export(out_path, format="mp3")
        return True
    except Exception:
        return False


def assemble_pcm(items, line_pcms, rate, out_path, chapter_gap_ms, line_gap_ms):
    """Plak per-regel PCM aan elkaar met pauzes tussen hoofdstukken en zinnen."""
    frames = bytearray()
    li = 0
    for it in items:
        if it["type"] == "chapter":
            if frames:  # geen stilte vóór de allereerste klank
                frames += pcm_silence(chapter_gap_ms, rate)
        else:
            frames += line_pcms[li]
            li += 1
            frames += pcm_silence(line_gap_ms, rate)
    frames = bytes(frames)

    if out_path.lower().endswith(".mp3"):
        if try_encode_mp3(frames, rate, out_path):
            return out_path
        wav_path = os.path.splitext(out_path)[0] + ".wav"
        write_wav(wav_path, frames, rate)
        print("  Geen mp3-encoder gevonden (pip install lameenc). WAV geschreven.")
        return wav_path
    write_wav(out_path, frames, rate)
    return out_path


# --------------------------------------------------------------------------
# Piper (offline, neuraal) — aanbevolen voor een mooie stem
# --------------------------------------------------------------------------
PIPER_VOICES = {
    "nl_BE-nathalie-medium": ("nl_BE", "nathalie", "medium"),
    "nl_BE-rdh-medium": ("nl_BE", "rdh", "medium"),
    "nl_NL-mls_5809-low": ("nl_NL", "mls_5809", "low"),
    "nl_NL-mls_7432-low": ("nl_NL", "mls_7432", "low"),
}
DEFAULT_PIPER_KEY = "nl_BE-nathalie-medium"
DEFAULT_PIPER_KEY_M = "nl_BE-rdh-medium"
VOICE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "voices")
HF_BASE = "https://huggingface.co/rhasspy/piper-voices/resolve/main/nl"


def piper_voice_url(key, ext):
    locale, name, quality = PIPER_VOICES[key]
    return "%s/%s/%s/%s/%s.onnx%s" % (HF_BASE, locale, name, quality, key, ext)


def download_voice(key, dest_dir=VOICE_DIR):
    import urllib.request
    if key not in PIPER_VOICES:
        raise SystemExit("Onbekende stem: %s. Kies uit: %s" % (key, ", ".join(PIPER_VOICES)))
    os.makedirs(dest_dir, exist_ok=True)
    for ext in ("", ".json"):
        url = piper_voice_url(key, ext)
        out = os.path.join(dest_dir, key + ".onnx" + ext)
        if os.path.exists(out):
            print("  bestaat al: %s" % out)
            continue
        print("  downloaden: %s" % url)
        urllib.request.urlretrieve(url, out)
        print("  opgeslagen: %s" % out)
    return os.path.join(dest_dir, key + ".onnx")


def piper_model_path(key_or_path):
    if key_or_path and os.path.exists(key_or_path):
        return key_or_path
    cand = os.path.join(VOICE_DIR, (key_or_path or DEFAULT_PIPER_KEY) + ".onnx")
    return cand if os.path.exists(cand) else None


def piper_say(text, model_path):
    """Synthetiseer één zin met de piper-CLI en geef (rate, pcm_bytes)."""
    tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    tmp.close()
    try:
        subprocess.run(["piper", "-m", model_path, "-f", tmp.name],
                       input=text.encode("utf-8"),
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        return read_wav_pcm(tmp.name)
    finally:
        try:
            os.unlink(tmp.name)
        except OSError:
            pass


def render_piper(lines, model_n, model_m):
    rate = None
    pcms = []
    for i, it in enumerate(lines, 1):
        mp = model_m if (it["speaker"] == "M" and model_m) else model_n
        r, pcm = piper_say(it["text"], mp)
        if rate is None:
            rate = r
        pcms.append(pcm)
        sys.stdout.write("\r  regel %d/%d gesynthetiseerd" % (i, len(lines)))
        sys.stdout.flush()
    print()
    return rate, pcms


# --------------------------------------------------------------------------
# pyttsx3 (offline systeemstem)
# --------------------------------------------------------------------------
def render_pyttsx3(lines):
    import pyttsx3
    engine = pyttsx3.init()
    voices = engine.getProperty("voices")
    nl = [v for v in voices if "nl" in (getattr(v, "id", "") + getattr(v, "name", "")).lower()]
    voice_n = nl[0].id if nl else (voices[0].id if voices else None)
    voice_m = nl[1].id if len(nl) > 1 else voice_n
    tmpdir = tempfile.mkdtemp(prefix="podtts_")
    rate = None
    pcms = []
    for i, it in enumerate(lines, 1):
        engine.setProperty("voice", voice_m if it["speaker"] == "M" else voice_n)
        seg = os.path.join(tmpdir, "seg.wav")
        engine.save_to_file(it["text"], seg)
        engine.runAndWait()
        r, pcm = read_wav_pcm(seg)
        if rate is None:
            rate = r
        pcms.append(pcm)
        sys.stdout.write("\r  regel %d/%d gesynthetiseerd" % (i, len(lines)))
        sys.stdout.flush()
    print()
    return rate, pcms


# --------------------------------------------------------------------------
# edge-tts / gtts (MP3-native, online)
# --------------------------------------------------------------------------
EDGE_DEFAULT_N = "nl-NL-FennaNeural"
EDGE_DEFAULT_M = "nl-NL-MaartenNeural"
MP3_RATE = 24000  # edge-tts levert 24 kHz mono


def make_silence_mp3(ms, rate=MP3_RATE):
    out = bytearray()
    if not try_encode_mp3_bytes(pcm_silence(ms, rate), rate, out):
        return b""
    return bytes(out)


def try_encode_mp3_bytes(pcm_bytes, rate, out_bytearray):
    try:
        import lameenc
        enc = lameenc.Encoder()
        enc.set_bit_rate(128)
        enc.set_in_sample_rate(rate)
        enc.set_channels(1)
        enc.set_quality(2)
        out_bytearray += enc.encode(pcm_bytes) + enc.flush()
        return True
    except Exception:
        return False


def render_edge(lines, voice_n, voice_m, rate_pct):
    import asyncio
    import edge_tts
    rate = ("+%d%%" % rate_pct) if rate_pct >= 0 else ("%d%%" % rate_pct)

    async def _bytes(text, voice):
        buf = b""
        async for chunk in edge_tts.Communicate(text, voice, rate=rate).stream():
            if chunk["type"] == "audio":
                buf += chunk["data"]
        return buf

    async def _go():
        out = []
        for i, it in enumerate(lines, 1):
            voice = voice_m if it["speaker"] == "M" else voice_n
            out.append(await _bytes(it["text"], voice))
            sys.stdout.write("\r  regel %d/%d gesynthetiseerd" % (i, len(lines)))
            sys.stdout.flush()
        print()
        return out

    return asyncio.run(_go())


def render_gtts(lines):
    from gtts import gTTS
    import io
    out = []
    for i, it in enumerate(lines, 1):
        fp = io.BytesIO()
        gTTS(it["text"], lang="nl").write_to_fp(fp)
        out.append(fp.getvalue())
        sys.stdout.write("\r  regel %d/%d gesynthetiseerd" % (i, len(lines)))
        sys.stdout.flush()
    print()
    return out


def assemble_mp3native(items, line_mp3s, out_path, chapter_gap_ms, line_gap_ms):
    chap_gap = make_silence_mp3(chapter_gap_ms)
    line_gap = make_silence_mp3(line_gap_ms)
    if not chap_gap:
        print("  (tip: pip install lameenc voor nette pauzes tussen de hoofdstukken)")
    with open(out_path, "wb") as f:
        li = 0
        wrote = False
        for it in items:
            if it["type"] == "chapter":
                if wrote and chap_gap:
                    f.write(chap_gap)
            else:
                f.write(line_mp3s[li])
                li += 1
                if line_gap:
                    f.write(line_gap)
                wrote = True
    return out_path


# --------------------------------------------------------------------------
def detect_engine(piper_model):
    """Auto: piper (als stem aanwezig) -> edge -> gtts -> pyttsx3."""
    def has(mod):
        try:
            __import__(mod)
            return True
        except ImportError:
            return False
    if has("piper") and piper_model:
        return "piper"
    for name, mod in (("edge", "edge_tts"), ("gtts", "gtts"), ("pyttsx3", "pyttsx3")):
        if has(mod):
            return name
    if has("piper"):
        return "piper"
    return None


def main():
    ap = argparse.ArgumentParser(description="Maak een audiobestand van het podcast-script (met pauzes).")
    ap.add_argument("script", nargs="?", help="Pad naar podcast-script.txt")
    ap.add_argument("-o", "--out", default="podcast.mp3", help="Uitvoerbestand (standaard podcast.mp3).")
    ap.add_argument("--engine", default="auto", choices=["auto", "piper", "edge", "gtts", "pyttsx3"])
    ap.add_argument("--chapter-gap", type=float, default=0.9, help="Seconden stilte tussen hoofdstukken.")
    ap.add_argument("--line-gap", type=float, default=0.25, help="Seconden stilte tussen zinnen.")
    ap.add_argument("--piper-model", default=DEFAULT_PIPER_KEY, help="Piper-stem (naam of pad naar .onnx).")
    ap.add_argument("--piper-model-m", default=DEFAULT_PIPER_KEY_M, help="Tweede piper-stem voor Mees.")
    ap.add_argument("--voice-n", default=EDGE_DEFAULT_N, help="edge-tts stem voor Noor.")
    ap.add_argument("--voice-m", default=EDGE_DEFAULT_M, help="edge-tts stem voor Mees.")
    ap.add_argument("--rate", type=float, default=1.0, help="Spreeksnelheid-multiplier (edge-tts).")
    ap.add_argument("--download-voice", nargs="?", const=DEFAULT_PIPER_KEY,
                    help="Download een Piper NL-stem (standaard %s) en stop." % DEFAULT_PIPER_KEY)
    ap.add_argument("--download-voice-m", nargs="?", const=DEFAULT_PIPER_KEY_M,
                    help="Download ook de tweede stem voor Mees.")
    ap.add_argument("--list-voices", action="store_true", help="Toon beschikbare Piper NL-stemmen.")
    args = ap.parse_args()

    if args.list_voices:
        print("Beschikbare Piper NL-stemmen (download met --download-voice <naam>):")
        for k in PIPER_VOICES:
            print("  " + k)
        return

    if args.download_voice is not None or args.download_voice_m is not None:
        if args.download_voice is not None:
            download_voice(args.download_voice)
        if args.download_voice_m is not None:
            download_voice(args.download_voice_m)
        print("Klaar. Genereer nu met: --engine piper")
        return

    if not args.script:
        ap.error("geef het pad naar het script op (bijv. podcast-script.txt), of gebruik --download-voice")
    if not os.path.exists(args.script):
        ap.error("bestand niet gevonden: %s" % args.script)

    with open(args.script, "r", encoding="utf-8") as f:
        items = parse_script(f.read())
    lines = spoken_lines(items)
    if not lines:
        ap.error("geen spreekregels gevonden in het script.")

    piper_model = piper_model_path(args.piper_model)
    engine = args.engine if args.engine != "auto" else detect_engine(piper_model)
    if engine is None:
        print("Geen TTS-backend gevonden. Installeer er een, bijvoorbeeld:\n"
              "  pip install piper-tts lameenc   (offline, mooie stem)\n"
              "  of: pip install edge-tts        (online, mooie stem)", file=sys.stderr)
        sys.exit(1)

    chapters = sum(1 for it in items if it["type"] == "chapter")
    chap_ms = int(args.chapter_gap * 1000)
    line_ms = int(args.line_gap * 1000)
    print("Script: %d regels, %d hoofdstukken. Backend: %s. Pauzes: %.2fs / %.2fs."
          % (len(lines), chapters, engine, args.chapter_gap, args.line_gap))

    if engine == "piper":
        if not piper_model:
            print("Geen Piper-stem gevonden. Download er eerst een:\n"
                  "  python tools/podcast_tts.py --download-voice", file=sys.stderr)
            sys.exit(1)
        model_m = piper_model_path(args.piper_model_m)
        rate, pcms = render_piper(lines, piper_model, model_m)
        out = assemble_pcm(items, pcms, rate, args.out, chap_ms, line_ms)
    elif engine == "pyttsx3":
        rate, pcms = render_pyttsx3(lines)
        out = assemble_pcm(items, pcms, rate, args.out, chap_ms, line_ms)
    elif engine == "edge":
        rate_pct = int(round((args.rate - 1.0) * 100))
        mp3s = render_edge(lines, args.voice_n, args.voice_m, rate_pct)
        out = assemble_mp3native(items, mp3s, args.out, chap_ms, line_ms)
    else:  # gtts
        mp3s = render_gtts(lines)
        out = assemble_mp3native(items, mp3s, args.out, chap_ms, line_ms)

    print("Klaar: %s" % out)


if __name__ == "__main__":
    main()
