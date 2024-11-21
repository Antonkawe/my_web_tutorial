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
        const response = await fetch(`/api/tiktok?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        if (data.status === 'success') {
            const videoUrl = data.video.url;
            videoPlayer.src = videoUrl;
            videoTitle.textContent = data.video.title || 'Judul Tidak Tersedia';
            downloadButton.onclick = () => {
                window.location.href = `https://www.antoncodder.online/api/download?url=${encodeURIComponent(videoUrl)}`;
            };
            resultDiv.style.display = 'block';
        } else {
            errorDiv.textContent = data.message;
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        errorDiv.textContent = 'Gagal memproses permintaan. Periksa koneksi Anda atau coba lagi.';
        errorDiv.style.display = 'block';
    }
});