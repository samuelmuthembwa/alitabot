const { ytv } = require("./downloaders")
const ytsearch = require('yt-search');
module.exports = {

    async handleVideo(sock, resolve, m){
        try {
            ytsearch(resolve.args).then((results)=>{
                let info = results.videos[0]
                if (!info.liveStream) {
                    let url = info.url;
                    let capdata =`💿 *Title*: ${info.title}\n🤹🏾‍♀️ *Author*: ${info.author.name}\n⏲️ *Duration*: ${info.duration.timestamp} Minutes\n😀 *Views*: ${info.views}\n⬆️ *Released*: ${info.ago}\n📕 *Description*: ${info.description}\n\n🎧 *Downloading video* ... `;
                    sock.sendMessage(m.key.remoteJid, {image: {url: info.thumbnail}, caption: capdata}, {quoted: m}).then(()=>{
                        ytv(url).then((res)=>{
                            sock.sendMessage(
                                m.key.remoteJid, 
                                { video: { url: res.dl_link }, mimetype: 'video/mp4' },
                                {quoted: m}
                            )
                        }).catch((err)=>{
                            sock.sendMessage(m.key.remoteJid, {text: err+"⚠️ Error occured."}, {quoted: m})
                        })
                    })
                    
                     
                }
            }).catch((er)=>{
                sock.sendMessage(m.key.remoteJid, {text: "⚠️ 1 Error occured."}, {quoted: m})
            })
        } catch (error) {
            sock.sendMessage(m.key.remoteJid, {text: "⚠️ 2 Error occured."}, {quoted: m})
        }
    },
  
    
}



