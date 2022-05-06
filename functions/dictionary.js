const axios = require("axios")
const request = require("request")
module.exports = {
    async handleDictionary(resolve, m, sock){
        if(resolve.args == ""){
            sock.sendMessage(resolve.sender, {text:"「「  👸🏾 *Alita Bot* 」」\n\n  😃 Give me a world." }, {quoted: m})
        }
        else{ 
            var dictionary_api_url = `https://api.dictionaryapi.dev/api/v2/entries/en/${resolve.args}`;
            try {
                request(dictionary_api_url, function(err,response,  body){
                    if(err)
                    {
                        sock.sendMessage(resolve.sender, {text:"「「  👸🏾 *Alita Bot* 」」\n\n  🆘 Internal Server Error!" }, {quoted: m})
                    }else
                    {
                        let parsed = JSON.parse(body);
                        let phonetic = "";
                        let audio_url = "";
                        if(parsed instanceof Array)
                        {
                            if(typeof parsed[0].phonetic !== "undefined")
                            {
                                phonetic = parsed[0].phonetic;
                            }
                            if(parsed[0].phonetics.length > 0)
                            {
                                let audio_url_chunk = parsed[0].phonetics[0].audio;
                                audio_url = audio_url_chunk;
                                if(typeof audio_url_chunk !== "undefined")
                                {  
                                sendAudio(audio_url);
                                }else{
                                    sock.sendMessage(m.key.remoteJid, {text:"「「  👸🏾 *Alita Bot* 」」\n\n 🔇 Voice note not available." }, {quoted: m})
                                }
                            }
                            
                            let array_res =[];
                            for(var i=0; i<parsed[0].meanings.length; i++)
                            {
                                var partOfSpeech = "*"+parsed[0].meanings[i].partOfSpeech.toUpperCase()+"*: ";
                                var definition = parsed[0].meanings[i].definitions[0].definition;
                                array_res.push([partOfSpeech, definition])
                            }
                            for(var i = 0; i<array_res.length; i++)
                            {
                                array_res[i].join(" ");
                            }
                            let sentence = "";
                            for(var i = 0; i<array_res.length; i++)
                            {
                                sentence +=array_res[i]+"\n";
                            }
                            sock.sendMessage(m.key.remoteJid, {text:"\n「「   👸🏾 *Alita Bot* 🧡❤   」」\n\n🔊 *PHONETIC:* "+phonetic+"\n"+sentence}, {quoted: m})
                            
                            
                        }else{
                            sock.sendMessage(m.key.remoteJid, {text:"\n「「  👸🏾 *Alita Bot* 💚❤️ 」」\n\n🚧 No Definitions Found.\n😒 Try again later."}, {quoted: m});
                        }
                        async function sendAudio(audio_url)
                        {
                            if(typeof audio_url !== "undefined")
                            {
                                let vn_path = (Math.random() + 1).toString(36).substring(7)+".mp3";
                                let stream = fs.createWriteStream(vn_path);

                                try {
                                    axios({
                                        method: "get",
                                        url: audio_url,
                                        responseType: "stream"
                                    }).then((response)=>{
                                        response.data.pipe(stream);
                                        stream.on('finish', ()=>{
                                            let path = vn_path;
                                            let jid = m.key.remoteJid;
                                            sendAudio(path, jid)
                                            async function sendAudio(path, jid)
                                            {
                                                sock.sendMessage(
                                                    jid, 
                                                    { audio: { url: path }, mimetype: 'audio/mp4' },
                                                    {quoted: m}
                                                    // { url: "Media/audio.mp3" }, // can send mp3, mp4, & ogg
                                                ).then(()=>{
                                                    fs.unlinkSync(vn_path)
                                                })
                                            }
                                        })
                                    })
                                    .catch(()=>{
                                        fs.unlinkSync(vn_path)
                                    })
                                
                                } catch (error) {
                                    console.log("Voice note downoad error.")
                                }
                            }
                            else{

                                sock.sendMessage(m.key.remoteJid, {text:"\n「「  👸🏾 *Alita Bot* 💚❤️ 」」\n\n ⚠️ Could not fetch audio!"}, {quoted: m});
                            }  
                        }
                    }
                });
            } catch (error) {
                sock.sendMessage(m.key.remoteJid, {text:"「「  👸🏾 *Alita Bot* 💚❤️ 」」\n\n  🆘 Internal Server Error!" }, {quoted: m})
            }
        }
    }
}

  


