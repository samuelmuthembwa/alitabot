module.exports = {
  async handleWeather(info, m, sock){
    const axios = require("axios");
    let place = info.args == ""? "Nairobi" : info.args
    const options = {
      method: 'GET',
      url: `http://api.weatherapi.com/v1/current.json?key=e2457e24fe9b4424b00120756211011&q=${place}&aqi=no`,
    };
    axios.request(options).then(function (response) {
      var data = response.data
      var iconUrl = "http:"+data.current.condition.icon
      var weatherInfo = `😃 Name: ${data.location.name}\n🌴 Country: ${data.location.country}\n⭐ Longitude: ${data.location.lon}\n⭐ Latitude: ${data.location.lat}\n🌥️ Condition: ${data.current.condition.text}\n❄️ Temp: ${data.current.temp_c}°C\n💫 Humidity: ${data.current.humidity}\n🍃 Windspeed: ${data.current.wind_kph} KM/h\n🌟 Wind direction: ${data.current.wind_dir}\n☔ Precipitation: ${data.current.precip_mm} mm`
      try {
        sock.sendMessage(info.sender, {image: {url: iconUrl},caption: weatherInfo},  {quoted: m})
        
      } catch (error) {
        
      }
      
      
    }).catch(function (error) {
      console.error(error);
    });
  }}
