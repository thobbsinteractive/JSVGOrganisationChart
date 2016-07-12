function JOrganisationChart(svgElement, chartData, settings)
{
    this.data = {
        groups: []
    }

    this.svgElement = svgElement;

    //Defaults
    this.settings = {
        chartAlign : "centre",
        nodeTitleStyle: "font-family:Arial;font-size:16px;cursor:default;fill:rgba(0,0,0,1)",
        nodeLineSpacing : 5,
        nodeTextStyle: "font-family:Arial;font-size:12px;cursor:default;fill:rgba(0,0,0,1)",
        nodePadding : 10, //Default to 10px
        nodeMargin : 10, //Default to 5px
        nodeStyle: "fill:rgba(255,255,255,1);stroke:rgba(181,217,234,1);stroke-width:1;",
        orphanNodeTitleStyle: "font-family:Arial;font-size:12px;cursor:default;fill:rgba(0,0,0,1)",
        orphanNodeStyle: "fill:rgba(237,247,255,1);stroke:rgba(181,217,234,1);stroke-width:1;",
        groupTitleStyle: "font-family:Arial;font-size:18px;cursor:default;fill:rgba(161,197,214,1)",
        groupPadding: 15, //Default to 20px
        groupMargin: 20,//Default to 20px
        groupStyle: "fill:rgba(237,247,255,1);stroke:rgba(181,217,234,1);stroke-width:2;",
        chartPadding: 10,
        chartBackgroundColour: "fill:rgba(255,255,255,1);stroke:rgba(220,220,220,1);stroke-width:0;",
        groupLineStyle: "stroke:rgba(52,136,221,1);stroke-width:2",
        nodeLineStyle: "stroke:rgba(52,136,221,1);stroke-width:1"
    }

	if (settings != undefined) {
	    if (settings.chartAlign != undefined) { this.settings.chartAlign = settings.chartAlign };
	    if (settings.nodeTitleStyle != undefined) { this.settings.nodeTitleStyle = settings.nodeTitleStyle };
	    if (settings.nodeLineSpacing != undefined) { this.settings.nodeLineSpacing = settings.nodeLineSpacing };
	    if (settings.nodeTextStyle != undefined) { this.settings.nodeTextStyle = settings.nodeTextStyle };
	    if (settings.nodePadding != undefined) { this.settings.nodePadding = settings.nodePadding };
	    if (settings.nodeMargin != undefined) { this.settings.nodeMargin = settings.nodeMargin };
	    if (settings.nodeFont != undefined) { this.settings.nodeFont = settings.nodeFont };
	    if (settings.groupTitleStyle != undefined) { this.settings.groupTitleStyle = settings.groupTitleStyle };
	    if (settings.nodeStyle != undefined) { this.settings.nodeStyle = settings.nodeStyle };
	    if (settings.groupStyle != undefined) { this.settings.groupStyle = settings.groupStyle };
	    if (settings.groupPadding != undefined) { this.settings.groupPadding = settings.groupPadding };
	    if (settings.groupMargin != undefined) { this.settings.groupMargin = settings.groupMargin };
	    if (settings.chartPadding != undefined) { this.settings.chartPadding = settings.chartPadding };
	    if (settings.nodeLineStyle != undefined) { this.settings.nodeLineStyle = settings.nodeLineStyle };
	    if (settings.groupLineStyle != undefined) { this.settings.groupLineStyle = settings.groupLineStyle };
	}

	if (svgElement != undefined)
	{
	    //Default built-in functions
        var chartMethods = ''+
                'function navigateTo(event, url) {\n' +
                '   if(event.target != undefined && url != undefined)\n' +
                '   {\n' +
                '       window.location.href = url;\n' +
                '   }\n' +
                '}\n' +
                'function openTo(event, url) {\n' +
                '   if(event.target != undefined && url != undefined)\n' +
                '   {\n' +
                '      window.open(url,"_blank");\n' +
                '   }\n' +
                '}\n' +
                'function setStyle(event, nodeStyle, titleStyle, textStyle) {\n' +
                '   if(event.target != undefined && nodeStyle != undefined) {\n' +
                '       if(event.target.nodeName == "text" && (event.target.getAttribute("data-type") == "title" || event.target.getAttribute("data-type") == "text")) {\n' +
                '           if (event.target.getAttribute("data-parentid") != undefined) {\n' +
                '               var parentid = event.target.getAttribute("data-parentid");\n' +
                '               var elements = document.getElementsByTagName("rect");\n' +
                '               var nodeElement = undefined;\n' +
                '               for (i = 0; i < elements.length; i++) {\n' +
                '                   if(elements[i].getAttribute("data-id") == parentid)\n' +
                '                   {\n' +
                '                       nodeElement = elements[i];\n' +
                '                       break;\n' +
                '                   }\n' +
                '               }\n' +
                '               if(nodeElement != undefined){\n' +
                '                   nodeElement.setAttribute("style",nodeStyle);\n' +
                '               }\n' +
                '           }\n' +
                '           if(event.target.getAttribute("data-type") == "title") {\n' +
                '               event.target.setAttribute("style",titleStyle);\n' +
                '           }\n' +
                '           if(event.target.getAttribute("data-type") == "text") {\n' +
                '               event.target.setAttribute("style", textStyle);\n' +
                '           }\n' +
                '       }\n' +
                '       else {\n' +
                '           event.target.setAttribute("style",nodeStyle);\n' +
                '       }\n' +
                '   }\n' +
                '}\n'


        var scriptElement = document.createElement("script");
        scriptElement.setAttribute("type","application/ecmascript")
        scriptElement.innerHTML = chartMethods;
        svgElement.appendChild(scriptElement);

        if (chartData != undefined) {
            this.data = chartData;
            this.drawChart(svgElement, chartData);
        }
	}
}

