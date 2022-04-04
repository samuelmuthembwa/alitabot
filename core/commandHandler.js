const {handle} = require("../functions/bestBets")
const {handleLive} = require('../functions/liveGames')
const {handleAlive} = require('../functions/alive')
const {handleTyops} = require("../functions/typos")
const {handleRemove}= require("../functions/remove")
exports.commandHandler = async(resolve, m, sock)=>{
    switch (resolve.command) {
        case "bet" :
        case "bets":
            let resBets= await handle(resolve, m, sock)
            
            break;
        case "live":
            let resLive= await handleLive(resolve, m, sock)
            
            break;
        case "typos":
        case "typo":
            let resTypos= await handleTyops(resolve, m, sock)
            break;
        case "remove":
            let resRemove= await handleRemove(resolve, m, sock)

            break;
        case "alive":
            let resAlive= await handleAlive(resolve, m, sock)
            break;
        default:
            break;
    }
}