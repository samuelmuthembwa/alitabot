const { Boom } = require('@hapi/boom') 
const commands = require("./config/commands")
const resolver = require('./core/cleaner')
const commandHandler = require("./core/commandHandler")
const axios = require("axios");
const P =require('pino') 
const fs = require('fs')
const makeWASocket = require('@adiwajshing/baileys').default;
const  { AnyMessageContent, delay, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, useSingleFileAuthState, MessageType, MessageOptions, Mimetype } =require('@adiwajshing/baileys');
const banner = require("./core/banner")
const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json')
//Functions Import
const {live} = require("./functions/liveGames");
const { handleAi } = require('./functions/Ai');
// start a connection
const startSock = async() => {
	const { version, isLatest } = await fetchLatestBaileysVersion()
    console.log(banner);
	const sock = makeWASocket({
		version,
		printQRInTerminal: true,
		auth: state,
        browser: ["AlitaBot v2.0"]
	})
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
		console.log(JSON.stringify(m))
        if(m.message != undefined && m.message != null)
        {
            if(m.key.fromMe == false)
            {
				var resolve = await resolver.cleaner(m, sock)
				if(resolve.isCmd && commands.includes(resolve.command))
				{
					commandHandler.commandHandler(resolve, m, sock)
				}
				if(resolve.mimetype == 'ex-text' &&resolve.quotedsender == '254734962640@s.whatsapp.net' )
				{
					await handleAi(m, sock, resolve)
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
			fs.unlink("auth_info_multi.json",(err)=>{
				if(err)
				{
					console.log("Auth info not deleted")
				}
				console.log("\n\nBOT RESTARTED...\n\n")
				startSock()
			})
			
		}
        
		console.log('connection update', update)
	})
	// listen for when the auth credentials is updated
	sock.ev.on('creds.update', saveState)

	return sock
}
//Starting AlitaBot
startSock()