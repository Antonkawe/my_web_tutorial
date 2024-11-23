const axios = require("axios");

const testApiKey = async (apiKey) => {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=Ks-_Mh1QhMc&key=${apiKey}`;
  
  try {
    const response = await axios.get(url);
    console.log("API Key Valid! Berikut datanya:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("API Key Tidak Valid atau Quota Habis!", error.response.status, error.response.statusText);
    } else {
      console.error("Terjadi kesalahan saat menguji API Key:", error.message);
    }
  }
};

// Masukkan API Key yang ingin diuji
testApiKey("AIzaSyDXc8z_dNA04L6J42deJyH3ObPeKvOLizw");