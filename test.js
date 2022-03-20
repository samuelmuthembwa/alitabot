const gis = require("g-i-s")
const fs =  require("fs")
const request = require("request")
let search_term = "sorghum"
gis(search_term, fetcher);
async function fetcher(error, results){
    if(error){
        console.log("Err Image"+ error)
    }
    else{
        let iteration = 0;
        let count  = results.length;
        if(count <=5 ){
            iteration = count;
        }
        else{
            iteration = 5;

        }
        
        let image_names = [];
        console.log("Fetching your images ...")
        for(var i = 1; i <=iteration ; i++)
        {
            let name = (Math.random() + 1).toString(36).substring(7)+".jpg";
            image_names.push(name);
            try {
                let stream = fs.createWriteStream(name);
                request(results[i].url).pipe(stream);   
                console.log(encodeURI("You are a link"))
            } catch (error) {
                console.log("Err Image"+ error)
            }
        }
        for(var i = 0; i <= iteration-1 ; i++)
        {
            try {
                console.log(image_names[i])
            } catch (error) {
                console.log("Err Image"+ error)
            }
        }
            
        
        
    }
}