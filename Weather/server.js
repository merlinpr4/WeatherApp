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


    https.get(endpoint,(response) => {
        response.on("data", (data) => res.send(data)
        )
        console.log(data)
    })

   
})

   

}