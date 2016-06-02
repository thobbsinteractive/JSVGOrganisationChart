function JOrganisationChart(svgElement, chartData, settings)
{
    this.svgElement = svgElement;

    //Defaults
    this.settings = {
        chartAlign : "centre",
        nodeTitleSize : 30, //Default to 30px
        nodeLineSpacing : 0,
        nodeTextSize : 20, //Default to 20px
        nodePadding : 10, //Default to 10px
        nodeMargin : 10, //Default to 10px
        nodeFont : "Arial",
        nodeTextColour : "rgba(0,0,0,1)",
        nodeStyle : "fill:rgba(50,50,125,0.8);stroke:rgba(0,0,50,1);stroke-width:1;",
        groupFont : "Arial",
        groupTextColour : "rgba(0,0,0,1)",
        groupPadding : 20, //Default to 20px
        groupStyle : "fill:rgba(50,50,125,0.8);stroke:rgba(0,0,50,1);stroke-width:2;",
        chartPadding : 30
    }

	if (settings != undefined) {
	    if (settings.chartAlign != undefined) { this.settings.chartAlign = settings.chartAlign };
	    if (settings.nodeTitleSize != undefined) { this.settings.nodeTitleSize = settings.nodeTitleSize };
	    if (settings.nodeLineSpacing != undefined) { this.settings.nodeLineSpacing = settings.nodeLineSpacing };
	    if (settings.nodeTextSize != undefined) { this.settings.nodeTextSize = settings.nodeTextSize };
	    if (settings.nodePadding != nodePadding) { this.settings.nodePadding = settings.nodePadding };
	    if (settings.nodeMargin != undefined) { this.settings.nodeMargin = settings.nodeMargin };
	    if (settings.nodeFont != undefined) { this.settings.nodeFont = settings.nodeFont };
	    if (settings.groupFont != undefined) { this.settings.groupFont = settings.groupFont };
	    if (settings.nodeStyle != undefined) { this.settings.nodeStyle = settings.nodeStyle };
	    if (settings.groupStyle != undefined) { this.settings.groupStyle = settings.groupStyle };
	    if (settings.nodeTextColour != undefined) { this.settings.nodeTextColour = settings.nodeTextColour };
	    if (settings.groupTextColour != undefined) { this.settings.groupTextColour = settings.groupTextColour };
	    if (settings.groupPadding != undefined) { this.settings.groupPadding = settings.groupPadding };
	    if (settings.chartPadding != undefined) { this.settings.chartPadding = settings.chartPadding };
	}

	if (chartData != undefined)
	{
		if (chartData.group != undefined)
		{
		    var dimensions = this.calculateGroupSize(chartData.group, this.settings);

		    this.drawGroup(this.settings.chartPadding + dimensions.width / 2, this.settings.chartPadding, svgElement, chartData.group, this.settings)
		}
	}
}

JOrganisationChart.prototype.calculateGroupSize = function (group, settings) {
    var dimensions = { width: 0, height: 0 };

    if (group != undefined) {

        dimensions.width = settings.groupPadding;
        dimensions.height = settings.groupPadding;

        if (group.nodes != undefined && group.nodes.length > 0) {

            dimensions.height = dimensions.height + settings.nodePadding;
            //Size of this row           
            var rowDimensions = this.calculateNodeMaxRowSize(group.nodes, settings)
            dimensions.width = rowDimensions.width;
            dimensions.width = dimensions.width + settings.nodePadding;

            dimensions.height = dimensions.height + rowDimensions.height;
            dimensions.height = dimensions.height + settings.nodePadding;
        }
    }

    return dimensions;
}

