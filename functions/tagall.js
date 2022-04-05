module.exports = {
    
    async handleTagall(sock, resolve, m){
        const {tagAll} = require("../database/store")
        console.log("A tag function")
        try {
            const metadata = await sock.groupMetadata(m.key.remoteJid, false);
            const array = metadata.participants.map(all => all.id)
            let allMembers = ''
            array.forEach((participant, i) => allMembers += `@${array[i].replace('@s.whatsapp.net', '')}\n`)
            await sock.sendMessage(m.key.remoteJid, { text: `✨ *Reason for tag:* ${resolve.args}\n${allMembers}`, mentions: array }, {quoted: m})
            tagAll.push(m.key.participant)
        } catch (error) {
            sock.sendMessage(resolve.sender, {text: "👸🏾 Couldn't tag all memmbers"}, {quoted: m})
        }
    }
}
    
