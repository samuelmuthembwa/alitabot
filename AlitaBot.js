const { Boom } = require('@hapi/boom') 

const axios = require("axios");
const P =require('pino') 
const fs = require('fs')
const makeWASocket = require('@adiwajshing/baileys').default;
const  { AnyMessageContent, delay, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, useSingleFileAuthState, MessageType, MessageOptions, Mimetype } =require('@adiwajshing/baileys');
const banner = require("./core/banner")
const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json')
//Functions Import
const {live} = require("./functions/liveGames")
// start a connection
const startSock = async() => {

	// fetch latest version of WA Web

	const { version, isLatest } = await fetchLatestBaileysVersion()
	// console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)
    console.log(banner);
	const sock = makeWASocket({
        
		version,
		// logger: P({ level: 'trace' }),
		printQRInTerminal: true,
		auth: state,
        browser: ["AlitaBot v2.0"]
	})



    
	// sock.ev.on('chats.set', item => console.log(`recv ${item.chats.length} chats (is latest: ${item.isLatest})`))
	// sock.ev.on('messages.set', item => console.log(`recv ${item.messages.length} messages (is latest: ${item.isLatest})`))
	// sock.ev.on('contacts.set', item => console.log(`recv ${item.contacts.length} contacts`))


    sock.ev.on('messages.upsert', async ({ messages }) => {
        console.log(messages)
        const m = messages[0];
        console.log(m)
        const messageType = Object.keys (m.message)[0]// get what type of message it is -- text, image, video
        if(m.key.fromMe == false)
        {
            
            if(messageType == "extendedTextMessage")
            {
                if(m.message.extendedTextMessage.contextInfo.participant == "254732730009@s.whatsapp.net")
                {
                    console.log("Text recieved: "+m.message.extendedTextMessage.text)
                    console.log("Qouted message: "+JSON.stringify(m.message.extendedTextMessage.contextInfo.quotedMessage))
                    console.log("Participant: "+m.key.participant)
                    const id = m.key.remoteJid
                    switch (m.message.extendedTextMessage.text) {
                        case "!live":
                            
                            var options = {
                                method: 'GET',
                                url: 'https://football-betting-odds1.p.rapidapi.com/provider1/live/inplaying',
                                headers: {
                                'X-RapidAPI-Host': 'football-betting-odds1.p.rapidapi.com',
                                'X-RapidAPI-Key': '3845051cf5mshe78f8102a6f8f30p14ff22jsnfe48a5ffb225'
                                }
                            };
                            
                            axios.request(options).then(function (response) {
                                let gamesStr = ""
                                for (var key in response.data) {
                                    if (response.data.hasOwnProperty(key)) {
                                    gamesStr+=`🥅 ${response.data[key].country_leagues} 🥅\nHome: ${response.data[key].home} VS Away: ${response.data[key].away}\n⚽ Current score: ${response.data[key].score}\n⏰ Period: ${response.data[key].periodTXT}\n_______________________________\n`
                                        
                                    }

                                }
                                sock.sendMessage(id, { text: gamesStr }, { quoted: m })
                            }).catch(function (error) {
                                console.error(error);
                            });
                            

                            
                            break;
                        case "!bets":
                            var options = {
                            method: 'GET',
                            url: 'https://football-prediction1.p.rapidapi.com/best-bets',
                            headers: {
                                'X-RapidAPI-Host': 'football-prediction1.p.rapidapi.com',
                                'X-RapidAPI-Key': '3845051cf5mshe78f8102a6f8f30p14ff22jsnfe48a5ffb225'
                            }
                            };

                            axios.request(options).then(function (response) {
                                var bets = "🥅Predictions🥅\n_________________________\n"
                            for(var i=0; i<response.data.matches.today.length; i++)
                            {
                                const keys = Object.keys(response.data.matches.today[i].predictions);
                                var preds = ""
                                keys.forEach((key, index) => {
                                    preds+=`\n> ${key}: ${response.data.matches.today[i].predictions[key]}`;
                                });
                                bets += `Home: ${response.data.matches.today[i].homeTeam} Away: ${response.data.matches.today[i].awayTeam}\nConfidence: ${response.data.matches.today[i].confidence}\nPredictions: ${preds}\n______________________________\n`
                            }
                            
                            sock.sendMessage(id, { text: bets }, { quoted: m })
                            }).catch(function (error) {
                                console.error(error);
                            });
                            break;
                        default:
                            break;
                    }
                    
                }   
            }

        }
        
    })

	// sock.ev.on('message-receipt.update', m => console.log(m))
	// sock.ev.on('presence.update', m => console.log(m))
	// sock.ev.on('chats.upsert', m => console.log(m))
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