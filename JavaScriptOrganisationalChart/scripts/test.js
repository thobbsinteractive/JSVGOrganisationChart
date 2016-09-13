document.addEventListener("DOMContentLoaded", function(event){

    //Default Theme Demo
    var chart1 = new JSVGOrganisationChart(document.getElementById("chart1SVG"));
    chart1.addGroup(undefined, "Grp1", "Directors");
    chart1.addNode("Grp1", undefined, "Node1", "Mr Director", ["Manager", "Runs Everything"]);
    chart1.addNode("Grp1", undefined, "Node2", "Mrs Money", ["Finance Manager", "Pays for Everything"]);
    chart1.addNode("Grp1", "Node1", "Node1.1", "Mrs Finance Director", ["Accountant", "Pays for somethings"]);
    chart1.addNode("Grp1", "Node1", "Node1.2", "Mr Sales Director", ["Head of Sales", "Sells Everything"]);
    chart1.addNode("Grp1", "Node2", "Node2.1", "Mr Wide", ["Finance Clerk Who has a really long Job Title", "Plays with numbers"]);

    chart1.addGroup("Grp1", "Grp2", "Software Developers");
    chart1.addNode("Grp2", undefined, "Node2.1", "Mr Manager", ["Business Manager", "Orders Lackies"]);
    chart1.addNode("Grp2", "Node2.1", "Node2.1.1", "Mr Software Developer 1", ["Software Developer", "Makes Bugs", "Cleans Office"]);
    chart1.addNode("Grp2", "Node2.1.1", "Node2.1.1.1", "Mr Student", ["Placement Dude", "Tests"]);
    chart1.addNode("Grp2", "Node2.1", "Node2.1.2", "Mrs Software Developer 2", ["Software Developer", "Makes Codes"]);
    chart1.addNode("Grp2", "Node2.1", "Node2.1.3", "Mr Software Developer 3", ["Software Developer", "Turns Water into Wine"]);
    chart1.addGroup("Grp1", "Grp3", "Support Team");
    chart1.addNode("Grp3", undefined, "Node3.1", "Mrs Support Manager", ["Business Manager", "Orders Lackies"]);
    chart1.addNode("Grp3", "Node3.1", "Node3.1.1", "Mr", ["1st Line Support", "Phone Jocky"]);
    chart1.drawChart();

    
    //Plain Theme Demo
    var chart2 = new JSVGOrganisationChart(document.getElementById("chart2SVG"));
    chart2.setPlainTheme();
    chart2.addGroup(undefined, "Grp1", undefined);
    chart2.addNode("Grp1", undefined, "Node1", "Mr Director", ["Manager", "Runs Everything"]);
    chart2.addNode("Grp1", "Node1", "Node1.1", "Mrs Finance Director", ["Accountant", "Pays for somethings"]);
    chart2.addNode("Grp1", "Node1", "Node1.2", "Mr Sales Director", ["Head of Sales", "Sells Everything"]);
    chart2.addNode("Grp1", "Node1", "Node1.3", "Mr Wide", ["Finance Clerk Who has a really long Job Title", "Plays with numbers"]);
    chart2.addNode("Grp1", "Node1.1", "Node1.1.1", "Mr Cleaner", ["Cleaner", "Cleans"]);
    chart2.addNode("Grp1", "Node1.1", "Node1.1.2", "Mr Shopfloor", ["Head of Sales", "Sells Everything"]);
    chart2.addNode("Grp1", "Node1.3", "Node1.3.1", "Mr John Hummer", ["Muscian", "Sound Track to the 80s"]);
    chart2.drawChart();

    //Interactivity Demo
    var chart3 = new JSVGOrganisationChart(document.getElementById("chart3SVG"));
    chart3.addGroup(undefined, "Grp1", "Interactivity Demo");
    chart3.addNode("Grp1", undefined, "Node1", "BBC", ["Click Navigates", "to BBC"], undefined,
        "navigateTo(event,'http://www.bbc.co.uk')",
        "setStyle(event,'fill:rgba(217,227,235,1);cursor:pointer;','cursor:pointer;','cursor:pointer;')",
        "setStyle(event,'fill:rgba(255,255,255,1);cursor:default;','cursor:default;','cursor:default;')");
    chart3.addNode("Grp1", "Node1", "Node1.1", "Google", ["Click Opens Tab", "to Google"], undefined,
        "openTo(event,'http://www.google.co.uk')",
        "setStyle(event,'fill:rgba(217,227,235,1);cursor:pointer;','cursor:pointer;','cursor:pointer;')",
        "setStyle(event,'fill:rgba(255,255,255,1);cursor:default;','cursor:default;','cursor:default;')");
    chart3.addNode("Grp1", "Node1", "Node1.2", "Nothing ", ["Click Does Nothing"], undefined,
        undefined,
        "setStyle(event,'fill:rgba(217,227,235,1);cursor:pointer;','cursor:pointer;','cursor:pointer;')",
        "setStyle(event,'fill:rgba(255,255,255,1);cursor:auto;','cursor:default;','cursor:default;')");
    chart3.drawChart();

    //Preloaded Data Demo
    var charData = {
        groups: [
            {
                id: "1",
                title: "Test Group 1",
                type: "Group",
                nodes: [
                    { id: "1", type: "Node", title: "Mrs D", text: ["Director", "Paid loads"] }
                ],
                onclick: "openTo(event,'http://www.facebook.co.uk')",
                onmouseover: "setStyle(event,'fill:rgba(217,227,235,1);stroke:rgba(181,217,234,1);stroke-width:2;cursor:pointer;','font-family:Arial;font-size:18px;cursor:pointer;','font-family:Arial;font-size:18px;cursor:pointer;')",
                onmouseout: "setStyle(event,'fill:rgba(237,247,255,1);stroke:rgba(181,217,234,1);stroke-width:2;cursor:auto;','font-family:Arial;font-size:18px;cursor:default;','font-family:Arial;font-size:18px;cursor:default;')"
            },
            {
                id: "2",
                title: "Test Group 2",
                type: "Group",
                nodes: [
                    {
                        id: "1", type: "Node", title: "Mr Director", text: ["Director", "Paid loads"], children:
                            [
                                {
                                    id: "12", type: "Node", title: "The Cleaner", text: ["Middle Manager 1", "Paid a bit"], children:
                                        [
                                            { id: "121", type: "Node", title: "The great Johnson", text: ["And Johnson", "Paid some"] },
                                            { id: "122", type: "Node", title: "The less greate Johnson", text: ["And Johnson", "Paid some"] }
                                        ]
                                },
                                { id: "13", type: "Node", title: "The Partner", text: ["Middle Manager 2", "Paid a bit"] },
                                { id: "14", type: "Node", title: "The Another", text: ["Middle Manager 3", "Paid a bit"] },
                                {
                                    id: "141", type: "Node", title: "The Johnson", text: ["Middle Manager 4", "Paid a bit", "Worth the money"], children:
                                        [
                                            { id: "1411", type: "Node", title: "Johnson", text: ["And Johnson", "Paid some"] }
                                        ]
                                }
                            ],
                        onclick: "openTo(event,'http://www.bbc.co.uk')",
                        onmouseover: "setStyle(event,'fill:rgba(240,240,240,1);stroke:rgba(181,217,234,1);stroke-width:2;cursor:pointer;','font-family:Arial;font-size:16px;cursor:pointer;','font-family:Arial;font-size:12px;cursor:pointer;')",
                        onmouseout: "setStyle(event,'fill:rgba(255,255,255,1);stroke:rgba(181,217,234,1);stroke-width:1;cursor:auto;','font-family:Arial;font-size:16px;cursor:default;','font-family:Arial;font-size:12px;cursor:default;')"
                    },
                    {
                        id: "2", type: "Node", title: "Mrs Director", text: ["Owner", "Owns most of Russia"], children:
                              [
                                  { id: "21", type: "Node", title: "The Manager", text: ["Manager 1", "Paid a bit more"] },
                                  { id: "22", type: "Node", title: "The Money", text: ["Accountant", "Paid a lot"] }
                              ]
                    },
                    { id: "3", type: "Node", title: "VP", text: ["Owner", "Owns most of Europe"] }
                ],
                children: [
                    {
                        id: "21",
                        type: "Group",
                        title: "Test 2",
                        nodes: [
                            {
                                id: "1", type: "Node", title: "Business Manager", text: ["BM", "Does Stuff"], children:
                                [
                                  { id: "11", type: "Node", title: "Subordinate 1", text: ["Subordinate", "Paid"] },
                                  { id: "12", type: "Node", title: "Subordinate 2", text: ["Subordinate", "Paid"] }
                                ]
                            }
                        ],
                        orphannodes: [
                            { id: "1", type: "OrphanNode", title: "Software", nodeStyle: "fill:rgba(237,247,255,1);stroke:rgba(181,217,234,1);stroke-width:2;cursor:auto;", },
                            { id: "2", type: "OrphanNode", title: "Hardware", nodeStyle: "fill:rgba(237,247,255,1);stroke:rgba(181,217,234,1);stroke-width:2;cursor:auto;", },
                            { id: "3", type: "OrphanNode", title: "Spamware", nodeStyle: "fill:rgba(237,247,255,1);stroke:rgba(181,217,234,1);stroke-width:2;cursor:auto;", },
                            { id: "4", type: "OrphanNode", title: "Spyware", nodeStyle: "fill:rgba(237,247,255,1);stroke:rgba(181,217,234,1);stroke-width:2;cursor:auto;", },
                            { id: "5", type: "OrphanNode", title: "Cycleware", nodeStyle: "fill:rgba(237,247,255,1);stroke:rgba(181,217,234,1);stroke-width:2;cursor:auto;", }
                        ]
                    },
                    {
                        id: "22",
                        type: "Group",
                        title: "Test 3",
                        nodes: [
                            {
                                id: "1", type: "Node", title: "Business Manager 2", text: ["BM", "Does Stuff"], children:
                                [
                                  { id: "11", type: "Node", title: "Subordinate 3", text: ["Subordinate", "Paid"] },
                                  { id: "12", type: "Node", title: "Subordinate 4", text: ["Subordinate", "Paid"] }
                                ]
                            }
                        ],
                        children: [
                            {
                                id: "221",
                                type: "Group",
                                title: "Test 9",
                                nodes: [
                                    {
                                        id: "1", type: "Node", title: "Business Manager", text: ["BM", "Does Stuff"], children:
                                        [
                                          { id: "11", type: "Node", title: "Subordinate 7", text: ["Subordinate", "Paid"] },
                                          { id: "12", type: "Node", title: "Subordinate 8", text: ["Subordinate", "Paid"] }
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


    var chart4 = new JSVGOrganisationChart(document.getElementById("chart4SVG"), charData);

    var linkElement = chart4.getImageDownloadLink(document.getElementById("imageDownload"), "Click to Download");
    document.body.appendChild(linkElement);


    chart4.addGroup(undefined, "1000", "Top Group");
    chart4.addGroup("1000", "101", "Bot1 Group");
    chart4.addGroup("1000", "102", "Bot2 Group");
    chart4.addGroup("1", "101", "Add Group", [
                            {
                                id: "304", type: "Node", title: "Business Manager 2", text: ["BM", "Does Stuff"], children:
                                [
                                  { id: "401", type: "Node", title: "Subordinate 3", text: ["Subordinate", "Paid"] },
                                  { id: "402", type: "Node", title: "Subordinate 4", text: ["Subordinate", "Paid"] }
                                ]
                            }
    ]);
    chart4.addGroup("1", "102", "Add Next Group");

    chart4.addNode("102", undefined, "301", "Added Node", ["Added Sub"]);
    chart4.addNode("1", undefined, "1", "Replaced!", ["Replaced Node"]);
    chart4.drawChart();
});
