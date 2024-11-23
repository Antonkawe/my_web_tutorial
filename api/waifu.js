const Redis = require("ioredis");
const axios = require("axios");
const redis = new Redis(process.env.REDIS_URL);
const API_KEY = "AlphaCoder03";
const BASE_URL = "https://api.waifu.im/search/";
const LIMIT_WINDOW = 60 * 1000;
const REQUEST_LIMIT = 10;
const BLOCK_DURATION = 60 * 60 * 24 * 7;

module.exports = async (req, res) => {
    const clientIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const { tags, apikey } = req.query;
    const isBlocked = await redis.get(`blocked:${clientIP}`);
    if (isBlocked) {
        return res.end(
            JSON.stringify(
                {
                    status: "error",
                    errorCode: "IP_BLOCKED",
                    message: "IP Anda telah diblokir karena terlalu banyak permintaan.",
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
                    status: "error",
                    errorCode: "INVALID_API_KEY",
                    message: "API Key tidak valid.",
                },
                null,
                2
            )
        );
    }
    const redisKey = `rate_limit:${clientIP}`;
    const currentRequests = await redis.incr(redisKey);
    if (currentRequests === 1) {
        await redis.pexpire(redisKey, LIMIT_WINDOW);
    }
    if (currentRequests > REQUEST_LIMIT) {
        await redis.set(`blocked:${clientIP}`, true, "EX", BLOCK_DURATION);
        return res.end(
            JSON.stringify(
                {
                    status: "error",
                    errorCode: "RATE_LIMIT_EXCEEDED",
                    message: `Anda diblokir karena terlalu banyak permintaan. Hubungi administrator jika ini adalah kesalahan.`,
                },
                null,
                2
            )
        );
    }
    if (!tags) {
        return res.end(
            JSON.stringify(
                {
                    status: "error",
                    errorCode: "MISSING_TAGS",
                    message: "Tag tidak diberikan.",
                },
                null,
                2
            )
        );
    }
    try {
        const response = await axios.get(BASE_URL, { params: { included_tags: tags } });
        const { images } = response.data;
        if (!images || images.length === 0) {
            return res.end(
                JSON.stringify(
                    {
                        status: "error",
                        errorCode: "TAGS_NOT_FOUND",
                        message: "Tags tidak ditemukan.",
                    },
                    null,
                    2
                )
            );
        }
        return res.end(
            JSON.stringify(
                {
                    status: "success",
                    project: "AlphaCoder",
                    owner: "Anton",
                    timestamp: new Date().toISOString(),
                    images: {
                        name: images[0].tags.name,
                        description: images[0].tags.description,
                        url: images[0].url,
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
                    details: error.message,
                },
                null,
                2
            )
        );
    }
};