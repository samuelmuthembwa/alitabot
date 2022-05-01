// const fs = require('fs');
// const { upload } = require("./downloaders")
// module.exports = {

//     async handleUploader(sock, resolve, m){
//         // console.log(JSON.stringify(m))
//         try {
//             // const stream = await downloadContentFromMessage(m.message.documentMessage, 'application')
//             // let buffer = Buffer.from([])
//             // for await(const chunk of stream) {
//             //     buffer = Buffer.concat([buffer, chunk])
//             // }
//             let ext = m.message.extendedTextMessage.contextInfo.
//             let r = (Math.random() + 1).toString(36).substring(7);
//             console.log(JSON.stringify(ext))
//         } catch (error) {
//             sock.sendMessage(m.key.remoteJid, {text: "⚠️ Could not upload the image."}, {quoted: m})
//         }
//     }
// }
