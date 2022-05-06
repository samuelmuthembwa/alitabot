const request =  require("request")
module.exports = {
    async handleCelebrity(sock, resolve, m){
        if(resolve.args == ""){
            sock.sendMessage(info.sender, {text: "🌟 You didn't provide a celebrity name."}, {quoted: m})
        }
        else{
            try {
                request.get({
                    url: 'https://api.api-ninjas.com/v1/celebrity?name='+resolve.args,
                    headers: {
                        'X-Api-key': 'co+5Rd3Fghuv2RJ/Y5ypZQ==JoO6zg4EUycfDrTy'
                    },
                },function(error, response, body){
                    if(error)
                    {
                        sock.sendMessage(m.key.remoteJid, { text: "👸🏾 Could not fetch celebrity's details."}, {quoted: m})
                    }
                    else if(response.statusCode == 200){
                        if(body.length == 2 )
                        {
                            sock.sendMessage(m.key.remoteJid, { text: "👸🏾 No celebrity's details that match."}, {quoted: m})
                        }
                        else{
                            let info = body[0]
                            let name = info.name !== "" || info.name !== null || info.name !== undefined ? info.name : "N/A";
                            let worth = info.net_worth !== "" || info.net_worth !== null || info.net_worth !== undefined ? info.net_worth : "N/A";
                            let gender = info.gender !== "" || info.gender !== null || info.gender !== undefined ? info.gender : "N/A";
                            let height = info.height !== "" || info.height !== null || info.gender !== undefined ? info.gender : "N/A";
                            let birthday = info.birthday !== "" || info.birthday !== null || info.birthday !== undefined ? info.birthday : "N/A";
                            sock.sendMessage(m.key.remoteJid, { text: `🌟 Name : ${name}\n🔥 Net worth: ${worth}\n🍀 Gender: ${gender}\n❄️ Height: ${height}\n🥂 Birthday: ${birthday}`}, {quoted: m})
                        }
                    }
                })
            } catch (error) {
                sock.sendMessage(m.key.remoteJid, { text: "「「  👸🏾 *Alita Bot* 」」Internal Server Error."}, {quoted: m})
            }
        }
    }
}
