const { WAConnection, MessageType } = require('@adiwajshing/baileys');

const conn = new WAConnection();
conn.autoReconnect = true;
conn.loadAuthInfo('./auth_info.json');

conn.on('open', () => {
    console.log('Bot is connected');
});

conn.on('chat-update', async (chatUpdate) => {
    if (!chatUpdate.hasNewMessage) return;
    const message = chatUpdate.messages.all()[0];
    const sender = message.key.remoteJid;

    if (message.message && message.message.conversation) {
        const command = message.message.conversation.toLowerCase();
        let response = '';

        switch (command) {
            case 'bonjour':
                response = 'Bonjour! Comment puis-je vous aider aujourd'hui?';
                break;
            case 'help':
                response = 'Commandes disponibles: bonjour, help, heure';
                break;
            case 'heure':
                response = `Current UTC Time: ${new Date().toUTCString()}`;
                break;
            default:
                response = 'Commande non reconnue. Tapez "help" pour voir les commandes disponibles.';
        }

        await conn.sendMessage(sender, response, MessageType.text);
    }
});

conn.connect();