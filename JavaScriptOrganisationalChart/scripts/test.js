document.addEventListener("DOMContentLoaded", function(event){

    var charData = {
        groups: [
            {
                id: "1",
                title: "Test Group 1",
                type: "Group",
                nodes: [
                    { id: "1", type: "Node", title: "Mrs D", text: ["Director", "Paid loads"] }
                ]
            },
            {
                id: "2",
                title: "Test Group 2",
                type: "Group",
                nodes: [
                    {
                        id: "2", type: "Node", title: "Mr Director", text: ["Director", "Paid loads"], children:
                            [
                                {
                                    id: "3", type: "Node", title: "The Cleaner", text: ["Middle Manager 1", "Paid a bit"], children:
                                        [
                                            { id: "200", type: "Node", title: "The great Johnson", text: ["And Johnson", "Paid some"] },
                                            { id: "201", type: "Node", title: "The less greate Johnson", text: ["And Johnson", "Paid some"] }
                                        ]
                                },
                                { id: "4", type: "Node", title: "The Partner", text: ["Middle Manager 2", "Paid a bit"] },
                                { id: "5", type: "Node", title: "The Another", text: ["Middle Manager 3", "Paid a bit"] },
                                {
                                    id: "6", type: "Node", title: "The Johnson", text: ["Middle Manager 4", "Paid a bit", "Worth the money"], children:
                                        [
                                            { id: "7", type: "Node", title: "Johnson", text: ["And Johnson", "Paid some"] }
                                        ]
                                }
                            ],
                        onclick: "openTo(event,'http://www.bbc.co.uk')",
                        onmouseover: "setStyle(event,'fill:rgba(240,240,240,1);stroke:rgba(181,217,234,1);stroke-width:2;')",
                        onmouseout: "setStyle(event,'fill:rgba(255,255,255,1);stroke:rgba(181,217,234,1);stroke-width:1;')"
                    },
                    {
                        id: "8", type: "Node", title: "Mrs Director", text: ["Owner", "Owns most of Russia"], children:
                              [
                                  { id: "9", type: "Node", title: "The Manager", text: ["Manager 1", "Paid a bit more"] },
                                  { id: "10", type: "Node", title: "The Money", text: ["Accountant", "Paid a lot"] }
                              ]
                    },
                    { id: "11", type: "Node", title: "VP", text: ["Owner", "Owns most of Europe"] }
                ],
                children: [
                    {
                        id: "3",
                        type: "Group",
                        title: "Test 2",
                        nodes: [
                            {
                                id: "12", type: "Node", title: "Business Manager", text: ["BM", "Does Stuff"], children:
                                [
                                  { id: "13", type: "Node", title: "Subordinate 1", text: ["Subordinate", "Paid"] },
                                  { id: "14", type: "Node", title: "Subordinate 2", text: ["Subordinate", "Paid"] }
                                ]
                            }
                        ]
                    },
                    {
                        id: "4",
                        type: "Group",
                        title: "Test 3",
                        nodes: [
                            {
                                id: "15", type: "Node", title: "Business Manager 2", text: ["BM", "Does Stuff"], children:
                                [
                                  { id: "16", type: "Node", title: "Subordinate 3", text: ["Subordinate", "Paid"] },
                                  { id: "17", type: "Node", title: "Subordinate 4", text: ["Subordinate", "Paid"] }
                                ]
                            }
                        ],
                        children: [
                            {
                                id: "5",
                                type: "Group",
                                title: "Test 9",
                                nodes: [
                                    {
                                        id: "18", type: "Node", title: "Business Manager", text: ["BM", "Does Stuff"], children:
                                        [
                                          { id: "19", type: "Node", title: "Subordinate 7", text: ["Subordinate", "Paid"] },
                                          { id: "20", type: "Node", title: "Subordinate 8", text: ["Subordinate", "Paid"] }
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


    var chart = new JOrganisationChart(document.getElementById("mySVG"), charData);

    chart.addGroup(undefined, "1000", "Top Group");
    chart.addGroup("1000", "101", "Bot1 Group");
    chart.addGroup("1000", "102", "Bot2 Group");
    chart.addGroup("1", "101", "Add Group", [
                            {
                                id: "304", type: "Node", title: "Business Manager 2", text: ["BM", "Does Stuff"], children:
                                [
                                  { id: "401", type: "Node", title: "Subordinate 3", text: ["Subordinate", "Paid"] },
                                  { id: "402", type: "Node", title: "Subordinate 4", text: ["Subordinate", "Paid"] }
                                ]
                            }
    ]);
    chart.addGroup("1", "102", "Add Next Group");

    chart.addNode("102", undefined, "301", "Added Node", ["Added Sub"]);
    chart.addNode("4", "16", "303", "Added Node", ["Added Sub"]);
});
