const thiccysapi = require('textmaker-thiccy');

thiccysapi.textpro("https://textpro.me/create-wonderful-graffiti-art-text-effect-1011.html",
    "Phaticusthiccy"
    ).then(async (data) => { 
      try { 
          console.log(data)
      } catch(err) { 
          console.log(err)
      } 
});