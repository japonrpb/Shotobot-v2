import sys
import json
import yt_dlp
import re

query = sys.argv[1] if len(sys.argv) > 1 else ""

ydl_opts = {
    'format': 'bestaudio/best',
    'quiet': True,
    'no_warnings': True,
    'extract_flat': False,
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '192',
    }],
}

try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(f"ytsearch1:{query}", download=False)
        if info and 'entries' in info and len(info['entries']) > 0:
            video = info['entries'][0]
            url = video.get('url', '')
            if not url:
                formats = video.get('formats', [])
                for f in formats:
                    if f.get('acodec') != 'none' and f.get('vcodec') == 'none':
                        url = f.get('url')
                        break
                    elif f.get('url'):
                        url = f.get('url')
            result = {
                "url": url,
                "title": video.get('title', 'Audio'),
                "duration": video.get('duration', 0),
                "uploader": video.get('uploader', 'Desconocido')
            }
            print(json.dumps(result))
        else:
            print(json.dumps({"error": "No se encontró el video"}))
except Exception as e:
    print(json.dumps({"error": str(e)}))
