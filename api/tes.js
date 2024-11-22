const axios = require('axios');

const API_URL = 'https://www.antoncodder.online/api/tiktok';
const API_KEY = 'AlphaCoder'; // API key sesuai yang digunakan

const testSpam = async () => {
    for (let i = 1; i <= 11; i++) {
        try {
            const response = await axios.get(API_URL, {
                params: {
                    apikey: API_KEY,
                    url: 'https://www.tiktok.com/@example/video/123456789', // Ganti dengan URL TikTok yang valid
                },
            });
            console.log(`Request ${i}:`, response.data);
        } catch (error) {
            console.error(`Request ${i} error:`, error.response ? error.response.data : error.message);
        }
    }
};

testSpam();
