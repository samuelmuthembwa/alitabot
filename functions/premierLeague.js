const fs = require("fs")
const axios = require("axios")
const cheerio  = require("cheerio")
module.exports = {
    async handlePremierleague(sock, resolve, m){
        try {
            let clubs = []
            let pts = []
            let club_info = []
            let data = "\nγγ  πΈπΎ *Alita Bot* γγ\n\n β½ *Premier League* β½\n_______________________\n";
            let url = "https://www.sportsmole.co.uk/football/live-scores/";
            axios({
                method: 'get',
                url: url
            })
            .then((res)=>{
                let $ = cheerio.load(res.data);
                // Scrappring games
                $(".leaguetable .s1").find('a:nth-child(1)').each(function() {
                    clubs.push($(this).text().trim());
                });
                //Scapping PTS
                $(".leaguetable .positiontd").find('strong').each(function() {
                    pts.push($(this).text().trim());
                });
                for(var i = 0; i<clubs.length ; i++)
                {
                    club_info.push({name: clubs[i], pts: pts[i]})
                }
                for(var i = 0; i<club_info.length ; i++)
                {
                    data = data+"β½ "+"*"+club_info[i].name+"*"+" PTS :"+"*"+club_info[i].pts+"*"+"\n";
                }
                sock.sendMessage(resolve.sender, {text: data}, {quoted: m})
            })
            .catch((err)=>{
                sock.sendMessage(resolve.sender, {text: "γγ  πΈπΎ *Alita Bot* γγ\n\n π Couldn't Fetch Premier League Data. "}, {quoted: m})
            })    
        } catch (error) {
            sock.sendMessage(resolve.sender, {text: "γγ  πΈπΎ *Alita Bot* γγ\n\n π Couldn't Fetch Premier League Data. "}, {quoted: m}) 
        }
    }
}
