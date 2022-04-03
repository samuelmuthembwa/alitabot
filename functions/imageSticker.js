const fs = require('fs');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const  ffmpeg = require("fluent-ffmpeg")
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
let r = (Math.random() + 1).toString(36).substring(7);
const filePath = "./images/alitabot.jpeg"
const stickerPath = "./temp/st-" + r + ".webp";
try {
    
    console.log("Converting...")
    ffmpeg(filePath)
    .outputOptions(["-y", "-vcodec libwebp"])
    .videoFilters(
        "scale=2000:2000:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=2000:2000:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1"
    )
    .save(stickerPath)
    .on("end", async () => {
       console.log("Sticker made.")
    })
    .on('error', (er)=>{
        console.log("Err in function : "+er)
    })
} catch (error) {
    console.log("Error: "+error)
}