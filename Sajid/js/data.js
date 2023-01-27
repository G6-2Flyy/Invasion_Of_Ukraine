$(document).ready(function () {
    createdatatable2();    
});

function createdatatable2() {

    d3.json('data/ukraine_war_data.json').then(function(data){

        data_values = data.map(datum => Object.values(datum));
        data_headers = Object.keys(data[0]);
        data_columns = [];

        for (i = 0; i < data_headers.length; i++) {
            header = data_headers[i];
            title_dict = {'title': `${header}`};
            data_columns.push(title_dict);
        }

        console.log(data_values);
        console.log(data_columns);

        $(document).ready(function() {

            $('#data_table').DataTable({
                data: data_values,
                columns: data_columns,
                fixedColumns: true,
            });

        });

    });



    // d3.text('data/table_html.txt').then(function(t_string){
    //     document.getElementById("datatablecontainer").innerHTML += t_string;
    //     $(document).ready(function() {
    //         $('#data_table').DataTable();
    //     })       
    // }); 

}


// function createdatatable(data) {

//     // create header string



//     var starter_string = ` <thead> <tr> `;
//     var added_string = "";
//     var ender_string = ' </tr> </thead> ';

//     headers_list = Object.keys(data[0]);
//     // console.log(headers_list);

//     for (i = 0; i < headers_list.length; i++) {
//         added_string = ` <th>${headers_list[i]}</th> `;
//         starter_string = starter_string.concat(added_string);
//     }

//     var final_string = starter_string.concat(ender_string);
//     // console.log(final_string);

//     document.getElementById("data_table").innerHTML += final_string;

//     // add row data

//     document.getElementById("data_table").innerHTML += ` <tbody> `;

//     for (k = 0; k < 20; k++) {

//         var row_starter_string = ` <tr> `;
//         var row_added_string = "";
//         var row_ender_string = ` </tr> `;

//         row_list = Object.values(data[k]);
//         // console.log(row_list);

//         for (j = 0; j < row_list.length; j++) {
//             row_added_string = ` <td>${row_list[j]}</td> `;
//             row_starter_string = row_starter_string.concat(row_added_string);
//         }

//         var row_final_string = row_starter_string.concat(row_ender_string);
//         // console.log(row_final_string);

//         document.getElementById("data_table").innerHTML += row_final_string;
    
//     }

//     document.getElementById("data_table").innerHTML += ` </tbody> `;

//     $(document).ready(function() {

//         $('#data_table').DataTable();

//     })

// }