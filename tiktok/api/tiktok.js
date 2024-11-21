import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ status: 'error', message: 'URL tidak diberikan.' });
    }
    try {
        const response = await fetch(`https://www.antoncodder.online/api/tiktok?url=${encodeURIComponent(url)}&apikey=AlphaCoder03`);
        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Kesalahan server.' });
    }
}