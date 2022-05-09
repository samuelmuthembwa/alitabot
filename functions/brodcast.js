module.exports = {
    async handleBrodcast(sock, resolve, m){
        let {groups} = require('../database/store')
        console.log("\nGroups: "+groups)
        for(var i = 0; i< groups.length; i++)
        {
            sock.sendMessage(groups[i], {text: "☘️☘️☘️☘️☘️☘️☘️☘️\n「「  👸🏾 *Alita Bot* 」」\n☘️☘️☘️☘️☘️☘️☘️☘️\n*Broadcast*: "+resolve.args+"\n\nby: Botdev [Sam]"})
        }
        
    }
}