/**
 * Analytics module
 * Handles chart visualization of the data
 */

// Cache for processed data to avoid redundant processing
let dataCache = {
    lastUpdated: null,
    cachedData: null,
    categories: null,
    nestedData: null
};

/**
 * Initialize the analytics chart
 * @param {Element} container - DOM element to contain the chart
 * @returns {Object} Chart configuration object
 */
export function initializeAnalyticsChart(container) {
    try {
        // Check if container exists
        if (!container) {
            console.error('Analytics container not found');
            return null;
        }

        // Create SVG container with responsive dimensions
        const margin = { top: 40, right: 150, bottom: 60, left: 80 };
        
        // Get the container width for responsiveness
        const containerWidth = container.clientWidth;
        const width = containerWidth - margin.left - margin.right;
        
        // Calculate height as a percentage of width for better responsiveness
        // Minimum height of 300px, maximum of 600px
        const height = Math.max(300, Math.min(600, containerWidth * 0.5));
        
        // Create SVG
        const svg = d3.select(container)
            .append("svg")
            .attr("class", "analytics-chart-svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        
        // Create title
        svg.append("text")
            .attr("class", "chart-title")
            .attr("x", width / 2)
            .attr("y", -margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Articles Over Time by Health Category");
        
        // Create axes - these will be populated later with data
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`);
        
        svg.append("g")
            .attr("class", "y-axis");
        
        // Add axis labels
        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("transform", `translate(${width/2}, ${height + 40})`)
            .style("text-anchor", "middle")
            .text("Date");
        
        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("transform", "rotate(-90)")
            .attr("y", -60)
            .attr("x", -(height / 2))
            .attr("text-anchor", "middle")
            .text("Number of Articles");
        
        // Create tooltip container
        const tooltip = svg.append("g")
            .attr("class", "tooltip")
            .style("display", "none");
            
        tooltip.append("rect")
            .attr("width", 150)
            .attr("height", 50)
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("rx", 5)
            .attr("ry", 5);
            
        tooltip.append("text")
            .attr("class", "tooltip-category")
            .attr("x", 10)
            .attr("y", 20);
            
        tooltip.append("text")
            .attr("class", "tooltip-value")
            .attr("x", 10)
            .attr("y", 40);
        
        // Add placeholder for legend
        svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width + 10}, 0)`);
        
        // Add placeholder for lines and dots
        svg.append("g").attr("class", "lines-container");
        svg.append("g").attr("class", "dots-container");

        // Add a no-data message container that's initially hidden
        svg.append("text")
            .attr("class", "no-data-message")
            .attr("x", width / 2)
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("display", "none")
            .text("No data available for the current filters");
        
        return {
            container,
            svg,
            margin,
            width,
            height,
            lastData: null
        };
    } catch (error) {
        console.error('Error initializing analytics chart:', error);
        return null;
    }
}

/**
 * Process data for the chart
 * @param {Array} filteredData - The filtered data to process
 * @returns {Object} Processed data including nested data and categories
 */
function processChartData(filteredData) {
    // If we already have cached data for this dataset, return it
    if (dataCache.lastUpdated && dataCache.lastUpdated === filteredData) {
        return {
            nestedData: dataCache.nestedData,
            categories: dataCache.categories
        };
    }
    
    try {
        // Process data: group by month and health category
        const monthFormat = d3.timeFormat("%b %Y");
        
        // Ensure all entries have parsedDate
        const validData = filteredData.filter(d => d.parsedDate);
        
        if (validData.length === 0) {
            return { nestedData: [], categories: [] };
        }
        
        // Group data by month and health category
        const nestedData = d3.nest()
            .key(d => monthFormat(d.parsedDate))
            .key(d => {
                // Handle items with no health categories
                if (!d['Sector Categories'] || d['Sector Categories'].length === 0) {
                    return "Uncategorized";
                }
                // For simplicity, use the first category
                return d['Sector Categories'][0];
            })
            .rollup(v => v.length) // Count articles
            .entries(validData);
        
        // Sort by date
        nestedData.sort((a, b) => {
            // Parse the month strings back to dates for comparison
            const parseMonthYear = d3.timeParse("%b %Y");
            return parseMonthYear(a.key) - parseMonthYear(b.key);
        });
        
        // Extract unique categories across all months
        const allCategories = new Set();
        nestedData.forEach(month => {
            month.values.forEach(category => {
                allCategories.add(category.key);
            });
        });
        
        // Convert to array for d3 color mapping
        const categories = Array.from(allCategories);
        
        // Update cache
        dataCache.lastUpdated = filteredData;
        dataCache.nestedData = nestedData;
        dataCache.categories = categories;
        
        return { nestedData, categories };
    } catch (error) {
        console.error('Error processing chart data:', error);
        return { nestedData: [], categories: [] };
    }
}

/**
 * Update the analytics chart with new data
 * @param {Object} chart - Chart configuration object
 * @param {Array} filteredData - Filtered data to display
 */
export function updateAnalyticsChart(chart, filteredData) {
    if (!chart || !chart.svg) {
        console.error('Invalid chart configuration');
        return;
    }
    
    try {
        if (!filteredData || filteredData.length === 0) {
            displayNoDataMessage(chart, true);
            return;
        }

        const { svg, width, height } = chart;
        
        // Record the data we're rendering for comparison in resize events
        chart.lastData = filteredData;
        
        // Process data: group by month and health category
        const { nestedData, categories } = processChartData(filteredData);
        
        if (nestedData.length === 0 || categories.length === 0) {
            displayNoDataMessage(chart, true);
            return;
        } else {
            displayNoDataMessage(chart, false);
        }
        
        // Prepare line chart data
        const lineData = categories.map(category => {
            return {
                category: category,
                values: nestedData.map(month => {
                    const categoryData = month.values.find(c => c.key === category);
                    return {
                        date: month.key,
                        count: categoryData ? categoryData.value : 0
                    };
                })
            };
        });
        
        // Set up scales
        const x = d3.scaleBand()
            .domain(nestedData.map(d => d.key))
            .range([0, width])
            .padding(0.1);
        
        const y = d3.scaleLinear()
            .domain([0, d3.max(lineData, d => d3.max(d.values, v => v.count)) * 1.1]) // Add 10% padding
            .nice()
            .range([height, 0]);
        
        // Set up color scale
        const color = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(categories);
        
        // Create line generator
        const line = d3.line()
            .x(d => x(d.date) + x.bandwidth() / 2)
            .y(d => y(d.count))
            .curve(d3.curveMonotoneX);
        
        // Update axes with transitions
        svg.select(".x-axis")
            .transition()
            .duration(750)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)");
        
        svg.select(".y-axis")
            .transition()
            .duration(750)
            .call(d3.axisLeft(y));
        
        // Update lines using proper enter/update/exit pattern
        const linesContainer = svg.select(".lines-container");
        const lines = linesContainer.selectAll(".line")
            .data(lineData, d => d.category);
        
        // Enter new lines
        lines.enter()
            .append("path")
            .attr("class", d => `line line-${d.category.replace(/\s+/g, '-').toLowerCase()}`)
            .attr("fill", "none")
            .attr("stroke", d => color(d.category))
            .attr("stroke-width", 2)
            .attr("d", d => line(d.values))
            .style("opacity", 0)
            .transition()
            .duration(750)
            .style("opacity", 1);
        
        // Update existing lines
        lines.transition()
            .duration(750)
            .attr("d", d => line(d.values))
            .attr("stroke", d => color(d.category));
        
        // Remove old lines
        lines.exit()
            .transition()
            .duration(500)
            .style("opacity", 0)
            .remove();
        
        // Update dots using proper enter/update/exit pattern
        const dotsContainer = svg.select(".dots-container");
        
        // Process all points for all categories into a flat array for easier management
        const allPoints = lineData.flatMap(d => 
            d.values.map(v => ({
                category: d.category,
                date: v.date,
                count: v.count
            }))
        );
        
        const dots = dotsContainer.selectAll(".dot")
            .data(allPoints, d => `${d.category}-${d.date}`);
        
        // Enter new dots
        dots.enter()
            .append("circle")
            .attr("class", d => `dot dot-${d.category.replace(/\s+/g, '-').toLowerCase()}`)
            .attr("cx", d => x(d.date) + x.bandwidth() / 2)
            .attr("cy", d => y(d.count))
            .attr("r", 0)
            .attr("fill", d => color(d.category))
            .on("mouseover", handleDotMouseOver)
            .on("mouseout", handleDotMouseOut)
            .transition()
            .duration(750)
            .attr("r", 4);
        
        // Update existing dots
        dots.transition()
            .duration(750)
            .attr("cx", d => x(d.date) + x.bandwidth() / 2)
            .attr("cy", d => y(d.count))
            .attr("fill", d => color(d.category));
        
        // Remove old dots
        dots.exit()
            .transition()
            .duration(500)
            .attr("r", 0)
            .remove();
        
        // Update legend
        updateLegend(svg, categories, color);

        // Mouse event handlers for dots
        function handleDotMouseOver(d) {
            const tooltip = svg.select(".tooltip");
            tooltip.style("display", null);
            
            tooltip.select(".tooltip-category")
                .text(`${d.category}`);
                
            tooltip.select(".tooltip-value")
                .text(`${d.date}: ${d.count} articles`);
                
            const tooltipWidth = 150;
            const tooltipHeight = 50;
            
            let x = parseFloat(d3.select(this).attr("cx"));
            let y = parseFloat(d3.select(this).attr("cy"));
            
            // Adjust tooltip position to prevent going off the chart
            if (x + tooltipWidth > width) {
                x = x - tooltipWidth - 10;
            } else {
                x = x + 10;
            }
            
            if (y + tooltipHeight > height) {
                y = y - tooltipHeight - 10;
            } else {
                y = y - 10;
            }
            
            tooltip.attr("transform", `translate(${x}, ${y})`);
            
            // Highlight the related line and dot
            const categoryClass = d.category.replace(/\s+/g, '-').toLowerCase();
            
            d3.selectAll(`.line-${categoryClass}`)
                .transition()
                .duration(200)
                .attr("stroke-width", 4);
                
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 6);
        }
        
        function handleDotMouseOut() {
            svg.select(".tooltip").style("display", "none");
            
            // Remove highlighting
            d3.selectAll(".line")
                .transition()
                .duration(200)
                .attr("stroke-width", 2);
                
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 4);
        }
    } catch (error) {
        console.error('Error updating analytics chart:', error);
        displayNoDataMessage(chart, true);
    }
}

