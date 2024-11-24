import yt_dlp

# Fungsi untuk mendapatkan informasi video
def fetch_video_info(url):
    ydl_opts = {
        'quiet': True,  # Agar output terminal tidak terlalu ramai
        'skip_download': True,  # Tidak mengunduh video, hanya mengambil informasi
        'format': 'best'  # Pilih format terbaik
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Ambil informasi video
            info = ydl.extract_info(url, download=False)
            return info
    except Exception as e:
        return {"error": str(e)}

# URL video untuk diuji
video_url = input("Masukkan URL video: ")

# Ambil informasi video
response = fetch_video_info(video_url)

# Cetak respons dalam format yang lebih rapi
import json
print(json.dumps(response, indent=2))
