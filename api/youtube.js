const ytdl = require('ytdl-core');
const API_KEY = 'AlphaCoder03';

module.exports = async (req, res) => {
  const { url, apikey } = req.query;
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
  if (!url) {
    return res.end(
      JSON.stringify(
        {
          status: 'error',
          message: 'URL video YouTube tidak diberikan.',
        },
        null,
        2
      )
    );
  }
  try {
    const video = await ytdl.getInfo(url);
    const videoUrl = video.formats.find(format => format.container === 'mp4').url;
    return res.end(
      JSON.stringify(
        {
          status: 'success',
          project: 'AlphaCoder',
          owner: 'Anton',
          video: {
            title: video.videoDetails.title,
            url: videoUrl,
            duration: video.videoDetails.lengthSeconds,
          },
          message: 'Video berhasil ditemukan!',
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
          message: 'Terjadi kesalahan saat mengambil video.',
          details: error.message,
        },
        null,
        2
      )
    );
  }
};