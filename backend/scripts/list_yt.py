import yt_dlp
ydl_opts = {
    'extract_flat': 'in_playlist',
    'playlistend': 50,
    'quiet': True,
    'no_warnings': True
}
with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    info = ydl.extract_info('https://www.youtube.com/@GRIIPusatSore/videos', download=False)
    for i, e in enumerate(info.get('entries', [])):
        print(f"{i+1}. {e.get('title')} ({e.get('duration_string', 'unknown')})")
