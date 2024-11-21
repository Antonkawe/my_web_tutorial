const axios = require('axios');
const API_KEY = 'AlphaCoder03';
const styles = [
    "clan",
    "amped",
    "neon",
    "winner",
    "carved",
    "glow",
    "aloha",
    "fabulous",
    "runner",
    "style",
    "smurfs",
    "blackbird",
    "water",
    "comics",
    "fluffy",
    "matrix"
];
module.exports = async (req, res) => {
    const { text, apikey, style } = req.query;
    if (apikey !== API_KEY) {
        return res.end(
            JSON.stringify(
                {
                    status: "error",
                    errorCode: "INVALID_API_KEY",
                    message: "API Key tidak valid.",
                    timestamp: new Date().toISOString(),
                    requestId: apikey || "N/A",
                    details: "Periksa API Key yang Anda kirimkan dan pastikan itu benar.",
                },
                null,
                2
            )
        );
    }
    if (!text) {
        return res.end(
            JSON.stringify(
                {
                    status: "error",
                    errorCode: "MISSING_TEXT",
                    message: "Teks tidak diberikan.",
                    timestamp: new Date().toISOString(),
                    details: "Tambahkan parameter 'text' pada permintaan Anda.",
                },
                null,
                2
            )
        );
    }
    if (!styles.includes(style)) {
        return res.end(
            JSON.stringify(
                {
                    status: "error",
                    errorCode: "INVALID_STYLE",
                    message: "Gaya tidak ditemukan. Berikut adalah daftar gaya yang valid:",
                    validStyles: styles,
                    timestamp: new Date().toISOString(),
                    details: "Pilih salah satu gaya yang valid dari daftar di atas.",
                },
                null,
                2
            )
        );
    }
    try {
        const imageUrl = `https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=${style}-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text=${encodeURIComponent(text)}`;
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const resultImageUrl = response.request.res.responseUrl;
        return res.end(
            JSON.stringify(
                {
                    status: "success",
                    project: "AlphaCoder",
                    owner: "Anton",
                    timestamp: new Date().toISOString(),
                    image: {
                        url: resultImageUrl,
                    },
                },
                null,
                2
            )
        );
    } catch (error) {
        return res.end(
            JSON.stringify(
                {
                    status: "error",
                    errorCode: "SERVER_ERROR",
                    message: "Terjadi kesalahan pada server.",
                    timestamp: new Date().toISOString(),
                    details: error.message,
                },
                null,
                2
            )
        );
    }
};
