const axios  = require('axios')
const FormData = require("form-data")
const fs = require("fs")
const path = require("path")

module.exports = {
    async handleRemoveBg (sock, resolve, m){
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
                    try {
                        let formData = new FormData()
                        formData.append('size','auto')
                        formData.append('image_file', fs.ReadStream(imgpath), path.basename(imgpath))
                        axios({
                            method: 'post',
                            url: 'https://api.remove.bg/v1.0/removebg',
                            data: formData,
                            responseType: 'arraybuffer',
                            headers: {
                                ...formData.getHeaders(),
                                'X-Api-Key': 'YVkXNavWfix26k3wfp9cpbw7'     
                            },
                            encoding: null
                        })
                        .then((response)=>{
                            if(response.status != 200)
                            {
                                sock.sendMessage(m.key.remoteJid, { text: "👸🏾 Internal Server Error."}, {quoted: m})
                            }
                            if(response.status == 200)
                            {
                                let r = (Math.random() + 1).toString(36).substring(7);
                                let rmbgPath = "./temp/img/"+r+".jpeg";
                                fs.writeFile(rmbgPath, response.data, function(err) {
                                    if(err) {
                                        sock.sendMessage(m.key.remoteJid, { text: "👸🏾 Internal Server Error."}, {quoted: m})
                                    }
                                })
                                sock.sendMessage(m.key.remoteJid,{ image: {url: './images/alitabot.jpeg'}, caption: "👸🏾 Alitabot Background Remover."}, {quoted: m})
                                .then(()=>{
                                    try {
                                        fs.unlinkSync(imgpath)
                                        fs.unlinkSync(rmbgPath)
                                    } catch(err) {
                                    console.error(err)
                                    }
                                })
                            }
                            
                        })
                        .catch((er)=>{
                            console.log("1 ERR "+er)
                            sock.sendMessage(m.key.remoteJid, { text: "👸🏾 Internal Server Error."}, {quoted: m})
                        })
                        
                    } catch (error) {
                        console.log("2 ERR "+error)
                        sock.sendMessage(m.key.remoteJid, { text: "👸🏾 Internal Server Error."}, {quoted: m})
                    }

                })
            } catch (error) {
                console.log("3 ERR "+eror)
                sock.sendMessage(m.key.remoteJid, { text: "👸🏾 Internal Server Error."}, {quoted: m})
            }
        }
    }
}
