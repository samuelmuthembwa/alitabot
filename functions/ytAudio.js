const { yta } = require("./downloaders")
const ytsearch = require('yt-search');
module.exports = {

    async handleAudio(sock, resolve, m){
        try {
            ytsearch(resolve.args).then((results)=>{
                let info = results.videos[0]
                if (!info.liveStream) {
                    let url = info.url;
                    let capdata =`💿 *Title*: ${info.title}\n🤹🏾‍♀️ *Author*: ${info.author.name}\n⏲️ *Duration*: ${info.duration.timestamp} Minutes\n😀 *Views*: ${info.views}\n⬆️ *Released*: ${info.ago}\n📕 *Description*: ${info.description}\n\n🎧 *Downloading Audio* ... `;
                    sock.sendMessage(m.key.remoteJid, {image: {url: info.thumbnail}, caption: capdata}, {quoted: m}).then(()=>{
                        yta(url).then((res)=>{
                            console.log(res.dl_link)
                            sock.sendMessage(
                                m.key.remoteJid, 
                                { audio: { url: res.dl_link }, mimetype: 'audio/mp4' },
                                {quoted: m}
                            )
                        }).catch((err)=>{
                            sock.sendMessage(m.key.remoteJid, {text: err+"⚠️ Error occured."}, {quoted: m})
                        })
                    })
   
                }
            }).catch((er)=>{
                sock.sendMessage(m.key.remoteJid, {text: er+"⚠️ Error occured."}, {quoted: m})
            })
        } catch (error) {
            sock.sendMessage(m.key.remoteJid, {text: error+"⚠️ Error occured."}, {quoted: m})
        }
    },
  
    
}



