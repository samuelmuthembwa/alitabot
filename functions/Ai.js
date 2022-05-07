const axios = require('axios')
module.exports = {
    async handleAi(sock, resolve, m){
        try {
            var alita_ai = "http://api.brainshop.ai/get?bid=164282&key=Kmjncuh3Oc2pV8OI&uid=[uid]&msg="+resolve.body;
            axios({
                method: 'GET',
                url: encodeURI(alita_ai)
            })
            .then((res)=>{
                sock.sendMessage(m.key.remoteJid, {text: res.data.cnt}, {quoted: m});
                
                // sock.sendMessage(m.key.remoteJid,{text: res.data.cnt})
                console.log("\n\n"+JSON.stringify(m)+"\n\n")
                
            })
            .catch((err)=>{
                console.log("\n\n"+err+"\n\n")
                // sock.sendMessage(m.key.remoteJid,{text: "😃 I don't recognise emojis or special characters yet."})
            })
        }catch(er){
            console.log(er)
        }

    }
}
