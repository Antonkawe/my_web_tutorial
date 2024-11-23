document.getElementById('downloadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = document.getElementById('url').value;
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoTitle = document.getElementById('videoTitle');
    const downloadButton = document.getElementById('downloadButton');
    resultDiv.style.display = 'none';
    errorDiv.style.display = 'none';
    try {
        const response = await fetch(`/api/tiktok?url=${encodeURIComponent(url)}&apikey=AlphaCoder03`);
        const data = await response.json();
        if (response.ok && data.status === 'success') {
            const videoUrl = data.video.url;
            videoPlayer.src = videoUrl;
            videoTitle.textContent = data.video.title || 'Judul Tidak Tersedia';
            downloadButton.onclick = () => {
                window.location.href = `https://www.antoncodder.online/api/download?url=${encodeURIComponent(videoUrl)}`;
            };
            resultDiv.style.display = 'block';
        } else {
            errorDiv.textContent = data.message || 'Terjadi kesalahan pada server.';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        errorDiv.textContent = 'Untuk Layanan Paket Gratis Mungkin Sedang Gangguan. Silahkan Coba Lagi Lain Waktu😊';
        errorDiv.style.display = 'block';
    }
});
document.getElementById('videoPlayer').addEventListener('click', (e) => {
    e.target.requestFullscreen();
});