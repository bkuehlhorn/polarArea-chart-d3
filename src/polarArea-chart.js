/**
 * Created by Bernard Kuehlhorn on 6/11/16.
 */
function PolarAreaChart(id, axes, data, options) {
/* Draw a Polar Area chart from input. Simple input:
* array of dimension, value
* legend name of each value
* value can be simple number or array of numbers
* legend can be simple string or array of strings
* data: [ [ legend, color, value ], ... ] value between .00 and 1.00
* radius = min(width, height) * .90 / 2
* outerradus = radius * value
* angle = 2 * Math.PI / len(data)*/
// function RadarChart(id, data, options) {

	var cfg = {
	 w: 600,				//Width of the circle
	 h: 600,				//Height of the circle
	 margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
	 levels: 3,				//How many levels or inner circles should there be drawn
	 maxValue: 0, 			//What is the value that the biggest circle will represent
	 labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.35, 	//The opacity of the area of the blob
	 dotRadius: 4, 			//The size of the colored circles of each blog
	 opacityCircles: 0.1, 	//The opacity of the circles of each blob
     opacityArcs: 0.4,
	 strokeWidth: 2, 		//The width of the stroke around each blob
	 roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
	 color: d3.scale.category10()	//Color function
	};

	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }//for i
	}//if

    var radius = Math.min(cfg.w, cfg.h) / 2,
		Format = d3.format('d'),			 	//Percentage formatting
        innerRadius = 0.0,
        delta_angle = 2 * Math.PI / headers.length,
        start_angle = 0,
        end_angle = delta_angle,
        arcInit = d3.svg.arc().innerRadius(0);

	var maxValue = Math.max(cfg.maxValue, d3.max(data.values, function(i){return i}));

	// var allAxis = (data.map(function(i, j){return i.name})),	//Names of each axis
	var allAxis = axes,
		total = allAxis.length,					//The number of different axes
		radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
		Format = d3.format('d'),			 	//Percentage formatting
		angleSlice = Math.PI * 2 / total,		//The width in radians of each "slice"
		angleOffset = angleSlice / 2;

    	//Scale for the radius
	var rScale = d3.scale.linear()
		.range([0, radius])
		.domain([0, maxValue]);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.width; });

    // var tip = d3.tip()
    //   .attr('class', 'd3-tip')
    //   .offset([0, 0])
    //   .html(function(d) {
    //     return d.data.label + ": <span style='color:orangered'>" + d.data.score + "</span>";
    //   });

    var outlineArc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(radius);

	d3.select(id).select("svg").remove();

    var svg = d3.select(id).append("svg")
        .attr("width",  Number(cfg.w) + cfg.margin.left + cfg.margin.right)
        .attr("height", Number(cfg.h) + cfg.margin.top + cfg.margin.bottom)
        .append("g")
			.attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")")
			.attr("class", "axisWrapper");

    var svgArc = d3.svg.arc().outerRadius(radius);
	var axisGrid = svg.append("g");
	/////////////////////////////////////////////////////////
	////////// Glow filter for some extra pizzazz ///////////
	/////////////////////////////////////////////////////////

	//Filter for the outside glow
	// var filter = g.append('defs').append('filter').attr('id','glow'),
	// 	feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
	// 	feMerge = filter.append('feMerge'),
	// 	feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
	// 	feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

	/////////////////////////////////////////////////////////
	/////////////// Draw the Circular grid //////////////////
	/////////////////////////////////////////////////////////

	//Wrapper for the grid & axes
	// var axisGrid = g.append("g").attr("class", "axisWrapper");

    // svg.call(tip);

    // var path = svg.selectAll(".solidArc")
    //     .data(pie(data))
    //     .enter().append("path")
    //     .attr("fill", function(d) { return d.data.color; })
    //     .attr("class", "solidArc")
    //     .attr("stroke", "gray")
    //     .attr("d", arc)
    //     .on('mouseover', tip.show)
    //     .on('mouseout', tip.hide);

	pieSlice_color = data.color;
    data.values.forEach(function(pieSlice) {
        datum = { startAngle: start_angle,
            endAngle: end_angle,
            innerRadius: 0,
            outerRadius: radius * pieSlice / 10};

		var arc = svg.append("g");

        var slice = arc.append("path")
            .datum(datum)
    		.style("fill-opacity", cfg.opacityArcs)
            .style("fill", pieSlice_color)
            .attr("d", arcInit)
		    .attr("class", "slice");

        start_angle += delta_angle;
        end_angle += delta_angle
    });

	//Draw the background circles
	axisGrid.selectAll(".levels")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", function(d, i){return radius/cfg.levels*d;})
		.style("fill", "#CDCDCD")
		.style("stroke", "#CDCDCD")
		.style("fill-opacity", cfg.opacityCircles)
		.style("filter" , "url(#glow)");

	//Text indicating at what % each level is
	axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter().append("text")
	   .attr("class", "axisLabel")
	   .attr("x", 14)
	   .attr("y", function(d){ return -d*radius/cfg.levels;})
	   .attr("dy", "0.4em")
	   .style("font-size", "10px")
	   .attr("fill", "#737373")
	   .text(function(d,i) { return Format(maxValue * d/cfg.levels); });

	//Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		  .append("g")
		  .attr("class", "axis");
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px");

	//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2 + angleOffset); })
		.attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2 + angleOffset); })
		.text(function(d){return d})
		.call(wrap, cfg.wrapWidth);

    // svg.append("svg:text")
    //     .attr("class", "aster-score")
    //     .attr("dy", ".35em")
    //     .attr("text-anchor", "middle") // text-align: right
    //     .text(Math.round(score));

	/////////////////////////////////////////////////////////
	/////////////////// Helper Function /////////////////////
	/////////////////////////////////////////////////////////

	//Taken from http://bl.ocks.org/mbostock/7555321
	//Wraps SVG text
	function wrap(text, width) {
	  text.each(function() {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.4, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

		var pop_words = words;
		while (word = pop_words.pop()) {
		  line.push(word);
		  tspan.text(line.join(" "));
		  if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		  }
		}
	  });
	}//wrap
}

