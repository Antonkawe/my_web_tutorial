const region = require("./language");

/**
 * Format angka menjadi bentuk singkat (contoh: 1k, 1.2M)
 * @param {number} num - Angka yang akan diformat
 * @returns {string} Angka yang diformat
 */
const formatNumber = num => 
    num >= 1e6 ? `${(num / 1e6).toFixed(1).replace(/\.0$/, '')}M` :
    num >= 1e3 ? `${(num / 1e3).toFixed(1).replace(/\.0$/, '')}k` :
    num.toString();

/**
 * Mendapatkan nama wilayah berdasarkan kode
 * @param {string} code - Kode wilayah
 * @returns {string} Nama wilayah
 */
const getRegionName = code => region[code] || 'Unknown Region';

/**
 * Format ukuran file menjadi bentuk yang lebih mudah dibaca
 * @param {number} bytes - Ukuran file dalam byte
 * @returns {string} Ukuran file yang diformat
 */
const formatFileSize = bytes => {
    if (bytes < 0) return 'Invalid Size';
    if (bytes >= 1e12) return `${(bytes / 1e12).toFixed(1)} TB`;
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
    if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(1)} KB`;
    return `${bytes} B`;
};

/**
 * Format durasi dalam detik menjadi menit dan detik
 * @param {number} seconds - Durasi dalam detik
 * @returns {string} Durasi yang diformat
 */
const formatDuration = seconds => {
    if (seconds < 0) return 'Invalid Duration';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} menit ${remainingSeconds} detik`;
};

const sendError = (res, code, message) => {
    return res.end(JSON.stringify({
        status: 'error',
        errorCode: code,
        message: message,
        timestamp: new Date().toISOString()
    }, null, 2));
};

module.exports = { sendError, formatNumber, getRegionName, formatFileSize, formatDuration };