/**
 * Update the legend with current categories
 * @param {Selection} svg - D3 selection of the SVG
 * @param {Array} categories - List of categories
 * @param {Function} colorScale - D3 color scale function
 */
function updateLegend(svg, categories, colorScale) {
    try {
        const legend = svg.select(".legend");
        const legendItems = legend.selectAll(".legend-item")
            .data(categories, d => d);
        
        // Enter new legend items
        const legendEnter = legendItems.enter()
            .append("g")
            .attr("class", d => `legend-item legend-${d.replace(/\s+/g, '-').toLowerCase()}`)
            .attr("transform", (d, i) => `translate(0, ${i * 20})`)
            .style("opacity", 0)
            .on("mouseover", function(category) {
                // Highlight the related line and dots
                const categoryClass = category.replace(/\s+/g, '-').toLowerCase();
                
                d3.selectAll(`.line-${categoryClass}`)
                    .transition()
                    .duration(200)
                    .attr("stroke-width", 4);
                    
                d3.selectAll(`.dot-${categoryClass}`)
                    .transition()
                    .duration(200)
                    .attr("r", 6);
            })
            .on("mouseout", function() {
                // Remove highlighting
                d3.selectAll(".line")
                    .transition()
                    .duration(200)
                    .attr("stroke-width", 2);
                    
                d3.selectAll(".dot")
                    .transition()
                    .duration(200)
                    .attr("r", 4);
            });
        
        legendEnter.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", d => colorScale(d));
        
        legendEnter.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .text(d => d)
            .style("font-size", "12px");
        
        legendEnter.transition()
            .duration(500)
            .style("opacity", 1);
        
        // Update existing legend items
        legendItems.transition()
            .duration(500)
            .attr("transform", (d, i) => `translate(0, ${i * 20})`);
        
        legendItems.select("rect")
            .transition()
            .duration(500)
            .attr("fill", d => colorScale(d));
        
        legendItems.select("text")
            .text(d => d);
        
        // Remove old legend items
        legendItems.exit()
            .transition()
            .duration(500)
            .style("opacity", 0)
            .remove();
    } catch (error) {
        console.error('Error updating legend:', error);
    }
}

