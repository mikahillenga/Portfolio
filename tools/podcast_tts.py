#!/usr/bin/env python3
"""
Maak een MP3 van het podcast-script van de CGI-oefenomgeving.

Download eerst het script in de app (Podcast -> "Download script (.txt)") en
draai dan dit bruggetje. Elke regel in het script ziet er zo uit:

    # 1 · Welkom            (regels met # zijn hoofdstuktitels / opmerkingen)
    N: Welkom bij de ...    (N = host Noor)
    M: En het idee is ...   (M = coach Mees)

Gebruik:
    pip install edge-tts
    python tools/podcast_tts.py podcast-script.txt -o podcast.mp3

Backends (auto-detectie in deze volgorde):
  * edge-tts  : mooiste Nederlandse neurale stemmen, twee stemmen, MP3.
                Heeft internet nodig.
  * gtts      : Google TTS, MP3, één stem. Heeft internet nodig.
  * pyttsx3   : volledig offline (systeemstem, robotachtiger). Schrijft WAV.

Voorbeelden:
    python tools/podcast_tts.py podcast-script.txt -o podcast.mp3
    python tools/podcast_tts.py podcast-script.txt --engine pyttsx3 -o podcast.wav
    python tools/podcast_tts.py --list-voices
"""

import argparse
import os
import sys
import tempfile


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
        # geen herkende spreker: behandel als gewone regel (host)
        items.append({"type": "line", "speaker": "N", "text": line})
    return items


def spoken_lines(items):
    return [it for it in items if it["type"] == "line" and it["text"]]


# --------------------------------------------------------------------------
# Backend-detectie
# --------------------------------------------------------------------------
def detect_engine():
    for name, mod in (("edge", "edge_tts"), ("gtts", "gtts"), ("pyttsx3", "pyttsx3")):
        try:
            __import__(mod)
            return name
        except ImportError:
            continue
    return None


# --------------------------------------------------------------------------
# edge-tts (neuraal, twee stemmen, MP3)
# --------------------------------------------------------------------------
EDGE_DEFAULT_N = "nl-NL-FennaNeural"    # host Noor
EDGE_DEFAULT_M = "nl-NL-MaartenNeural"  # coach Mees


def edge_list_voices():
    import asyncio
    import edge_tts

    async def _go():
        voices = await edge_tts.list_voices()
        return [v for v in voices if str(v.get("Locale", "")).startswith("nl")]

    for v in asyncio.run(_go()):
        print("  %-26s %s" % (v["ShortName"], v.get("Gender", "")))


def edge_synth(lines, out_path, voice_n, voice_m, rate_pct):
    import asyncio
    import edge_tts

    rate = ("+%d%%" % rate_pct) if rate_pct >= 0 else ("%d%%" % rate_pct)

    async def _line_bytes(text, voice):
        buf = b""
        comm = edge_tts.Communicate(text, voice, rate=rate)
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                buf += chunk["data"]
        return buf

    async def _go():
        with open(out_path, "wb") as f:
            for i, it in enumerate(lines, 1):
                voice = voice_n if it["speaker"] == "N" else voice_m
                data = await _line_bytes(it["text"], voice)
                f.write(data)
                sys.stdout.write("\r  regel %d/%d gesynthetiseerd" % (i, len(lines)))
                sys.stdout.flush()
        print()

    asyncio.run(_go())


# --------------------------------------------------------------------------
# gTTS (MP3, één stem)
# --------------------------------------------------------------------------
def gtts_synth(lines, out_path):
    from gtts import gTTS
    with open(out_path, "wb") as f:
        for i, it in enumerate(lines, 1):
            gTTS(it["text"], lang="nl").write_to_fp(f)
            sys.stdout.write("\r  regel %d/%d gesynthetiseerd" % (i, len(lines)))
            sys.stdout.flush()
    print()


