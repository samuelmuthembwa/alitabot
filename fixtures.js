const axios = require("axios");
const cheerio  = require("cheerio")

const options = {
  method: 'GET',
  url: 'https://www.newsnow.co.uk/h/Sport/Football',
};
axios.request(options).then(function (response) {
  var $ = cheerio.load(response.data)
  var rows = $("nn_container > div.rs-grid.rs-grid--skeleton.js-skeleton > aside > div > div.c-football-widget > div > section.c-football-widget__matches > span:nth-child(1)")
  console.log(rows)
	
}).catch(function (error) {
	console.error(error);
});