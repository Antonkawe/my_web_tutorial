document.getElementById('downloadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const urlInput = document.getElementById('url').value.trim();
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoId = document.getElementById('videoId');
    const videoRegion = document.getElementById('videoRegion');
    const videoDuration = document.getElementById('videoDuration');
    const videoTitle = document.getElementById('videoTitle');
    const downloadButton = document.getElementById('downloadButton');
    resultDiv.style.display = 'none';
    errorDiv.style.display = 'none';
    if (!urlInput) {
        errorDiv.textContent = 'Harap masukkan URL TikTok yang valid.';
        errorDiv.style.display = 'block';
        return;
    }

    try {
        const response = await fetch(`/api/tiktok?url=${encodeURIComponent(urlInput)}&apikey=AlphaCoder03`);
        const data = await response.json();
        if (response.ok && data.status === 'success') {
            const { url, id, title, play, likes, comment, size, region, duration } = data.video;
            updateVideoDetails(videoPlayer, videoId, videoTitle, videoRegion, videoDuration, {
                url,
                id,
                title,
                play,
                likes,
                comment,
                size,
                region,
                duration,
            });
            downloadButton.onclick = () => {
                window.location.href = `/api/download?url=${encodeURIComponent(url)}`;
            };
            resultDiv.style.display = 'block';
        } else {
            displayError(errorDiv, data.message || 'Terjadi kesalahan pada server.');
        }
    } catch (error) {
        displayError(
            errorDiv,
            'Layanan mungkin sedang gangguan. Silakan coba lagi nanti. Jika terus berlanjut, hubungi dukungan.'
        );
    }
});

document.getElementById('videoPlayer').addEventListener('click', (e) => {
    e.target.requestFullscreen();
});

function updateVideoDetails(player, idElem, titleElem, regionElem, durationElem, videoData) {
    const { url, id, title, play, likes, comment, size, region, duration } = videoData;
    player.src = url;
    idElem.textContent = `ID: ${id || 'ID tidak tersedia'}`;
    titleElem.textContent = `Judul: ${title || 'Judul tidak tersedia'}`;
    document.getElementById('videoPlay').textContent = `Play: ${play || 'Tidak tersedia'}`;
    document.getElementById('videoLikes').textContent = `Likes: ${likes || 'Tidak tersedia'}`;
    document.getElementById('videoComment').textContent = `Comment: ${comment || 'Tidak tersedia'}`;
    document.getElementById('videoSize').textContent = `Size: ${size || 'Tidak tersedia'}`;
    regionElem.textContent = `Region: ${region || 'Region tidak tersedia'}`;
    durationElem.textContent = `Durasi: ${duration || 'Durasi tidak tersedia'}`;
}

function displayError(errorElem, message) {
    errorElem.textContent = message;
    errorElem.style.display = 'block';
}