/**
 * Display or hide a message when no data is available
 * @param {Object} chart - Chart configuration
 * @param {boolean} show - Whether to show the message
 */
function displayNoDataMessage(chart, show) {
    if (!chart || !chart.svg) return;
    
    try {
        const { svg } = chart;
        
        // Get the no-data message
        const noDataMessage = svg.select(".no-data-message");
        
        if (show) {
            // Hide chart elements
            svg.selectAll(".lines-container, .dots-container").style("display", "none");
            
            // Show no data message
            noDataMessage.style("display", null);
        } else {
            // Show chart elements
            svg.selectAll(".lines-container, .dots-container").style("display", null);
            
            // Hide no data message
            noDataMessage.style("display", "none");
        }
    } catch (error) {
        console.error('Error displaying no data message:', error);
    }
}

/**
 * Handle window resize for responsiveness
 * @param {Object} chart - Chart configuration
 */
export function handleChartResize(chart) {
    if (!chart || !chart.container || !chart.svg) return;
    
    try {
        // Get current dimensions
        const containerWidth = chart.container.clientWidth;
        const width = containerWidth - chart.margin.left - chart.margin.right;
        const height = Math.max(300, Math.min(600, containerWidth * 0.5));
        
        // Update chart dimensions
        chart.width = width;
        chart.height = height;
        
        // Update SVG dimensions
        d3.select(chart.container).select("svg")
            .attr("width", width + chart.margin.left + chart.margin.right)
            .attr("height", height + chart.margin.top + chart.margin.bottom);
        
        // Update axes positions
        chart.svg.select(".x-axis")
            .attr("transform", `translate(0,${height})`);
            
        // Update axis labels
        chart.svg.select(".x-axis-label")
            .attr("transform", `translate(${width/2}, ${height + 40})`);
            
        chart.svg.select(".y-axis-label")
            .attr("x", -(height / 2));
            
        // Update legend position
        chart.svg.select(".legend")
            .attr("transform", `translate(${width + 10}, 0)`);
            
        // Update title position
        chart.svg.select(".chart-title")
            .attr("x", width / 2);
            
        // Update no-data message position
        chart.svg.select(".no-data-message")
            .attr("x", width / 2)
            .attr("y", height / 2);
        
        // Re-render the chart with the current data if available
        if (chart.lastData && chart.lastData.length > 0) {
            updateAnalyticsChart(chart, chart.lastData);
        }
    } catch (error) {
        console.error('Error handling chart resize:', error);
    }
}

/**
 * Clean up analytics chart resources
 * @param {Object} chart - Chart configuration
 */
export function cleanupAnalyticsChart(chart) {
    if (!chart || !chart.svg) return;
    
    try {
        // Remove event listeners from dots
        chart.svg.selectAll(".dot")
            .on("mouseover", null)
            .on("mouseout", null);
            
        // Remove event listeners from legend items
        chart.svg.selectAll(".legend-item")
            .on("mouseover", null)
            .on("mouseout", null);
        
        // Clear the chart's last data reference
        chart.lastData = null;
    } catch (error) {
        console.error('Error cleaning up analytics chart:', error);
    }
}
