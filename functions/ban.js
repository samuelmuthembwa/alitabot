module.exports = {
    
    async handleBan(sock, resolve, m){
        const {bannedUsers} = require("../database/store")
        console.log("A ban function")
        try {
            if(resolve.args.length < 1)
            {
                await sock.sendMessage(m.key.remoteJid, { text: `👻 No one to ban....😈`}, {quoted: m})

            }
            else{
                var tobeBanned = resolve.args.replace("@","").replace(" ","")+"@s.whatsapp.net"
                await sock.sendMessage(m.key.remoteJid, { text: `👻 The tagged user was banned from using AlitaBot till unbanned by bot owner.😈`}, {quoted: m})
                
                bannedUsers.push(tobeBanned)
                console.log("Banned users array"+bannedUsers+"\n")

            }
            
        } catch (error) {
            console.log(error)
            sock.sendMessage(resolve.sender, {text: "👸🏾 Couldn't ban the tagged user"}, {quoted: m})
        }
    },

    async handleUnBan(sock, resolve, m){
        const {bannedUsers} = require("../database/store")
        console.log("A unban function")
        try {
            if(resolve.args.length < 1)
            {
                await sock.sendMessage(m.key.remoteJid, { text: `👻 No one to unban... `}, {quoted: m})
            }
            else{
            var tobeunBanned = resolve.args.replace("@","").replace(" ","")+"@s.whatsapp.net"
            await sock.sendMessage(m.key.remoteJid, { text: `👸🏾 *The tagged user was unbanned by bot owner.* `}, {quoted: m})
            for( var i = 0; i < bannedUsers.length; i++){ 
    
                if ( bannedUsers[i] === tobeunBanned) { 
            
                    bannedUsers.splice(i, 1); 
                }
            
            }
        }
        } catch (error) {
            sock.sendMessage(resolve.sender, {text: "👸🏾 Couldn't unban the tagged user"}, {quoted: m})
        }
    }

}
    
