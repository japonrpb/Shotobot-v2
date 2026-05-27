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
            if f.get('ext') == 'mp4' and f.get('height') and f.get('vcodec') != 'none':
                if not video_url or f.get('height', 0) > video_url.get('height', 0):
                    video_url = f
        if not video_url:
            for f in formats:
                if f.get('vcodec') != 'none':
                    video_url = f
                    break
        if video_url:
            result = {
                "url": video_url.get('url', ''),
                "title": info.get('title', 'Video'),
                "duration": info.get('duration', 0),
                "uploader": info.get('uploader', 'Desconocido'),
                "thumbnail": info.get('thumbnail', '')
            }
            print(json.dumps(result))
        else:
            print(json.dumps({"error": "No se encontró video"}))
except Exception as e:
    print(json.dumps({"error": str(e)}))
