const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");
const player = document.getElementById("player");

searchBtn.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  if (!query) return alert("Masukkan kata kunci pencarian!");

  try {
    const response = await fetch(`/api/youtube?apikey=AlphaCoder03&query=${encodeURIComponent(query)}`);
    const data = await response.json();

    resultsDiv.innerHTML = "";

    if (data.status === 'success' && Array.isArray(data.data) && data.data.length > 0) {
      data.data.forEach((video) => {
        const videoItem = document.createElement("div");
        videoItem.className = "video-item";
        videoItem.innerHTML = `
          <img src="${video.thumbnail}" alt="${video.title}" />
          <span>${video.title}</span>
        `;

        // Perbaiki bagian ini untuk mendapatkan URL musik
        const musicUrl = video.url;

        videoItem.addEventListener("click", () => {
          if (musicUrl) {
            const audioPlayer = new Audio(musicUrl);
            audioPlayer.loop = true;
            audioPlayer.play();
            player.style.display = "none"; // Sembunyikan player
          } else {
            alert("URL musik tidak ditemukan!");
          }
        });

        resultsDiv.appendChild(videoItem);
      });
    } else {
      alert("Musik tidak ditemukan!");
    }
  } catch (error) {
    alert("Terjadi kesalahan saat mencari musik!");
    console.error(error);
  }
});