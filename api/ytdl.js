const { exec } = require('child_process');
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
                    details: 'Periksa API Key yang Anda kirimkan dan pastikan itu benar.',
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
                    message: 'URL video tidak diberikan.',
                },
                null,
                2
            )
        );
    }

    const command = `yt-dlp -f best --get-title --get-duration --get-url --get-filename "${url}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.end(
                JSON.stringify(
                    {
                        status: 'error',
                        message: 'Terjadi kesalahan saat menjalankan yt-dlp.',
                        details: error.message,
                    },
                    null,
                    2
                )
            );
        }

        if (stderr) {
            return res.end(
                JSON.stringify(
                    {
                        status: 'error',
                        message: 'Terjadi kesalahan pada yt-dlp.',
                        details: stderr,
                    },
                    null,
                    2
                )
            );
        }

        try {
            const output = stdout.split('\n').filter(Boolean);
            const title = output[0];
            const duration = output[1];
            const mp4Url = output[2];
            const mp3Url = output[3];

            return res.end(
                JSON.stringify(
                    {
                        status: 'success',
                        project: 'AlphaCoder',
                        owner: 'Anton',
                        data: {
                            title: title,
                            duration: duration,
                            mp4Url: mp4Url,
                            mp3Url: mp3Url,
                        },
                    },
                    null,
                    2
                )
            );
        } catch (e) {
            return res.end(
                JSON.stringify(
                    {
                        status: 'error',
                        message: 'Terjadi kesalahan dalam memproses data.',
                        details: e.message,
                    },
                    null,
                    2
                )
            );
        }
    });
};