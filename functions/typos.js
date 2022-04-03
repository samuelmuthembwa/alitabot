const axios = require("axios");
const cheerio  = require("cheerio")
var query = "Alita Bot"
var url = 'http://qaz.wtf/u/convert.cgi/?text='+query
const options = {
  method: 'GET',
  url: encodeURI(url),
};
axios.request(options).then(function (response) {
  var $ = cheerio.load(response.data)
  var rows = $("body > table > tbody > tr > td").each((index, element) => {
    console.log($(element).text().trim());
    });
  
	
}).catch(function (error) {
	console.error(error);
});