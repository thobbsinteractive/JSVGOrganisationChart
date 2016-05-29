$(document).ready(function(){

    var charData = {
        group: {
            name: "Test1",
            nodes: [{title:"Timmys Test", text:["Hit me baby","one more time"]}]
        }
    }


    var chart = new JOrganisationChart(document.getElementById("myCanvas"), charData);

});
