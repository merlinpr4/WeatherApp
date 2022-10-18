    var app = new Vue({
    el:'#app',
    data: {
        city: '',
        result: null,
        temp:null,
        weathDesc:null,
        wind:null,
        rain:null,
    methods:{
        GetWeath : getWeather
        }
    })

    //function that gets json data from the server
    function getWeather(){
        //console.log("getWeather called");
        let prom = fetch("weather/"+this.city);
        prom
        .then( response => response.json())
        .then (response => {
            this.result = response.list;
            this.history.push(response.list);
            summary = getSummary(this.result);
            this.temp = summary[0];
            this.wind = summary[1];
            this.weathDesc = summary[2];
            this.rain = summary[3];

            console.log(summary);
            console.log(temp);

        })
        }

        //Function that summarises the key values for the tables
        function getSummary(response){
              //temp summary
              temp = []
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

               //weather description summary
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
               //console.log(rain)

               return [temp,wind,desp,rain];
        }