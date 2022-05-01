const fs = require('fs');
const { downloadContentFromMessage } = require ('@adiwajshing/baileys')
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const  ffmpeg = require("fluent-ffmpeg")
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const filePath = "./images/alitabot.jpeg"
module.exports = {
    async handleSticker(sock, resolve, m){
        if(resolve.mimetype == "image")
        {
            try {
                const stream = await downloadContentFromMessage(m.message.imageMessage, 'image')
                let buffer = Buffer.from([])
                for await(const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                let r = (Math.random() + 1).toString(36).substring(7);
                let imgpath = "./temp/img/"+r+".jpeg";
                const stickerPath = "./temp/img/st-" + r + ".webp";
                fs.writeFile(imgpath, buffer, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    try {
                        ffmpeg(imgpath)
                     .outputOptions(["-y", "-vcodec libwebp"])
                     .videoFilters(
                         "scale=2000:2000:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=2000:2000:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1"
                     )
                     .save(stickerPath)
                     .on("end", async () => {
                        await sock.sendMessage(
                            resolve.sender, 
                            {sticker: { url: stickerPath }}
                            ,{quoted: m}
                        ).then(()=>{
                            try {
                            fs.unlinkSync(imgpath)
                            fs.unlinkSync(stickerPath)
                            } catch(err) {
                            console.error(err)
                            }
                        })
                     })
                     .on('error', (er)=>{
                        sock.sendMessage(m.key.remoteJid, {text: "⚠️ Image could not be converted to sticker."}, {quoted: m})
                     })
                    } catch (error) {
                        sock.sendMessage(m.key.remoteJid, {text: "⚠️ Image could not be converted to sticker."}, {quoted: m})
                    }
                }); 
            } catch (err) {
                sock.sendMessage(m.key.remoteJid, {text: "⚠️ Image could not be converted to sticker."}, {quoted: m})
            }
        }
        else{
            sock.sendMessage(m.key.remoteJid, {text: "⚠️ Send me an image please."}, {quoted: m})
        }

    }
}
