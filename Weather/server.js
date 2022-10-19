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

    let coord = null
    

    https.get(endpoint,(resp) => {
        let data = "";
         
         resp.on('data', (info) => {
             data += info;
         });
 
         resp.on('end', () => {
            weatherInfo = JSON.parse(data)
            //console.log(j);
            //console.log("go");
           // console.log(j.list);
            //console.log("go2");
            coord = weatherInfo.city.coord;

            console.log(coord);
            console.log(coord.lat);
            let airPoll = "http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=" + coord.lat+ "&lon=" + coord.lon + "&appid=e84ba5f47d90887b1f24bf8990e92a28" ;
            

            /*
            https.get(airPoll,(response) => {

                let data = "";
         
                resp.on('data', (info) => {
                    data += info;
                });

                console.log(data);

            });
            */
        });
     
    


     
        resp.on("data", (data) => res.send(data)
         )
     })
    } 