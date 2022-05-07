const axios =require("axios")
const cheerio = require('cheerio')
try {
    let link = "https://www.musixmatch.com/search/"+"mwambieni";
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
            console.log("\n\n"+lyrics_data)
            // sock.sendMessage(m.key.remoteJid, {text:"「「  👸🏾 *Alita Bot* 」」\n\n*Lyrics Search Engine*\n"+lyrics_data}, {quoted: m});
        })
        .catch((err)=>{
            console.log("\n\n  1 ERR"+err)
            // sock.sendMessage(m.key.remoteJid, {text:"「「  👸🏾 *Alita Bot* 」」\n\n 😒 No Lyrics found."},{quoted: m})
        })
    }).catch((err)=>{
        console.log("\n\n  2 ERR"+err)
        // sock.sendMessage(m.key.remoteJid, {text:"「「  👸🏾 *Alita Bot* 」」\n\n 😒 No Lyrics found."},{quoted: m})
    })
} catch (error) {
    console.log("\n\n  3 ERR"+error)
    // sock.sendMessage(m.key.remoteJid, {text:"「「  👸🏾 *Alita Bot* 」」\n\n 😒 No Lyrics found."},{quoted: m})
}