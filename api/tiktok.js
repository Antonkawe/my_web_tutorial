const axios = require('axios');
const { aend, sendError, formatNumber, getRegionName, formatFileSize, formatDuration } = require("./data/utils");
const API_KEY = "AlphaCoder03";

module.exports = async (req, res) => {
    const { url, apikey } = req.query;
    if (apikey !== API_KEY) return sendError(res, 'INVALID_API_KEY', 'API Key tidak valid.');
    if (!url) return sendError(res, 'MISSING_URL', 'URL TikTok tidak diberikan.');
    try {
        const response = await axios.get('https://tikwm.com/api/', { params: { url } });
        const data = response.data?.data;

        if (data?.play) {
            send(
                status: 'success',
                project: 'AlphaCoder',
                owner: 'Anton Thomzz',
                video: formatVideoData(data),
                profile: data.author
            );
        }
        return sendError(res, 'VIDEO_NOT_FOUND', 'Video tidak ditemukan.');
    } catch (error) {
        return sendError(res, 'SERVER_ERROR', `Terjadi kesalahan pada server: ${error.message}`);
    }
};

const formatVideoData = data => ({
    id: data.id,
    title: data.title,
    play: formatNumber(data.play_count),
    likes: formatNumber(data.digg_count),
    comment: formatNumber(data.comment_count),
    share: formatNumber(data.share_count),
    download: formatNumber(data.download_count),
    favorit: formatNumber(data.collect_count),
    upload: new Date(data.create_time * 1000).toISOString(),
    region: getRegionName(data.region),
    duration: formatDuration(data.duration),
    size: formatFileSize(data.size),
    url: data.play
});