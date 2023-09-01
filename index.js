document.addEventListener("DOMContentLoaded", function () {
    var width = window.innerWidth;
    var height = window.innerHeight;

    var svg = d3.select("#map-container") // Update the container ID
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var projection = d3.geoMercator()
        .scale(100)
        .translate([width - 400, 300]);

    var path = d3.geoPath().projection(projection);
    //clicked region variable
    var selectedRegion = null; 
    //universities in region variable
    var universitiesInRegion; 

    d3.json("./data/world_map.json", function (err, geojson) {
        if (err) throw err;

        // Load and parse the university rank data
        d3.json("./data/world_university_rank.json", function (err, rankData) {
            if (err) throw err;
            // Display map and define interactions
            svg.selectAll("path")
                .data(geojson.features)
                .enter()
                .append("path")
                .attr("class", "country")
                .attr("d", path)
                .on("mouseover", function (d) {
                    d3.select(this).classed("highlighted", true);
                    var countryRegion = d.properties.subregion;
                    d3.selectAll("path.country")
                        .filter(function (country) {
                            return country.properties.subregion === countryRegion;
                        })
                        .classed("highlighted", true);
                })
                .on("mouseout", function (d) {
                    d3.select(this).classed("highlighted", false);
                    d3.selectAll("path.country")
                        .classed("highlighted", false);
                })
                .on("click", function (d) {
                    if (selectedRegion !== d.properties.subregion) {
                        //clear preivously displayed data
                        d3.select("#info-container").selectAll("*").remove();
                        d3.select("#bar-plot-container").selectAll("*").remove();
                        d3.selectAll("path.country")
                            .classed("selected", false);
                        selectedRegion = d.properties.subregion;
                        d3.select(this).classed("selected", true);
                        d3.selectAll("path.country")
                            .filter(function (country) {
                                return country.properties.subregion === selectedRegion;
                            })
                            .classed("selected", true);

                        svg.selectAll(".university-label").remove();
                        svg.selectAll(".university-none").remove();
                        svg.selectAll(".region-title").remove();

                        //get universities of hovered region
                        universitiesInRegion = rankData.filter(function (univ) {
                            return univ["SubRegion"] === selectedRegion;
                        });
                        //get only top 20
                        universitiesInRegion = universitiesInRegion.slice(0, 20);
                        var labelX = 10;
                        var universityLabels = svg.selectAll(".university-label")
                            .data(universitiesInRegion)
                            .enter().append("text")
                            .attr("class", "university-label")
                            .attr("x", 10)
                            .attr("text-anchor", "start")
                            .attr("y", function (d, i) {
                                return 40 + i * 20;
                            })
                            .text(function (d, i) {
                                return (i + 1) + "- " + d["University name"] + " (" + d["Country"] + ")";
                            });

                        // no data available case
                        if (universityLabels.empty()) {
                            svg.append("text")
                                .attr("class", "university-none")
                                .attr("x", 10)
                                .attr("y", 60)
                                .attr("text-anchor", "start")
                                .text("No available data for this region");
                        }
                        // Display the name of the region on top of the list
                        svg.append("text")
                            .attr("class", "region-title")
                            .attr("x", labelX)
                            .attr("y", 15)
                            .attr("text-anchor", "start")
                            .text("Top 20 Universities in  " + selectedRegion);

                        //define new possible click interaction
                        universityLabels.on("click", function (d) {
                            displayUniversityInfo(d); 
                        });
                        //default barplot
                        createBarPlot(universitiesInRegion, d3.select("#plot-option-select").property("value"));
                    } else {
                        // Deselect the region
                        d3.select(this).classed("selected", false);
                        d3.selectAll("path.country")
                            .filter(function (country) {
                                return country.properties.subregion === selectedRegion;
                            })
                            .classed("selected", false);
                        svg.selectAll(".university-label").remove();
                        svg.selectAll(".university-none").remove();
                        svg.selectAll(".region-title").remove();
                        selectedRegion = null;
                    }
                });
        });
    });

    function displayUniversityInfo(university) {
        //clear university info container
        d3.select("#info-container").selectAll("*").remove();
        // Display university info in the info-container
        var infoDiv = d3.select("#info-container")
            .append("div")
            .attr("class", "university-info");
        
        //add title
        infoDiv.append("t2")
            .text(university["University name"]);

        var properties = [
                ["World Rank","Rank"],
                ["Number of students","Number of students"],
                ["Number of students per staff","Number of students per staff"],
                ["Female-to-Male Ratio: ","Gender ratio"],
                ["Percentage of international students","Percentage of international students"]
        ];
        
        //add informations
        for (var i = 0; i < properties.length; i++) {
            infoDiv.append("p")
                .text(properties[i][0] + ": " + university[properties[i][1]]);
        }
    }

    function createBarPlot(data, selectedOption) {
        //Clear previous bar plot
        d3.select("#bar-plot-container").selectAll("*").remove();

        // Extract and format data based on the selected option
        var barPlotData;
        
        if (selectedOption === "Number of students") {
            barPlotData = data.map(function (d) {
                return {
                    category: d["University name"],
                    value: parseInt(d[selectedOption].replace(/,/g, ''), 10) // Convert to integer
                };
            });
        } else if (selectedOption === "Percentage of international students") {
            barPlotData = data.map(function (d) {
                return {
                    category: d["University name"],
                    value: parseFloat(d[selectedOption])
                };
            });
        } else if (selectedOption === "Female students ratio") {
            barPlotData = data.map(function (d) {
                // Calculate a numerical value for gender ratio, e.g., 57:43 -> 0.57
                var ratioParts = d["Gender ratio"].split(" : ");
                var ratioValue = parseFloat(ratioParts[0]) / (parseFloat(ratioParts[0]) + parseFloat(ratioParts[1]));
                return {
                    category: d["University name"],
                    value: ratioValue
                };
            });
        }

        // Create the bar plot
        var margin = { top: 0, right: 120, bottom: 100, left: 40 };
        var width = 400;
        var height = 250;

        var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
        var y = d3.scaleLinear().rangeRound([height, 0]);

        var svg = d3.select("#bar-plot-container")
            .append("svg")
            .attr("width", width +200 )
            .attr("height", height + 250)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var numbers = Array.from({ length: 20 }, (_, i) => i + 1);

        x.domain(numbers.map(function (d) { return d; }));
        y.domain([0, d3.max(barPlotData, function (d) { return d.value; })]);

        svg.selectAll(".bar")
            .data(barPlotData)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d, i) { return x(i + 1); }) // Use numbers as the x-axis
            .attr("y", function (d) { return y(d.value); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d.value); });

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "middle");

        svg.append("g")
            .call(d3.axisLeft(y));

        // Add labels to the x-axis and y-axis
        svg.append("text")
            .attr("class", "axis-label")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 50) + ")")
            .style("text-anchor", "middle")
            .text('Distribution of '+selectedOption+" in "+selectedRegion);
        
    }

     // Create the dropdown menu
    d3.select("#plot-option-select")
     .on("change", function () {
         var selectedOption = this.value;
         createBarPlot(universitiesInRegion, selectedOption);
     });
 
});
