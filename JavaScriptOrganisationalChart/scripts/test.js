$(document).ready(function(){

    var charData = {
        group: {
            name: "Test1",
            nodes: [{ title: "Mr Director", text: ["Director", "Paid loads"] }, { title: "Mrs Director", text: ["Owner", "Owns most of Russia"] }]
        }
    }


    var chart = new JOrganisationChart($("#mySVG"), charData);

});
