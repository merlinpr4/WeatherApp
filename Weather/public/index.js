    var app = new Vue({
    el:'#app',
    data: {
        city: '',
        result: null,
        d0:null,
        temp:null,
        weathDesc:null,
        wind:null,
        rain:null,
        history :[]},
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
            //console.log( response.list);

            //console.log(this.result[0].weather[0].description);

            //the next 4 days
            this.d0 = response.list[0];
            this.d1 = response.list[1];
            this.d2 = response.list[2];
            this.d3 = response.list[3];
            
            //day 0 - today data
            let d0Temp = this.d0.temp.day;
            let d0Wind = this.d0.speed ; //not 100% confident on this come back
            let d0Rain = this.d0.rain;

            //console.log("day0:" + d0Temp + " " + d0Wind + " " + d0Rain);
            //console.log("rain" + this.d0.rain);

            // console.log("day 0");
            //  console.log(response.list[0]);

            //console.log("windspeed" + d0.speed);

            
            //console.log(response.list[0].weather[0].description);
            //we need the next 4 days of data easily acceible 

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