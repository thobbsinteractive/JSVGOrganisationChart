

function JOrganisationChart(svgElement, chartData, x, y)
{
	this.x = x;
	this.y = y;

	this.chartAlign = "centre";

	this.nodeTitleSize = 30; //Default to 30px
	this.nodeLineSpacing = 0;
	this.nodeTextSize = 20; //Default to 20px
	this.nodePadding = 10; //Default to 10px
	this.nodeMargin = 10; //Default to 10px
	this.nodeFont = "Arial";
	this.svgElement = svgElement;
	this.nodeBackGroundColour = "rgba(50,50,125,0.8)"
	this.nodeBorderColour = "rgba(0,0,50,1)"
	this.nodeTextColour = "rgba(0,0,0,1)"

	if (chartData != undefined)
	{
		if (chartData.group != undefined)
		{
			if (chartData.group.nodes != undefined && chartData.group.nodes.length > 0) {
				for(var i = 0; i < chartData.group.nodes.length; i++)
				{
				    this.drawNode(100, 100, this.svgElement, chartData.group.nodes[i]);
				}
			}
		}
	}
}

JOrganisationChart.prototype.calculateNodeSize = function (svgElement, nodeData) {
	var dimensions = { width: 0, height: 0 };

	if (nodeData != undefined)
	{
		var carrageLoc = this.nodePadding;
         
		//Measure Width (max line width + padding)
		if (nodeData.title != undefined && nodeData.title.length > 0)
		{
		    dimensions.width = (nodeData.title.length * (this.nodeTitleSize/2)) + (this.nodePadding * 2);
		    carrageLoc = carrageLoc + this.nodeTitleSize + this.nodeLineSpacing;
		}

		if (nodeData.text != undefined && nodeData.text.length > 0)
		{
			var lineWidth = 0;

			for (var i = 0; i < nodeData.text.length;i++)
			{
				carrageLoc = carrageLoc + this.nodeTextSize;
				lineWidth = (nodeData.text[i].length * (this.nodeTextSize / 2)) + (this.nodePadding * 2);
				if (dimensions.width < lineWidth)
				{
					dimensions.width = lineWidth;
				}

				if (i < (nodeData.text.length -1))
				{
				    carrageLoc = carrageLoc + this.nodeLineSpacing;
				}
			}
			carrageLoc = carrageLoc + this.nodePadding;
		}

		dimensions.height = carrageLoc;
	}

	return dimensions;
};

JOrganisationChart.prototype.drawNode = function (cx, cy, svgElement, nodeData) {

    if (nodeData != undefined && svgElement != undefined)
	{
		var dimensions = this.calculateNodeSize(svgElement, nodeData);

		var x = cx + (dimensions.width / 2);

        //Draw node box
		var nodeBoxSVG = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		nodeBoxSVG.setAttribute('x', x);
		nodeBoxSVG.setAttribute('y', cy);
		nodeBoxSVG.setAttribute('width', x);
		nodeBoxSVG.setAttribute('height', cy);
		nodeBoxSVG.setAttribute("style", "fill:" + this.nodeBackGroundColour + ";stroke:" + this.nodeBorderColour + ";stroke-width:2;");

		svgElement.append(nodeBoxSVG);

		var carrageLoc = cy + this.nodePadding;

		if (nodeData.title != undefined && nodeData.title.length > 0) {

		    carrageLoc = carrageLoc + this.nodeTitleSize;
		    //Render Title
		    var nodeTitleSVG = document.createElementNS("http://www.w3.org/2000/svg", "text");
		    nodeTitleSVG.setAttribute('x', x + this.nodePadding);
		    nodeTitleSVG.setAttribute('y', carrageLoc);
		    nodeTitleSVG.setAttribute("fill", this.nodeTextColour);
		    nodeTitleSVG.setAttribute("style", "font-family:" + this.nodeFont + "; font-size:" + this.nodeTitleSize + "px;");
		    nodeTitleSVG.textContent = nodeData.title;

		    svgElement.append(nodeTitleSVG);

		    carrageLoc = carrageLoc + (this.nodeTitleSize / 2);
		    carrageLoc = carrageLoc + this.nodeLineSpacing;
		}

        //Render other text lines
        if (nodeData.text != undefined && nodeData.text.length > 0) {
            for (var i = 0; i < nodeData.text.length; i++) {

                carrageLoc = carrageLoc + (this.nodeTextSize/2);

                var nodeTextSVG = document.createElementNS("http://www.w3.org/2000/svg", "text");
                nodeTextSVG.setAttribute('x', x + this.nodePadding);
                nodeTextSVG.setAttribute('y', carrageLoc);
                nodeTextSVG.setAttribute("fill", this.nodeTextColour);
                nodeTextSVG.setAttribute("style", "font-family:" + this.nodeFont + "; font-size:" + this.nodeTextSize + "px;");
                nodeTextSVG.textContent = nodeData.text[i];
                svgElement.append(nodeTextSVG);

                carrageLoc = carrageLoc + (this.nodeTextSize / 2);

                if (i < (nodeData.text.length - 1)) {
                    carrageLoc = carrageLoc + this.nodeLineSpacing;
                }
            }
        }
	}
};