JOrganisationChart.prototype.getFontSizeFromStyle = function(style)
{
    var fontSize = 12;

    if (style != undefined) {
        var parts = style.split(';');

        if (parts != undefined && parts.length > 0) {
            for (var i = 0; i < parts.length; i++) {
                if (parts[i].indexOf('font-size:') > -1) {
                    fontSize = Number(parts[i].replace('font-size:', '').replace('px', ''));
                    break;
                }
            }
        }
    }
    return fontSize;

}

JOrganisationChart.prototype.getSVGXML = function(svgElement)
{
    var svg = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

    if (svgElement != undefined) {
        var outer = document.createElement('div');
        outer.appendChild(svgElement.cloneNode(true));

        svg = svg + outer.innerHTML;

        //Remove script element as this will NOT convert to XML
        var svgStart = svg.split("<script type=\"application/ecmascript\">")[0];
        var svgEnd = svg.split("</script>")[1];
        svg = svgStart + svgEnd;
    }
    return svg;
}

JOrganisationChart.prototype.getImageDownloadLink = function (svgElement, linkText) {

    var alink = document.createElement("a");
    alink.text = "For IE right click and select 'Save picture as'";

    var au = navigator.userAgent;

    if (svgElement != undefined && au.indexOf("Edge") < 0) {

        var canvasElement = document.createElement("canvas");

        this.drawToCanvas(svgElement, canvasElement, alink, linkText);
    }

    return alink;
}

JOrganisationChart.prototype.drawToCanvas = function (svgElement, canvasElement, linkElement, linkText) {

    var width = 100;
    var height = 100;

    if (svgElement != undefined && canvasElement != undefined) {
        width = parseInt(svgElement.getAttribute("width"));
        height = parseInt(svgElement.getAttribute("height"));

        canvasElement.width = width;
        canvasElement.height = height;
        context = canvasElement.getContext("2d");

        var imgsrc = 'data:image/svg+xml;base64,' + window.btoa(this.getSVGXML(svgElement));

        var image = new Image;
        image.src = imgsrc;
        image.onload = function () {
            context.drawImage(image, 0, 0);

            if (linkElement != undefined) {
                try {
                    var canvasdata = canvasElement.toDataURL("image/png");
                    linkElement.download = "OrganisationChart.png";
                    linkElement.href = canvasdata;
                    linkElement.text = linkText;

                } catch (exception) {

                }
            }

        };
    }

}

JOrganisationChart.prototype.findGroup = function(groupid)
{
    if (this.data.groups != undefined && this.data.groups.length > 0) {

        return this.find(groupid, this.data.groups);
    }
    return undefined;
}

