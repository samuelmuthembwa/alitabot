const axios =require("axios")
const cheerio = require('cheerio')
module.exports = {
    async handleLyrics(sock, resolve, m){
        if(resolve.args == ""){
            sock.sendMessage(info.sender, {text:"「「  👸🏾 *Alita Bot* 」」\n\n  😃 Give me a song title." }, {quoted: m})
        }
        else{
            try {
                let link = "https://www.musixmatch.com/search/"+resolve.args;
                axios({
                    
                    method: 'get',
                    url: encodeURI(link)
                }).then((res)=>{
                    
                    let $ = cheerio.load(res.data)
                    let mainpage_url = $("#site").find("div > div > div > div > div > div > div > div > div ")
                    return link = `https://www.musixmatch.com` + $(mainpage_url).find('h2 > a').attr('href')
                    
                }).then((res)=>{
                    axios({
                        method: 'get',
                        url: encodeURI(link)
                    }).then((res)=>{
                        let $ = cheerio.load(res.data)
                        let lyrics_data = $('#site').find('.mxm-lyrics__content > .lyrics__content__ok').text()
                        sock.sendMessage(m.key.remoteJid, {text:"「「  👸🏾 *Alita Bot* 」」\n\n*Lyrics Search Engine*\n"+lyrics_data}, {quoted: m});
                    })
                    .catch((err)=>{
                        sock.sendMessage(m.key.remoteJid, {text:"「「  👸🏾 *Alita Bot* 」」\n\n 😒 No Lyrics found."},{quoted: m})
                    })
                }).catch((err)=>{
                    sock.sendMessage(m.key.remoteJid, {text:"「「  👸🏾 *Alita Bot* 」」\n\n 😒 No Lyrics found."},{quoted: m})
                })
            } catch (error) {
                sock.sendMessage(m.key.remoteJid, {text:"「「  👸🏾 *Alita Bot* 」」\n\n 😒 No Lyrics found."},{quoted: m})
            }
        }
    }
}
