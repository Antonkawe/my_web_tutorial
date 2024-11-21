const fetch = require('node-fetch');

export default async function handler(req, res) {
    const { url } = req.query;
    console.log('URL received:', url);
    if (!url) {
        console.log('Error: URL tidak diberikan');
        return res.status(400).json({ status: 'error', message: 'URL tidak diberikan.' });
    }
    try {
        const requestUrl = `https://www.antoncodder.online/api/tiktok?url=${encodeURIComponent(url)}&apikey=AlphaCoder03`;
        console.log('Requesting API:', requestUrl);
        const response = await fetch(requestUrl);
        const data = await response.json();
        console.log('API Response:', data);
        return res.status(200).json(data);
    } catch (error) {
        console.error('API Error:', error.message);
        return res.status(500).json({ status: 'error', message: 'Kesalahan server.' });
    }
}