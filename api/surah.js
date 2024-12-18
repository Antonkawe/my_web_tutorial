const axios = require('axios');
const API_KEY = 'AlphaCoder03';

module.exports = async (req, res) => {
    const { apikey, surahName } = req.query;

    if (apikey !== API_KEY) {
        return sendError(res, 401, 'INVALID_API_KEY', 'API Key tidak valid.', apikey);
    }
    if (!surahName) {
        return sendError(res, 400, 'MISSING_SURAH_NAME', 'Nama Surah tidak diberikan.');
    }

    try {
        const surahListResponse = await axios.get('https://api.alquran.cloud/v1/surah');
        const surahList = surahListResponse.data.data;
        const surah = surahList.find(s => s.englishName.toLowerCase() === surahName.toLowerCase());
        if (!surah) {
            return sendError(res, 404, 'SURAH_NOT_FOUND', `Surah dengan nama ${surahName} tidak ditemukan.`, apikey);
        }
        const surahDetailResponse = await axios.get(`https://api.alquran.cloud/v1/surah/${surah.number}`);
        const surahData = surahDetailResponse.data.data;
        const response = {
            status: 'success',
            code: 200,
            data: {
                project: 'AlphaCoder',
                owner: 'Anton',
                surah: {
                    id: surahData.number,
                    name: surahData.englishName,
                    revelation: surahData.revelationType,
                    verses: surahData.numberOfAyahs,
                    translation: surahData.englishNameTranslation,
                    fullText: Array.isArray(surahData.ayahs) ? surahData.ayahs.map(ayah => ayah.text).join(' ') : '',
                },
            },
        };
        return sendFormattedResponse(res, 200, 'success', response);
    } catch (error) {
        console.error('Terjadi kesalahan pada server:', error.message);
        return sendError(res, 500, 'SERVER_ERROR', 'Terjadi kesalahan pada server.', error.message);
    }
};

const sendError = (res, statusCode, errorCode, message, details = null) => {
    const response = {
        status: 'error',
        code: statusCode,
        error: {
            code: errorCode,
            message: message,
            details: details,
        },
        timestamp: new Date().toISOString(),
    };

    return sendFormattedResponse(res, statusCode, 'error', response);
};

const sendFormattedResponse = (res, statusCode, status, data) => {
    const formattedData = JSON.stringify(data, (key, value) => {
        if (typeof value === 'string') {
            return value.replace(/\n/g, '\n').replace(/\r/g, '');
        }
        return value;
    }, 2);
    return res.status(statusCode).end(formattedData);
};