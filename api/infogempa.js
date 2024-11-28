const axios = require('axios');
const API_KEY = "AlphaCoder03";
module.exports = async (req, res) => {
    const { apikey } = req.query;
    if (apikey !== API_KEY) {
        return res.end(
            JSON.stringify(
                {
                    status: 'error',
                    errorCode: 'INVALID_API_KEY',
                    message: 'API Key tidak valid.',
                    timestamp: new Date().toISOString(),
                    details: 'Periksa API Key yang Anda kirimkan dan pastikan itu benar.',
                },
                null,
                2
            )
        );
    }
    try {
        const url = 'https://data.bmkg.go.id/DataMKG/TEWS/';
        const response = await axios.get(url+'autogempa.json');
        const gempa = response.data.Infogempa.gempa;
        return res.end(
            JSON.stringify(
                 {
                     status: 'success',
                     project: 'AlphaCoder',
                     owner: 'Anton Thomz',
                     message: 'Informasi Gempa Terkini',
                     data: {
                           Tanggal: gempa.Tanggal,
                           Jam: gempa.Jam,
                           DateTime: gempa.DateTime,
                           Coordinates: gempa.Coordinates,
                           Lintang: gempa.Lintang,
                           Bujur: gempa.Bujur,
                           Magnitude: gempa.Magnitude,
                           Kedalaman: gempa.Kedalaman,
                           Wilayah: gempa.Wilayah,
                           Potensi: gempa.Potensi,
                           Dirasakan: gempa.Dirasakan,
                           thumbnail: url+gempa.Shakemap
                     },
                }, null, 2
            )
        );
    } catch (error) {
        return res.end(
            JSON.stringify(
                {
                    status: 'error',
                    message: 'Gagal mendapatkan data gempa. Silakan coba lagi.',
                    timestamp: new Date().toISOString(),
                    details: error.message
                }, null, 2
            )
        );
    }
};