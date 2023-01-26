
d3.json('../Resources/file.json').then(function (data) {
    d3.json('../Resources/RB_battle.json').then(function (data2) {
        console.log('3rd print', data2);
        makeLineChart(data2);
    })
    console.log(data);
    makeChart(data);

})


function makeChart(data) {
    let filtered_data = data.filter(function (battle) {
        console.log(battle.fatalities);
        return battle.fatalities > 0;
    })
    console.log(filtered_data);
    filtered_data = filtered_data.sort(function (a, b) { return b.fatalities - a.fatalities });
    filtered_data = filtered_data.slice(0, 10);
    console.log(filtered_data);

    var data = [
        {
            x: filtered_data.map(function (battle) {
                return battle.location
            }),
            y: filtered_data.map(function (battle) {
                return battle.fatalities
            }),
            type: 'bar'
        }
    ];

    Plotly.newPlot('myDiv', data);

}

function makeLineChart(data) {
    let num_battles = data.map(function (battle) {
        return battle.is_battle
    })
    let num_fatalities = data.map(function (battle) {
        return battle.fatalities
    })
    console.log(num_battles);
    console.log("2ndPrint", data.length);
    // Data retrieved https://en.wikipedia.org/wiki/List_of_cities_by_average_temperature
    Highcharts.chart('container', {
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Monthly Battles in Ukraine'
        },
        subtitle: {
            text: 'Source: ' +
                '<a href="https://en.wikipedia.org/wiki/List_of_cities_by_average_temperature" ' +
                'target="_blank">Wikipedia.com</a>'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
            accessibility: {
                description: 'Months of the year'
            }
        },
        yAxis: {
            title: {
                text: 'Battles'
            },
            labels: {
                formatter: function () {
                    return this.value + '°';
                }
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 4,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        series: [{
            name: 'Battles',
            marker: {
                symbol: 'square'
            },
            data: num_battles

        },
        {
            name: 'Fatalities',
            marker: {
                symbol: 'square'
            },
            data: num_fatalities

        }]

    });
    var options = {
        series: [{
          name: "Battles",
          data: num_battles
        },
        {
          name: "Fatalities",
          data: num_fatalities
        },
       
      ],
        chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [5, 7, 5],
        curve: 'straight',
        dashArray: [0, 8, 5]
      },
      title: {
        text: 'Monthly Battles & Fatalities in Ukraine ',
        align: 'center',
      style: {
      fontSize:  '20px',
      fontWeight:  '',
      fontFamily:  undefined,
      color:  '#263238'
    },
      },
      legend: {
        tooltipHoverFormatter: function(val, opts) {
          return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
        }
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return val + " (mins)"
              }
            }
          },
          {
            title: {
              formatter: function (val) {
                return val + " per session"
              }
            }
          },
          {
            title: {
              formatter: function (val) {
                return val;
              }
            }
          }
        ]
      },
      grid: {
        borderColor: '#f1f1f1',
      }
      };

      var chart = new ApexCharts(document.querySelector("#chart"), options);
      chart.render();

}