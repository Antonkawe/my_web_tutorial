const axios = require('axios');
module.exports = async (req, res) => {
    const query = req.query.q;
    const trackUrl = req.query.url;
    if (query && !trackUrl) {
        try {
            const response = await axios.get(`https://spotifyapi.caliphdev.com/api/search/tracks?q=${query}`);
            return res.end(
                JSON.stringify({
                    status: 'success',
                    project: 'AlphaCoder',
                    owner: 'Anton',
                    results: response.data
                }, null, 2)
            );
        } catch (error) {
            return res.end(
                JSON.stringify({
                    status: 'error',
                    message: 'Error fetching data',
                    error: error.message
                }, null, 2)
            );
        }
    }
    if (trackUrl) {
        try {
        const response = await axios.get(`https://spotifyapi.caliphdev.com/api/download/track?url=${trackUrl}`, {
            responseType: 'stream'
        });
        let fileName = 'Track_AlphaCoder.mp3';
        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition) {
            const match = contentDisposition.match(/filename="?(.+)"?/);
            fileName = match ? match[1] : fileName;
        }
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', response.headers['content-type']);
        response.data.pipe(res);
    } catch (error) {
            return res.end(
                JSON.stringify({
                    status: 'error',
                    message: 'Error fetching download data',
                    error: error.message
                }, null, 2)
            );
        }
    }
    return res.end(
        JSON.stringify({
            status: 'error',
            message: 'Query parameter q or url is required'
        }, null, 2)
    );
};