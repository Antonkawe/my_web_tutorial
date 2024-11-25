const ytSearch = require('yt-search');
const API_KEY = 'AlphaCoder03';

module.exports = async (req, res) => {
    const { query, apikey } = req.query;
    if (apikey !== API_KEY) return sendError(res, 'INVALID_API_KEY', 'API Key tidak valid.', apikey);
    if (!query) return sendError(res, 'MISSING_QUERY', 'Query pencarian tidak diberikan.');
    try {
        const result = await ytSearch(query);
        const videos = result.videos
            .sort((a, b) => b.views - a.views)
            .slice(0, 15)
            .map(video => ({
                title: video.title,
                thumbnail: video.thumbnail,
                url: video.url,
                channel: video.author.name,
                views: video.views,
                uploadDate: video.ago,
                duration: video.timestamp,
                description: video.description,
                embedUrl: `https://www.youtube.com/embed/${video.videoId}`,
            }));
        return res.end(JSON.stringify({
            status: 'success',
            project: 'AlphaCoder',
            owner: 'Anton',
            data: videos
        }, null, 2));
    } catch (error) {
        return sendError(res, 'SERVER_ERROR', `Terjadi kesalahan pada server: ${error.message}`);
    }
};

const sendError = (res, code, message, apikey = 'N/A') => {
    return res.end(JSON.stringify({
        status: 'error',
        errorCode: code,
        message: message,
        timestamp: new Date().toISOString(),
        requestId: apikey,
    }, null, 2));
};