const request =  require("request")
module.exports = {
    async handleDnsLookup(sock, resolve, m){
        if(resolve.args == ""){
            sock.sendMessage(info.sender, {text: "🌟 You didn't provide domain name."}, {quoted: m})
        }
        else{
            request.get({
                url: 'https://api.api-ninjas.com/v1/dnslookup?domain='+resolve.args,
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
                        sock.sendMessage(m.key.remoteJid, { text: "👸🏾 No records for the domain provided."}, {quoted: m})
                    }
                    else{
                        let info = JSON.parse(body)[0]
                        let record_type = info.record_type !== "" || info.record_type !== null || info.record_type !== undefined ? info.record_type : "N/A";
                        let value = info.value !== "" || info.value !== null || info.value !== undefined ? info.value : "N/A";
                        sock.sendMessage(m.key.remoteJid, { text: `🔥 Value : ${value}\n🌟 Record Type: ${record_type}`}, {quoted: m})
                    }

                }
            })
        }
    }
}