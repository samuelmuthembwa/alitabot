module.exports = {
    async handleContact(sock, resolve, m){
        const templateButtons = [
            {index: 1, urlButton: {displayText: 'π¬ DM Now', url: 'https://wa.me/254759439032'}},
            {index: 2, callButton: {displayText: 'Call me', phoneNumber: '+254 7594 39032'}},
        ]

        const templateMessage = {
            text: "γγ  πΈπΎ *Alita Bot* γγ\n",
            footer: "Creator: Muthembwa Β©2022",
            templateButtons: templateButtons
        }
        sock.sendMessage(m.key.remoteJid, templateMessage, {quoted: m})
    }
}
