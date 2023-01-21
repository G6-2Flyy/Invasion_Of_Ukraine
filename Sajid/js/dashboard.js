

$(window).ready(function() {
    
        d3.json('data/ukraine_war_data.json').then(function(data) {
        // console.log(data);
        makesunburst(data);
        

    });
});


function makesunburst(data) {

    let dataf = data;

    // console.log(Object.keys(data[0]));

    labels_data = [];
    parents_data = [];
    values_data = [];

    // create label lists

    event_type_dict = {};
    subevent_type_dict = {};

    for (i = 0; i < dataf.length; i++) {

        battle_event = data[i].event_type;
        battle_sub_event = data[i].sub_event_type;
        event_type_list = Object.keys(event_type_dict);
        if (event_type_list.includes(battle_event)) {
            event_type_dict[`${battle_event}`][0] +=1;
            
            subevent_type_dict = event_type_dict[`${battle_event}`][1];

            subevent_type_list = Object.keys(subevent_type_dict);

            if (subevent_type_list.includes(battle_sub_event)) {
                event_type_dict[`${battle_event}`][1][`${battle_sub_event}`] +=1;
            }
            else {
                event_type_dict[`${battle_event}`][1][`${battle_sub_event}`] = 1;
            }

        } 
        else {
            subevent_type_dict = {};
            event_type_dict[`${battle_event}`] = [1];
            subevent_type_dict[`${battle_sub_event}`] = 1;
            event_type_dict[`${battle_event}`].push(subevent_type_dict);       
        }

    }

    console.log(event_type_dict);

    event_type_list = Object.keys(event_type_dict);

    for (j = 0; j < event_type_list.length; j++) {
        labels_data.push(event_type_list[j]);
        parents_data.push("");
        event_typ = event_type_list[j];
        values_data.push(event_type_dict[`${event_typ}`][0]);

        subevent_type_dict = event_type_dict[`${event_typ}`][1];
        subevent_type_list = Object.keys(subevent_type_dict);

        for (k = 0; k < subevent_type_list.length; k++) {
            labels_data.push(subevent_type_list[k]);
            parents_data.push(event_type_list[j]);
            subevent_typ = subevent_type_list[k];
            values_data.push(subevent_type_dict[`${subevent_typ}`]);

        }

    }


    console.log(labels_data);
    console.log(parents_data);
    console.log(values_data);



    var data = [
        {
          "type": "sunburst",
          "labels": ["Eve", "Cain", "Seth", "Enos", "Noam", "Abel", "Awan", "Enoch", "Azura"],
          "parents": ["", "Eve", "Eve", "Seth", "Seth", "Eve", "Eve", "Awan", "Eve" ],
          "values":  [65, 14, 12, 10, 2, 6, 6, 4, 4],
          "leaf": {"opacity": 0.4},
          "marker": {"line": {"width": 2}},
          "branchvalues": 'total'
        }];
        
        var layout = {
          "margin": {"l": 0, "r": 0, "b": 0, "t": 0},
        };
        
        
        Plotly.newPlot('sunburstgraph', data, layout, {showSendToCloud: true});
        
        myPlot = document.getElementById("sunburstgraph");


}