JOrganisationChart.prototype.findNode = function (groupid,nodeid) {
    if (this.data.groups != undefined && this.data.groups.length > 0) {
        var group = this.find(groupid, this.data.groups);
        if(group != undefined && group.nodes != undefined)
        {
            return this.find(nodeid, group.nodes);
        }
    }
    return undefined;
}

JOrganisationChart.prototype.addGroup = function (parentid, groupid, groupName, groupStyle, groupOnclick, groupOnmouseover, groupOnmouseout) {
    var parentGroup = undefined;

    if (parentid != undefined) {
        if (this.data.groups != undefined && this.data.groups.length > 0) {
            var parentGroup = this.find(parentid, this.data.groups);
        }
    }

    if (parentGroup != undefined) {
        if (parentGroup.children == undefined) {
            parentGroup.children = [];
        }

        parentGroup.children.push({
            id: groupid,
            title: groupName,
            type: "Group",
            nodes: [],
            groupStyle: groupStyle,
            onclick: groupOnclick,
            onmouseover: groupOnmouseover,
            onmouseout: groupOnmouseout
        });
    } else {
        if (this.data.groups != undefined) {
            this.data.groups.push({
                id: groupid,
                title: groupName,
                type: "Group",
                nodes: [],
                groupStyle: groupStyle,
                onclick: groupOnclick,
                onmouseover: groupOnmouseover,
                onmouseout: groupOnmouseout
            });
        }
    }

    this.drawChart(this.svgElement, this.data);
}

JOrganisationChart.prototype.addOrphanNode = function (groupid, nodeid, nodeTitle, nodeText, nodeStyle, nodeOnclick, nodeOnmouseover, nodeOnmouseout) {
    var group = undefined;

    if (groupid != undefined) {
        if (this.data.groups != undefined && this.data.groups.length > 0) {
            var group = this.find(groupid, this.data.groups);
        }
    }

    if (group != undefined) {
        var parentNode = undefined;

        if (parentid != undefined) {
            if (group.nodes != undefined && group.nodes.length > 0) {
                parentNode = this.find(parentid, group.nodes);
            }

            if (parentNode != undefined) {
                if (parentNode.children == undefined) {
                    parentNode.children = [];
                }

                parentNode.children.push({
                    id: nodeid,
                    title: nodeTitle,
                    type: "OrphanNode",
                    text: nodeText,
                    children: nodeChildren,
                    onclick: nodeOnclick,
                    onmouseover: nodeOnmouseover,
                    onmouseout: nodeOnmouseout
                });
            }
        } else {
            if (group.nodes == undefined) {
                group.nodes = [];
            }

            group.nodes.push({
                id: nodeid,
                title: nodeTitle,
                type: "OrphanNode",
                text: nodeText,
                children: nodeChildren,
                onclick: nodeOnclick,
                onmouseover: nodeOnmouseover,
                onmouseout: nodeOnmouseout
            });
        }
    }

    this.drawChart(this.svgElement, this.data);
}

JOrganisationChart.prototype.addNode = function (groupid, parentid, nodeid, nodeTitle, nodeText, nodeStyle, nodeOnclick, nodeOnmouseover, nodeOnmouseout)
{
    var group = undefined;

    if (groupid != undefined)
    {
        if(this.data.groups != undefined && this.data.groups.length > 0)
        {
            var group = this.find(groupid, this.data.groups);
        }
    }

    if(group != undefined)
    {
        var parentNode = undefined;

        if (parentid != undefined) {
            if (group.nodes != undefined && group.nodes.length > 0) {
                parentNode = this.find(parentid, group.nodes);
            }

            if(parentNode != undefined)
            {
                if(parentNode.children == undefined)
                {
                    parentNode.children = [];
                }

                parentNode.children.push({
                    id: nodeid,
                    title: nodeTitle,
                    type: "Node",
                    text: nodeText,
                    children: [],
                    nodeStyle: nodeStyle,
                    onclick: nodeOnclick,
                    onmouseover: nodeOnmouseover,
                    onmouseout: nodeOnmouseout
                });
            }
        } else
        {
            if(group.nodes == undefined)
            {
                group.nodes = [];
            }

            group.nodes.push({
                id: nodeid,
                title: nodeTitle,
                type: "Node",
                text: nodeText,
                children: [],
                onclick: nodeOnclick,
                onmouseover: nodeOnmouseover,
                onmouseout: nodeOnmouseout
            });
        }
    }

    this.drawChart(this.svgElement, this.data);
}

