const { Boom } = require('@hapi/boom') 
const P =require('pino') 
const fs = require('fs')
const axios = require('axios')
const {yta, ytv} =require('./lib/ytdl')

//Functions
const { lengthTest} = require('./functions/lengthTest')

const makeWASocket = require('@adiwajshing/baileys').default;
const  { AnyMessageContent, delay, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, useSingleFileAuthState } =require('@adiwajshing/baileys');

// the store maintains the data of the WA connection in memory
// can be written out to a file & read from it
const store = makeInMemoryStore({ logger: P().child({ level: 'debug', stream: 'store' }) })
store.readFromFile('./baileys_store_multi.json')
// save every 10s
setInterval(() => {
	store.writeToFile('./baileys_store_multi.json')
}, 10_000)

const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json')

// start a connection
const startSock = async() => {
	// fetch latest version of WA Web
	const { version, isLatest } = await fetchLatestBaileysVersion()
	// console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)

	const sock = makeWASocket({
		version,
		logger: P({ level: 'trace' }),
		printQRInTerminal: true,
		auth: state,
		// implement to handle retries
		getMessage: async key => {
			return {
				conversation: 'hello'
			}
		}
	})

	store.bind(sock.ev)


    
	// sock.ev.on('chats.set', item => console.log(`recv ${item.chats.length} chats (is latest: ${item.isLatest})`))
	// sock.ev.on('messages.set', item => console.log(`recv ${item.messages.length} messages (is latest: ${item.isLatest})`))
	// sock.ev.on('contacts.set', item => console.log(`recv ${item.contacts.length} contacts`))
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
        
        if (!m.message) return // if there is no text or media message
        const messageType = Object.keys (m.message)[0]// get what type of message it is -- text, image, video
        //Youtube link Buttons

        if(m.message.hasOwnProperty("buttonsResponseMessage"))
        {
            let btn_response = m.message.buttonsResponseMessage.selectedButtonId;
            if(btn_response === "ytvideo")
            {
                sock.sendMessage(m.key.remoteJid, {text: "\n「「  👸🏾 *Alita Bot* 💚❤️ 」」\n\n  ⏲️ Video download feature coming soon."})
            }
            if(btn_response === "cancel")
            {
                sock.sendMessage(m.key.remoteJid, {text: "\n「「  👸🏾 *Alita Bot* 💚❤️ 」」\n\n  🗑️ Download cancelled."})
            }
            if(btn_response === "ytaudio" )
            {
                const readline = require('readline');

                async function getFirstLine(pathToFile) {
                const readable = fs.createReadStream(pathToFile);
                const reader = readline.createInterface({ input: readable });
                const line = await new Promise((resolve) => {
                    reader.on('line', (line) => {
                    reader.close();
                    resolve(line);
                    });
                });
                readable.close();
                return line;
                }
                let ytlink = await getFirstLine('./database/ytlinks.txt');
                let audio_path = (Math.random() + 1).toString(36).substring(7)+".mp3";
                let stream = fs.createWriteStream(audio_path);
                yta(ytlink)
                .then((res)=>{
                    console.log(res.dl_link),
                    axios({
                        method: "get",
                        url: res.dl_link,
                        responseType: "stream"
                    }).then(function (response) {
                        response.data.pipe(stream);
                        sock.sendMessage(m.key.remoteJid, {text: "\n「「  👸🏾 *Alita Bot* 💚❤️ 」」\n\n 📂⬇️ Downloading ..."})
                        
                        
                        stream.on('finish',()=>{
                            let path = audio_path;
                            let jid = m.key.remoteJid;
                            sendAudio(path, jid)
                            async function sendAudio(path, jid)
                            {
                                await sock.sendMessage(
                                    jid, 
                                    { audio: { url: path }, mimetype: 'audio/mp4' }
                                    // { url: "Media/audio.mp3" }, // can send mp3, mp4, & ogg
                                ).then(()=>{
                                    fs.unlinkSync(audio_path)
                                })
                            }
                            
                        })
                    })
                    .catch(()=>{
                        sock.sendMessage(m.key.remoteJid, {text: "\n「「  👸🏾 *Alita Bot* 💚❤️ 」」\n\n ‼️  Download failed."})
                    })
                })
                .catch(()=>{
                    sock.sendMessage(m.key.remoteJid, {text: "\n「「  👸🏾 *Alita Bot* 💚❤️ 」」\n\n ‼️Youtube Link is corrupt."})
                })
            }
        }


        
        // a youtube link
        if (messageType === 'extendedTextMessage') {
            let command = JSON.stringify(m.message.extendedTextMessage.text).split(" ")[0].replace('"','');
            let ytlink = JSON.stringify(m.message.extendedTextMessage.text).split(" ")[1].replace('"','');
            console.log("\n\n\nthe youtube link"+ytlink)
            fs.writeFile('./database/ytlinks.txt', ytlink, err => {
                if (err) {
                  console.error(err)
                  return
                }
                
                console.log("Ytlinks file written successfully")
              })
            let yttitle = JSON.stringify(m.message.extendedTextMessage.title);
            let video_path = (Math.random() + 1).toString(36).substring(7)+".mp4";
            
            // let audio_stream = fs.createWriteStream(audio_path);
            console.log(JSON.stringify(m));
            if(command === "!play")
            {
                // send a buttons message!
                const buttons = [
                    {buttonId: 'ytvideo', buttonText: {displayText: '🎬 Video'}, type: 0},
                    {buttonId: 'ytaudio', buttonText: {displayText: '🎧 Audio'}, type: 0},
                    {buttonId: 'cancel', buttonText: {displayText: '⛔ Cancel'}, type: 0}
                ]
                
                const buttonMessage = {
                    text: "\n「「  👸🏾 *Alita Bot* 💚❤️ 」」",
                    footer: '☘️ Select a button: ',
                    buttons: buttons,
                    headerType: 0
                }
                
                sock.sendMessage(m.key.remoteJid, buttonMessage, messageType.buttonsMessage)
    
            }
        }
    })

	// sock.ev.on('message-receipt.update', m => console.log(m))
	// sock.ev.on('presence.update', m => console.log(m))
	// sock.ev.on('chats.update', m => console.log(m))
	// sock.ev.on('contacts.upsert', m => console.log(m))

    //Connection Update
	sock.ev.on('connection.update', (update) => {
		const { connection, lastDisconnect } = update
		if(connection === 'close') {
			// reconnect if not logged out
			startSock()
		}
        
		console.log('connection update', update)
	})
	// listen for when the auth credentials is updated
	sock.ev.on('creds.update', saveState)

	return sock
}
//Starting AlitaBot
startSock()