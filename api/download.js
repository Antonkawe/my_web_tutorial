const axios = require('axios');
function isBlockedUrl(url) {
    const blockedUrls = [
        /youtube\.com/,
        /facebook\.com/
    ];
    return blockedUrls.some(pattern => pattern.test(url));
}
module.exports = async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.end(
            JSON.stringify(
                {
                    status: 'error',
                    message: 'URL tidak diberikan.',
                },
                null,
                2
            )
        );
    }
    if (isBlockedUrl(url)) {
        return res.end(
            JSON.stringify(
                {
                    status: 'error',
                    errorCode: 'BLOCKED_URL',
                    message: 'Opss. API ini tidak mengizinkan pengunduhan secara langsung karena bisa dianggap ilegal.',
                    timestamp: new Date().toISOString(),
                },
                null,
                2
            )
        );
    }
    try {
        if (url.includes('mediafire.com')) {
            const response = await axios.get(url, { responseType: 'stream' });
            handleFileDownload(response, res);
        } else if (url.includes('drive.google.com')) {
            const driveFileId = extractGoogleDriveId(url);
            const fileDownloadUrl = await getGoogleDriveDownloadUrl(driveFileId);
            const response = await axios.get(fileDownloadUrl, { responseType: 'stream' });
            handleFileDownload(response, res);
        } else {
            const response = await axios({
                url,
                method: 'GET',
                responseType: 'stream',
                timeout: 15000,
            });
            handleFileDownload(response, res);
        }
    } catch (error) {
        return res.end(
            JSON.stringify(
                {
                    status: 'error',
                    message: 'Gagal mengunduh file.',
                    details: error.message,
                },
                null,
                2
            )
        );
    }
};
function handleFileDownload(response, res) {
    let fileName = 'AlphaCoder';
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        fileName = match ? match[1] : `AlphaCoder_${Date.now()}`;
    } else {
        const extension = response.headers['content-type'].split('/')[1];
        fileName = `AlphaCoder_${Date.now()}.${extension}`;
    }
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
}
function extractGoogleDriveId(url) {
    const regex = /(?:drive|file)\/d\/([^\/?]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}
async function getGoogleDriveDownloadUrl(fileId) {
    const apiUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const response = await axios.get(apiUrl, { headers: { Authorization: `Bearer YOUR_ACCESS_TOKEN` } });
    return response.data.webContentLink;
}
