const cheerio = require('cheerio')
const axios = require('axios')
let url = "https://www.livescore.com/en/football/live/";

async function livescore()
{
    return new Promise((resolve, reject)=>{
        try {
            axios({
                method: 'GET',
                url: url
            })
            .then((res)=>{
                let games = [];
                let $ = cheerio.load(res.data)
                $(".event__titleBox").each(function() {
                    games.push($(this).text().trim());
                });
                console.log(games)
                resolve({
                    games: games
                })
            })
            .catch(reject)
        } catch (error) {
            reject("Error ")
        }
    })

}
livescore()
.then((res)=>{
    console.log(res.games)
})