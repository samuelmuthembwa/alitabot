const fs = require('fs');
const { downloadContentFromMessage } = require ('@adiwajshing/baileys');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const  ffmpeg = require("fluent-ffmpeg")
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const filePath = "vid.mkv"
let r = (Math.random() + 1).toString(36).substring(7);
const stickerPath = "./temp/st-" + r + ".webp";
module.exports = {
    async handleGif(sock, resolve, m){
        if(resolve.mimetype == "video")
        {
            try {
                const stream = await downloadContentFromMessage(m.message.videoMessage, 'video')
                let buffer = Buffer.from([])
                for await(const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                let r = (Math.random() + 1).toString(36).substring(7);
                let vidpath = "./temp/vid/"+r+".mp4";
                const gifPath = "./temp/vid/st-" + r + ".webp";
                fs.writeFile(vidpath, buffer, function(err) {
                    if(err) {
                        console.log("\n\nError 1"+err)
                        sock.sendMessage(m.key.remoteJid, {text: "⚠️ Image could not be converted to sticker."}, {quoted: m})
                    }
                    try {
                        ffmpeg(vidpath)
                            .duration(8)
                            .outputOptions([
                                "-y",
                                "-vcodec libwebp",
                                "-lossless 1",
                                "-qscale 1",
                                "-preset default",
                                "-loop 0",
                                "-an",
                                "-vsync 0",
                                "-s 600x600",
                            ])
                            .videoFilters(
                                "scale=600:600:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=600:600:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1"
                            )
                            .save(gifPath)
                            .on("end",()=>{
                                sock.sendMessage(
                                    resolve.sender, 
                                    {sticker: { url: gifPath }}
                                    ,{quoted: m}
                                ).then(()=>{
                                    try {
                                    fs.unlinkSync(gifPath)
                                    fs.unlinkSync(vidpath)
                                    } catch(err) {
                                    console.error(err)
                                    }
                                })
                            })
                            .on('error', (r)=>{
                                console.log("\n\nError 2"+r)
                                sock.sendMessage(m.key.remoteJid, {text: "⚠️ Image could not be converted to sticker."}, {quoted: m})
                            })
                    } catch (error) {
                        console.log("\n\nError 3"+error)
                        sock.sendMessage(m.key.remoteJid, {text: "⚠️ Image could not be converted to sticker."}, {quoted: m})
                    }
                });
            } catch (error) {
                console.log("\n\nError 4"+error)
                sock.sendMessage(m.key.remoteJid, {text: "⚠️ Image could not be converted to sticker."}, {quoted: m})
            }
        }
        else{
            sock.sendMessage(m.key.remoteJid, {text: "⚠️ Send me a video."}, {quoted: m})
        }
    }
}
