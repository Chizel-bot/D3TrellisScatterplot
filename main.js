
// **** Your JavaScript code goes here ****

//Set Up
var svg = d3.select('svg');

var width = +svg.attr('width');
var height = svg.attr('height');

var padding = {t:20, r:20, b:60, l:60, axis:40};

trellisWidth = width / 2 - padding.l - padding.r;
trellisHeight = height / 2 - padding.t - padding.b;


// Data
d3.csv('./data/real_estate.csv', function(error, dataset) {
    if(error) {
        console.error('Error while loading ./real_estate.csv dataset.');
        console.error(error);
        return; // Early return out of the callback function
    }

var realEstate = d3.nest()
    .key(function(d){return d.location;})
    .entries(dataset);

var trellisG = svg.selectAll(".trellis")
    .data(realEstate)
    .enter()
    .append("g")
    .attr("class", "trellis")
    .attr("transform", function(d, i) {
        var tx = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
        var ty = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
        return 'translate('+[tx, ty]+')';}
    );


// Scales
var year = d3.extent(dataset, function(d) { return d['year_built'];});

var xScale = d3.scaleLinear()
    .domain(year)
    .range([0, trellisWidth]);

var priceMax = d3.max(dataset, function(d){return parseInt(d['price_per_sqft']);})

var yScale = d3.scaleLinear()
    .domain([0, priceMax])
    .range([trellisHeight, 0]);

// Axis
var xAxis = d3.axisBottom(xScale)
    .ticks(7)
    .tickFormat(function(d){return d;});

var yAxis = d3.axisLeft(yScale)
    .ticks(9)
    .tickFormat(function(d){return d;});

trellisG.append('g')
    .attr('class', 'x_axis')
    .attr('transform', 'translate(0,'+trellisHeight+')')
    .call(xAxis);

trellisG.append('g')
    .attr('class', 'y_axis')
    .attr('transform', 'translate(0,0)')
    .call(yAxis);

trellisG.selectAll('.trellis')
    .data(function(d){return d.values;})
    .enter()
    .append('circle')
    .attr('r', 3)
    .attr("cx", function(d) {return xScale(d['year_built']);})
    .attr('cy', function(d) {return yScale(d['price_per_sqft'])})
    .attr('fill', function(d){
        if(d.beds > 2) {
            return '#2e5d90';
        } else {
            return '#499936';
        }
    });

// Axis Titles
trellisG.append('text')
       .attr("x", (trellisWidth/2 - padding.axis))
       .attr("y", trellisHeight + padding.axis)
       .text("Year Built");

trellisG.append("text")
        .attr("y", .5*padding.t)
        .attr("transform", "translate(-50,"+ (.80*trellisHeight)+ "), rotate(-90)")
        .attr("class", "axis_label")
        .text("Price Per Square Foot (USD)");

var cities = realEstate.map(function(d) {
        return d['key'];
    });

trellisG
        .append("text")
        .attr("x", (trellisWidth/2) - padding.axis)
        .attr("y",1.5*padding.t)
        .text((function(d,i) {return cities[i];}));
});



