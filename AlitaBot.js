const commands = require("./config/commands")
const resolver = require('./core/cleaner')
const commandHandler = require("./core/commandHandler")
const makeWASocket = require('@adiwajshing/baileys').default;
const  { fetchLatestBaileysVersion, useSingleFileAuthState } =require('@adiwajshing/baileys');
const banner = require("./core/banner")
const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json')
//Functions Import
const { handleAi } = require('./functions/Ai');
// start a connection
const startSock = async() => {
	const { version } = await fetchLatestBaileysVersion()
    console.log(banner);
	const sock = makeWASocket({
		version,
		printQRInTerminal: true,
		auth: state,
        browser: ["AlitaBot v2.0"]
	})
    sock.ev.on('messages.upsert', async ({ messages }) => {
        let m = messages[0];
		// console.log(JSON.stringify(m))
        if(m.message != undefined && m.message != null)
        {
            if(m.key.fromMe == false)                           
            {
				resolver.cleaner(m, sock).then((resolve)=>{
					if(resolve.isCmd && commands.includes(resolve.command))
					{
						commandHandler.commandHandler(resolve, m, sock)
					}
					if (resolve.mimetype == 'ex-text' && resolve.quotedsender == '254734962640@s.whatsapp.net' )
					{
						handleAi(m, sock, resolve)
					}
				
				})
				.catch((err)=>{
					console.log("AlitaBot.js Error: "+err)
				})

            }
        }
        
    })

	

	// sock.ev.on('message-receipt.update', m => console.log(m))
	// sock.ev.on('presence.update', m => console.log(m))
	// sock.ev.on('chats.upsert', m => console.log(m))
	// sock.ev.on('contacts.upsert', m => console.log(m))

//  this is a conection update

    //Connection Update
	sock.ev.on('connection.update', (update) => {
		const { connection } = update
		if(connection === 'close') {
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