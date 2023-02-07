$(document).ready(function () {

    // d3.json('data/ukraine_war_data.json').then(function(data){
        
    //     createdatatable(data);

    // });


    createdatatable2();
    
});

function createdatatable2() {

    // table_string = '<table id="data_table" border="1" class="dataframe">  <thead>    <tr style="text-align: right;">      <th></th>      <th>data_id</th>      <th>event_date</th>      <th>year</th>      <th>event_type</th>      <th>sub_event_type</th>      <th>actor1</th>      <th>admin1</th>      <th>admin2</th>      <th>admin3</th>      <th>location</th>      <th>latitude</th>      <th>longitude</th>      <th>source</th>      <th>notes</th>      <th>fatalities</th>      <th>timestamp</th>      <th>source2</th>    </tr>  </thead>  <tbody>    <tr>      <th>29781</th>      <td>9439679</td>      <td>31-Jul-22</td>      <td>2022</td>      <td>Explosions/Remote violence</td>      <td>Shelling/artillery/missile attack</td>      <td>Military Forces of Russia (2000-)</td>      <td>Sumy</td>      <td>Sumskyi</td>      <td>Bilopilska</td>      <td>Iskryskivshchyna</td>      <td>51.2390</td>      <td>34.3766</td>      <td>Ministry of Defence of Ukraine</td>      <td>On 31 July 2022, Russian forces shelled near Iskryskivshchyna, Sumy. Casualties unknown.</td>      <td>0</td>      <td>1660055882</td>      <td>Ministry of Defence of Ukraine</td>    </tr>    <tr>      <th>15190</th>      <td>9579592</td>      <td>13-Oct-22</td>      <td>2022</td>      <td>Explosions/Remote violence</td>      <td>Shelling/artillery/missile attack</td>      <td>Military Forces of Russia (2000-)</td>      <td>Donetsk</td>      <td>Volnovaskyi</td>      <td>Velykonovosilkivska</td>      <td>Zolota Nyva</td>      <td>47.7943</td>      <td>36.9905</td>      <td>Ministry of Defence of Ukraine</td>      <td>On 13 October 2022, Russian military forces shelled near Zolota Nyva, Donetsk. Casualties unknown.</td>      <td>0</td>      <td>1666188231</td>      <td>Ministry of Defence of Ukraine</td>    </tr>  </tbody></table>'

    d3.text('data/table_html.txt').then(function(t_string){
        console.log(t_string);
        document.getElementById("datatablecontainer").innerHTML += t_string;

        $(document).ready(function() {

            $('#data_table').DataTable();

        })

        return t_string;        
    });

    // console.log(table_string);

    

}


function createdatatable(data) {

    // create header string
    var starter_string = ` <thead> <tr> `;
    var added_string = "";
    var ender_string = ' </tr> </thead> ';

    headers_list = Object.keys(data[0]);
    // console.log(headers_list);

    for (i = 0; i < headers_list.length; i++) {
        added_string = ` <th>${headers_list[i]}</th> `;
        starter_string = starter_string.concat(added_string);
    }

    var final_string = starter_string.concat(ender_string);
    // console.log(final_string);

    document.getElementById("data_table").innerHTML += final_string;

    // add row data

    document.getElementById("data_table").innerHTML += ` <tbody> `;

    for (k = 0; k < 20; k++) {

        var row_starter_string = ` <tr> `;
        var row_added_string = "";
        var row_ender_string = ` </tr> `;

        row_list = Object.values(data[k]);
        // console.log(row_list);

        for (j = 0; j < row_list.length; j++) {
            row_added_string = ` <td>${row_list[j]}</td> `;
            row_starter_string = row_starter_string.concat(row_added_string);
        }

        var row_final_string = row_starter_string.concat(row_ender_string);
        // console.log(row_final_string);

        document.getElementById("data_table").innerHTML += row_final_string;
    
    }

    document.getElementById("data_table").innerHTML += ` </tbody> `;

    $(document).ready(function() {

        $('#data_table').DataTable();

    })

}