module.exports = {
  async handle(info, m , sock){
    return new Promise((resolve, reject)=>{
      const axios = require("axios");
      const options = {
        method: 'GET',
        url: 'https://football-prediction1.p.rapidapi.com/best-bets',
        headers: {
          'X-RapidAPI-Host': 'football-prediction1.p.rapidapi.com',
          'X-RapidAPI-Key': '3845051cf5mshe78f8102a6f8f30p14ff22jsnfe48a5ffb225'
        }
      };

      axios.request(options).then(function (response) {
        let bets = "🥅🥅Predictions🥅🥅\n"
        for(var i=0; i<response.data.matches.today.length; i++)
        {
          const keys = Object.keys(response.data.matches.today[i].predictions);
          var preds = ""
          keys.forEach((key, index) => {
              preds+=`\n> ${key}: ${response.data.matches.today[i].predictions[key]}`;
          });
          bets += "⚽ Home: "+response.data.matches.today[i].homeTeam+"⚽ Away: "+response.data.matches.today[i].awayTeam+"\n😇 Confidence: "+response.data.matches.today[i].confidence+"\n🤹🏾 Predictions: "+preds+"\n____________________________\n"
        }
        // console.log("Best bets function console log"+bets)
        sock.sendMessage(info.sender, {text: bets}, {quoted: m})
      }).catch(function (error) {
        reject("Something went wrong when fetching bets.")
        console.error(error);
      });

    })
  }
}