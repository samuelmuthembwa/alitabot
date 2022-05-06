module.exports = {
    async handleContact(sock, resolve, m){
        const templateButtons = [
            {index: 1, urlButton: {displayText: '💬 DM Now', url: 'https://wa.me/254759439032'}},
            {index: 2, callButton: {displayText: 'Call me', phoneNumber: '+254 7594 39032'}},
        ]

        const templateMessage = {
            text: "「「  👸🏾 *Alita Bot* 」」\n",
            footer: "Creator: Muthembwa ©2022",
            templateButtons: templateButtons
        }
        sock.sendMessage(m.key.remoteJid, templateMessage, {quoted: m})
    }
}
