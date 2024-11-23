const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");
const player = document.getElementById("player");

searchBtn.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  if (!query) return alert("Masukkan kata kunci pencarian!");

  const apiKey = "AIzaSyDXc8z_dNA04L6J42deJyH3ObPeKvOLizw";
  const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    resultsDiv.innerHTML = "";
    if (data.items && data.items.length > 0) {
      data.items.forEach((video) => {
        const videoItem = document.createElement("div");
        videoItem.className = "video-item";
        videoItem.innerHTML = `
          <img src="${video.snippet.thumbnails.default.url}" alt="${video.snippet.title}" />
          <span>${video.snippet.title}</span>
        `;

        const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
        videoItem.addEventListener("click", () => {
          window.open(videoUrl, "_blank");
        });

        resultsDiv.appendChild(videoItem);
      });
    } else {
      alert("Tidak ada hasil ditemukan.");
    }
  } catch (error) {
    alert("Terjadi kesalahan saat mencari video.");
    console.error(error);
  }
});