# --------------------------------------------------------------------------
# pyttsx3 (offline, WAV)
# --------------------------------------------------------------------------
def pyttsx3_synth(lines, out_path):
    import wave
    import pyttsx3

    engine = pyttsx3.init()
    voices = engine.getProperty("voices")
    nl = [v for v in voices if "nl" in (getattr(v, "id", "") + getattr(v, "name", "")).lower()]
    voice_n = (nl[0].id if len(nl) > 0 else (voices[0].id if voices else None))
    voice_m = (nl[1].id if len(nl) > 1 else voice_n)

    if not out_path.lower().endswith(".wav"):
        out_path = os.path.splitext(out_path)[0] + ".wav"
        print("  (pyttsx3 schrijft WAV) -> %s" % out_path)

    tmpdir = tempfile.mkdtemp(prefix="podtts_")
    params = None
    out = wave.open(out_path, "wb")
    try:
        for i, it in enumerate(lines, 1):
            engine.setProperty("voice", voice_n if it["speaker"] == "N" else voice_m)
            seg = os.path.join(tmpdir, "seg.wav")
            engine.save_to_file(it["text"], seg)
            engine.runAndWait()
            with wave.open(seg, "rb") as w:
                if params is None:
                    params = w.getparams()
                    out.setparams(params)
                out.writeframes(w.readframes(w.getnframes()))
            sys.stdout.write("\r  regel %d/%d gesynthetiseerd" % (i, len(lines)))
            sys.stdout.flush()
        print()
    finally:
        out.close()
    return out_path


# --------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser(description="Maak een MP3 van het podcast-script.")
    ap.add_argument("script", nargs="?", help="Pad naar podcast-script.txt")
    ap.add_argument("-o", "--out", default="podcast.mp3", help="Uitvoerbestand (standaard podcast.mp3).")
    ap.add_argument("--engine", default="auto", choices=["auto", "edge", "gtts", "pyttsx3"])
    ap.add_argument("--voice-n", default=EDGE_DEFAULT_N, help="edge-tts stem voor host Noor.")
    ap.add_argument("--voice-m", default=EDGE_DEFAULT_M, help="edge-tts stem voor coach Mees.")
    ap.add_argument("--rate", type=float, default=1.0, help="Spreeksnelheid-multiplier (1.0 = normaal).")
    ap.add_argument("--list-voices", action="store_true", help="Toon beschikbare Nederlandse edge-tts stemmen.")
    args = ap.parse_args()

    if args.list_voices:
        try:
            edge_list_voices()
        except ImportError:
            print("Installeer edge-tts: pip install edge-tts")
        return

    if not args.script:
        ap.error("geef het pad naar het script op (bijv. podcast-script.txt)")
    if not os.path.exists(args.script):
        ap.error("bestand niet gevonden: %s" % args.script)

    with open(args.script, "r", encoding="utf-8") as f:
        items = parse_script(f.read())
    lines = spoken_lines(items)
    if not lines:
        ap.error("geen spreekregels gevonden in het script.")

    engine = args.engine if args.engine != "auto" else detect_engine()
    if engine is None:
        print("Geen TTS-backend gevonden. Installeer er een:\n"
              "  pip install edge-tts   (aanbevolen, mooiste stemmen)\n"
              "  of: pip install gtts\n"
              "  of: pip install pyttsx3", file=sys.stderr)
        sys.exit(1)

    chapters = sum(1 for it in items if it["type"] == "chapter")
    print("Script: %d regels in %d hoofdstukken. Backend: %s." % (len(lines), chapters, engine))
    rate_pct = int(round((args.rate - 1.0) * 100))

    if engine == "edge":
        edge_synth(lines, args.out, args.voice_n, args.voice_m, rate_pct)
        out = args.out
    elif engine == "gtts":
        gtts_synth(lines, args.out)
        out = args.out
    else:
        out = pyttsx3_synth(lines, args.out)

    print("Klaar: %s" % out)


if __name__ == "__main__":
    main()
