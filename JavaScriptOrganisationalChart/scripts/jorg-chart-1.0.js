function JOrganisationChart(svgElement, chartData, settings)
{
    this.svgElement = svgElement;

    //Defaults
	this.chartAlign = "centre";
	this.nodeTitleSize = 30; //Default to 30px
	this.nodeLineSpacing = 0;
	this.nodeTextSize = 20; //Default to 20px
	this.nodePadding = 10; //Default to 10px
	this.nodeMargin = 10; //Default to 10px
	this.nodeFont = "Arial";
	this.nodeTextColour = "rgba(0,0,0,1)"
	this.nodeStyle = "fill:rgba(50,50,125,0.8);stroke:rgba(0,0,50,1);stroke-width:1;";
	this.groupFont = "Arial";
	this.groupTextColour = "rgba(0,0,0,1)"
	this.groupPadding = 20; //Default to 20px
	this.groupStyle = "fill:rgba(50,50,125,0.8);stroke:rgba(0,0,50,1);stroke-width:2;";
	this.chartPadding = 30;

	if (settings != undefined) {
	    if (settings.chartAlign != undefined) { this.chartAlign = settings.chartAlign };
	    if (settings.nodeTitleSize != undefined) { this.nodeTitleSize = settings.nodeTitleSize };
	    if (settings.nodeLineSpacing != undefined) { this.nodeLineSpacing = settings.nodeLineSpacing };
	    if (settings.nodeTextSize != undefined) { this.nodeTextSize = settings.nodeTextSize };
	    if (settings.nodePadding != nodePadding) { this.nodePadding = settings.nodePadding };
	    if (settings.nodeMargin != undefined) { this.nodeMargin = settings.nodeMargin };
	    if (settings.nodeFont != undefined) { this.nodeFont = settings.nodeFont };
	    if (settings.groupFont != undefined) { this.groupFont = settings.groupFont };
	    if (settings.nodeStyle != undefined) { this.nodeStyle = settings.nodeStyle };
	    if (settings.groupStyle != undefined) { this.groupStyle = settings.groupStyle };
	    if (settings.nodeTextColour != undefined) { this.nodeTextColour = settings.nodeTextColour };
	    if (settings.groupTextColour != undefined) { this.groupTextColour = settings.groupTextColour };
	    if (settings.groupPadding != undefined) { this.groupPadding = settings.groupPadding };
	    if (settings.chartPadding != undefined) { this.chartPadding = settings.chartPadding };
	}

	if (chartData != undefined)
	{
		if (chartData.group != undefined)
		{
		    var dimensions = this.calculateGroupSize(chartData.group);

		    this.drawGroup(this.chartPadding + dimensions.width / 2, this.chartPadding, svgElement, chartData.group)
		}
	}
}

JOrganisationChart.prototype.calculateGroupSize = function (group) {
    var dimensions = { width: 0, height: 0 };

    if (group != undefined) {
        dimensions.width = this.groupPadding * 2;

        if (group.nodes != undefined && group.nodes.length > 0) {
            for (var i = 0; i < group.nodes.length; i++) {
                var nodeDimensions = this.calculateNodeSize(group.nodes[i]);

                dimensions.width = dimensions.width + nodeDimensions.width + (this.nodeMargin*2);

                if (nodeDimensions.height > dimensions.height)
                {
                    dimensions.height = nodeDimensions.height;
                }
            }
            dimensions.height = dimensions.height + (this.nodeMargin * 2) + (this.groupPadding * 2);
        }
    }

    return dimensions;
}

JOrganisationChart.prototype.calculateNodeSize = function (nodeData) {
	var dimensions = { width: 0, height: 0 };

	if (nodeData != undefined)
	{
		var carrageLoc = this.nodePadding;
         
		//Measure Width (max line width + padding)
		if (nodeData.title != undefined && nodeData.title.length > 0)
		{
		    dimensions.width = this.calculateTextWidth(nodeData.title, this.nodeTitleSize);
		    carrageLoc = carrageLoc + this.nodeTitleSize + this.nodeLineSpacing;
		}

		if (nodeData.text != undefined && nodeData.text.length > 0)
		{
			var lineWidth = 0;

			for (var i = 0; i < nodeData.text.length;i++)
			{
				carrageLoc = carrageLoc + this.nodeTextSize;
				lineWidth = this.calculateTextWidth(nodeData.text[i],this.nodeTextSize);
				if (dimensions.width < lineWidth)
				{
					dimensions.width = lineWidth;
				}

				if (i < (nodeData.text.length -1))
				{
				    carrageLoc = carrageLoc + this.nodeLineSpacing;
				}
			}
		}
		carrageLoc = carrageLoc + this.nodePadding;
		dimensions.width = dimensions.width + (this.nodePadding * 2);
		dimensions.height = carrageLoc;
	}

	return dimensions;
};

