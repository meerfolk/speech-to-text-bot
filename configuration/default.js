module.exports = {
    server: {
        port: 3000,
    },
    telegram: {
        token: process.env.TELEGRAM_TOKEN,
    },
    availableChatIds: JSON.parse(process.env.AVAILABLE_CHAT_IDS || '[]'),
    workerInterval: 5 * 60 * 1000,
};
