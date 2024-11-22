const redis = require('redis');
const API_KEY_DEV = 'Anton-AlphaCoder-03';
const client = redis.createClient();
client.on('error', (err) => {
    console.error('Redis error: ', err);
});

module.exports = async (req, res) => {
    const { apikey } = req.query;
    if (apikey !== API_KEY_DEV) {
        return res.end(
            JSON.stringify(
                {
                    status: 'error',
                    message: 'API key tidak valid untuk akses developer.',
                },
                null,
                2
            )
        );
    }
    try {
        client.keys('*:blocked', (err, keys) => {
            if (err) throw err;

            if (keys.length === 0) {
                return res.end(
                    JSON.stringify(
                        {
                            status: 'success',
                            message: 'Tidak ada IP yang sedang diblokir.',
                            data: [],
                        },
                        null,
                        2
                    )
                );
            }
            const blockedIPs = [];
            keys.forEach((key) => {
                const ip = key.split(':')[0];
                client.ttl(key, (err, ttl) => {
                    if (err) throw err;
                    blockedIPs.push({ ip, ttl });
                    if (blockedIPs.length === keys.length) {
                        return res.end(
                            JSON.stringify(
                                {
                                    status: 'success',
                                    message: 'Daftar IP yang sedang diblokir.',
                                    data: blockedIPs,
                                },
                                null,
                                2
                            )
                        );
                    }
                });
            });
        });
    } catch (error) {
        return res.end(
            JSON.stringify(
                {
                    status: 'error',
                    message: 'Terjadi kesalahan saat membaca data.',
                    details: error.message,
                },
                null,
                2
            )
        );
    }
};