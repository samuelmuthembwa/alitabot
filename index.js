const { Boom } = require('@hapi/boom') 
const P =require('pino') 
const fs = require('fs')
const axios = require('axios')
const readline = require('readline')
const ytdl = require('ytdl-core')
const yts = require('yt-search')

//Functions
const {yta, ytv} =require('./lib/ytdl')

//Constants
const {btnFooter} = require('./lib/constants')
const {name} = require('./AlitaBot/Bot')
const commandlist = require('./AlitaBot/commands.json')
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
        console.log(JSON.stringify(m))
        
        if (!m.message) return // if there is no text or media message
        const messageType = Object.keys (m.message)[0]// get what type of message it is -- text, image, video
        //Normal commands
        if(m.message.hasOwnProperty('conversation'))
        {   let msg_array = m.message.conversation.split(' ');
            let command = m.message.conversation.split(' ')[0].replace("'", '');
            switch (command) {
                case"!ytsearch":
                    if(msg_array.length === 1)
                    {
                        sock.sendMessage(m.key.remoteJid, {text:"「「  👸🏾 *Alita Bot* 💚❤️ 」」\n\n  🧐 Provide search term." })
                    }
                    else if(msg_array.length !== 1)
                    {
                        let search_array = [];
                        for(var i = 1; i< msg_array.length; i++)
                        {
                            search_array.push(msg_array[i]);
                        }
                        var query = search_array.join( " ");
                        try {
                            var yt_result = await yts(query);
                            let results = yt_result.all;
                            var ytresult = "";
                            ytresult += "「「  👸🏾 *Alita Bot* 🧡❤ 」」\n🎥 Youtube Search Results";
                            ytresult += "\n__________________________\n\n";
                            yt_result.all.map((video) => {
                            ytresult += "💿 *Title:* " + video.title + "\n";
                            ytresult += "🔗 *Link:* " + video.url + "\n";
                            ytresult += "⏱️ *Duration:* " + video.timestamp + "\n";
                            ytresult +=
                                "⬆️ *Upload:* " + video.ago + "\n__________________________\n\n";
                            });
                            //let thumbail = MessageMedia.fromFilePath("./images/thumbnails/yt_thumb.jpg");
                            sock.sendMessage(m.key.remoteJid, {text:ytresult})

                        } catch (error) {

                            sock.sendMessage(m.key.remoteJid, {text:"「「  👸🏾 *Alita Bot* 💚❤️ 」」\n\n  😒 Couldn't get result." })
                        }
                        
                    }
                break;
                case "!play":
                    if(msg_array.length === 1)
                    {
                        sock.sendMessage(m.key.remoteJid, {text:"「「  👸🏾 *Alita Bot* 💚❤️ 」」\n\n  🧐 Provide a youtube link!." })
                    }
                    else if(msg_array.length !== 1)
                    {
                        let link =  m.message.conversation.split(' ')[1].replace("'", '');
                        youtube(link);
                    }
                break;
                case "!alive":
                    // send a buttons message with image header!
                    const buttons = [
                        {buttonId: 'alivebtncall', buttonText: {displayText: '📞 Contact'}, type: 1},
                        {buttonId: 'alivebtntext', buttonText: {displayText: '💬 Text Me'}, type: 1},
                        {buttonId: 'alivebtnhelp', buttonText: {displayText: 'Help'}, type: 1}
                    ]
                    
                    const buttonMessage = {
                        image: {url: './AlitaBot/alitabot.jpg'},
                        caption: "Hey there🥰🥰🥰\nI am 👸🏾 *Alita Bot* 🧡❤\n\nI will help you manage your whatsapp group 😎, personal chat and get Internet content for you\nIn my development stages currently if you notice any bug 🧏🏾 or want to suggest a future contact my developer.",
                        footerText: btnFooter,
                        buttons: buttons,
                        headerType: 4
                    }
                    
                    sock.sendMessage(m.key.remoteJid, buttonMessage)
                break;
                case "!help":
                    help();

                break;
                case "!contact":
                    contact();
                break;
                default:
                break;
            }
             
        }
        //Button response handling
        if(m.message.hasOwnProperty("buttonsResponseMessage"))
        {
            let btn_response = m.message.buttonsResponseMessage.selectedButtonId;

            switch (btn_response) {
                case "alivebtncall":
                case "alivebtntext":
                    contact()
                break;
                case "alivebtnhelp":
                    help();
                break;
                case "ytaccept":
                    try {
                        const ytbuttonsDownload = [
                            {buttonId: 'ytvideo', buttonText: {displayText: '🎬 Video'}, type: 1},
                            {buttonId: 'ytaudio', buttonText: {displayText: '🎧 Audio'}, type: 1},
                            {buttonId: 'ytcancel', buttonText: {displayText: '🗑️ Cancel'}, type: 1},
                        ]
                        const ytbuttonsDownloadMessage = {
                            text: `\n「「  👸🏾 *Alita Bot* 💚❤️ 」」\n\n ☘️ Select conversion option: `,
                            footer: btnFooter,
                            buttons: ytbuttonsDownload,
                            headerType: 1
                        }
                        sock.sendMessage(m.key.remoteJid, ytbuttonsDownloadMessage, messageType.buttonsMessage)
                    } catch (error) {
                        console.log("Ytbuttons error.")
                    }
                    
                break;
                case "ytdecline":
                    try {
                        sock.sendMessage(m.key.remoteJid,{text: "「「  👸🏾 *Alita Bot* 💚❤️ 」」\n\n 😃 Copy that, commander."})
                    } catch (error) {
                        console.log("Ytdecline error.")
                    }
                break;
                case "ytcancel":
                    try {
                        sock.sendMessage(m.key.remoteJid,{text: "「「  👸🏾 *Alita Bot* 💚❤️ 」」\n\n 🗑️ Download trashed."})
                    } catch (error) {
                        console.log("Ytcancel error.")
                    }
                break;
                case "ytaudio":
                     try {
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
                                sock.sendMessage(m.key.remoteJid, {text: "\n「「  👸🏾 *Alita Bot* 💚❤️ 」」\n\n 📂 Downloading ..."})
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
                            sock.sendMessage(m.key.remoteJid, {text: "\n「「  👸🏾 *Alita Bot* 💚❤️ 」」\n\n ‼️ Youtube Link is corrupt."})
                        })
                     } catch (error) {
                         console.log("yt audio error")
                     }
                break;
                case"ytvideo":
                    sock.sendMessage(m.key.remoteJid, {text: "\n「「  👸🏾 *Alita Bot* 💚❤️ 」」\n\n  🤹🏾‍♂️ This feature is comin soon."})
                break;
                default:
                break;
            }

        }


        
        // a youtube link
        if (messageType === 'extendedTextMessage') {
            //Checking if the link is a Youtube link
            let ytlink = JSON.stringify(m.message.extendedTextMessage.canonicalUrl).replace('"','');
            console.log(ytlink)
            //If youtube link is detected
            try {
                if(ytdl.validateURL(ytlink))
                {
                    youtube(ytlink); 
                }
                // youtube(ytlink);
            } catch (error) {
                console.log("Ytdl Validate error.")
            }


        }



        async function youtube(ytlink)
        {
            if(ytdl.validateURL(ytlink))
            {
                //Writing the link to ytlinks txt file
                try {
                    fs.writeFile('./database/ytlinks.txt', ytlink, err => {
                        if (err) {
                          console.error(err)
                          return
                        }
                        //Youtube Link written to file
                        const ytbuttonsConfirm = [
                            {buttonId: 'ytaccept', buttonText: {displayText: '⬇️ Yes'}, type: 1},
                            {buttonId: 'ytdecline', buttonText: {displayText: '⛔ No'}, type: 1},
                        ]
                        const ytbuttonMessageConfirm = {
                            text: `\n「「  👸🏾 *Alita Bot* 💚❤️ 」」\n\n ☘️ Do you want to download? `,
                            footer:btnFooter ,
                            buttons: ytbuttonsConfirm,
                            headerType: 1
                        }
                        sock.sendMessage(m.key.remoteJid, ytbuttonMessageConfirm, messageType.buttonsMessage)
                    })
                } catch (error) {
                    console.log("Ytlink Write and buttons error.")
                }
    
            }
            // If youtube link is not detected
            else
            {
                sock.sendMessage(m.key.remoteJid, {text:"「「  👸🏾 *Alita Bot* 💚❤️ 」」\n\n  😃 That was not a valid youtube link!." })
                console.log("\n\n Not a Youtube link")
            }
        }



        async function help()
        {
            try {
                // send a list message!
                const sections = [
                    {
                    title: "😍 *General*",
                    rows: [
                        {title: "📞 Contact", rowId: "optioncontact", description: "\nGet Alita Bot's Contact."},
                        {title: "🎧 Youtube Audio", rowId: "optionytaudio", description: "\nDownload youtube Music."},
                        {title: "🎬 Youtube Video", rowId: "optionytvideo", description: "\nComing soon."},
                        {title: "📗 Online Dictionary", rowId: "optiondict", description: "\nGet word meanings."}
                    ]
                    },
                   {
                    title: "🔍 *Search Engine*",
                    rows: [
                        {title: "Wikipedia", rowId: "optionwiki", description: "Search to get Official wikipedia link."},
                        {title: "Youtube search", rowId: "optionspeed", description: "Search for latest videos."}
                    ]
                    },
                ]
                
                const listMessage = {
                    title: name,
                    text:"📚 Hey check out my command list.",
                    
                    buttonText: "💬 Help list",
                    footer: btnFooter,
                    sections
                }
                sock.sendMessage(m.key.remoteJid, listMessage);

            }
                
            catch (error) {
                console.log("Ytalive error")
                
            }

        }

        async function contact()
        {
            const templateButtons = [
                {index: 1, urlButton: {displayText: '⭐ Star AlitaBot on GitHub!', url: 'https://github.com/samuelmunyoki/Alita-Bot'}},
                {index: 2, callButton: {displayText: 'Call me!', phoneNumber: '+254 7594 39032'}},
                {index: 2, callButton: {displayText: 'Save My Number 😍', phoneNumber: '+254 7594 39032'}},
            ]
            
            const templateMessage = {
                text: name,
                footer: btnFooter,
                templateButtons: templateButtons
            }
            
            sock.sendMessage(m.key.remoteJid, templateMessage)
            console.log(commandlist)
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