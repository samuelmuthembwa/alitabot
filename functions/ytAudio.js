const { yta } = require("./downloaders")
const ytsearch = require('ytsearch');
module.exports = {

    async handleAudio(sock, resolve, m){
        try {
            ytsearch(resolve.args).then((results)=>{
                let info = results.videos[0]
                if (!info.liveStream) {
                    let data = {
                        image: {url: info.thumbnail.url},
                        caption: `💿 *Title*: ${info.title}\n🤹🏾‍♀️ *Author*: ${info.author.name}\n⏲️ *Duration*: ${info.duration.timestamp}\n😀 *Views*: ${info.views}\n⬆️ *Released*: ${info.ago}\n📕 *Description*: ${info.description}\n`,
                    }
                    let url = info.url;
                    sock.sendMessage(m.key.remoteJid, data, {quoted: m}).then(()=>{
                        sock.sendMessage(m.key.remoteJid, {text: "🎧 Downloading ... "}, {quoted: m})
                        .then(()=>{
                            getAudio(url, sock, m)

                        })
                    })
                    
                    getAudio = (url, sock, m)=>{
                        yta(url).then((res)=>{
                            
                            sock.sendMessage(
                                m.key.remoteJid, 
                                { audio: { url: res.dl_link }, mimetype: 'audio/mp4' },
                                {quoted: m}
                            )
                        }).catch((err)=>{
                            sock.sendMessage(m.key.remoteJid, {text: "⚠️ Error occured."}, {quoted: m})
                        })
                    } 
                }
            }).catch((er)=>{
                sock.sendMessage(m.key.remoteJid, {text: "⚠️ Error occured."}, {quoted: m})
            })
        } catch (error) {
            sock.sendMessage(m.key.remoteJid, {text: "⚠️ Error occured."}, {quoted: m})
        }
    },
  
    
}



