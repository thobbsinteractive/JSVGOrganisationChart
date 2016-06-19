function JOrganisationChart(svgElement, chartData, settings)
{
    this.data = {
        groups: []
    }

    this.svgElement = svgElement;

    //Defaults
    this.settings = {
        chartAlign : "centre",
        nodeTitleSize : 16, //Default to 16px
        nodeLineSpacing : 5,
        nodeTextSize : 12, //Default to 12px
        nodePadding : 10, //Default to 10px
        nodeMargin : 10, //Default to 5px
        nodeFont : "Arial",
        nodeTextColour : "rgba(0,0,0,1)",
        nodeStyle : "fill:rgba(255,255,255,1);stroke:rgba(181,217,234,1);stroke-width:1;",
        groupFont : "Arial",
        groupTextColour : "rgba(0,0,0,1)",
        groupPadding: 20, //Default to 20px
        groupMargin: 20,//Default to 20px
        groupStyle: "fill:rgba(237,247,255,1);stroke:rgba(181,217,234,1);stroke-width:2;",
        chartPadding: 10,
        chartBackgroundColour: "fill:rgba(255,255,255,1);stroke:rgba(220,220,220,1);stroke-width:0;",
        groupLineStyle: "stroke:rgba(52,136,221,1);stroke-width:2",
        nodeLineStyle: "stroke:rgba(52,136,221,1);stroke-width:1"
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

	if (svgElement != undefined)
	{
	    //Default built-in functions
        var chartMethods = ''+
        '<script type="text/JavaScript">' +
            '<![CDATA[' +
                'function navigateTo(event, url) {' +
                    'if(event.target != undefined && url != undefined)' +
                    '{' +
                        'window.location.href = url;' +
                    '}' +
               '}' +
               'function openTo(event, url) {' +
                    'if(event.target != undefined && url != undefined)' +
                    '{' +
                        'window.open(url,"_blank");' +
                    '}' +
               '}' +
               'function setStyle(event,newStyle) {' +
                    'if(event.target != undefined && newStyle != undefined)' +
                    '{' +
                        'event.target.setAttribute("style",newStyle);' +
                    '}' +
               '}' +
	        ']]>' +
        '</script>'

        svgElement.append(chartMethods);

        if (chartData != undefined) {
            this.data = chartData;
            this.drawChart(svgElement, chartData);
        }
	}
}

JOrganisationChart.prototype.addGroup = function(parentid, groupid, groupName, nodes, groupOnclick, groupOnmouseover, groupOnmouseout)
{
    var parentGroup = undefined;

    if(parentid != undefined)
    {
        if(this.data.groups != undefined && this.data.groups.length > 0)
        {
            var parentGroup = this.findGroup(parentid, this.data.groups);
        }
    }

    if (nodes == undefined) {
        nodes = [];
    }

    if(parentGroup != undefined)
    {
        if (parentGroup.children == undefined)
        {
            parentGroup.children = [];
        }

        parentGroup.children.push({
                id: groupid,
                name: groupName,
                type: "Group",
                nodes: nodes,
                onclick: groupOnclick,
                onmouseover: groupOnmouseover,
                onmouseout: groupOnmouseout
        });
    }else
    {
        if(this.data.groups != undefined)
        {
            this.data.groups.push({
                id: groupid,
                name: groupName,
                type: "Group",
                nodes: nodes,
                onclick: groupOnclick,
                onmouseover: groupOnmouseover,
                onmouseout: groupOnmouseout
            });
        }
    }

    this.drawChart(this.svgElement, this.data);
}

JOrganisationChart.prototype.findGroup = function (id, children)
{
    if (children != undefined && children.length > 0) {
        for (var i = 0; i < children.length; i++)
        {
            if (children[i] != undefined && children[i].id != undefined && children[i].id == id && children[i].type == "Group")
            {
                return children[i];
            }
        }

        //Check for Id in children
        for (var i = 0; i < children.length; i++) {
            if (children[i] != undefined && children[i].children != undefined && children[i].children.length > 0) {
                var foundGroup = this.findGroup(id, children[i].children);
                if(foundGroup != undefined)
                {
                    return foundGroup;
                }
            }
        }
    }
    return undefined;
}

JOrganisationChart.prototype.drawChart = function(svgElement, chartData){
    if (chartData != undefined) {

        if (chartData.groups != undefined) {
            var dimensions = this.calculateRowSize(chartData.groups, this.settings, true);

            $(svgElement).width(dimensions.width + (this.settings.chartPadding * 2));
            $(svgElement).height(dimensions.height + (this.settings.chartPadding * 2));
            
            var bkBoxSVG = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            bkBoxSVG.setAttribute('x',0);
            bkBoxSVG.setAttribute('y',0);
            bkBoxSVG.setAttribute('width', dimensions.width + (this.settings.chartPadding * 2));
            bkBoxSVG.setAttribute('height', dimensions.height + (this.settings.chartPadding * 2));
            bkBoxSVG.setAttribute("style", this.settings.chartBackgroundColour);
            svgElement.append(bkBoxSVG);

            this.drawGroupRow(this.settings.chartPadding + dimensions.width / 2, this.settings.chartPadding, svgElement, chartData.groups, this.settings, true)
        }
    }
}

JOrganisationChart.prototype.calculateTotalChildRowHeight = function (items, settings) {
    var maxHeight = 0;

    if ((items != undefined) && (items.length > 0)) {

        for (var i = 0; i < items.length; i++) {
            var thisHeight = this.calculateSize(items[i], settings, true).height;

            if (items[i].children != undefined && items[i].children.length > 0) {
                thisHeight = thisHeight + this.calculateTotalChildRowHeight(items[i].children, settings);
            } 
            
            if (thisHeight > maxHeight) {
                maxHeight = thisHeight;
            }
        }
    }

    return maxHeight;
}

JOrganisationChart.prototype.calculateTotalChildRowWidth = function (parentWidth, items, settings)
{
    var totalWidth = 0;

    if ((items != undefined) && (items.length > 0)) {

        for (var i = 0; i < items.length; i++) {
            var childRowWidth = 0;
            var thisWidth = this.calculateSize(items[i], settings, true).width;

            if (items[i].children != undefined && items[i].children.length > 0) {
                childRowWidth = this.calculateTotalChildRowWidth(thisWidth, items[i].children, settings);

                if (childRowWidth > thisWidth) {
                    totalWidth = totalWidth + childRowWidth;
                }else
                {
                    totalWidth = totalWidth + thisWidth;
                }

            }else
            {
                totalWidth = totalWidth + thisWidth;
            }
        }

        if (totalWidth < parentWidth) {
            totalWidth = parentWidth;
        }
    }

    return totalWidth;
}

JOrganisationChart.prototype.calculateRowSize = function (items, settings, includeChildren) {

    var dimensions = { width: 0, height: 0 };

    if ((items != undefined) && (items.length > 0))
    {   
        var totalWidth = 0;
        var rowHeight = 0;

        for (var i = 0; i < items.length; i++) {

            var size = this.calculateSize(items[i], settings, true);

            if (size.height > rowHeight)
            {
                rowHeight = size.height;
            }

            var width = size.width;
            var childWidth = 0;

            if (includeChildren != undefined && includeChildren == true) {
                if (items[i].children != undefined && items[i].children.length > 0) {
                    childWidth = childWidth + this.calculateTotalChildRowWidth(this.calculateSize(items[i], settings, true).width, items[i].children, settings);
                }
            }

            if(childWidth > width)
            {
                totalWidth = totalWidth + childWidth;
            }else
            {
                totalWidth = totalWidth + width;
            }
        }

        if (includeChildren != undefined && includeChildren == true)
        {
            dimensions.height = this.calculateTotalChildRowHeight(items, settings);
        } else
        {
            dimensions.height = rowHeight;
        }
        dimensions.width = totalWidth;
    }
    return dimensions;
}

JOrganisationChart.prototype.calculateSize = function (item, settings, includeMargins) {

    var dimensions = { width: 0, height: 0 };

    if ((item != undefined)&&(item.type != undefined)) {
        if (item.type == "Node") {
            dimensions = this.calculateNodeSize(item, settings, includeMargins);
        }

        if (item.type == "Group") {
            dimensions = this.calculateGroupSize(item, settings, includeMargins);
        }
    }
    return dimensions;
}
JOrganisationChart.prototype.calculateNodeSize = function (nodeData, settings, includeMargins) {
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

		if (includeMargins != undefined && includeMargins == true) {
		    dimensions.width = dimensions.width + (settings.nodeMargin * 2);
		    dimensions.height = dimensions.height + (settings.nodeMargin * 2);
		}
	}

	return dimensions;
};

