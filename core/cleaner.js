const {AlitaBotObject} = require('./coreClass')
const pref = require("../config/prefix")
let {groups} = require('../database/store')
exports.cleaner = async(m, sock )=>{
    return new Promise(async (resolve, reject)=>{
        try {
            AlitaBotObject.isGroup = m.key.remoteJid.split("@")[1] == "g.us" ? true : false;
            AlitaBotObject.mimetype = Object.keys(m.message) == "imageMessage" ? 'image' : Object.keys(m.message) == "videoMessage" ? "video" : Object.keys(m.message) == "conversation" ? "convo" :  Object.keys(m.message) == "extendedTextMessage" ? "ex-text" : "other";
            AlitaBotObject.body = AlitaBotObject.mimetype == "ex-text" ?  m.message.extendedTextMessage.text: AlitaBotObject.mimetype == "convo" ? m.message.conversation : "" ;
            AlitaBotObject.sender =  m.key.remoteJid;
            AlitaBotObject.owner = "254759439032@s.whatsapp.net";
            AlitaBotObject.botId = "254734962640@s.whatsapp.net";
            AlitaBotObject.imgCaption = AlitaBotObject.mimetype == "image" ? AlitaBotObject.body = m.message.imageMessage.caption  : "";
            AlitaBotObject.videoCaption = AlitaBotObject.mimetype == "video" ? AlitaBotObject.body = m.message.videoMessage.caption  : "";
            AlitaBotObject.isCmd = pref.includes(AlitaBotObject.body.charAt(0), 0)? true: false;
            AlitaBotObject.command = pref.includes(AlitaBotObject.body.charAt(0), 0) ? AlitaBotObject.body.split(" ")[0].substring(1) : "";
            AlitaBotObject.quotedsender = AlitaBotObject.mimetype == "ex-text" ? m.message.extendedTextMessage.contextInfo.participant : "";
            AlitaBotObject.groupMetadata = AlitaBotObject.isGroup == true ? await sock.groupMetadata(m.key.remoteJid) : '';
            var rawArgs = AlitaBotObject.body.split(" ")
            var rawArgsArr = []
            if(AlitaBotObject.isGroup)
            {
                if(groups.includes(AlitaBotObject.sender) == false)
                {
                    groups.push(AlitaBotObject.sender)
                }
            }
            for(var i=1; i<=rawArgs.length; i++)
            {
                var argChunk = rawArgs[i]
                rawArgsArr.push(argChunk)
            }
            AlitaBotObject.args = rawArgsArr.join(" ").replace(","," ")
            AlitaBotObject.groupMembers =AlitaBotObject.isGroup ? AlitaBotObject.groupMetadata.participants : '';
            AlitaBotObject.groupAdmins = AlitaBotObject.isGroup ? getGroupAdmins(AlitaBotObject.groupMembers) : '';
            return resolve(AlitaBotObject)
    
        } catch (error) {
            console.log("Something went wrong in cleaner file.\n"+error)
        }

    })
    
}
function getGroupAdmins(participants){
    var admins = [];
    for (var i in participants) {
        participants[i].admin != null? admins.push(participants[i].id) : '';
    }
    return admins;
}
