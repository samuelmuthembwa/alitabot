module.exports = {
    async handleWeather(info, m, sock){
      let linkRegex = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i
      let isGroupLiink = linkRegex.exec(info.body)
      if(isGroupLiink)
      {
        sock.sendMessage(info.sende, {text: "🧐 Did i see a group invite link?"})
        if(info.isGroup)
        {
          if(info.groupAdmins.includes(info.botId))
          {
            
            
          }
        }
      }
    }}
  