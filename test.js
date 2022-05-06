const request =  require("request")
request.get({
    url: 'https://api.api-ninjas.com/v1/celebrity?name='+"michael",
    headers: {
        'X-Api-key': 'co+5Rd3Fghuv2RJ/Y5ypZQ==JoO6zg4EUycfDrTy'
    },
},function(error, response, body){
    if(error)
    {
        console.log( "👸🏾 Could not fetch celebrity's details.")
    }
    else if(response.statusCode == 200){
        
        if(body.length == 2 )
        {
            console.log( "👸🏾 Could not fetch celebrity's details.")
        }
        else{
            
            let info = JSON.parse(body)[0]
            let name = info.name != "" || info.name != null || info.name != undefined ? info.name : "N/A";
            let worth = info.net_worth !== "" || info.net_worth !== null || info.net_worth !== undefined ? info.net_worth : "N/A";
            let gender = info.gender !== "" || info.gender !== null || info.gender !== undefined ? info.gender : "N/A";
            let height = info.height !== "" || info.height !== null || info.gender !== undefined ? info.gender : "N/A";
            let birthday = info.birthday !== "" || info.birthday !== null || info.birthday !== undefined ? info.birthday : "N/A";
            console.log(`🌟 Name : ${name}\n🔥 Net worth: ${worth}\n🍀 Gender: ${gender}\n❄️ Height: ${height}\n🥂 Birthday: ${birthday}`)
        }
    }
})