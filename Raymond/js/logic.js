
d3.json('../Resources/file.json').then(function(data){
    console.log(data);
    makeChart(data);
    makeLineChart(data);
})


function makeChart(data) {
  let filtered_data = data.filter(function(battle){
    console.log(battle.fatalities);
    return battle.fatalities > 0;
  })
  console.log(filtered_data);
  filtered_data = filtered_data.sort(function(a, b){return b.fatalities-a.fatalities});
  filtered_data = filtered_data.slice(0, 10);
  console.log(filtered_data);

  var data = [
    {
      x:filtered_data.map(function(battle){
        return battle.location
      }),
      y: filtered_data.map(function(battle){
        return battle.fatalities
      }),
      type: 'bar'
    }
  ];
    
  Plotly.newPlot('myDiv', data);

}

function makeLineChart(data) {
   console.log("2ndPrint", data);

    let f_event_data = data.filter(function(strike){
        // console.log(strike.sub_event_type);
        // return strike.sub_event_type === 'Shelling/artillery/missile attack';
        
    })

    let strikeType = []

    for(let i = 0; i < sub_event_type.length; i++){
        let sub_event_type = sub_event_type[i];
        strikeType.push(sub_event_type);
        console.log(strikeType);
    };
    var data = [
        {
            
        }
    ]
}