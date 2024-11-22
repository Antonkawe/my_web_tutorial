const axios = require('axios');
const redis = require('redis');
const API_KEY = 'AlphaCoder03';
const BLOCK_DURATION = 604800;
const client = redis.createClient();

client.on('error', (err) => {
    console.error('Redis error: ', err);
});

// Pastikan Redis sudah siap
client.on('ready', () => {
    console.log('Redis client connected and ready');
});

module.exports = async (req, res) => {
    const { url, apikey } = req.query;
    const ip = req.ip;

    try {
        // Mengecek apakah IP diblokir
        const isBlocked = await new Promise((resolve, reject) => {
            client.get(`${ip}:blocked`, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });

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

        // Menghitung jumlah permintaan yang dilakukan oleh IP ini
        const count = await new Promise((resolve, reject) => {
            client.incr(`${ip}:count`, (err, count) => {
                if (err) reject(err);
                resolve(count);
            });
        });

        // Jika permintaan pertama, set waktu expire
        if (count === 1) {
            client.expire(`${ip}:count`, 60);
        }

        // Jika melebihi 10 permintaan, blokir IP
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

        // Memproses permintaan untuk mengambil video dari TikTok
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
                    },
                    null,
                    2
                )
            );
        } catch (error) {
            console.error('Error getting video:', error);
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
    } catch (error) {
        console.error('Error processing request:', error);
        return res.end(
            JSON.stringify(
                {
                    status: 'error',
                    message: 'Terjadi kesalahan saat memproses permintaan.',
                    details: error.message,
                },
                null,
                2
            )
        );
    }
};