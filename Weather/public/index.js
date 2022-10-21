    let myChart ;
  
    const body = document.body;
    const changeBackground = colours => body.setAttribute("color",color);
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
        poll:null,
        days:null,
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
            this.temp = this.result[0];
            this.wind = this.result[1];
            this.weathDesc = this.result[2];
            this.rain = this.result[3];
            this.weatherType = this.result[4];
            this.rainFall = this.result[5];
            this.poll = this.result[6];

            chart(this.weatherType,this.temp,this.wind);          
        })
      
        }

        //created a barchart based on the temperature for next 4 days that changes colour based on weather type
        function chart(type, temp,speed){
 
          if (myChart) {
            myChart.destroy()
          }

          var xVal = ["Day 1", "Day 2", "Day 3", "Day 4" ];
          var bar_ctx = document.getElementById('myChart').getContext('2d');
          var colours = bar_ctx.createLinearGradient(0, 0, 0, 600);

          //console.log(type);

          var colours2 = bar_ctx.createLinearGradient(0, 0, 0, 600);
          colours2.addColorStop(0, "#8F62B6");
          colours2.addColorStop(1, "#f5c9e6");


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
            datasets: [
            {
              label: "temperature",
              backgroundColor: colours,
              data: temp,
              order:0
            },
            {
              label:"windspeed",
              backgroundColor:  colours2,
              data:speed
            },
          ]
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
                yOffset: '85%',
              }
          },
          title: {
            display: true,  
            text: "Temperature and Wind speed per day"
          }
        }
        });

      }