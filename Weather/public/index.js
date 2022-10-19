    var app = new Vue({
    el:'#app',
    data: {
        city: '',
        result: null,
        temp:null,
        weathDesc:null,
        wind:null,
        rain:null,
        rainFall:null,
        weatherType:null},
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
            summary = getSummary(this.result);
            this.temp = summary[0];
            this.wind = summary[1];
            this.weathDesc = summary[2];
            this.rain = summary[3];

          //  console.log(summary);
          // console.log(temp);

          this.weatherType = getTypeWeather(temp);
         // console.log(this.weatherType);

          this.rainFall= getRainFall(rain);

        })
        }

        function getRainFall(rain)
        {
            sum = 0 ;
            for ( var i = 0 ; i < temp.length ; i++)
            {
                sum += temp[i];
            }

            if (sum > 0)
            {
                rain = true;
            }

         return rain ;
        }


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

      
        