JOrganisationChart.prototype.calculateNodeRowSize = function (nodes, settings) {

    var dimensions = { width: 0, height: 0 };

    if ((nodes != undefined) && (nodes.length > 0)) {
        dimensions.height = settings.nodeMargin;
        dimensions.width = settings.nodeMargin;

        for (var i = 0; i < nodes.length; i++) {
            var nodeDimensions = this.calculateNodeSize(nodes[i], settings);

            dimensions.width = dimensions.width + nodeDimensions.width;

            if (nodeDimensions.height > dimensions.height) {
                dimensions.height = nodeDimensions.height;
            }

            dimensions.width = dimensions.width + settings.nodeMargin; 
        }

        dimensions.height = dimensions.height + settings.nodeMargin;
    }
    return dimensions;
}

JOrganisationChart.prototype.calculateNodeMaxRowSize = function (nodes, settings) {

    var dimensions = { width: 0, height: 0 };

    if((nodes != undefined)&&(nodes.length > 0))
    {
        var nodeRowSize = this.calculateNodeRowSize(nodes, settings);

        dimensions.width = nodeRowSize.width;
        dimensions.height = nodeRowSize.height;

        for (var i = 0; i < nodes.length; i++) {
            
            if (nodes[i].childNodes != undefined && nodes[i].childNodes.length > 0) {

                var childDimensions = JOrganisationChart.prototype.calculateNodeMaxRowSize(nodes[i].childNodes, settings)

                dimensions.width = dimensions.width + childDimensions.width;
                dimensions.height = dimensions.height + childDimensions.height;
            }
        }
    }
    return dimensions;
}

JOrganisationChart.prototype.calculateNodeSize = function (nodeData, settings) {
	var dimensions = { width: 0, height: 0 };

	if (nodeData != undefined)
	{
	    var carrageLoc = settings.nodePadding;
         
		//Measure Width (max line width + padding)
		if (nodeData.title != undefined && nodeData.title.length > 0)
		{
		    dimensions.width = this.calculateTextWidth(nodeData.title, settings.nodeTitleSize);
		    carrageLoc = carrageLoc + settings.nodeTitleSize + settings.nodeLineSpacing;
		}

		if (nodeData.text != undefined && nodeData.text.length > 0)
		{
			var lineWidth = 0;

			for (var i = 0; i < nodeData.text.length;i++)
			{
			    carrageLoc = carrageLoc + settings.nodeTextSize;
			    lineWidth = this.calculateTextWidth(nodeData.text[i], settings.nodeTextSize);
				if (dimensions.width < lineWidth)
				{
					dimensions.width = lineWidth;
				}

				if (i < (nodeData.text.length -1))
				{
				    carrageLoc = carrageLoc + settings.nodeLineSpacing;
				}
			}
		}
		carrageLoc = carrageLoc + settings.nodePadding;
		dimensions.width = dimensions.width + (settings.nodePadding * 2);
		dimensions.height = carrageLoc;
	}

	return dimensions;
};

JOrganisationChart.prototype.calculateTextWidth = function(text,fontSize)
{
    return text.length * (fontSize / 2);
}

JOrganisationChart.prototype.drawGroup = function (cx, cy, svgElement, group, settings) {
    if (group != undefined) {
        var grpDimensions = this.calculateGroupSize(group, settings)

        //Draw group box
        var groupBoxSVG = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        groupBoxSVG.setAttribute('x', cx - (grpDimensions.width / 2));
        groupBoxSVG.setAttribute('y', cy);
        groupBoxSVG.setAttribute('width', grpDimensions.width);
        groupBoxSVG.setAttribute('height', grpDimensions.height);
        groupBoxSVG.setAttribute("style", settings.groupStyle);

        svgElement.append(groupBoxSVG);

        var ncy = (cy + settings.groupPadding)

        if (group.nodes != undefined && group.nodes.length > 0) {

            //Draw Row
            this.drawNodeRow(cx,cy,svgElement,group.nodes,settings)
        }
    }
}

