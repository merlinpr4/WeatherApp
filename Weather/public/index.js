    let myChart ;
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
        backColor:"#ADD8E6",
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
            this.result = response;
           // console.log(response);
            console.log(this.result);
            summary = getSummary(this.result);
            this.temp = summary[0];
            this.wind = summary[1];
            this.weathDesc = summary[2];
            this.rain = summary[3];

           this.weatherType = getTypeWeather(temp);
          
           
          this.rainFall= getRainFall(rain);

          chart(this.weatherType);

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

        function chart(type){

          // destroy previous created graph
        if (myChart) {
          myChart.destroy()
         }

          var xVal = ["Day1", "Day2", "Day3", "Day4" ];
        
          var bar_ctx = document.getElementById('myChart').getContext('2d');
         

              
          var colours = bar_ctx.createLinearGradient(0, 0, 0, 600);

         
          console.log(type);

          if(type == "cold"){
            colours.addColorStop(0, "#2f50e4");
            colours.addColorStop(1,"#73c6ed" );
            this.backColor = "background-color:#ADD8E6";
          }
          else if(type == "mild"){
            colours.addColorStop(0, "#ff7f50");
            colours.addColorStop(1, "#ffff94" );
            this.backColor = "#ADD8E6";
          }
          else if (type== "hot"){
            colours.addColorStop(0, "#ff3333");
            colours.addColorStop(1, "#ff8c00" );
            this.backColor = "#ADD8E6";
          }
  
        myChart = new Chart("myChart", {
          type: "bar",
          data: {
            labels: xVal,
            datasets: [{
              label: "temperature",
              backgroundColor: colours,
              data: this.temp,
              order:1 , 
              borderWidth: 1
            }]
          },
          options: {
            responsive : true,
            maintainAspectRatio: true,
            legend: {
               position: 'top',
               display:  true 
            },
            plugins: {
              deferred: {
                yOffset: '85%'
              }
          },
          title: {
            display: true,  
            text: "Temperature per day"
          }
        }
        });

      }