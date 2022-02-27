const cheerio = require('cheerio')
const axios = require('axios')
let clubs = []
let pts = []
let club_info = []
let data = "\n「「  👸🏾 *Alita Bot* 💚❤️ 」」\n\n ⚽ Premier League ⚽\n";
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
        data = data+"Name: "+club_info[i].name+"PTS :"+club_info[i].pts+"\n";
    }


    console.log(data)
})