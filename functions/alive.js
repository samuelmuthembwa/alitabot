module.exports = {
    async handleAlive(resolve, m, sock){
        // send a buttons message with image header!
        const buttons = [
            {buttonId: 'alivebtncall', buttonText: {displayText: 'ð Contact'}, type: 1},
            {buttonId: 'alivebtnPremier', buttonText: {displayText: 'â½ Premier League'}, type: 1},
            {buttonId: 'alivebtnhelp', buttonText: {displayText: 'Help'}, type: 1}
        ]
        
        
        const buttonMessage = {
            image: {url: './images/alitabot.jpeg'},
            caption: "Hey thereð¥°ð¥°ð¥°\nI am ð¸ð¾ *Alita Bot* ð§¡â¤\n\nI will help you manage your whatsapp group ð, personal chat and get Internet content for you\nIn my development stages currently if you notice any bug ð§ð¾ or want to suggest a future contact my developer.\n [version 2.0]",
            footerText: "AlitaBot",
            // buttons: buttons,
            headerType: 4
        }
        
        sock.sendMessage(resolve.sender, buttonMessage,{quoted: m})

}}