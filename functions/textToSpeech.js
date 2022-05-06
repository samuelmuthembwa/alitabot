const tts = require("google-translate-tts")
const fs = require("fs")
module.exports = {
    
    async handleTTs(sock, resolve, m){
        try {
            if(resolve.args == ""){
                sock.sendMessage(info.sender, {text: "🌟 You didn't provide a celebrity name."}, {quoted: m})
            }
            else{
                let buffer = await tts.synthesize({
                    text: resolve.args,
                    voice: 'en-US',
                });
                let r = (Math.random() + 1).toString(36).substring(7);
                let audioMP3 = "./temp/mp3/"+r+".mp3";
                fs.writeFile(audioMP3, buffer, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    await sock.sendMessage(
                        m.key.remoteJid, 
                        { audio: { url: audioMP3}, mimetype: 'audio/mp3' },
                        {quoted: m}
                    ).then(()=>{
                        try {
                        fs.unlinkSync(audioMP3)
                        } catch(err) {
                        console.error(err)
                        }
                    })
                })
            }
        } catch (error) {
            sock.sendMessage(m.key.remoteJid, { text: "👸🏾 Internal Server Error."}, {quoted: m})
        }      
    }
}