JOrganisationChart.prototype.find = function (id, children)
{
    if (children != undefined && children.length > 0) {
        for (var i = 0; i < children.length; i++)
        {
            if (children[i] != undefined && children[i].id != undefined && children[i].id == id)
            {
                return children[i];
            }
        }

        //Check for Id in children
        for (var i = 0; i < children.length; i++) {
            if (children[i] != undefined && children[i].children != undefined && children[i].children.length > 0) {
                var found = this.find(id, children[i].children);
                if (found != undefined)
                {
                    return found;
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

            svgElement.setAttribute("width",(dimensions.width + (this.settings.chartPadding * 2)));
            svgElement.setAttribute("height",(dimensions.height + (this.settings.chartPadding * 2)));
            
            var bkBoxSVG = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            bkBoxSVG.setAttribute('x',0);
            bkBoxSVG.setAttribute('y',0);
            bkBoxSVG.setAttribute('width', dimensions.width + (this.settings.chartPadding * 2));
            bkBoxSVG.setAttribute('height', dimensions.height + (this.settings.chartPadding * 2));
            bkBoxSVG.setAttribute("style", this.settings.chartBackgroundColour);
            svgElement.appendChild(bkBoxSVG);

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
        if (item.type == "Node" || item.type == "OrphanNode") {
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

		    var nodeTitleStyle = "";

		    if (nodeData.type == "Node")
		    {
		        nodeTitleStyle = settings.nodeTitleStyle;

		        if (nodeData.nodeTitleStyle != undefined) {
		            nodeTitleStyle = nodeData.nodeTitleStyle;
		        }
		    }

		    if (nodeData.type == "OrphanNode") {
		        nodeTitleStyle = settings.orphanedNodeTitleStyle;

		        if (nodeData.orphanNodeNodeTitleStyle != undefined) {
		            nodeTitleStyle = nodeData.orphanNodeTitleStyle;
		        }
		    }

		    dimensions.width = this.calculateTextWidth(nodeData.title, this.getFontSizeFromStyle(nodeTitleStyle));
		    carrageLoc = carrageLoc + this.getFontSizeFromStyle(nodeTitleStyle) + settings.nodeLineSpacing;
		}

		if (nodeData.text != undefined && nodeData.text.length > 0)
		{
			var lineWidth = 0;

			for (var i = 0; i < nodeData.text.length;i++)
			{
			    var nodeTextStyle = settings.nodeTextStyle;
			    if (nodeData.nodeTextStyle != undefined) {
			        nodeTextStyle = nodeData.nodeTextStyle;
			    }

			    carrageLoc = carrageLoc + this.getFontSizeFromStyle(nodeTextStyle);
			    lineWidth = this.calculateTextWidth(nodeData.text[i], this.getFontSizeFromStyle(nodeTextStyle));
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

        if (group.orphannodes != undefined && group.orphannodes.length > 0) {

            var rowDimensions = this.calculateRowSize(group.orphannodes, settings, true);
            if (rowDimensions.width > dimensions.width)
            {
                dimensions.width = rowDimensions.width;
            }
            dimensions.height = dimensions.height + rowDimensions.height;
        }

        if (group.title != undefined && group.title.length > 0) {
            dimensions.height = dimensions.height + this.getFontSizeFromStyle(settings.groupTitleStyle);

            var titleWidth = this.calculateTextWidth(group.title, this.getFontSizeFromStyle(settings.groupTitleStyle));

            if (dimensions.width < (titleWidth + (settings.groupPadding * 2))) {
                dimensions.width = titleWidth + (settings.groupPadding * 2);
            }
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
    var width = 0;
    for (var i = 0;i < text.length;i++)
    {
        if(text[i] == text[i].toUpperCase())
        {
            width += fontSize * 0.75;
        }else
        {
            width += fontSize * 0.5;
        }
    }
    
    return width;
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
        groupBoxSVG.setAttribute("data-id", 'groupid=' + group.id);

        if (group.title != undefined) { groupBoxSVG.setAttribute("data-title", group.title); }
        if (group.onclick != undefined){ groupBoxSVG.setAttribute('onclick', group.onclick); }
        if (group.onactivate != undefined) { groupBoxSVG.setAttribute('onactivate', group.onactivate); }
        if (group.onmousedown != undefined) { groupBoxSVG.setAttribute('onmousedown ', group.onmousedown); }
        if (group.onmouseup != undefined) { groupBoxSVG.setAttribute('onmouseup', group.onmouseup); }
        if (group.onmouseover != undefined) { groupBoxSVG.setAttribute('onmouseover', group.onmouseover); }
        if (group.onmousemove != undefined) { groupBoxSVG.setAttribute('onmousemove', group.onmousemove); }
        if (group.onmouseout != undefined) { groupBoxSVG.setAttribute('onmouseout', group.onmouseout); }

        svgElement.appendChild(groupBoxSVG);

        var carrageLoc = cy + settings.groupPadding;

        if (group.title != undefined && group.title.length > 0) {

            carrageLoc = carrageLoc + (this.getFontSizeFromStyle(settings.groupTitleStyle) * 0.75);

            //Render Title
            var groupTitleSVG = document.createElementNS("http://www.w3.org/2000/svg", "text");

            groupTitleSVG.setAttribute('data-parentid', 'groupid=' + group.id);
            groupTitleSVG.setAttribute('data-type', 'title');

            if (group.onclick != undefined) { groupTitleSVG.setAttribute('onclick', group.onclick); }
            if (group.onactivate != undefined) { groupTitleSVG.setAttribute('onactivate', group.onactivate); }
            if (group.onmousedown != undefined) { groupTitleSVG.setAttribute('onmousedown ', group.onmousedown); }
            if (group.onmouseup != undefined) { groupTitleSVG.setAttribute('onmouseup', group.onmouseup); }
            if (group.onmouseover != undefined) { groupTitleSVG.setAttribute('onmouseover', group.onmouseover); }
            if (group.onmousemove != undefined) { groupTitleSVG.setAttribute('onmousemove', group.onmousemove); }
            if (group.onmouseout != undefined) { groupTitleSVG.setAttribute('onmouseout', group.onmouseout); }

            groupTitleSVG.setAttribute('text-anchor', 'middle');
            groupTitleSVG.setAttribute('alignment-baseline', 'central');
            groupTitleSVG.setAttribute('x', cx);
            groupTitleSVG.setAttribute('y', carrageLoc);
            groupTitleSVG.setAttribute("style", settings.groupTitleStyle);
            groupTitleSVG.textContent = group.title;

            svgElement.appendChild(groupTitleSVG);

            carrageLoc = carrageLoc + (this.getFontSizeFromStyle(settings.groupTitleStyle) * 0.25);
        }

        if (group.nodes != undefined && group.nodes.length > 0) {

            //Draw Row
            this.drawNodeRow(cx, carrageLoc, svgElement, group.id, group.nodes, settings, true);
            carrageLoc = carrageLoc + this.calculateRowSize(group.nodes, settings, true).height;
        }

        if (group.orphannodes != undefined && group.orphannodes.length > 0) {

            //Draw Row
            this.drawNodeRow(cx, carrageLoc, svgElement, group.id, group.orphannodes, settings, true)
        }
    }
}

JOrganisationChart.prototype.drawNodeRow = function (cx, cy, svgElement, groupid, nodes, settings, isFirstNode) {

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
            this.drawNode(ncx, ncy, svgElement, groupid, nodes[i], settings);
            if (!isFirstNode)
            {
                this.drawConnection(cx, cy - settings.nodeMargin, ncx, ncy, settings.nodeMargin, settings.nodeLineStyle, svgElement, settings)
            };
        
            //Draw childern (if any)
            if (nodes[i].children != undefined && nodes[i].children.length > 0) {
                this.drawNodeRow(ncx, cy + nodeRowDimensions.height, svgElement, groupid, nodes[i].children, settings);
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
        svgElement.appendChild(lineSVG);

        lineSVG = document.createElementNS("http://www.w3.org/2000/svg", "line");
        lineSVG.setAttribute('style', lineStyle);
        lineSVG.setAttribute('x1', cx1);
        lineSVG.setAttribute('y1', cy1 + margin);
        lineSVG.setAttribute('x2', cx2);
        lineSVG.setAttribute('y2', cy1 + margin);
        svgElement.appendChild(lineSVG);

        lineSVG = document.createElementNS("http://www.w3.org/2000/svg", "line");
        lineSVG.setAttribute('style', lineStyle);
        lineSVG.setAttribute('x1', cx2);
        lineSVG.setAttribute('y1', cy1 + margin);
        lineSVG.setAttribute('x2', cx2);
        lineSVG.setAttribute('y2', cy2);
        svgElement.appendChild(lineSVG);
    }
}

JOrganisationChart.prototype.drawNode = function (cx, cy, svgElement, groupid, nodeData, settings) {

    if (nodeData != undefined && svgElement != undefined)
	{
        var dimensions = this.calculateNodeSize(nodeData, settings);

        //Draw node box
        var nodeBoxSVG = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        nodeBoxSVG.setAttribute('data-id', 'groupid=' + groupid + ';nodeid=' + nodeData.id);
		nodeBoxSVG.setAttribute('x', cx - (dimensions.width / 2));
		nodeBoxSVG.setAttribute('y', cy);
		nodeBoxSVG.setAttribute('width', dimensions.width);
		nodeBoxSVG.setAttribute('height', dimensions.height);

		var nodeStyle = "";
		if (nodeData.type == "Node")
		{
		    nodeStyle = settings.nodeStyle;
		    if (nodeData.nodeStyle != undefined)
		    {
		        nodeStyle = nodeData.nodeStyle;
		    }
		}

		if (nodeData.type == "OrphanNode") {
		    nodeStyle = settings.orphanNodeStyle;
		    if (nodeData.orphanNodeStyle != undefined) 
{
		        nodeStyle = nodeData.orphanNodeStyle;
		    }
		}

		nodeBoxSVG.setAttribute("style", nodeStyle);

		if (nodeData.title != undefined) { nodeBoxSVG.setAttribute("data-title", nodeData.title); }
		if (nodeData.onclick != undefined) { nodeBoxSVG.setAttribute('onclick', nodeData.onclick); }
		if (nodeData.onactivate != undefined) { nodeBoxSVG.setAttribute('onactivate', nodeData.onactivate); }
		if (nodeData.onmousedown != undefined) { nodeBoxSVG.setAttribute('onmousedown ', nodeData.onmousedown); }
		if (nodeData.onmouseup != undefined) { nodeBoxSVG.setAttribute('onmouseup', nodeData.onmouseup); }
		if (nodeData.onmouseover != undefined) { nodeBoxSVG.setAttribute('onmouseover', nodeData.onmouseover); }
		if (nodeData.onmousemove != undefined) { nodeBoxSVG.setAttribute('onmousemove', nodeData.onmousemove); }
		if (nodeData.onmouseout != undefined) { nodeBoxSVG.setAttribute('onmouseout', nodeData.onmouseout); }

		svgElement.appendChild(nodeBoxSVG);

		var carrageLoc = cy + settings.nodePadding;

		if (nodeData.title != undefined && nodeData.title.length > 0) {

		    var nodeTitleStyle = "";

		    if (nodeData.type == "Node") {
		        nodeTitleStyle = settings.nodeTitleStyle;

		        if (nodeData.nodeTitleStyle != undefined) {
		            nodeTitleStyle = nodeData.nodeTitleStyle;
		        }
		    }

		    if (nodeData.type == "OrphanNode") {
		        nodeTitleStyle = settings.orphanNodeTitleStyle;

		        if (nodeData.orphanNodeTitleStyle != undefined) {
		            nodeTitleStyle = nodeData.orphanNodeTitleStyle;
		        }
		    }

		    carrageLoc = carrageLoc + (this.getFontSizeFromStyle(nodeTitleStyle) * 0.75);

		    //Render Title
		    var nodeTitleSVG = document.createElementNS("http://www.w3.org/2000/svg", "text");
		    nodeTitleSVG.setAttribute('data-parentid', 'groupid=' + groupid + ';nodeid=' + nodeData.id);
		    nodeTitleSVG.setAttribute('data-type', 'title');

		    if (nodeData.onclick != undefined) { nodeTitleSVG.setAttribute('onclick', nodeData.onclick); }
		    if (nodeData.onactivate != undefined) { nodeTitleSVG.setAttribute('onactivate', nodeData.onactivate); }
		    if (nodeData.onmousedown != undefined) { nodeTitleSVG.setAttribute('onmousedown ', nodeData.onmousedown); }
		    if (nodeData.onmouseup != undefined) { nodeTitleSVG.setAttribute('onmouseup', nodeData.onmouseup); }
		    if (nodeData.onmouseover != undefined) { nodeTitleSVG.setAttribute('onmouseover', nodeData.onmouseover); }
		    if (nodeData.onmousemove != undefined) { nodeTitleSVG.setAttribute('onmousemove', nodeData.onmousemove); }
		    if (nodeData.onmouseout != undefined) { nodeTitleSVG.setAttribute('onmouseout', nodeData.onmouseout); }

		    nodeTitleSVG.setAttribute('text-anchor', 'middle');
		    nodeTitleSVG.setAttribute('alignment-baseline', 'central');
		    nodeTitleSVG.setAttribute('x', cx);
		    nodeTitleSVG.setAttribute('y', carrageLoc);

		    nodeTitleSVG.setAttribute("style", nodeTitleStyle);
		    nodeTitleSVG.textContent = nodeData.title;

		    svgElement.appendChild(nodeTitleSVG);

		    carrageLoc = carrageLoc + (this.getFontSizeFromStyle(nodeTitleStyle) * 0.25);
		    carrageLoc = carrageLoc + settings.nodeLineSpacing;
		}

        //Render other text lines
        if (nodeData.text != undefined && nodeData.text.length > 0) {
            for (var i = 0; i < nodeData.text.length; i++) {

                var nodeTextStyle = settings.nodeTextStyle;
                if (nodeData.nodeTextStyle != undefined) {
                    nodeTextStyle = nodeData.nodeTextStyle;
                }

                carrageLoc = carrageLoc + (this.getFontSizeFromStyle(nodeTextStyle) * 0.75);

                var nodeTextSVG = document.createElementNS("http://www.w3.org/2000/svg", "text");

                nodeTextSVG.setAttribute('data-parentid', 'groupid=' + groupid + ';nodeid=' + nodeData.id);
                nodeTextSVG.setAttribute('data-type', 'text');

                if (nodeData.onclick != undefined) { nodeTextSVG.setAttribute('onclick', nodeData.onclick); }
                if (nodeData.onactivate != undefined) { nodeTextSVG.setAttribute('onactivate', nodeData.onactivate); }
                if (nodeData.onmousedown != undefined) { nodeTextSVG.setAttribute('onmousedown ', nodeData.onmousedown); }
                if (nodeData.onmouseup != undefined) { nodeTextSVG.setAttribute('onmouseup', nodeData.onmouseup); }
                if (nodeData.onmouseover != undefined) { nodeTextSVG.setAttribute('onmouseover', nodeData.onmouseover); }
                if (nodeData.onmousemove != undefined) { nodeTextSVG.setAttribute('onmousemove', nodeData.onmousemove); }
                if (nodeData.onmouseout != undefined) { nodeTextSVG.setAttribute('onmouseout', nodeData.onmouseout); }

                nodeTextSVG.setAttribute('text-anchor', 'middle');
                nodeTextSVG.setAttribute('alignment-baseline', 'central');
                nodeTextSVG.setAttribute('x', cx);
                nodeTextSVG.setAttribute('y', carrageLoc);

                nodeTextSVG.setAttribute("style", nodeTextStyle);
                nodeTextSVG.textContent = nodeData.text[i];
                svgElement.appendChild(nodeTextSVG);

                carrageLoc = carrageLoc + (this.getFontSizeFromStyle(nodeTextStyle) * 0.25);

                if (i < (nodeData.text.length - 1)) {
                    carrageLoc = carrageLoc + settings.nodeLineSpacing;
                }
            }
        }
	}
};