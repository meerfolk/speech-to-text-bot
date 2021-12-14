module.exports = {
    server: {
        port: 3000,
    },
    telegram: {
        token: process.env.TELEGRAM_TOKEN,
    },
    availableChatIds: JSON.parse(process.env.AVAILABLE_CHAT_IDS || '[]'),
    workerInterval: 5 * 1000,
    cloud: {
        azure: {
            storage: {
                account: process.env.AZURE_STORAGE_ACCOUNT,
                sas: process.env.AZURE_STORAGE_SAS,
                container: process.env.AZURE_STORAGE_CONTAINER,
            }
        }
    }
};
