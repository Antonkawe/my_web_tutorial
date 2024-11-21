const axios = require('axios');
const API_KEY = 'AlphaCoder03';

module.exports = async (req, res) => {
    const { apikey, surahName } = req.query;

    // Validasi API Key
    if (apikey !== API_KEY) {
        return res.end(
            JSON.stringify(
                {
                    status: 'error',
                    errorCode: 'INVALID_API_KEY',
                    message: 'API Key tidak valid.',
                    timestamp: new Date().toISOString(),
                    requestId: apikey || 'N/A',
                    details: 'Periksa API Key yang Anda kirimkan dan pastikan itu benar.'
                },
                null,
                2
            )
        );
    }

    // Validasi Nama Surah
    if (!surahName) {
        return res.end(
            JSON.stringify(
                {
                    status: 'error',
                    message: 'Nama Surah tidak diberikan.',
                },
                null,
                2
            )
        );
    }

    try {
        // Mengambil daftar surah dari API eksternal
        const surahListResponse = await axios.get('https://api.alquran.cloud/v1/surah');
        const surahList = surahListResponse.data.data;

        // Menampilkan data surah yang didapat untuk debugging
        console.log('Daftar Surah:', surahList);

        // Mencari surah berdasarkan nama yang diberikan
        const surah = surahList.find((s) => s.englishName.toLowerCase() === surahName.toLowerCase());

        if (!surah) {
            return res.end(
                JSON.stringify(
                    {
                        status: 'error',
                        errorCode: 'SURAH_NOT_FOUND',
                        message: `Surah dengan nama ${surahName} tidak ditemukan.`,
                        timestamp: new Date().toISOString(),
                        requestId: apikey,
                    },
                    null,
                    2
                )
            );
        }

        // Mengambil detail surah dan teksnya
        const API_URL = `https://api.alquran.cloud/v1/surah/${surah.number}`;
        const response = await axios.get(API_URL);

        if (response.data.status === 'OK') {
            const surahData = response.data.data;

            // Menampilkan data surah untuk debugging
            console.log('Data Surah:', surahData);

            return res.end(
                JSON.stringify(
                    {
                        status: 'success',
                        project: 'AlphaCoder',
                        owner: 'Anton',
                        surah: {
                            id: surahData.number,
                            name: surahData.englishName,
                            revelation: surahData.revelationType,
                            verses: surahData.numberOfAyahs,
                            translation: surahData.englishNameTranslation,
                            fullText: surahData.ayahs.map((ayah) => ayah.text).join(' '), // Menampilkan teks lengkap surah
                        },
                    },
                    null,
                    2
                )
            );
        } else {
            return res.end(
                JSON.stringify(
                    {
                        status: 'error',
                        errorCode: 'SURAH_NOT_FOUND',
                        message: `Surah dengan nama ${surahName} tidak ditemukan.`,
                        timestamp: new Date().toISOString(),
                        requestId: apikey,
                    },
                    null,
                    2
                )
            );
        }
    } catch (error) {
        console.error('Terjadi kesalahan pada server:', error); // Log error untuk debugging

        return res.end(
            JSON.stringify(
                {
                    status: 'error',
                    message: 'Terjadi kesalahan pada server.',
                    details: error.message,
                },
                null,
                2
            )
        );
    }
};
