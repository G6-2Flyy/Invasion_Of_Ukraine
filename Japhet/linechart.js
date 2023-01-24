d3.json('js/ukraine_war_data.json').then(function(data){
    console.log(data);
    makelineChart(data);
})
function makeChart(data) {
  let filtered_data = data.filter(function(battle){
    console.log(data.fatalities);
    return data.fatalities > 0;
  })
  console.log(filtered_data);
  filtered_data = filtered_data.sort(function(a, b){return b.fatalities-a.fatalities});
  filtered_data = filtered_data.slice(0, 10);
  console.log(filtered_data);
  var data = [filtered_data.location, filtered_data.fatalities];
  Plotly.newPlot('myDiv', data);
}
function makelineChart(data){


  var trace1 = {
    x: data.map(datum => datum.timestamp),
    y:data.map(datum => datum.fatalities),
    type: 'scatter'
  };
  
  
  var linechart1 = [trace1];
  
  Plotly.newPlot('myDiv', linechart1);
  
};
