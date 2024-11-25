const region = require("./language");

const formatNumber = num => (num >= 1e6 ? (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M' :
    (num >= 1e3 ? (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'k' : num.toString()));

const getRegionName = code => region[code] || 'Unknown Region';

const formatFileSize = bytes => {
    if (bytes >= 1e12) return (bytes / 1e12).toFixed(1) + ' TB';
    if (bytes >= 1e9) return (bytes / 1e9).toFixed(1) + ' GB';
    if (bytes >= 1e6) return (bytes / 1e6).toFixed(1) + ' MB';
    if (bytes >= 1e3) return (bytes / 1e3).toFixed(1) + ' KB';
    return bytes + ' B';
};

const formatDuration = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} menit ${remainingSeconds} detik`;
};

module.exports = { formatNumber, getRegionName, formatFileSize, formatDuration };