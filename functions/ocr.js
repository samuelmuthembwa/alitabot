const tesseract = require("node-tesseract-ocr")
const pref = require("../config/prefix")
const config = {
    lang : "eng",
    oem: 1,
    psm: 3
}
module.exports = {
    async handleOcr(sock, resolve, m){
        if(resolve.mimetype == "image")
        {
           try {
            let stream = await downloadContentFromMessage(m.message.imageMessage, 'image')
            let buffer = Buffer.from([])
            for await(const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk])
            }
            let r = (Math.random() + 1).toString(36).substring(7);
            let imgpath = "./temp/img/"+r+".jpeg";
            fs.writeFile(imgpath, buffer, function(err) {
                if(err) {
                    return console.log(err);
                }
                tesseract.recognize(imgpath, config)
                .then((txt)=>{
                    sock.sendMessage(resolve.sender, { text: txt}, {quoted: m})
                })
                .catch((er)=>{
                    sock.sendMessage(resolve.sender, { text: er}, {quoted: m})
                })
            })
           } catch (error) {
            sock.sendMessage(resolve.sender, { text: "👸🏾 Could not download image."}, {quoted: m})
           }
        }
    }
}