JOrganisationChart.prototype.drawNodeRow = function (cx, cy, svgElement, nodes, settings) {

    if (nodes != undefined && nodes.length > 0)
    {
        var nodeRowDimensions = this.calculateNodeRowSize(nodes, settings);

        var ncx = cx - (nodeRowDimensions.width / 2);
        var ncy = cy + settings.nodeMargin;

        //Draw Row
        for (var i = 0; i < nodes.length; i++) {
            var nodeDimensions = this.calculateNodeSize(nodes[i], settings);
            ncx = ncx + (nodeDimensions.width / 2) + settings.nodeMargin;
            this.drawNode(ncx, ncy, svgElement, nodes[i], settings);

            //Draw childern
            if (nodes[i].childNodes != undefined && nodes[i].childNodes.length > 0) {

                this.drawNodeRow(ncx, ncy + nodeRowDimensions.height, svgElement, nodes[i].childNodes, settings);
                var childRowDimensions = this.calculateNodeRowSize(nodes[i].childNodes, settings);
                ncx = ncx + (childRowDimensions.width / 2) + settings.nodeMargin;

            } else
            {
                ncx = ncx + (nodeDimensions.width / 2) + settings.nodeMargin;
            }
        }

        ncy = ncy + settings.nodeMargin;

    }
}

JOrganisationChart.prototype.drawNode = function (cx, cy, svgElement, nodeData, settings) {

    if (nodeData != undefined && svgElement != undefined)
	{
        var dimensions = this.calculateNodeSize(nodeData, settings);

        //Draw node box
		var nodeBoxSVG = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		nodeBoxSVG.setAttribute('x', cx - (dimensions.width / 2));
		nodeBoxSVG.setAttribute('y', cy);
		nodeBoxSVG.setAttribute('width', dimensions.width);
		nodeBoxSVG.setAttribute('height', dimensions.height);
		nodeBoxSVG.setAttribute("style", settings.nodeStyle);

		svgElement.append(nodeBoxSVG);

		var carrageLoc = cy + settings.nodePadding;

		if (nodeData.title != undefined && nodeData.title.length > 0) {

		    carrageLoc = carrageLoc + (settings.nodeTitleSize * 0.75);
		    //Render Title
		    var nodeTitleSVG = document.createElementNS("http://www.w3.org/2000/svg", "text");
		    nodeTitleSVG.setAttribute('text-anchor', 'middle');
		    nodeTitleSVG.setAttribute('alignment-baseline', 'central');
		    nodeTitleSVG.setAttribute('x', cx);
		    nodeTitleSVG.setAttribute('y', carrageLoc);
		    nodeTitleSVG.setAttribute("fill", settings.nodeTextColour);
		    nodeTitleSVG.setAttribute("style", "font-family:" + settings.nodeFont + "; font-size:" + settings.nodeTitleSize + "px;");
		    nodeTitleSVG.textContent = nodeData.title;

		    svgElement.append(nodeTitleSVG);

		    carrageLoc = carrageLoc + (settings.nodeTitleSize * 0.25);
		    carrageLoc = carrageLoc + settings.nodeLineSpacing;
		}

        //Render other text lines
        if (nodeData.text != undefined && nodeData.text.length > 0) {
            for (var i = 0; i < nodeData.text.length; i++) {

                carrageLoc = carrageLoc + (settings.nodeTextSize * 0.75);

                var nodeTextSVG = document.createElementNS("http://www.w3.org/2000/svg", "text");
                nodeTextSVG.setAttribute('text-anchor', 'middle');
                nodeTextSVG.setAttribute('alignment-baseline', 'central');
                nodeTextSVG.setAttribute('x', cx);
                nodeTextSVG.setAttribute('y', carrageLoc);
                nodeTextSVG.setAttribute("fill", settings.nodeTextColour);
                nodeTextSVG.setAttribute("style", "font-family:" + settings.nodeFont + "; font-size:" + settings.nodeTextSize + "px;");
                nodeTextSVG.textContent = nodeData.text[i];
                svgElement.append(nodeTextSVG);

                carrageLoc = carrageLoc + (settings.nodeTextSize * 0.25);

                if (i < (nodeData.text.length - 1)) {
                    carrageLoc = carrageLoc + settings.nodeLineSpacing;
                }
            }
        }
	}
};