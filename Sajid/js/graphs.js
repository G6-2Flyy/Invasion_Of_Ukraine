$(document).ready(function () {

    d3.json('data/ukraine_war_data.json').then(function(data){
    
        populatefilterlists(data);

        d3.select("#selmaineventset").on("change", function () {

            // create Sub Events Menu
            const sub_events_list = new Set();
            let event_selected = d3.select("#selmaineventset").node().value;

            if (event_selected == "All") {

                data.forEach(datapoints => sub_events_list.add(datapoints.sub_event_type));

            }
            else {

                data.forEach(datapoints =>  {
                    if (datapoints.event_type == event_selected) {
                        sub_events_list.add(datapoints.sub_event_type);
                    }
                });
            }

            var sub_events_list_array = Array.from(sub_events_list);
            $("#selsubeventset").empty();
            d3.select("#selsubeventset").append("option").text("All");
            sub_events_list_array.forEach((events) => d3.select("#selsubeventset").append("option").text(events));
    
        });

    //     d3.json('data/RB_battle.json').then(function (data2) {
    //       console.log('3rd print', data2);
    //       makeLineChartHigh(data2);
    //   })

        // End Create Sub Events Menu

        makeChart(data);
        makeLineChartHigh(data);

        $("#filter").on("click", function () {
            let datafilt = filterdata(data);
            makeChart(datafilt);
            makeLineChartHigh(datafilt);
          });

    });
    
});

// populate filter lists

function populatefilterlists(data) {

    //main event list

    const events_list = new Set();
    const sub_events_list = new Set();
    const sources_list = new Set();
    const instigator_list = new Set();
    const month_list = new Set();

    data.forEach((datapoints) => {
        events_list.add(datapoints.event_type);
        sub_events_list.add(datapoints.sub_event_type);
        sources_list.add(datapoints.source2);
        instigator_list.add(datapoints.actor1);
        date_array = datapoints.event_date.split("-");
        month_list.add(date_array[1]);
    })

    var events_list_array = Array.from(events_list);
    var sub_events_list_array = Array.from(sub_events_list);
    var sources_list_array = Array.from(sources_list);
    var instigator_list_array = Array.from(instigator_list);
    var min_fatalities_array = [1, 2, 3, 4, 5, 10, 15, 20, 50, 100, 350];
    var max_fatalities_array = [100, 50, 20, 15, 10, 5, 4, 3, 2, 1];
    var month_list_array = Array.from(month_list);

    events_list_array.forEach(events => d3.select("#selmaineventset").append("option").text(events));
    sub_events_list_array.forEach((events) => d3.select("#selsubeventset").append("option").text(events));
    sources_list_array.forEach(source => d3.select("#selsourceset").append("option").text(source));
    month_list_array.forEach(month => d3.select("#selmonthset").append("option").text(month));
    min_fatalities_array.forEach(fatalnumber => d3.select("#selminfatalset").append("option").text(fatalnumber));
    max_fatalities_array.forEach(fatalnumber => d3.select("#selmaxfatalset").append("option").text(fatalnumber));   
    instigator_list_array.forEach(instigator => d3.select("#selinstigatorset").append("option").text(instigator));
    

}

// filter data

function filterdata(data) {

    main_event = d3.select("#selmaineventset").node().value;
    sub_main_event = d3.select("#selsubeventset").node().value;
    sel_month = d3.select("#selmonthset").node().value;
    sel_source = d3.select("#selsourceset").node().value;
    sel_instigator = d3.select("#selinstigatorset").node().value;
    min_fatal = d3.select("#selminfatalset").node().value;
    max_fatal = d3.select("#selmaxfatalset").node().value;

    var dataf = data;

    if (max_fatal > min_fatal) {

            d3.select("#maxfatalerror").text("");

            if (main_event == "All") {
                dataf = dataf;
            }
            else {
                dataf = dataf.filter(datum => datum.event_type == main_event);
            }

            if (sub_main_event == "All") {
                dataf = dataf;
            }
            else {
                dataf = dataf.filter(datum => datum.sub_event_type == sub_main_event);
            }
            
            if (sel_month == "All") {
                dataf = dataf;
            }
            else {
                dataf = dataf.filter(datum => datum.event_date.split("-")[1] == sel_month);
            }

            if (sel_source == "All") {
                dataf = dataf;
            }
            else {
                dataf = dataf.filter(datum => datum.source2 == sel_source);
            }

            if (sel_instigator == "All") {
                dataf = dataf;
            }
            else {
                dataf = dataf.filter(datum => datum.actor1 == sel_instigator);
            }

            dataf = dataf.filter(datum => datum.fatalities >= min_fatal);
            dataf = dataf.filter(datum => datum.fatalities <= max_fatal);

            console.log(dataf);
            
            return dataf;
    }
    else {

            d3.select("#maxfatalerror").text("Maximum fatalities must exceed minimum");
            // console.log(max_fatal);
            // console.log(min_fatal);

            return 0;

    }

    
}

function makeChart(data) {
  let filtered_data = data.filter(function(battle){
    
    return battle.fatalities > 0;
  })
  filtered_data = filtered_data.sort(function(a, b){return b.fatalities-a.fatalities});
  filtered_data = filtered_data.slice(0, 10);
//   console.log(filtered_data);

  location_array = filtered_data.map(battle => battle.location);
  fatalities_array = filtered_data.map(battle => battle.fatalities);
  data_id_array = filtered_data.map(battle => battle.data_id);

  location_date_combined_array = [];
  for (i = 0; i < location_array.length; i++) {
    location_date_combined_array.push(`${location_array[i]} ID: ${data_id_array[i]}`);
  }

  console.log(location_date_combined_array);

  var plot_data = [
    {
      x: location_date_combined_array,
      y: fatalities_array,
      type: 'bar'
    }
  ];

  var layout = {
    title: 'The Top Ten War Incidents with the Highest Number of Fatalities',
    font:{
      family: 'Raleway, sans-serif'
    },
    showlegend: false,
    xaxis: {
      tickangle: -45
    },
    yaxis: {
      zeroline: false,
      gridwidth: 2
    },
    bargap :0.05
  };

  Plotly.newPlot('bargraph', plot_data);

}

function makeLineChartHigh(data) {

// Gather Data

months_array = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];

let num_war_events = [];
let num_fatalities = [];

    for (j = 0; j < months_array.length; j++) {

        let fatalities_total = 0;
        war_events_month = data.filter(datum => datum.event_date.split('-')[1] == months_array[j]);
        num_war_events.push(war_events_month.length);
        for (k = 0; k < war_events_month.length; k++) {
            fatalities_total = fatalities_total + war_events_month[k].fatalities;
        }
        num_fatalities.push(fatalities_total);

    }

console.log(num_war_events);
console.log("2ndPrint", num_fatalities);

// Data retrieved

// Make High chart


Highcharts.chart('high_container', {
    chart: {
        type: 'spline'
    },
    title: {
        text: 'Monthly Battles in Ukraine'
    },
    // subtitle: {
    //     text: 'Source: ' +
    //         '<a href="https://en.wikipedia.org/wiki/List_of_cities_by_average_temperature" ' +
    //         'target="_blank">Wikipedia.com</a>'
    // },
    xAxis: {
        categories: months_array,
        accessibility: {
            description: 'Months of the year'
        }
    },
    yAxis: {
        title: {
            text: 'War Events'
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
        name: 'War Events',
        marker: {
            symbol: 'square'
        },
        data: num_war_events

    },
    {
        name: 'Fatalities',
        marker: {
            symbol: 'square'
        },
        data: num_fatalities

    }]

});

}