function OrigData() {
    list = [
        'FIS	1.1	59	0.5	#9E0041	Fisheries',
        'MAR	1.3	24	0.5	#C32F4B	Mariculture',
        'AO	2	98	1	#E1514B	Artisanal Fishing Opportunities',
        'NP	3	60	1	#F47245	Natural Products',
        'CS	4	74	1	#FB9F59	Carbon Storage',
        'CP	5	70	1	#FEC574	Coastal Protection',
        'TR	6	42	1	#FAE38C	Tourism & Recreation',
        'LIV	7.1	77	0.5	#EAF195	Livelihoods',
        'ECO	7.3	88	0.5	#C7E89E	Economies',
        'ICO	8.1	60	0.5	#9CD6A4	Iconic Species',
        'LSP	8.3	65	0.5	#6CC4A4	Lasting Special Places',
        'CW	9	71	1	#4D9DB4	Clean Waters',
        'HAB	10.1	88	0.5	#4776B4	Habitats',
        'SPP	10.3	83	0.5	#5E4EA1	Species'
        ];
    ret = [];
    d = $.each(list, function (index, value) {
        fields = value.split('\t');
        ret.push({
                id: fields[0],
                order: fields[1],
                score: fields[3],
                weight: fields[4],
                color: fields[5],
                label: fields[6]
            }
        );
    });
    return d
}

function PolarData() {
return [
        {name: "one", color: 'red', value: 3},
        {name: "two", color: 'orange', value: 3},
        {name: "three", color: 'yellow', value: 3},
        {name: "four", color: 'green', value: 4},
        {name: "five", color: 'blue', value: 5},
        {name: "six", color: 'violet', value: 6},
        {name: "seven", color: 'black', value: 7}
       ]
}