JOrganisationChart.prototype.calculateGroupSize = function (group, settings, includeMargins) {
    var dimensions = { width: 0, height: 0 };

    if (group != undefined) {

        dimensions.width = settings.groupPadding * 2;
        dimensions.height = settings.groupPadding * 2;

        if (group.nodes != undefined && group.nodes.length > 0) {

            //Size of this row           
            var rowDimensions = this.calculateRowSize(group.nodes, settings, true);

            dimensions.width = dimensions.width + rowDimensions.width;
            dimensions.height = dimensions.height + rowDimensions.height;
        }

        if (includeMargins != undefined && includeMargins == true) {
            dimensions.width = dimensions.width + (settings.groupMargin * 2);
            dimensions.height = dimensions.height + (settings.groupMargin * 2);
        }
    }

    return dimensions;
}

JOrganisationChart.prototype.calculateTextWidth = function(text,fontSize)
{
    return text.length * (fontSize / 2);
}

JOrganisationChart.prototype.drawGroupRow = function (cx, cy, svgElement, groups, settings, isFirstNode) {

    if (groups != undefined && groups.length > 0) {
        var groupRowMaxDimensions = this.calculateRowSize(groups, settings, true);

        var ncx = cx - (groupRowMaxDimensions.width / 2);
        var ncy = cy + settings.groupMargin;

        for (var i = 0; i < groups.length; i++) {

            var groupDimensions = this.calculateGroupSize(groups[i], settings, true);
            var childRowDimensions = { width: 0, height: 0 };

            if (groups[i].children != undefined && groups[i].children.length > 0) {
                childRowDimensions = this.calculateRowSize(groups[i].children, settings, true);
            }

            if (childRowDimensions.width > groupDimensions.width) {
                ncx = ncx + (childRowDimensions.width / 2);
            } else {
                ncx = ncx + (groupDimensions.width / 2);
            }

            //Draw Row
            this.drawGroup(ncx, ncy, svgElement, groups[i], settings);
            if (!isFirstNode) {
                this.drawConnection(cx, cy - settings.groupMargin, ncx, ncy, settings.groupMargin, settings.groupLineStyle, svgElement, settings)
            };

            //Draw childern (if any)
            if (groups[i].children != undefined && groups[i].children.length > 0) {
                this.drawGroupRow(ncx, cy + groupDimensions.height, svgElement, groups[i].children, settings);
            }

            if (childRowDimensions.width > groupDimensions.width) {
                ncx = ncx + (childRowDimensions.width / 2);
            } else {
                ncx = ncx + (groupDimensions.width / 2);
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

        if (group.name != undefined) { groupBoxSVG.setAttribute("data-name", group.name); }
        if (group.onclick != undefined){ groupBoxSVG.setAttribute('onclick', group.onclick); }
        if (group.onactivate != undefined) { groupBoxSVG.setAttribute('onactivate', group.onactivate); }
        if (group.onmousedown != undefined) { groupBoxSVG.setAttribute('onmousedown ', group.onmousedown); }
        if (group.onmouseup != undefined) { groupBoxSVG.setAttribute('onmouseup', group.onmouseup); }
        if (group.onmouseover != undefined) { groupBoxSVG.setAttribute('onmouseover', group.onmouseover); }
        if (group.onmousemove != undefined) { groupBoxSVG.setAttribute('onmousemove', group.onmousemove); }
        if (group.onmouseout != undefined) { groupBoxSVG.setAttribute('onmouseout', group.onmouseout); }

        svgElement.append(groupBoxSVG);

        var gcy = (cy + settings.groupPadding)

        if (group.nodes != undefined && group.nodes.length > 0) {

            //Draw Row
            this.drawNodeRow(cx, gcy, svgElement, group.nodes, settings, true)
        }
    }
}

JOrganisationChart.prototype.drawNodeRow = function (cx, cy, svgElement, nodes, settings, isFirstNode) {

    if (nodes != undefined && nodes.length > 0)
    {
        var nodeRowMaxDimensions = this.calculateRowSize(nodes, settings, true);
        var nodeRowDimensions = this.calculateRowSize(nodes, settings);

        var ncx = cx - (nodeRowMaxDimensions.width / 2);
        var ncy = cy + settings.nodeMargin;

        for (var i = 0; i < nodes.length; i++) {

            var nodeDimensions = this.calculateSize(nodes[i], settings, true);
            var childRowDimensions = { width: 0, height: 0 };

            if (nodes[i].children != undefined && nodes[i].children.length > 0) {
                childRowDimensions = this.calculateRowSize(nodes[i].children, settings, true);
            }

            if (childRowDimensions.width > nodeDimensions.width) {
                ncx = ncx + (childRowDimensions.width / 2);
            } else {
                ncx = ncx + (nodeDimensions.width / 2);
            }

            //Draw Row
            this.drawNode(ncx, ncy, svgElement, nodes[i], settings);
            if (!isFirstNode)
            {
                this.drawConnection(cx, cy - settings.nodeMargin, ncx, ncy, settings.nodeMargin, settings.nodeLineStyle, svgElement, settings)
            };
        
            //Draw childern (if any)
            if (nodes[i].children != undefined && nodes[i].children.length > 0) {
                this.drawNodeRow(ncx, cy + nodeRowDimensions.height, svgElement, nodes[i].children, settings);
            }

            if (childRowDimensions.width > nodeDimensions.width) {
                ncx = ncx + (childRowDimensions.width / 2);
            } else {
                ncx = ncx + (nodeDimensions.width / 2);
            }
        }
    }
}

JOrganisationChart.prototype.drawConnection = function (cx1, cy1, cx2, cy2, margin, lineStyle, svgElement, settings)
{
    if(svgElement != undefined)
    {
        var lineSVG = document.createElementNS("http://www.w3.org/2000/svg", "line");
        lineSVG.setAttribute('style', lineStyle);
        lineSVG.setAttribute('x1', cx1);
        lineSVG.setAttribute('y1', cy1);
        lineSVG.setAttribute('x2', cx1);
        lineSVG.setAttribute('y2', cy1 + margin);
        svgElement.append(lineSVG);

        lineSVG = document.createElementNS("http://www.w3.org/2000/svg", "line");
        lineSVG.setAttribute('style', lineStyle);
        lineSVG.setAttribute('x1', cx1);
        lineSVG.setAttribute('y1', cy1 + margin);
        lineSVG.setAttribute('x2', cx2);
        lineSVG.setAttribute('y2', cy1 + margin);
        svgElement.append(lineSVG);

        lineSVG = document.createElementNS("http://www.w3.org/2000/svg", "line");
        lineSVG.setAttribute('style', lineStyle);
        lineSVG.setAttribute('x1', cx2);
        lineSVG.setAttribute('y1', cy1 + margin);
        lineSVG.setAttribute('x2', cx2);
        lineSVG.setAttribute('y2', cy2);
        svgElement.append(lineSVG);
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

		if (nodeData.name != undefined) { nodeBoxSVG.setAttribute("data-name", nodeData.name); }
		if (nodeData.onclick != undefined) { nodeBoxSVG.setAttribute('onclick', nodeData.onclick); }
		if (nodeData.onactivate != undefined) { nodeBoxSVG.setAttribute('onactivate', nodeData.onactivate); }
		if (nodeData.onmousedown != undefined) { nodeBoxSVG.setAttribute('onmousedown ', nodeData.onmousedown); }
		if (nodeData.onmouseup != undefined) { nodeBoxSVG.setAttribute('onmouseup', nodeData.onmouseup); }
		if (nodeData.onmouseover != undefined) { nodeBoxSVG.setAttribute('onmouseover', nodeData.onmouseover); }
		if (nodeData.onmousemove != undefined) { nodeBoxSVG.setAttribute('onmousemove', nodeData.onmousemove); }
		if (nodeData.onmouseout != undefined) { nodeBoxSVG.setAttribute('onmouseout', nodeData.onmouseout); }

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