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
  for(var i=0; i<response.data.matches.today.length; i++)
  {
    console.log("Home: "+response.data.matches.today[i].homeTeam);
    console.log("Away:"+response.data.matches.today[i].awayTeam);
    console.log("Confidence: "+response.data.matches.today[i].confidence);

    console.log("Predictions: "+JSON.stringify(response.data.matches.today[i].predictions));
    console.log("____________________________\n")


  }
}).catch(function (error) {
	console.error(error);
});