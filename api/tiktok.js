const axios = require('axios');
const API_KEY = 'AlphaCoder03';
module.exports = async (req, res) => {
    const { url, apikey } = req.query;
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
    if (!url) {
        return res.end(
            JSON.stringify(
                {
                    status: 'error',
                    message: 'URL TikTok tidak diberikan.',
                },
                null,
                2
            )
        );
    }
    try {
        const response = await axios.get('https://tikwm.com/api/', { params: { url } });
        if (response.data?.data?.play) {
            return res.end(
                JSON.stringify(
                    {
                        status: 'success',
                        project: 'AlphaCoder',
                        owner: 'Anton',
                        video: {
                            id: response.data.data.id,
                            region: response.data.data.region,
                            title: response.data.data.title,
                            url: response.data.data.play,
                            duration: response.data.data.duration,
                        },
                        author: response.data.author || response.data.data.author,
                    },
                    null,
                    2
                )
            );
        }
        return res.end(
            JSON.stringify(
                {
                    status: 'error',
                    errorCode: 'VIDEO_NOT_FOUND',
                    message: 'Video tidak ditemukan.',
                    timestamp: new Date().toISOString(),
                    requestId: apikey,
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
                    message: 'Terjadi kesalahan pada server.',
                    details: error.message,
                },
                null,
                2
            )
        );
    }
};