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
const {live} = require("./functions/liveGames")
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
		// console.log(m)
        if(m.message != undefined && m.message != null)
        {
            if(m.key.fromMe == false)
            {
				var sender = m.key.remoteJid;
				const groupMetadata = m.key.remoteJid.split("@")[1] == "g.us" ? await sock.groupMetadata(sender) : '';
				var resolve = await resolver.cleaner(m, groupMetadata)
				if(resolve.isCmd && commands.includes(resolve.command) && resolve.command != "tagall")
				{
					commandHandler.commandHandler(resolve, m, sock)
					// 	sock.sendMessage(resolve.sender, {text: res}, {quoted: m})
					// })
				}
				if(resolve.isCmd && resolve.command == "tagall" && commands.includes(resolve.command) )
				{
					try {
						const metadata = await sock.groupMetadata(m.key.remoteJid, false);
						const array = metadata.participants.map(all => all.id)
						let allMembers = ''
						array.forEach((participant, i) => allMembers += `@${array[i].replace('@s.whatsapp.net', '')}\n`)
						await sock.sendMessage(m.key.remoteJid, { text: `✨ *Reason for tag:* ${resolve.args}\n${allMembers}`, mentions: array }, {quoted: m})
					} catch (error) {
						sock.sendMessage(resolve.sender, {text: "👸🏾 Couldn't tag all memmbers"}, {quoted: m})
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