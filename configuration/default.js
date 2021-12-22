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
                container_sas: process.env.AZURE_CONTAINER_SAS,
            },
            cognitive: {
                region: process.env.AZURE_COGNITIVE_REGION,
                subscriptionKey: process.env.AZURE_COGNITIVE_SUBSCRIPTION_KEY,
                locale: process.env.AZURE_COGNITIVE_LOCALE,
            },
        }
    }
};
