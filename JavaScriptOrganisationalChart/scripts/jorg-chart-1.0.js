function JOrganisationChart(svgElement, chartData, x, y)
{
	//this.ctx = canvasElement.getContext("2d");
	this.x = x;
	this.y = y;

	this.chartAlign = "centre";

	this.nodeTitleSize = 30; //Default to 20px
	this.nodeLineSpacing = 10;
	this.nodeTextSize = 20; //Default to 20px
	this.nodePadding = 10; //Default to 10px
	this.nodeMargin = 10; //Default to 10px
	this.nodeFont = "Arial";

	if (chartData != undefined)
	{
		if (chartData.group != undefined)
		{
			if (chartData.group.nodes != undefined && chartData.group.nodes.length > 0) {
				for(var i = 0; i < chartData.group.nodes.length; i++)
				{
					this.drawNode(500,100,this.ctx, chartData.group.nodes[i]);
				}
			}
		}
	}
}

JOrganisationChart.prototype.calculateNodeSize = function (ctx, nodeData) {
	var dimensions = { width: 0, height: 0 };

	if (nodeData != undefined)
	{
		var carrageLoc = this.nodePadding;

		//Measure Width (max line width + padding)
		if (nodeData.title != undefined && nodeData.title.length > 0)
		{
			ctx.font = this.nodeTitleSize + 'px ' + this.nodeFont;
			dimensions.width = ctx.measureText(nodeData.title).width + (this.nodePadding * 2);
			carrageLoc = carrageLoc + this.nodeTitleSize;
		}

		carrageLoc = carrageLoc + this.nodeLineSpacing;

		if (nodeData.text != undefined && nodeData.text.length > 0)
		{
			ctx.font = this.nodeTextSize + 'px ' + this.nodeFont;

			var lineWidth = 0;

			for (var i = 0; i < nodeData.text.length;i++)
			{
				carrageLoc = carrageLoc + this.nodeTextSize;
				lineWidth = ctx.measureText(nodeData.text[i]).width + (this.nodePadding * 2);
				if (dimensions.width < lineWidth)
				{
					dimensions.width = lineWidth;
				}
				carrageLoc = carrageLoc + this.nodeLineSpacing;
			}
			carrageLoc = carrageLoc + this.nodePadding;
		}

		dimensions.height = carrageLoc;
	}

	return dimensions;
};

JOrganisationChart.prototype.drawNode = function (cx, cy, ctx, nodeData) {

	if (nodeData != undefined)
	{
		var dimensions = this.calculateNodeSize(this.ctx, nodeData);


	}
};
