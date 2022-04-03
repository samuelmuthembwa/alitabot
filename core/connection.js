const makeWAclientet = require('@adiwajshing/baileys').default; 
const conn = new WAConnection();
conn.version = [3, 3234, 9];
exports.WhatsApp = conn;
console.log("Connection Module")
