const {handle} = require("../functions/bestBets")
const {handleLive} = require('../functions/liveGames')
const {handleAlive} = require('../functions/alive')
const {handleTyops} = require("../functions/typos")
const {handleRemove}= require("../functions/remove")
const {handleWeather} =require("../functions/weather")
const {handleTagall} =  require("../functions/tagall")
const {handleBan, handleUnBan} = require("../functions/ban")
const { handleSticker } = require("../functions/stickerMaker")
const {tagAll, bannedUsers} = require("../database/store")
const { handleGif } = require("../functions/videoGif")
const { handleVideo } = require("../functions/ytVideo")
const { handleAudio } = require("../functions/ytAudio")
const { handleUploader } = require("../functions/uploader")
exports.commandHandler = async(resolve, m, sock)=>{
    if(resolve.isGroup)
    {
        
        let userId = m.key.participant;
        if(bannedUsers.includes(userId))
        {
            sock.sendMessage(m.key.remoteJid, {text: "❌ You were banned from using AlitaBot. Sorry contact bot owner."},{quoted: m})
        }
        else{
            switch (resolve.command) {
                case "sticker":
                    await handleSticker(sock, resolve, m)
                    break;
                case "video":
                    await handleVideo(sock, resolve, m)
                    break;
                case "audio":
                    await handleAudio(sock, resolve, m)
                    break;
                case "upload":
                    await handleUploader(sock, resolve, m)
                    break;
                case "gif":
                    await handleGif(sock, resolve, m)
                    break;
                case "ban":
                    let userId = m.key.participant;
                    if(userId != resolve.owner)
                    {
                        sock.sendMessage(m.key.remoteJid, {text: "⛔ Bot owner command."},{quoted: m})
                    }
                    else{
                        let resBan= await handleBan(sock, resolve, m)
                    }
                    break;
                case "unban":
                    let user = m.key.participant;
                    if(user != resolve.owner)
                    {
                        sock.sendMessage(m.key.remoteJid, {text: "⛔ Bot owner command."},{quoted: m})
                    }
                    else{
                        await handleUnBan(sock, resolve, m)
                    }
                    break;

                case "tagall":
                    if(tagAll.includes(userId))
                    {
                        let msg = "❌ You used this command today, wait until tommorow or contact bot owner."
                        sock.sendMessage( resolve.sender, {text: msg}, {quoted: m})
                    }
                    else{
                        await handleTagall(sock, resolve, m)
                    }
                    break;
                case "bet" :
                case "bets":
                    await handle(resolve, m, sock)
                    
                    break;
                case "live":
                    await handleLive(resolve, m, sock)
                    break;
                case "typos":
                case "typo":
                    await handleTyops(resolve, m, sock)
                    break;
                case "remove":
                   await handleRemove(resolve, m, sock)
        
                    break;
                case "alive":
                    await handleAlive(resolve, m, sock)
                    break;
                case "weather":
                    await handleWeather(resolve, m, sock)
                    break;
                default:
                    break;
            }   
        }
    }

}