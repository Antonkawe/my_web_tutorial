import yt_dlp
from flask import Flask, request, jsonify
app = Flask(__name__)
API_KEY = 'AlphaCoder03'

@app.route('/api/ytdl', methods=['GET'])
def ytdl():
    url = request.args.get('url')
    apikey = request.args.get('apikey')

    if apikey != API_KEY:
        return jsonify({
            "status": "error",
            "errorCode": "INVALID_API_KEY",
            "message": "API Key tidak valid.",
            "timestamp": str(request.args.get('timestamp', 'N/A')),
            "requestId": apikey or 'N/A',
            "details": "Periksa API Key yang Anda kirimkan dan pastikan itu benar."
        }), 400

    if not url:
        return jsonify({
            "status": "error",
            "message": "URL tidak diberikan."
        }), 400

    try:
        ydl_opts = {
            'quiet': True,
            'format': 'bestaudio/bestvideo',
            'outtmpl': '%(id)s.%(ext)s',
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(url, download=False)
            title = info_dict.get('title', 'Tidak ada judul')
            duration = info_dict.get('duration', 0)
            mp4_url = None
            mp3_url = None

            for format in info_dict['formats']:
                if format['ext'] == 'mp4' and not mp4_url:
                    mp4_url = format['url']
                if format['ext'] == 'mp3' and not mp3_url:
                    mp3_url = format['url']

        return jsonify({
            "status": "success",
            "project": "AlphaCoder",
            "owner": "Anton",
            "data": {
                "title": title,
                "duration": duration,
                "mp4_url": mp4_url,
                "mp3_url": mp3_url
            }
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Terjadi kesalahan pada server.",
            "details": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)