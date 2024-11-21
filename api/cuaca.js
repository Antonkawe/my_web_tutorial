const axios = require('axios');
const API_KEY = "060a6bcfa19809c2cd4d97a212b19273";
const sendResponse = (res, status, message, data = null, errorCode = null) => {
    const response = {
        status,
        message,
        timestamp: new Date().toISOString(),
        data,
        errorCode,
    };
    const httpStatus = status === 'success' ? 200 : status === 'error' && errorCode === 'INVALID_API_KEY' ? 401 : 500;
    res.status(httpStatus).end(JSON.stringify(response, null, 2));  
};
module.exports = async (req, res) => {
    const { apikey, q: city } = req.query;
    const validApiKey = "AlphaCoder03";
    if (apikey !== validApiKey) {
        return sendResponse(
            res,
            'error',
            'API Key tidak valid.',
            null,
            'INVALID_API_KEY'
        );
    }
    if (!city) {
        return sendResponse(
            res,
            'error',
            'Lokasi tidak ditemukan. Harap berikan nama kota.',
            null,
            'MISSING_CITY'
        );
    }
    try {
        const wdata = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&language=id`);
        const weatherData = {
            weather: wdata.data.weather[0].main,
            description: wdata.data.weather[0].description,
            temperature: wdata.data.main.temp,
            feels_like: wdata.data.main.feels_like,
            pressure: wdata.data.main.pressure,
            humidity: wdata.data.main.humidity,
            wind_speed: wdata.data.wind.speed,
            latitude: wdata.data.coord.lat,
            longitude: wdata.data.coord.lon,
            country: wdata.data.sys.country
        };
        return sendResponse(
        res,
        'success',
        `Cuaca untuk kota ${city}`,
           {
              project: 'AlphaCoder',
              owner: 'Anton',
              weatherData
           }
        );
    } catch (error) {
        return sendResponse(
            res,
            'error',
            'Gagal mendapatkan data cuaca. Silakan coba lagi.',
            { details: error.message }
        );
    }
};