// bot.js

const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const P = require('pino');
async function startBot() {

    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({
        auth: state,
       logger: P({ level: 'silent' })
          });
    sock.ev.on('creds.update', saveCreds);
    // Afficher le QR code
        sock.ev.on('connection.update', (update) => {
        const { qr, connection } = update;
            if (qr) {
            console.log('QR code reçu, scanne-le avec WhatsApp:', qr);
        }
    if (connection === 'open') {
    console.log('✅ Bot connecté à WhatsApp');
        }
        });
    // Répondre aux messages
    sock.ev.on('messages.upsert', async (msg) => {
       const m = msg.messages[0];
        if (!m.message) return;
        const text = m.message.conversation;
        console.log('Message reçu:', text);
        if (text === 'ping') {
            await sock.sendMessage(m.key.remoteJid, { text: 'pong' });
            }
        });
    }
startBot();
