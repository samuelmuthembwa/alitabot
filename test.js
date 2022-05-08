const fetch =require("node-fetch")
fetch('http://www.safaricom.com').then((response)=>{
    console.log(response); // Will show you the status
    if (!response.ok) {
        throw new Error("HTTP status " + response.status);
    }
    return response.json();
});