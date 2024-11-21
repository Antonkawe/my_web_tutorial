const axios = require('axios');
const API_KEY = 'AlphaCoder03';
const TENOR_API_KEY = 'AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ';

module.exports = async (req, res) => {
    const { emoji1, emoji2, apikey } = req.query;
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
    if (!emoji1 || !emoji2) {
        return res.end(
            JSON.stringify(
                {
                    status: 'error',
                    errorCode: 'MISSING_EMOJI',
                    message: 'Emoji1 dan Emoji2 harus diberikan.',
                    timestamp: new Date().toISOString(),
                    details: "Gunakan format: ?emoji1=😅&emoji2=🤔",
                },
                null,
                2
            )
        );
    }
    try {
        const apiUrl = `https://tenor.googleapis.com/v2/featured?key=${TENOR_API_KEY}&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`;
        const response = await axios.get(apiUrl);
        const { results } = response.data;
        if (!results || results.length === 0) {
            return res.end(
                JSON.stringify(
                    {
                        status: 'error',
                        errorCode: 'NO_RESULTS',
                        message: 'Tidak ditemukan hasil untuk kombinasi emoji tersebut.',
                        timestamp: new Date().toISOString(),
                        details: 'Coba gunakan kombinasi emoji lain.',
                    },
                    null,
                    2
                )
            );
        }
        const images = results.map(result => ({
            url: result.url,
            tags: result.tags || [],
        }));
        return res.end(
            JSON.stringify(
                {
                    status: 'success',
                    project: 'AlphaCoder',
                    owner: 'Anton',
                    timestamp: new Date().toISOString(),
                    images,
                },
                null,
                2
            )
        );
    } catch (error) {
        return res.end(
            JSON.stringify(
                {
                    status: 'error',
                    errorCode: 'SERVER_ERROR',
                    message: 'Terjadi kesalahan pada server.',
                    timestamp: new Date().toISOString(),
                    details: error.message,
                },
                null,
                2
            )
        );
    }
};