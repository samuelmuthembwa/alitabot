const thiccysapi = require('textmaker-thiccy');

const graffiti = (style, name)=>{
    let url = ""; 
    switch (style) {

        case "sand":
            url = "https://textpro.me/write-in-sand-summer-beach-free-online-991.html"
        break;
        case "beach":
            url = "https://textpro.me/create-a-summery-sand-writing-text-effect-988.html"
        break;
        case "blood":
            url = "https://textpro.me/blood-text-on-the-frosted-glass-941.html"
        break;
        case "leaves":
            url = "https://textpro.me/natural-leaves-text-effect-931.html"
        break;
        case "graffiti":
            url = "https://textpro.me/create-a-cool-graffiti-text-on-the-wall-1010.html"
        break;
        case "graffiti_second":
            url = "https://textpro.me/create-wonderful-graffiti-art-text-effect-1011.html"
        break;
        default:
            url =  "https://textpro.me/natural-leaves-text-effect-931.html"
        break;
    }
    return new Promise((resolve, reject) => {
        thiccysapi.textpro(url,
        name
        ).then(async (data) => { 
            
                try {
                    console.log(data) 
                    resolve({
                        data
                    })
                    
                } catch(err) { 
                    console.log(err)
                    reject('Err Downloading Graffiti')
                } 
            
        
        }); 
    })     
}
module.exports.graffiti = graffiti;
