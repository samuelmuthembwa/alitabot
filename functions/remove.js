module.exports = {
    async handleRemove(sock, resolve, m){
        if(resolve.isGroup)
        {
            if(resolve.groupAdmins.includes(resolve.botId) == false)
            {
                sock.sendMessage(resolve.sender, { text: "๐ธ๐พ I am not an admin yet."}, {quoted: m})
            }
            let sender = m.key.participant;
            if(resolve.groupAdmins.includes(sender) == false)
            {
                sock.sendMessage(resolve.sender, { text: "๐คน๐พ You are not admin. "}, {quoted: m})
            }
            
            if(resolve.body.split(" ")< 2)
            {
                sock.sendMessage(resolve.sender, { text: "๐ธ๐พ Tag the user to kick."}, {quoted: m})
            }
            else
            {
                if(resolve.groupAdmins.includes(resolve.botId) == true && resolve.groupAdmins.includes(sender)== true)
                {
                    try {
                        sock.sendMessage(resolve.sender, { text: "๐ธ๐พ Kicking user(s)."}, {quoted: m})
                        for(var i =0; i< resolve.args.split(" ").length;i++)
                        {
                            var tobeKicked = resolve.args.replace("@","").replace(" ","")+"@s.whatsapp.net"
                            console.log("Remove fun4"+ tobeKicked)
                            sock.groupParticipantsUpdate(
                                resolve.sender, 
                                [tobeKicked],
                                "remove" 
                            )

                        }  
                    } catch (error) {
                        sock.sendMessage(resolve.sender, { text: "๐ธ๐พ Could not remove user."}, {quoted: m})
                    }
                }
            }
        }
    }
}