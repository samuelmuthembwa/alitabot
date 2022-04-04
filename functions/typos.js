module.exports = {
  async handleTyops(info, m, sock){
    return new Promise((resolve, reject)=>{
      const axios = require("axios");
      const cheerio  = require("cheerio")
      var query = info.args
      if(query =="")
      {
        sock.sendMessage(info.sender, {text: "Provide a name please after command."}, {quoted: m})

      }
      else{
        var url = 'http://qaz.wtf/u/convert.cgi/?text='+query
      const options = {
        method: 'GET',
        url: encodeURI(url),
      };
      axios.request(options).then(function (response) {
        var $ = cheerio.load(response.data)
        let typos = ""
        var rows = $("body > table > tbody > tr > td").each((index, element) => {
        typos += $(element).text()+"\n";
        });
        sock.sendMessage(info.sender, {text: typos}, {quoted: m})
        
      }).catch(function (error) {
        reject("Something went wrong when fetching Typos.")
        console.error(error);
      });
      }
      

    })
  }
}