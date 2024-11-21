const axios = require('axios');
const FormData = require('form-data');
const API_KEY = 'AlphaCoder03';
const RAPID_API_KEY = '0b5dabdf3emsh8a71baf9c06480cp117160jsn849009b7cf8e';
const RAPID_API_HOST = 'phototoanime1.p.rapidapi.com';
const sendResponse = (res, status, message, data = null, errorCode = null) => {
    const response = {
        status,
        message,
        timestamp: new Date().toISOString(),
        data,
        errorCode,
    };
    return res.end(JSON.stringify(response, null, 2));
};
const validateApiKey = (apikey) => apikey === API_KEY;
module.exports = async (req, res) => {
    const { apikey, url } = req.query;

    if (!validateApiKey(apikey)) {
        return sendResponse(
            res,
            'error',
            'API Key tidak valid.',
            null,
            'INVALID_API_KEY'
        );
    }

    if (!url) {
        return sendResponse(
            res,
            'error',
            'URL gambar tidak ditemukan.'
        );
    }

    try {
        const form = new FormData();
        form.append('image', url);
        form.append('style', 'face2paint');
        const response = await axios.post(
            `https://${RAPID_API_HOST}/photo-to-anime`,
            form,
            {
                headers: {
                    'X-RapidAPI-Key': RAPID_API_KEY,
                    'X-RapidAPI-Host': RAPID_API_HOST,
                    ...form.getHeaders(),
                },
            }
        );
        const animeImageUrl = response.data.imageUrl;
        return sendResponse(
            res,
            'success',
            'Foto berhasil diubah menjadi anime.',
            {
                project: 'AlphaCoder',
                owner: 'Anton',
                url: animeImageUrl
            }
        );
    } catch (error) {
        return sendResponse(
            res,
            'error',
            'Terjadi kesalahan saat memproses foto.',
            { details: error.message }
        );
    }
};