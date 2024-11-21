const axios = require("axios");
const API_KEY = "AlphaCoder03";
const BASE_URL = "https://api.waifu.im/search/";

module.exports = async (req, res) => {
    const { tags, apikey } = req.query;
    if (apikey !== API_KEY) {
        return res.end(
            JSON.stringify(
                {
                    status: "error",
                    errorCode: "INVALID_API_KEY",
                    message: "API Key tidak valid.",
                    timestamp: new Date().toISOString(),
                    requestId: apikey || "N/A",
                    details: "Periksa API Key yang Anda kirimkan dan pastikan itu benar.",
                },
                null,
                2
            )
        );
    }
    if (!tags) {
        return res.end(
            JSON.stringify(
                {
                    status: "error",
                    errorCode: "MISSING_TAGS",
                    message: "Tag tidak diberikan.",
                    timestamp: new Date().toISOString(),
                    details: "Tambahkan parameter 'tags' pada permintaan Anda.",
                },
                null,
                2
            )
        );
    }
    try {
        const response = await axios.get(BASE_URL, { params: { included_tags: tags } });
        const { images } = response.data;
        if (!images || images.length === 0) {
            return res.end(
                JSON.stringify(
                    {
                        status: "error",
                        errorCode: "TAGS_NOT_FOUND",
                        message: "Tags tidak ditemukan. Berikut adalah daftar tags yang tersedia:",
                        tags: {
                            versatile: [
                                "maid",
                                "waifu",
                                "marin-kitagawa",
                                "mori-calliope",
                                "raiden-shogun",
                                "selfies",
                                "uniform",
                                "kamisato-ayaka",
                            ],
                            nsfw: [
                                "ass",
                                "hentai",
                                "milf",
                                "oral",
                                "paizuri",
                                "ecchi",
                                "ero",
                            ],
                        },
                        timestamp: new Date().toISOString(),
                        details: "Gunakan salah satu tags di atas untuk permintaan Anda.",
                    },
                    null,
                    2
                )
            );
        }
        const image = images[0];
        return res.end(
            JSON.stringify(
                {
                    status: "success",
                    project: "AlphaCoder",
                    owner: "Anton",
                    timestamp: new Date().toISOString(),
                    images: {
                        name: image.tags.name,
                        description: image.tags.description,
                        url: image.url,
                    },
                },
                null,
                2
            )
        );
    } catch (error) {
        return res.end(
            JSON.stringify(
                {
                    status: "error",
                    errorCode: "SERVER_ERROR",
                    message: "Terjadi kesalahan pada server. Cobalah lagi nanti.",
                    timestamp: new Date().toISOString(),
                    details: error.message,
                },
                null,
                2
            )
        );
    }
};
