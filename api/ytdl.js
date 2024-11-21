const { download } = require('btch-downloader');

module.exports = async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({
            status: 'error',
            message: 'URL video YouTube tidak ditemukan.',
        });
    }
    try {
        const video = await download(url);
        res.status(200).json({
            status: 'success',
            message: 'Video siap untuk diunduh!',
            url: video.url,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Terjadi kesalahan saat mengunduh video.',
            details: error.message,
        });
    }
};