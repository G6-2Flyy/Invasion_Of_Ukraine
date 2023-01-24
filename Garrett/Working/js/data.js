$(document).ready(function () {

    d3.json('data/ukraine_war_data.json').then(function(data){
    
        createdatatable(data);

    });
    
});

