// bot.js

const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const P = require('pino');
const qrcode = require('qrcode-terminal'); // <-- ajout obligatoire
async function startBot() {

    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({
        auth: state,
       logger: P({ level: 'silent' })
          });
    sock.ev.on('creds.update', saveCreds);
    // Afficher le QR code et l'état de connexion
    sock.ev.on('connection.update', (update) => {
        console.log('Update reçu:', update); // log brut pour debug
        const { qr, connection } = update;
        if (qr) {
            qrcode.generate(qr, { small: true }); // QR code ASCII
            }
        if (connection === 'open') {
            console.log('✅ Bot connecté à WhatsApp');
            }
        if (connection === 'close') {
            console.log('❌ Connexion fermée, relance le bot');
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
