const express = require('express')
const app = express()
const port = 3000;

const https = require("https");

const path=require("path")
let publicPath= path.resolve(__dirname,"public")
app.use(express.static(publicPath))

app.get('/weather/:city', sendWeather)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//function waits for city from front end and calls openweather api to figure out weather and air pollution data
function sendWeather(req,res) {
    let city =  req.params.city;
    //console.log('getData');

    let endpoint = "https://api.openweathermap.org/data/2.5/forecast/daily?q=" + city + "&units=metric&lang=en&appid=e84ba5f47d90887b1f24bf8990e92a28";
    let coord = null;
    let pollAvg = 0;

    https.get(endpoint,(resp) => {
        let result = "";
        let data = "";

        resp.on('data', (info) => {
            data += info;
        });
 
        resp.on('end', () => {
            weatherInfo = JSON.parse(data)
            result = weatherInfo.list;  
            coord =  weatherInfo.city.coord  ;
            summary = null ;
     
            let airPoll = "https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=" + coord.lat+ "&lon=" + coord.lon + "&appid=e84ba5f47d90887b1f24bf8990e92a28" ;
            
            https.get(airPoll,(resp) => {   
                let data = "";
                
                resp.on('data', (info) => {
                    data += info;
                });

                resp.on('end', () =>{
                    //figure out average air pollution for the next 5 days
                    polldata = JSON.parse(data);
                    pollSum = 0 ;
                    size = polldata.list.length;
                    for (var i = 0 ; i <  size ; i ++ )
                    {
                        pollSum += polldata.list[i].components.pm2_5 ;
                    }
                    pollAvg = pollSum/size;
                    summary = getSummary(result,pollAvg);
                    res.json(summary);
                
                })
        });
        });  
    })
} 

      //Function that summarises the key values for the tables and packing info into arrays
      function getSummary(response,poll){
        //temp summary
        temp = [];
        for (i = 0 ; i < 4 ; i ++)
        {
            temp.push(response[i].temp.day);
        }
      //  console.log(temp)

        //windspeed
        wind = []
        for (i = 0 ; i < 4 ; i ++)
        {
            wind.push(response[i].speed);
        }
        //console.log(wind)

        //weather description summary
        desp = []
        for (i = 0 ; i < 4 ; i ++)
        {
             desp.push(response[i].weather[0].description);
        }
        //console.log(desp)

         //rain summary
         rain = []
         for (i = 0 ; i < 4 ; i ++)
         {
              r = response[i].rain;
              if (r == undefined)
              {
                  r = 0 ;
              }

              rain.push(r);
         }

        //humiditiy
        hum = []
        for (i = 0 ; i < 4 ; i ++)
        {
            hum.push(response[i].humidity);
        }
      
         mask = false;
         if (poll > 10){
            mask = true;
         }

         weatherType = getTypeWeather(temp);
         rainFall = getRainFall(rain);
        
         return [temp,wind,desp,rain,weatherType,rainFall,mask,hum];
  }

  //function that checks if there is a slight chance of rain in coming days
  function getRainFall(rain)
  {
    rainChance = false ;
      sum = 0 ;
      for ( var i = 0 ; i < rain.length ; i++)
      {
          sum += rain[i];
      }

      if (sum > 0)
      {
          rainChance = true;
      }

   return rainChance ;
  }

//gets the type of weather for coming days based on temperature
  function getTypeWeather(temp){
      type = ""
      sum = 0 ;
      
      for ( var i = 0 ; i < temp.length ; i++)
      {
          sum += temp[i];
      }

      avg = sum/4 ;
      
      if (avg < 12)
      {
          type = "cold";
      }
      else if (avg >= 12 && avg <= 24)
      {
          type = "mild";
      }
      else 
      {
          type = "hot"
      }

      return type ;
  }
