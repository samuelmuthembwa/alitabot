const { downloadContentFromMessage } = require ('@adiwajshing/baileys')
const memeMaker = require('meme-maker')
const fs = require('fs')
module.exports = {

    async handleMemeMaker(sock, resolve, m){
        try {
            var topText, bottomText;
            var resolvelength = resolve["args"].split(" ").length;
            if(resolvelength<1){
                sock.sendMessage(resolve.sender, {text: "γγ  πΈπΎ *Alita Bot* γγ This command should be followed by at least one text or more. E.g !meme alita bot"}, {quoted: m})
            }
            else if(resolvelength == 1){
                topText = resolve["args"].split(" ")[0]
            }
            else{
                topText = resolve["args"].split(" ")[0]
                bottomText = resolve["args"].split(" ")[1]
            }
            const stream = await downloadContentFromMessage(m.message.imageMessage, 'image')
            let buffer = Buffer.from([])
            for await(const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk])
            }
            let r = (Math.random() + 1).toString(36).substring(7);
            let imgpath = "./temp/img/"+r+".jpeg";
            const memePath = "./temp/img/meme-" + r + ".png";
            fs.writeFile(imgpath, buffer, function(err) {
                if(err) {
                    console.log("\n Mememaker function error: "+err);
                }
                memeMaker({
                    image: imgpath,         
                    outfile: memePath,
                    topText: topText,
                    bottomText: bottomText,
                }, async function(err) {
                    if(err) 
                    {

                    }
                    sock.sendMessage.sendMessage(resolve.sender, fs.readFileSync(memePath), MessageType.image, {filename: 'AlitaBot-meme.png', mimetype: Mimetype.png, caption: 'γγ  πΈπΎ *Alita Bot* γγ π Meme Maker'}, {quoted: m})
                    .then(()=>{
                        try {
                        fs.unlinkSync(imgpath)
                        fs.unlinkSync(memePath)
                        } catch(err) {
                        console.error(err)
                        }
                    })
                       
                });
            })
        } catch (error) {
            
        }
    }
}
