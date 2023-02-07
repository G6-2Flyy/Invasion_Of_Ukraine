$(document).ready(function () {

    d3.json('data/ukraine_war_data.json').then(function(data){
    
        d3.json('data/geoBoundaries-UKR-ADM1.geojson').then(function(admin1_data){
       
            d3.json('data/geoBoundaries-UKR-ADM2.geojson').then(function(admin2_data){

            populatefilterlists(data);

            d3.select("#selmaineventset").on("change", function () {

                console.log("hello");
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

            makeMap(data, admin1_data, admin2_data);   
            $("#filter").on("click", function () {
                let datafilt = filterdata(data);
                makeMap(datafilt, admin1_data, admin2_data);
              });
    

            });
        
        });
    
     });
    
});

function makeMap(data, admin1_data, admin2_data) {

    $("#mapcontainer").empty();
    $("#mapcontainer").append("<div id='map'></div>");

    // Make base layers

    var myMap = L.map("map", {
        center: [48, 31],
        zoom: 6
      });

    var street =  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);
    
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    
    var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });

    // Add administrative region boundaries

    let mapStyle1 = {
        color: "#1B1918",
        fillColor: "#1B1918",
        fillOpacity: 0.25,
        weight: 2
      };
    
    
    var admin1 = L.geoJSON(admin1_data.features, {
    style: mapStyle1,
    }).addTo(myMap);

    var admin1_layer = L.layerGroup([admin1]);

    let mapStyle2 = {
        color: "#22577A",
        fillColor: "#22577A",
        fillOpacity: 0.15,
        weight: 1
      };
    
    
    var admin2 = L.geoJSON(admin2_data.features, {
    style: mapStyle2,
    }).addTo(myMap);

    var admin2_layer = L.layerGroup([admin2]);


    // Add a markers layer

    let event_markers = [];
    let coords_list = [];

    lenth = data.length;

    for (i = 0; i < lenth; i++) {
        datum = data[i];
        coords = [datum.latitude, datum.longitude];
        event_data = datum.date;
        event_type = datum.event_type;
        sub_event_type = datum.sub_event_type;
        // location = datum.location;
        var fatalities = datum.fatalities;
        notes = datum.notes;

        var color_dict = {

            'Explosions/Remote violence': "red",
            'Battles': "#FFD600",
            'Strategic developments': "forestgreen",
            'Violence against civilians': "purple",
            'Protests': "#005BBC"

        }
    
        event_markers.push(L.circle(coords, {
                            color: "black",
                            fillColor: color_dict[event_type],
                            fillOpacity: 0.75,
                            radius: 10000*(fatalities+1)**0.3,
                            weight: 0
                        }).bindPopup(`Event: ${event_type} <br> Sub Event: ${sub_event_type} <br> Fatalities: ${fatalities} <br> Notes: ${notes}`).addTo(myMap));
        
                            
       coords_list.push(coords) 
    }

    var event_layer = L.layerGroup(event_markers);
    var heatLayer = L.heatLayer(coords_list);



    // // CREATE HEATMAP LAYER
    // let fatalities_heat = L.markerClusterGroup();
    // let coords2 = [];

    // for (let i = 0; i < data.length; i++) {
    //     let fatalities_count = data[i];
    //     let location = [fatalities_count.latitude, fatalities_count.longitude];

    //     coords2.push([location.coordinates[1], location.coordinates[0]]);
    //     }
    // 

  

    // Collect base layers, overlays, and add a layer control

    var baseMaps = {
        Street: street,
        Topography: topo,
        Satellite: googleSat
      };

    var overlayMaps = {
        "Events": event_layer,
        "Admin Regions 1": admin1_layer,
        "Admin Regions 2": admin2_layer,
        "Heat Map": heatLayer
    };
    
      
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);


    // Create Legend
    var info = L.control({
        position: 'bottomright'
        
      });
      
      info.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        return div;
      };

      info.addTo(myMap);

      createLegend(); 
    

}

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

// Make Legend

function createLegend() {
    document.querySelector(".legend").innerHTML = 
  
      `
      <div class="card border-primary mb-3" style="max-width: 20rem;">
      <div class="card-header" style = 'color:black;'>Events Legend</div>
      <div class="card-body">
         
      <p style = 'background-color:white; color:black;'><svg width="16" height="16">
      <rect width="16" height="16" style="fill:red;stroke-width:0;stroke:rgb(0,0,0)" />
      </svg>&nbsp&nbsp&nbspExplosions/Remote violence</p>
      <p style = 'background-color:white; color:black;'><svg width="16" height="16">
      <rect width="16" height="16" style="fill:#FFD600;stroke-width:0;stroke:rgb(0,0,0)" />
      </svg>&nbsp&nbsp&nbspBattles</p>
      <p style = 'background-color:white; color:black;'><svg width="16" height="16">
      <rect width="16" height="16" style="fill:forestgreen;stroke-width:0;stroke:rgb(0,0,0)" />
      </svg>&nbsp&nbsp&nbspStrategic developments</p>
      <p style = 'background-color:white; color:black;'><svg width="16" height="16">
      <rect width="16" height="16" style="fill:purple;stroke-width:0;stroke:rgb(0,0,0)" />
      </svg>&nbsp&nbsp&nbspViolence against civilians</p>
      <p style = 'background-color:white; color:black;'><svg width="16" height="16">
      <rect width="16" height="16" style="fill:#005BBC;stroke-width:0;stroke:rgb(0,0,0)" />
      </svg>&nbsp&nbsp&nbspProtests</p>
      
      </div>
      </div>`  
      
  }
