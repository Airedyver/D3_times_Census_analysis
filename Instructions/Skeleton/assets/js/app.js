var svgWidth = 500;
var svgHeight = 300;

var margin = { top: 20, right: 40, bottom: 60, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
 .select(".chart")
 .append("svg")
 .attr("width", svgWidth)
 .attr("height", svgHeight)
 .append("g")
 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

// Append a div to the body to create tooltips, assign it a class
d3.select(".chart")
 .append("div")
 .attr("class", "tooltip")
 .style("opacity", 0);

d3.csv("assets/js/data.csv", function(err, data) {
 if (err) throw err;


 data.forEach(function(data) {
   data.poverty = +data.poverty;
   data.exercise = +data.exercise;
 });

 // Step 1: Create scale functions
 //= =============================
 // Set the domain, and declare x
 var yLinearScale = d3.scaleLinear().range([height,0]);
 var xLinearScale = d3.scaleLinear().range([0, width]);

 // Step 2: Create axis functions
 //= ============================
 // Declare these variables
 var bottomAxis = d3.axisBottom(xLinearScale);
 var leftAxis = d3.axisLeft(yLinearScale);

 // Step 3: Scale the domain
 //= =======================

xLinearScale.domain([5, d3.max(data, function(data) {
    return data.poverty;
})]);

yLinearScale.domain([55, d3.max(data, function(data) {
    return data.exercise;
})]);

 // Step 4: Initialize tooltips
 //= ==========================
 var toolTip = d3
   .tip()
   .attr("class", "tooltip")
   .direction('e')
   .html(function(data) {
     var stateName = data.state;
     var povertyRate = data.poverty
     var monthExercise = data.exercise
     return (stateName  + "<br> Poverty Rate: " + povertyRate + " % <br> Percent that exercised in the past month: " + monthExercise + "%") 
   });

 // Step 5: call toolTip (this has been done for you)
 //= ===============================================
 chart.call(toolTip);

 chart
   .selectAll("circle")
   .data(data)
   .enter()
   .append("circle")
     .attr("cx", function(data, index) {
       console.log(data.poverty);
       return xLinearScale(data.poverty);
     })
     .attr("cy", function(data, index) {
       return yLinearScale(data.exercise);
     })
     .attr("r", "10")
     .attr("fill", "purple")
     // Step 6: Use the event listener to create onclick and onmouseout events
     //= =====================================================================
     .on("click", function(data) {
       toolTip.show(data);
     })
     // on mouseout event
     .on("mouseout", function(data, index) {
       toolTip.hide(data);
     });

 chart
   .append("g")
   .attr("transform", `translate(0, ${height})`)
   .call(bottomAxis);

 chart
   .append("g")
   .call(leftAxis);

 chart.append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 0 - margin.left + 40)
     .attr("x", 0 - (height) - 30)
     .attr("dy", "1em")
     .attr("class", "axisText")
     .text("Citizens that exercised in the past month");

// Append x-axis labels
 chart.append("text")
   .attr("transform",
         "translate(" + (width / 2) + " ," +
                        (height + margin.top + 30) + ")")
   .attr("class", "axisText")
   .text("Poverty Rate per State");
});

