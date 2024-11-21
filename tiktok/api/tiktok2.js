const axios = require('axios');

export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ status: 'error', message: 'URL tidak diberikan.' });
    }
    try {
        const requestUrl = `https://www.antoncodder.online/api/tiktok2`;
        const response = await axios.post(requestUrl, {
            url: url
        });
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Kesalahan server.' });
    }
}