# JSVGOrganisationChart
A FREE Javascript SVG Organisation Chart with Optional Grouping, Styling and Navigation methods.

Why not use Google's Structure Chart instead? 

1: This is Open Source.

2: This is SVG with a (Webkit only) optional link to save as an image.

3: You can get an exact measurement of Chart Size, handy for setting div sizes.

![alt text](https://github.com/thobbsinteractive/JOrganisationChart/blob/master/basicSVGChartExample.png "Basic Example")

```
<!DOCTYPE html>
<html>
<head>
    <title></title>
	<meta charset="utf-8" />
    <script src="scripts/jorg-chart-1.0.js"></script>
</head>
<body>
    <svg xmlns="http://www.w3.org/2000/svg" id="mySVG">
        Sorry, your browser does not support inline SVG necessary for this chart.
    </svg>
    <script>
```
```javascript
    var chart = new JOrganisationChart(document.getElementById("mySVG"));
    
    //Root Group, Group 1:
    chart.addGroup(undefined, "Grp1", "Directors");
    //Group 1, 1st Root Node 
    chart.addNode("Grp1", undefined, "Node1", "Mr Director", ["Manager", "Runs Everything"]);
    //Group 1, 2nd Root Node 
    chart.addNode("Grp1", undefined, "Node2", "Mrs Money", ["Finance Manager", "Pays for Everything"]);
    
    //Group 1, 1st and 2nd Child Nodes
    chart.addNode("Grp1", "Node1", "Node1.1", "Mrs Finance Director", ["Accountant", "Pays for somethings"]);
    chart.addNode("Grp1", "Node1", "Node1.2", "Mr Sales Director", ["Head of Sales", "Sells Everything"]);
    chart.addNode("Grp1", "Node2", "Node2.1", "Mr Wide", ["Finance Clerk Who has a really long Job Title", "Plays with numbers"]);

    //Group 2
    chart.addGroup("Grp1", "Grp2", "Software Developers");
    chart.addNode("Grp2", undefined, "Node2.1", "Mr Manager", ["Business Manager", "Orders Lackies"]);
    chart.addNode("Grp2", "Node2.1", "Node2.1.1", "Mr Software Developer 1", ["Software Developer", "Makes Bugs", "Cleans Office"]);
    chart.addNode("Grp2", "Node2.1.1", "Node2.1.1.1", "Mr Student", ["Placement Dude", "Tests"]);
    chart.addNode("Grp2", "Node2.1", "Node2.1.2", "Mrs Software Developer 2", ["Software Developer", "Makes Codes"]);
    chart.addNode("Grp2", "Node2.1", "Node2.1.3", "Mr Software Developer 3", ["Software Developer", "Turns Water into Wine"]);
    
    //Group 3
    chart.addGroup("Grp1", "Grp3", "Support Team");
    chart.addNode("Grp3", undefined, "Node3.1", "Mrs Support Manager", ["Business Manager", "Orders Lackies"]);
    chart.addNode("Grp3", "Node3.1", "Node3.1.1", "Mr", ["1st Line Support", "Phone Jocky"]);
    chart.drawChart();
```
```
    </script>
</body>
</html>
```

#### Looking for just a simple Structure Chart with no grouping? ####

![alt text](https://github.com/thobbsinteractive/JOrganisationChart/blob/master/simpleSVGChartExample.png "Simple Structure Chart")

```
<!DOCTYPE html>
<html>
<head>
    <title></title>
	<meta charset="utf-8" />
    <script src="scripts/jorg-chart-1.0.js"></script>
</head>
<body>
    <svg xmlns="http://www.w3.org/2000/svg" id="mySVG">
        Sorry, your browser does not support inline SVG necessary for this chart.
    </svg>
    <script>
```
```javascript

    var chart = new JOrganisationChart(document.getElementById("mySVG"));
    chart.setPlainTheme();
    chart.addGroup(undefined, "Grp1", undefined);
    chart.addNode("Grp1", undefined, "Node1", "Mr Director", ["Manager", "Runs Everything"]);
    chart.addNode("Grp1", "Node1", "Node1.1", "Mrs Finance Director", ["Accountant", "Pays for somethings"]);
    chart.addNode("Grp1", "Node1", "Node1.2", "Mr Sales Director", ["Head of Sales", "Sells Everything"]);
    chart.addNode("Grp1", "Node1", "Node1.3", "Mr Wide", ["Finance Clerk Who has a really long Job Title", "Plays with numbers"]);
    chart.addNode("Grp1", "Node1.1", "Node1.1.1", "Mr Cleaner", ["Cleaner", "Cleans"]);
    chart.addNode("Grp1", "Node1.1", "Node1.1.2", "Mr Shopfloor", ["Head of Sales", "Sells Everything"]);
    chart.addNode("Grp1", "Node1.3", "Node1.3.1", "Mr John Hummer", ["Muscian", "Sound Track to the 80s"]);
    chart.drawChart();
```
```
    </script>
</body>
</html>
```

#### Need basic Interactivity? ####
Using built in methods you can set attributes using setStyle(...) or navigate or open a new tab using the openTo(...) and navigateTo(...) methods.

The example below sets style attributes on mouse over/mouse out and Navigates when a node is clicked.

![alt text](https://github.com/thobbsinteractive/JOrganisationChart/blob/master/InteractiveSVGChartExample.png "Interactive Chart")

```
<!DOCTYPE html>
<html>
<head>
    <title></title>
	<meta charset="utf-8" />
    <script src="scripts/jorg-chart-1.0.js"></script>
</head>
<body>
    <svg xmlns="http://www.w3.org/2000/svg" id="mySVG">
        Sorry, your browser does not support inline SVG necessary for this chart.
    </svg>
    <script>
```
```javascript

    var chart = new JSVGOrganisationChart(document.getElementById("mySVG"));
    chart.addGroup(undefined, "Grp1", "Interactivity Demo");
    chart.addNode("Grp1", undefined, "Node1", "BBC", ["Click Navigates", "to BBC"], undefined,
        "navigateTo(event,'http://www.bbc.co.uk')",
        "setStyle(event,'fill:rgba(217,227,235,1);cursor:pointer;','cursor:pointer;','cursor:pointer;')",
        "setStyle(event,'fill:rgba(255,255,255,1);cursor:default;','cursor:default;','cursor:default;')");
    chart.addNode("Grp1", "Node1", "Node1.1", "Google", ["Click Opens Tab", "to Google"], undefined,
        "openTo(event,'http://www.google.co.uk')",
        "setStyle(event,'fill:rgba(217,227,235,1);cursor:pointer;','cursor:pointer;','cursor:pointer;')",
        "setStyle(event,'fill:rgba(255,255,255,1);cursor:default;','cursor:default;','cursor:default;')");
    chart.addNode("Grp1", "Node1", "Node1.2", "Nothing ", ["Click Does Nothing"], undefined,
        undefined,
        "setStyle(event,'fill:rgba(217,227,235,1);cursor:pointer;','cursor:pointer;','cursor:pointer;')",
        "setStyle(event,'fill:rgba(255,255,255,1);cursor:auto;','cursor:default;','cursor:default;')");
    chart.drawChart();
    
```
```
    </script>
</body>
</html>
```
