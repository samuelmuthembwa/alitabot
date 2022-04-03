const fs = require('fs');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const  ffmpeg = require("fluent-ffmpeg")
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const filePath = "vid.mkv"
let r = (Math.random() + 1).toString(36).substring(7);
const stickerPath = "./temp/st-" + r + ".webp";
try {
    console.log("Gif conversion started ....")
    ffmpeg(filePath)
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
        .save(stickerPath)
        .on("end",()=>{
            console.log("Gif made. ")
        })
        .on('error', (r)=>{
            console.log("Gif FFMPeg : "+r)
        })
} catch (error) {
    console.log("Gif Error : "+error)
}