const axios = require("axios");
const { Redis } = require("@upstash/redis");
const redis = new Redis({
  url: "https://gentle-lamprey-42227.upstash.io",
  token: "AaTzAAIjcDE0Y2UwY2IzNDZmZjE0NDMyYWMxNDA3ZThhM2NiYjFmY3AxMA",
});

const API_KEY = "AlphaCoder03";
const BASE_URL = "https://api.waifu.im/search/";
const LIMIT_WINDOW = 60 * 1000;
const REQUEST_LIMIT = 4;
const BLOCK_DURATION = 60 * 60 * 24 * 7;

module.exports = async (req, res) => {
  try {
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
      await redis.expire(redisKey, LIMIT_WINDOW / 1000);
    }
    if (currentRequests > REQUEST_LIMIT) {
      await redis.set(`blocked:${clientIP}`, true);
      await redis.expire(`blocked:${clientIP}`, BLOCK_DURATION);
      return res.end(
        JSON.stringify(
          {
            status: "error",
            errorCode: "RATE_LIMIT_EXCEEDED",
            message: "Anda telah diblokir karena terlalu banyak permintaan.",
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
          images: images[0],
        },
        null,
        2
      )
    );
  } catch (error) {
    console.error("Server Error:", error.message);
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