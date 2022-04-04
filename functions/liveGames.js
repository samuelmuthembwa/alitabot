// const axios = require("axios");
// exports.live = async ()=>{
//   const options = {
//     method: 'GET',
//     url: 'https://football-betting-odds1.p.rapidapi.com/provider1/live/inplaying',
//     headers: {
//       'X-RapidAPI-Host': 'football-betting-odds1.p.rapidapi.com',
//       'X-RapidAPI-Key': '3845051cf5mshe78f8102a6f8f30p14ff22jsnfe48a5ffb225'
//     }
//   };
  
//   axios.request(options).then(function (response) {
//     const gamesStr = ""
//       for (var key in response.data) {
//           if (response.data.hasOwnProperty(key)) {
//            gamesStr+=`🥅 ${response.data[key].country_leagues} 🥅\nHome: ${response.data[key].home} VS Away: ${response.data[key].away}\nCurrent score: ${response.data[key].score}\nPeriod: ${response.data[key].periodTXT}\n___________________________________`
            
//           }

//       }
//       return gamesArr
//   }).catch(function (error) {
//     console.error(error);
//   });
// }



module.exports = {
  async handleLive(info, m, sock){
    return new Promise((resolve, reject)=>{
      const axios = require("axios");
      const options = {
        method: 'GET',
        url: 'https://football-betting-odds1.p.rapidapi.com/provider1/live/inplaying',
        headers: {
          'X-RapidAPI-Host': 'football-betting-odds1.p.rapidapi.com',
          'X-RapidAPI-Key': '3845051cf5mshe78f8102a6f8f30p14ff22jsnfe48a5ffb225'
        }
      };
      

      axios.request(options).then(function (response) {
        let gamesStr = "⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽\n"
        for (var key in response.data) {
            if (response.data.hasOwnProperty(key)) {
             gamesStr+=`🥅 ${response.data[key].country_leagues} 🥅\nHome: ${response.data[key].home} VS Away: ${response.data[key].away}\nCurrent score: ${response.data[key].score}\nPeriod: ${response.data[key].periodTXT}\n_______________________________\n`
              
            }
  
        }
        sock.sendMessage(info.sender, {text: gamesStr}, {quoted: m})
      }).catch(function (error) {
        reject("Something went wrong when fetching live.")
        console.error(error);
      });

    })
  }
}
