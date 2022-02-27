
const cheerio = require('cheerio')
const axios = require('axios')
let url = "https://africa.espn.com/football/scoreboard";
let games = [];

axios({
    method: 'get',
    url: url
})
.then((res)=>{
    
    let $ = cheerio.load(res.data)
    $(".competitors").find(".team-a .team__content .team-container").each(function() {
        games.push($(this).html());
    });
    console.log(games)
    
})