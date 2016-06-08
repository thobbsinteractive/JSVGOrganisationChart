function JOrganisationChart(svgElement, chartData, settings)
{
    this.svgElement = svgElement;

    //Defaults
    this.settings = {
        chartAlign : "centre",
        nodeTitleSize : 16, //Default to 16px
        nodeLineSpacing : 0,
        nodeTextSize : 12, //Default to 12px
        nodePadding : 10, //Default to 10px
        nodeMargin : 5, //Default to 5px
        nodeFont : "Arial",
        nodeTextColour : "rgba(0,0,0,1)",
        nodeStyle : "fill:rgba(255,255,255,0.8);stroke:rgba(50,50,50,1);stroke-width:1;",
        groupFont : "Arial",
        groupTextColour : "rgba(0,0,0,1)",
        groupPadding: 10, //Default to 20px
        groupMargin: 0,//Default to 20px
        groupStyle : "fill:rgba(200,200,255,0.8);stroke:rgba(0,0,50,1);stroke-width:2;",
        chartPadding: 10,
        chartBackgroundColour: "fill:rgba(220,220,220,1);stroke:rgba(220,220,220,1);stroke-width:0;"
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
	    if (settings.groupMargin != undefined) { this.settings.groupMargin = settings.groupMargin };
	    if (settings.chartPadding != undefined) { this.settings.chartPadding = settings.chartPadding };
	}

	if (chartData != undefined && svgElement != undefined)
	{
	    this.drawChart(svgElement, chartData);
	}
}

JOrganisationChart.prototype.drawChart = function(svgElement, chartData){
    if (chartData != undefined) {

        if (chartData.groups != undefined) {
            var dimensions = this.calculateGroupMaxSize(chartData.groups, this.settings);

            $(svgElement).width(dimensions.width + (this.settings.chartPadding * 2));
            $(svgElement).height(dimensions.height + (this.settings.chartPadding * 2));
            
            var bkBoxSVG = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            bkBoxSVG.setAttribute('x',0);
            bkBoxSVG.setAttribute('y',0);
            bkBoxSVG.setAttribute('width', dimensions.width + (this.settings.chartPadding * 2));
            bkBoxSVG.setAttribute('height', dimensions.height + (this.settings.chartPadding * 2));
            bkBoxSVG.setAttribute("style", this.settings.chartBackgroundColour);
            svgElement.append(bkBoxSVG);

            this.drawGroupRow(this.settings.chartPadding + dimensions.width / 2, this.settings.chartPadding, svgElement, chartData.groups, this.settings)
        }
    }
}

JOrganisationChart.prototype.calculateTotalGroupHeight = function (groups, settings) {
    var maxGroupHeight = 0;

    if ((groups != undefined) && (groups.length > 0)) {

        for (var i = 0; i < groups.length; i++) {
            var thisGroupHeight = this.calculateGroupSize(groups[i], settings).height + (settings.groupMargin * 2);

            if (groups[i].childGroups != undefined && groups[i].childGroups.length > 0) {
                thisGroupHeight = thisGroupHeight + this.calculateTotalGroupHeight(groups[i].childGroups, settings);
            }

            if (thisGroupHeight > maxGroupHeight) {
                maxGroupHeight = thisGroupHeight;
            }
        }
    }

    return maxGroupHeight;
}

JOrganisationChart.prototype.calculateTotalGroupWidth = function (parentGroupWidth, groups, settings) {
    var totalGroupWidth = 0;

    if ((groups != undefined) && (groups.length > 0)) {

        for (var i = 0; i < groups.length; i++) {

            var childGroupWidth = 0;
            var thisGroupWidth = this.calculateGroupSize(groups[i], settings).width;

            if (groups[i].childGroups != undefined && groups[i].childGroups.length > 0) {
                childGroupWidth = this.calculateTotalGroupWidth(thisGroupWidth, groups[i].childGroups, settings);

                if (childGroupWidth > thisGroupWidth) {
                    totalGroupWidth = totalGroupWidth + childGroupWidth + (settings.groupMargin * 2);
                } else {
                    totalGroupWidth = totalGroupWidth + thisGroupWidth + (settings.groupMargin * 2);
                }

            } else {
                totalGroupWidth = totalGroupWidth + thisGroupWidth + (settings.groupMargin * 2);
            }
        }

        if (totalGroupWidth < parentGroupWidth) {
            totalGroupWidth = parentGroupWidth;
        }
    }

    return totalGroupWidth;
}

