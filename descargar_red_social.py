import sys
import json
import yt_dlp

url = sys.argv[1] if len(sys.argv) > 1 else ""

ydl_opts = {
    'format': 'best[ext=mp4]/best',
    'quiet': True,
    'no_warnings': True,
}

try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        formats = info.get('formats', [])
        video_url = None
        for f in formats:
            if f.get('ext') == 'mp4' and f.get('vcodec') != 'none':
                if not video_url or f.get('height', 0) > video_url.get('height', 0):
                    video_url = f
        if not video_url:
            video_url = formats[0] if formats else None
        if video_url:
            result = {
                "url": video_url.get('url', ''),
                "title": info.get('title', 'Video'),
                "uploader": info.get('uploader', info.get('channel', 'Desconocido'))
            }
            print(json.dumps(result))
        else:
            print(json.dumps({"error": "No se encontró video"}))
except Exception as e:
    print(json.dumps({"error": str(e)}))