JOrganisationChart.prototype.calculateTextWidth = function(text,fontSize)
{
    return text.length * (fontSize / 2);
}

JOrganisationChart.prototype.drawGroup = function (cx, cy, svgElement, group) {
    if (group != undefined) {
        var grpDimensions = this.calculateGroupSize(group)

        //Draw group box
        var groupBoxSVG = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        groupBoxSVG.setAttribute('x', cx - (grpDimensions.width / 2));
        groupBoxSVG.setAttribute('y', cy);
        groupBoxSVG.setAttribute('width', grpDimensions.width);
        groupBoxSVG.setAttribute('height', grpDimensions.height);
        groupBoxSVG.setAttribute("style", this.groupStyle);

        svgElement.append(groupBoxSVG);

        var ncx = (cx - (grpDimensions.width / 2)) + this.groupPadding;
        var ncy = (cy + this.groupPadding)

        if (group.nodes != undefined && group.nodes.length > 0) {

            ncy = ncy + this.nodeMargin;
            //Draw Row
            for (var i = 0; i < group.nodes.length; i++) {
                var nodeDimensions = this.calculateNodeSize(group.nodes[i]);
                ncx = ncx + (nodeDimensions.width / 2) + this.nodeMargin;
                this.drawNode(ncx, ncy, this.svgElement, group.nodes[i]);
                ncx = ncx + (nodeDimensions.width / 2) + this.nodeMargin;
            }
            ncy = ncy + this.nodeMargin;
        }
    }
}

JOrganisationChart.prototype.drawNode = function (cx, cy, svgElement, nodeData) {

    if (nodeData != undefined && svgElement != undefined)
	{
		var dimensions = this.calculateNodeSize(nodeData);

        //Draw node box
		var nodeBoxSVG = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		nodeBoxSVG.setAttribute('x', cx - (dimensions.width / 2));
		nodeBoxSVG.setAttribute('y', cy);
		nodeBoxSVG.setAttribute('width', dimensions.width);
		nodeBoxSVG.setAttribute('height', dimensions.height);
		nodeBoxSVG.setAttribute("style", this.nodeStyle);

		svgElement.append(nodeBoxSVG);

		var carrageLoc = cy + this.nodePadding;

		if (nodeData.title != undefined && nodeData.title.length > 0) {

		    carrageLoc = carrageLoc + (this.nodeTitleSize * 0.75);
		    //Render Title
		    var nodeTitleSVG = document.createElementNS("http://www.w3.org/2000/svg", "text");
		    nodeTitleSVG.setAttribute('text-anchor', 'middle');
		    nodeTitleSVG.setAttribute('alignment-baseline', 'central');
		    nodeTitleSVG.setAttribute('x', cx);
		    nodeTitleSVG.setAttribute('y', carrageLoc);
		    nodeTitleSVG.setAttribute("fill", this.nodeTextColour);
		    nodeTitleSVG.setAttribute("style", "font-family:" + this.nodeFont + "; font-size:" + this.nodeTitleSize + "px;");
		    nodeTitleSVG.textContent = nodeData.title;

		    svgElement.append(nodeTitleSVG);

		    carrageLoc = carrageLoc + (this.nodeTitleSize * 0.25);
		    carrageLoc = carrageLoc + this.nodeLineSpacing;
		}

        //Render other text lines
        if (nodeData.text != undefined && nodeData.text.length > 0) {
            for (var i = 0; i < nodeData.text.length; i++) {

                carrageLoc = carrageLoc + (this.nodeTextSize * 0.75);

                var nodeTextSVG = document.createElementNS("http://www.w3.org/2000/svg", "text");
                nodeTextSVG.setAttribute('text-anchor', 'middle');
                nodeTextSVG.setAttribute('alignment-baseline', 'central');
                nodeTextSVG.setAttribute('x', cx);
                nodeTextSVG.setAttribute('y', carrageLoc);
                nodeTextSVG.setAttribute("fill", this.nodeTextColour);
                nodeTextSVG.setAttribute("style", "font-family:" + this.nodeFont + "; font-size:" + this.nodeTextSize + "px;");
                nodeTextSVG.textContent = nodeData.text[i];
                svgElement.append(nodeTextSVG);

                carrageLoc = carrageLoc + (this.nodeTextSize * 0.25);

                if (i < (nodeData.text.length - 1)) {
                    carrageLoc = carrageLoc + this.nodeLineSpacing;
                }
            }
        }
	}
};