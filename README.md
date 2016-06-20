# JSVGOrganisationChart
A free Javascript SVG Organisation Chart with Optional Grouping, Styling and Navigation methods.

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
    chart.addGroup(undefined, "Grp1", "Directors");
    chart.addNode("Grp1", undefined, "Node1", "Mr Director", ["Manager", "Runs Everything"]);
    chart.addNode("Grp1", undefined, "Node2", "Mrs Money", ["Finance Manager", "Pays for Everything"]);
    chart.addNode("Grp1", "Node1", "Node1.1", "Mrs Finance Director", ["Accountant", "Pays for somethings"]);
    chart.addNode("Grp1", "Node1", "Node1.2", "Mr Sales Director", ["Head of Sales", "Sells Everything"]);
    chart.addNode("Grp1", "Node2", "Node2.1", "Mr Wide", ["Finance Clerk Who has a really long Job Title", "Plays with numbers"]);

    chart.addGroup("Grp1", "Grp2", "Software Developers");
    chart.addNode("Grp2", undefined, "Node2.1", "Mr Manager", ["Business Manager", "Orders Lackies"]);
    chart.addNode("Grp2", "Node2.1", "Node2.1.1", "Mr Software Developer 1", ["Software Developer", "Makes Bugs", "Cleans Office"]);
    chart.addNode("Grp2", "Node2.1.1", "Node2.1.1.1", "Mr Student", ["Placement Dude", "Tests"]);
    chart.addNode("Grp2", "Node2.1", "Node2.1.2", "Mrs Software Developer 2", ["Software Developer", "Makes Codes"]);
    chart.addNode("Grp2", "Node2.1", "Node2.1.3", "Mr Software Developer 3", ["Software Developer", "Turns Water into Wine"]);
    chart.addGroup("Grp1", "Grp3", "Support Team");
    chart.addNode("Grp3", undefined, "Node3.1", "Mrs Support Manager", ["Business Manager", "Orders Lackies"]);
    chart.addNode("Grp3", "Node3.1", "Node3.1.1", "Mr", ["1st Line Support", "Phone Jocky"]);
```
```
    </script>
</body>
</html>
```
