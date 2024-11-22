const axios = require('axios');
const redis = require('redis');
const API_KEY = 'AlphaCoder03';
const BLOCK_DURATION = 604800;
const client = redis.createClient();
client.on('error', (err) => {
    console.error('Redis error: ', err);
});

module.exports = async (req, res) => {
    const { url, apikey } = req.query;
    const ip = req.ip;
    client.get(`${ip}:blocked`, (err, isBlocked) => {
        if (err) throw err;
        if (isBlocked) {
            return res.end(
                JSON.stringify(
                    {
                        status: 'error',
                        message: `IP Anda diblokir karena melanggar kebijakan. Silakan coba lagi setelah ${BLOCK_DURATION / 86400} hari.`,
                    },
                    null,
                    2
                )
            );
        }
        if (apikey !== API_KEY) {
            return res.end(
                JSON.stringify(
                    {
                        status: 'error',
                        errorCode: 'INVALID_API_KEY',
                        message: 'API Key tidak valid.',
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
        client.incr(`${ip}:count`, (err, count) => {
            if (err) throw err;
            if (count === 1) client.expire(`${ip}:count`, 60);
            if (count > 10) {
                client.set(`${ip}:blocked`, '1', 'EX', BLOCK_DURATION);
                return res.end(
                    JSON.stringify(
                        {
                            status: 'error',
                            message: 'Permintaan Anda terlalu berlebihan. IP Anda telah diblokir selama 1 minggu. Mohon patuhi batas penggunaan API untuk menghindari pemblokiran di masa mendatang.',
                        },
                        null,
                        2
                    )
                );
            }
            axios.get('https://tikwm.com/api/', { params: { url } })
                .then((response) => {
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
                            },
                            null,
                            2
                        )
                    );
                })
                .catch((error) => {
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
                });
        });
    });
};