JOrganisationChart.prototype.calculateGroupMaxSize = function (groups, settings) {

    var dimensions = { width: 0, height: 0 };

    if ((groups != undefined) && (groups.length > 0)) {
        var totalWidth = 0;
        var totalHeight = 0;

        for (var i = 0; i < groups.length; i++) {

            var groupSize = this.calculateGroupSize(groups[i], settings);
            var groupWidth = groupSize.width + (settings.groupMargin * 2);
            var childWidth = 0;

            if (groups[i].childGroups != undefined && groups[i].childGroups.length > 0) {
                childWidth = childWidth + this.calculateTotalGroupWidth(this.calculateGroupSize(groups[i], settings).width, groups[i].childGroups, settings);
            }

            if (childWidth > groupWidth) {
                totalWidth = totalWidth + childWidth;
            } else {
                totalWidth = totalWidth + groupWidth;
            }
        }

        dimensions.height = this.calculateTotalGroupHeight(groups, settings) + (settings.groupMargin * 2);
        dimensions.width = totalWidth + (settings.groupMargin * 2);
    }
    return dimensions;
}

JOrganisationChart.prototype.calculateGroupSize = function (group, settings) {
    var dimensions = { width: 0, height: 0 };

    if (group != undefined) {

        dimensions.width = settings.groupPadding * 2;
        dimensions.height = settings.groupPadding * 2;

        if (group.nodes != undefined && group.nodes.length > 0) {

            //Size of this row           
            var rowDimensions = this.calculateNodeRowMaxSize(group.nodes, settings)

            dimensions.width = dimensions.width + rowDimensions.width;
            dimensions.height = dimensions.height + rowDimensions.height;
        }
    }

    return dimensions;
}

JOrganisationChart.prototype.calculateNodeRowSize = function (nodes, settings) {

    var dimensions = { width: 0, height: 0 };

    if (nodes != undefined && nodes.length > 0) {
       
        for (var i = 0; i < nodes.length; i++) {

            var nodeDimensions = this.calculateNodeSize(nodes[i], settings);
            dimensions.width = dimensions.width + nodeDimensions.width + (settings.nodeMargin * 2);

            if (nodeDimensions.height > dimensions.height)
            {
                dimensions.height = nodeDimensions.height;
            }
        }
        dimensions.height = dimensions.height + (settings.nodeMargin * 2);
    }

    return dimensions;
}

JOrganisationChart.prototype.calculateTotalChildRowHeight = function (nodes, settings) {
    var maxNodeHeight = 0;

    if ((nodes != undefined) && (nodes.length > 0)) {

        for (var i = 0; i < nodes.length; i++) {
            var thisNodeHeight = this.calculateNodeSize(nodes[i], settings).height + (settings.nodeMargin * 2);

            if (nodes[i].childNodes != undefined && nodes[i].childNodes.length > 0) {
                thisNodeHeight = thisNodeHeight + this.calculateTotalChildRowHeight(nodes[i].childNodes, settings);
            } 
            
            if (thisNodeHeight > maxNodeHeight) {
                maxNodeHeight = thisNodeHeight;
            }
        }
    }

    return maxNodeHeight;
}

JOrganisationChart.prototype.calculateTotalChildRowWidth = function (parentNodeWidth, nodes, settings)
{
    var totalNodeWidth = 0;

    if ((nodes != undefined) && (nodes.length > 0)) {

        for (var i = 0; i < nodes.length; i++) {
            var childRowWidth = 0;
            var thisNodeWidth = this.calculateNodeSize(nodes[i], settings).width;

            if (nodes[i].childNodes != undefined && nodes[i].childNodes.length > 0) {
                childRowWidth = this.calculateTotalChildRowWidth(thisNodeWidth, nodes[i].childNodes, settings);

                if (childRowWidth > thisNodeWidth) {
                    totalNodeWidth = totalNodeWidth + childRowWidth + (settings.nodeMargin * 2);
                }else
                {
                    totalNodeWidth = totalNodeWidth + thisNodeWidth + (settings.nodeMargin * 2);
                }

            }else
            {
                totalNodeWidth = totalNodeWidth + thisNodeWidth + (settings.nodeMargin * 2);
            }
        }

        if (totalNodeWidth < parentNodeWidth) {
            totalNodeWidth = parentNodeWidth;
        }
    }

    return totalNodeWidth;
}

