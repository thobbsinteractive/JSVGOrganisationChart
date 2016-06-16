$(document).ready(function(){

    var charData = {
        groups: [
            {
                name: "Test Group",
                nodes: [
                    { title: "Mrs D", text: ["Director", "Paid loads"] }
                ]
            },
            {
            name: "Test1",
            nodes: [
                {
                    title: "Mr Director", text: ["Director", "Paid loads"], childNodes:
                        [
                            { title: "The Cleaner", text: ["Middle Manager 1", "Paid a bit"], childNodes:
                                    [
                                        { title: "The great Johnson", text: ["And Johnson", "Paid some"] },
                                        { title: "The less greate Johnson", text: ["And Johnson", "Paid some"] }
                                    ]
                            },
                            { title: "The Partner", text: ["Middle Manager 2", "Paid a bit"] },
                            { title: "The Another", text: ["Middle Manager 3", "Paid a bit"] },
                            {
                                title: "The Johnson", text: ["Middle Manager 4", "Paid a bit", "Worth the money"], childNodes:
                                    [
                                        { title: "Johnson", text: ["And Johnson", "Paid some"] }
                                    ]
                            }
                        ],
                    onclick: "openTo(event,'http://www.bbc.co.uk')",
                    onmouseover: "setStyle(event,'fill:rgba(240,240,240,1);stroke:rgba(181,217,234,1);stroke-width:2;')",
                    onmouseout: "setStyle(event,'fill:rgba(255,255,255,1);stroke:rgba(181,217,234,1);stroke-width:1;')"
                },
                {
                    title: "Mrs Director", text: ["Owner", "Owns most of Russia"], childNodes:
                          [
                              { title: "The Manager", text: ["Manager 1", "Paid a bit more"] },
                              { title: "The Money", text: ["Accountant", "Paid a lot"] }
                          ]
                },
                { title: "VP", text: ["Owner", "Owns most of Europe"] }
            ],
            childGroups:[
                {
                    id: "1",
                    name: "Test 2",
                    nodes: [
                        {
                            title: "Business Manager", text: ["BM", "Does Stuff"], childNodes:
                            [
                              { title: "Subordinate 1", text: ["Subordinate", "Paid"] },
                              { title: "Subordinate 2", text: ["Subordinate", "Paid"] }
                            ]
                        }
                    ]
                },
                {
                    name: "Test 3",
                    nodes: [
                        {
                            title: "Business Manager 2", text: ["BM", "Does Stuff"], childNodes:
                            [
                              { title: "Subordinate 3", text: ["Subordinate", "Paid"] },
                              { title: "Subordinate 4", text: ["Subordinate", "Paid"] }
                            ]
                        }
                    ],
                    childGroups: [
                        {
                            name: "Test 9",
                            nodes: [
                                {
                                    title: "Business Manager", text: ["BM", "Does Stuff"], childNodes:
                                    [
                                      { title: "Subordinate 7", text: ["Subordinate", "Paid"] },
                                      { title: "Subordinate 8", text: ["Subordinate", "Paid"] }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
            }
        ]
    }


    var chart = new JOrganisationChart($("#mySVG"), charData);

    chart.addGroup(undefined, "1000", "Top Group");
    chart.addGroup("1", "101", "Add Group");
    chart.addGroup("1", "102", "Add Next Group");

});
