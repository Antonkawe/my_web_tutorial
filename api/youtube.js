const ytSearch = require('yt-search');
const API_KEY = 'AlphaCoder03';

module.exports = async (req, res) => {
    const { query, apikey } = req.query;
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
    if (!query) {
        return res.end(
            JSON.stringify(
                {
                    status: 'error',
                    message: 'Query pencarian tidak diberikan.',
                },
                null,
                2
            )
        );
    }
    try {
        const result = await ytSearch(query);
        const videos = result.videos
            .sort((a, b) => b.views - a.views)
            .slice(0, 15)
            .map((video) => ({
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
        return res.end(
            JSON.stringify(
                {
                    status: 'success',
                    project: 'AlphaCoder',
                    owner: 'Anton',
                    data: videos,
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