JOrganisationChart.prototype.calculateNodeRowMaxSize = function (nodes, settings) {

    var dimensions = { width: 0, height: 0 };

    if((nodes != undefined)&&(nodes.length > 0))
    {   
        var totalWidth = 0;
        var totalHeight = 0;

        for (var i = 0; i < nodes.length; i++) {

            var nodeSize = this.calculateNodeSize(nodes[i], settings);
            var nodeWidth = nodeSize.width + (settings.nodeMargin * 2);
            var childWidth = 0;

            if (nodes[i].childNodes != undefined && nodes[i].childNodes.length > 0) {
                childWidth = childWidth + this.calculateTotalChildRowWidth(this.calculateNodeSize(nodes[i], settings).width, nodes[i].childNodes, settings);
            }

            if(childWidth > nodeWidth)
            {
                totalWidth = totalWidth + childWidth;
            }else
            {
                totalWidth = totalWidth + nodeWidth;
            }
        }

        dimensions.height = this.calculateTotalChildRowHeight(nodes,settings);
        dimensions.width = totalWidth;
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

JOrganisationChart.prototype.drawGroupRow = function (cx, cy, svgElement, groups, settings) {

    if (groups != undefined && groups.length > 0) {
        var groupRowMaxDimensions = this.calculateGroupMaxSize(groups, settings);
        var groupRowDimensions = this.calculateGroupSize(groups, settings);

        var ncx = cx - (groupRowMaxDimensions.width / 2);
        var ncy = cy + settings.groupMargin;

        for (var i = 0; i < groups.length; i++) {

            var groupDimensions = this.calculateGroupSize(groups[i], settings);
            var childRowDimensions = { width: 0, height: 0 };

            if (groups[i].childGroups != undefined && groups[i].childGroups.length > 0) {
                childRowDimensions = this.calculateNodeRowMaxSize(groups[i].childGroups, settings);
            }

            if (childRowDimensions.width > groupDimensions.width) {
                ncx = ncx + (childRowDimensions.width / 2);
            } else {
                ncx = ncx + (groupDimensions.width / 2) + settings.groupMargin;
            }

            //Draw Row
            this.drawGroup(ncx, ncy, svgElement, groups[i], settings);

            //Draw childern (if any)
            if (groups[i].childGroups != undefined && groups[i].childGroups.length > 0) {
                this.drawGroupRow(ncx, ncy + groupDimensions.height, svgElement, groups[i].childGroups, settings);
            }

            if (childRowDimensions.width > groupDimensions.width) {
                ncx = ncx + (childRowDimensions.width / 2);
            } else {
                ncx = ncx + (groupDimensions.width / 2) + settings.groupMargin;
            }
        }
    }
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

        var gcy = (cy + settings.groupPadding)

        if (group.nodes != undefined && group.nodes.length > 0) {

            //Draw Row
            this.drawNodeRow(cx, gcy, svgElement, group.nodes, settings)
        }
    }
}

JOrganisationChart.prototype.drawNodeRow = function (cx, cy, svgElement, nodes, settings) {

    if (nodes != undefined && nodes.length > 0)
    {
        var nodeRowMaxDimensions = this.calculateNodeRowMaxSize(nodes, settings);
        var nodeRowDimensions = this.calculateNodeRowSize(nodes, settings);

        var ncx = cx - (nodeRowMaxDimensions.width / 2);
        var ncy = cy + settings.nodeMargin;

        for (var i = 0; i < nodes.length; i++) {

            var nodeDimensions = this.calculateNodeSize(nodes[i], settings);
            var childRowDimensions = { width: 0, height: 0 };

            if (nodes[i].childNodes != undefined && nodes[i].childNodes.length > 0) {
                childRowDimensions = this.calculateNodeRowMaxSize(nodes[i].childNodes, settings);
            }

            if (childRowDimensions.width > nodeDimensions.width) {
                ncx = ncx + (childRowDimensions.width / 2);
            } else {
                ncx = ncx + (nodeDimensions.width / 2) + settings.nodeMargin;
            }

            //Draw Row
            this.drawNode(ncx, ncy, svgElement, nodes[i], settings);

            //Draw childern (if any)
            if (nodes[i].childNodes != undefined && nodes[i].childNodes.length > 0) {
                this.drawNodeRow(ncx, cy + nodeRowDimensions.height, svgElement, nodes[i].childNodes, settings);
            }

            if (childRowDimensions.width > nodeDimensions.width) {
                ncx = ncx + (childRowDimensions.width / 2) + settings.nodeMargin;
            } else {
                ncx = ncx + (nodeDimensions.width / 2) + settings.nodeMargin;
            }
        }
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
		if (nodeData.nodeStyle != undefined)
		{
		    nodeBoxSVG.setAttribute("style", nodeData.nodeStyle);
		} else
		{
		    nodeBoxSVG.setAttribute("style", settings.nodeStyle);
		}

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