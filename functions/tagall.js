module.exports = {
    
    async handleTagall(sock, resolve, m){
        const {tagAll} = require("../database/store")
        try {
            sock.groupMetadata(m.key.remoteJid, false).then((metadata)=>{
                const array = metadata.participants.map(all => all.id)
                let allMembers = ''
                array.forEach((participant, i) => allMembers += `@${array[i].replace('@s.whatsapp.net', '')}\n`)
                sock.sendMessage(m.key.remoteJid, { text: `\nβοΈπβοΈπβοΈπβοΈπβοΈπ\n     γγ  πΈπΎ *Alita Bot* γγ\nβοΈπβοΈπβοΈπβοΈπβοΈπ\nβ¨ *Reason for tag:* ${resolve.args}\n${allMembers}`, mentions: array }, {quoted: m})
                tagAll.push(m.key.participant)
            })
            
        } catch (error) {
            sock.sendMessage(resolve.sender, {text: "πΈπΎ Couldn't tag all memmbers"}, {quoted: m})
        }
    }
}
    
