const axios = require('axios');
const API_KEY = 'AlphaPrayer03';
module.exports = async (req, res) => {
    const { city, method = 2, apikey } = req.query;
    if (apikey !== API_KEY) {
        return sendError(res, 'INVALID_API_KEY', 'API Key tidak valid.');
    }
    if (!city) {
        return sendError(res, 'MISSING_CITY', 'Parameter kota tidak diberikan.');
    }

    try {
        const response = await axios.get('http://api.aladhan.com/v1/timingsByCity', {
            params: { city, country: 'Indonesia', method },
        });
        const { timings, date, meta } = response.data.data;
        return res.end(
            JSON.stringify(
                {
                    status: 'success',
                    project: 'AlphaCoder',
                    owner: 'Anton Thomzz',
                    location: `${city}, ${meta.timezone}`,
                    date: date.readable,
                    method: meta.method.name,
                    timings: formatTimings(timings),
                },
                null,
                2
            )
        );
    } catch (error) {
        return sendError(res, 'SERVER_ERROR', `Terjadi kesalahan saat mengambil data: ${error.message}`);
    }
};

const formatTimings = (timings) => ({
    Fajr: timings.Fajr,
    Dhuhr: timings.Dhuhr,
    Asr: timings.Asr,
    Maghrib: timings.Maghrib,
    Isha: timings.Isha,
});

const sendError = (res, code, message) => {
    res.end(
        JSON.stringify(
            {
                status: 'error',
                errorCode: code,
                message: message,
                timestamp: new Date().toISOString(),
            },
            null,
            2
        )
    );
};