
    try {
        // send a list message!
        const alivesections = [
            {
            title: "😍 General",
            rows: [
                {title: "Youtube Audio", rowId: "row_ytaudio", description: "Download youtube music"},
                {title: "Youtube Video", rowId: "row_ytvideoo", description: "Comming soon"}
            ]
            },
        {
            title: "🔍 Search Engines",
            rows: [
                {title: "Wikipedia", rowId: "row_wiki", description: "Get Official wikipedia links."},
                {title: "Youtube Search", rowId: "option4", description: "Search for Youtube content"}
            ]
            },
        ]

        const alivelistMessage = {
        text: "Hey there🥰🥰🥰\n\nI am 👸🏾 *Alita Bot* 🧡❤\n\nI will help you manage your whatsapp group 😎, personal chat and get Internet content for you\nIn my development stages currently if you notice any bug 🧏🏾 or want to suggest a future contact my developer.",
        title: "「「  👸🏾 *Alita Bot* 💚❤️ 」」",
        footer: btnFooter,
        buttonText: "Click to view available comands.",
        alivesections
        }

        sock.sendMessage(m.key.remoteJid, alivelistMessage)

    }
        
     catch (error) {
        console.log("Ytalive error")
        
    }
