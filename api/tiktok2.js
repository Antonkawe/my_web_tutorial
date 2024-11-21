const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
       return res.status(200).end();
    }
    const { url } = req.query;
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