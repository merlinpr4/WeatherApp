const axios = require('axios');
const express = require('express')
const app = express()
const port = 3000;

const https = require("https");

const path=require("path")
let publicPath= path.resolve(__dirname,"public")
app.use(express.static(publicPath))

app.get('/weather/:city', sendWeather)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


function sendWeather(req,res) {
    let city =  req.params.city;
    console.log('getData');

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

        coord = weatherInfo.city.coord;
        console.log(coord.lat);
        console.log(coord.lon);
        let airPoll = "https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=" + coord.lat+ "&lon=" + coord.lon + "&appid=e84ba5f47d90887b1f24bf8990e92a28" ;
         
        https.get(airPoll,(resp) => {   
            let data = ""
            
            resp.on('data', (info) => {
                data += info;
            });

            resp.on('end', () =>{
                polldata = JSON.parse(data);
                //console.log(polldata);
                pollSum = 0 ;
                size = polldata.list.length
                for (var i = 0 ; i <  size ; i ++ )
                {
                    pollSum += polldata.list[i].components.pm2_5 ;
                }
                
                pollAvg = pollSum/size;
                console.log( "avg:" + pollAvg  );      
               
            })
           
        });
        console.log("hi");
        console.log( "avg2:" + pollAvg  );
                   
        // console.log(result);
        res.json(result);
        });  

     })
    } 
