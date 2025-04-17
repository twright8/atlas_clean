
/**
 * Module for enhanced dashboard chart visualizations with animations and interactive features
 */
import * as d3 from 'd3';

// Chart references
let timeSeriesChart;
let categoryChart;
let topCountriesChart;

/**
 * Initialize the time series chart
 * @returns {Object} The chart reference
 */
export function initializeTimeSeriesChart() {
    const container = d3.select('#time-series-chart');

    // Set up dimensions and margins
    const margin = {top: 20, right: 30, bottom: 60, left: 60};
    const containerWidth = document.getElementById('time-series-chart').clientWidth || 500;
    const width = Math.max(containerWidth - margin.left - margin.right, 100);
    const height = 260 - margin.top - margin.bottom;

    // Create SVG with extra height for labels
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom + 130) // Added 30px for labels
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
        .domain([/* your min date */, /* your max date */])
        .range([0, width]);

    // Add X axis placeholder
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Add the X axis label as a separate element with more space


    // Add Y axis placeholder
    svg.append('g')
        .attr('class', 'y-axis')
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -40)
        .attr('x', -height / 2)
        .attr('fill', '#333')
        .style('text-anchor', 'middle')
        .text('Articles');

    // Add grid lines
    svg.append('g')
        .attr('class', 'grid-lines')
        .style('stroke-dasharray', '3,3')
        .style('stroke', '#e0e0e0')
        .style('stroke-width', 0.5);

    // Store reference to chart
    timeSeriesChart = svg;
    return svg;
}

/**
 * Initialize the category breakdown chart
 * @returns {Object} The chart reference
 */
export function initializeCategoryChart() {
    const container = d3.select('#category-chart');

    // Set up dimensions and margins
    const margin = {top: 20, right: 30, bottom: 50, left: 160};
    const containerWidth = document.getElementById('category-chart').clientWidth || 500;
    const width = Math.max(containerWidth - margin.left - margin.right, 100);
    const height = 260 - margin.top - margin.bottom;

    // Create SVG
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add X axis placeholder
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .append('text')
        .attr('y', 40)
        .attr('x', width / 2)
        .attr('fill', '#333')
        .style('text-anchor', 'middle');

    // Add Y axis placeholder
    svg.append('g')
        .attr('class', 'y-axis');

    // Store reference to chart
    categoryChart = svg;
    return svg;
}

/**
 * Initialize the top countries chart
 * @returns {Object} The chart reference
 */
export function initializeTopCountriesChart() {
    const container = d3.select('#top-countries-chart');

    // Set up dimensions and margins
    const margin = {top: 20, right: 30, bottom: 50, left: 110};
    const containerWidth = document.getElementById('top-countries-chart').clientWidth || 500;
    const width = Math.max(containerWidth - margin.left - margin.right, 100);
    const height = 260 - margin.top - margin.bottom;

    // Create SVG
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add X axis placeholder
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .append('text')
        .attr('y', 40)
        .attr('x', width / 2)
        .attr('fill', '#333')
        .style('text-anchor', 'middle');
    // Add Y axis placeholder
    svg.append('g')
        .attr('class', 'y-axis');

    // Store reference to chart
    topCountriesChart = svg;
    return svg;
}

/**
 * Updates the time series chart with aggregated data, supporting different content modes and time aggregations.
 * Features: Animations, Tooltips (fixed position), Peak Annotation (simplified). Legend removed.
 *
 * @param {Object} chart The D3 selection of the SVG group (`g`) element for the chart.
 * @param {Object} aggregatedData The data prepared by aggregateTimeSeriesData, containing { type: 'single'|'multi', data: [...] }.
 * @param {Object} dateRange Object containing minDate and maxDate of the original dataset (used for context, not direct plotting).
 * @param {Object} options Configuration options: { yearly: boolean, contentMode: 'total'|'integrity'|'health' }.
 */
export function updateTimeSeriesChart(chart, aggregatedData, dateRange, options = { yearly: false, contentMode: 'total' }) {
    // --- 1. Setup & Destructuring ---
    const { type, data: timeData } = aggregatedData;
    const { yearly, contentMode } = options;
    const displayFormat = yearly ? '%Y' : '%b %Y';
    const parseFormat = yearly ? d3.timeParse('%Y') : d3.timeParse('%Y-%m'); // Likely not needed if dates are objects

    console.log(`Updating Time Series Chart (D3 v7) - Mode: ${contentMode}, Yearly: ${yearly}, Type: ${type}, Data points: ${type === 'single' ? timeData.length : timeData.reduce((sum, d) => sum + d.values.length, 0)}`);

    // --- 2. Dimensions and Margins ---
    const margin = { top: 20, right: 30, bottom: 80, left: 60 };
    const containerElement = document.getElementById('time-series-chart');
    const containerWidth = containerElement ? containerElement.clientWidth : 600;
    const width = Math.max(containerWidth - margin.left - margin.right, 150);
    const height = 260 - margin.top - margin.bottom;

    const svg = chart;

    // --- 3. Clear Previous Elements ---
    svg.selectAll("*").remove();
    d3.select(containerElement).selectAll('.chart-tooltip-timeseries').remove(); // Remove tooltip from container

    // --- 4. Handle No Data Scenario ---
    const hasData = timeData && (
        (type === 'single' && timeData.length > 0) ||
        (type === 'multi' && timeData.length > 0 && timeData.some(d => d.values.length > 0))
    );

    // Re-add essential structure
    svg.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${height})`);
    const yAxisGroup = svg.append('g').attr('class', 'y-axis');
    yAxisGroup.append('text')
        .attr('class', 'y-axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 20)
        .attr('x', -height / 2)
        .attr('fill', '#333')
        .style('text-anchor', 'middle')
        .style('font-size', '12px');
    svg.append('g').attr('class', 'grid-lines').style('stroke-dasharray', '3,3').style('stroke', '#e0e0e0').style('stroke-width', 0.5);
    svg.append('g').attr('class', 'annotations');

    if (!hasData) {
        console.log("No data for time series chart.");
        svg.select('.y-axis-label').text('Articles');
        svg.append('text')
            .attr('class', 'no-data-message')
            .attr('x', width / 2)
            .attr('y', height / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('fill', '#666')
            .text('No data available for the selected filters');
        // Make sure axes still draw (even if empty)
        const x = d3.scaleTime().domain([new Date(2022,0,1), new Date()]).range([0, width]);
        const y = d3.scaleLinear().domain([0, 10]).range([height, 0]);
        svg.select('.x-axis').call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat(displayFormat)));
        svg.select('.y-axis').call(d3.axisLeft(y).ticks(5));
        return; // Stop further processing if no data
    }

    // --- 5. Determine Data Domains & Y-Axis Label ---
    let xDomain, yMax, yAxisLabelText;
    let pointsDataForHover = []; // Will hold data points for Voronoi

    if (type === 'single') {
        xDomain = d3.extent(timeData, d => d.date);
        yMax = d3.max(timeData, d => d.value);
        yAxisLabelText = yearly ? 'Total Articles per Year' : 'Total Articles per Month';
        pointsDataForHover = timeData; // Use directly for single line
    } else { // type === 'multi'
        const allDates = timeData.flatMap(category => category.values.map(v => v.date));
        const allValues = timeData.flatMap(category => category.values.map(v => v.value));
        xDomain = d3.extent(allDates);
        yMax = d3.max(allValues);
        const categoryTypeName = contentMode === 'integrity' ? 'Integrity Issue' : 'Health Sector';
        yAxisLabelText = `Articles per ${categoryTypeName}`;
        yAxisLabelText += yearly ? ' (Yearly)' : ' (Monthly)';
        // Flatten points for Voronoi, adding category info
        pointsDataForHover = timeData.flatMap(category =>
            category.values.map(v => ({ ...v, category: category.key }))
        );
    }
    // Domain validation...
    if (!xDomain || xDomain[0] === undefined || xDomain[1] === undefined) xDomain = [new Date(), new Date()];
    if (xDomain[0] && xDomain[1] && xDomain[0].getTime() === xDomain[1].getTime()) {
        const singleDate = xDomain[0];
        const padding = yearly ? 365*24*60*60*1000 : 30*24*60*60*1000;
        xDomain = [new Date(singleDate.getTime() - padding), new Date(singleDate.getTime() + padding)];
    }
    yMax = yMax === undefined || yMax === 0 ? 10 : yMax;

    // --- 6. Define Scales ---
    const x = d3.scaleTime().domain(xDomain).range([0, width]).nice();
    const y = d3.scaleLinear().domain([0, yMax * 1.1]).range([height, 0]).nice();
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    if (type === 'multi') color.domain(timeData.map(d => d.key));

    // --- 7. Update Axes ---
    const numTicksX = Math.min(pointsDataForHover.length, width < 300 ? 4 : (width < 500 ? 6 : 10));
    svg.select('.x-axis')
        .transition().duration(500)
        .call(d3.axisBottom(x).ticks(numTicksX).tickFormat(d3.timeFormat(displayFormat)))
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)");
    svg.select('.y-axis-label').text(yAxisLabelText);
    svg.select('.y-axis')
        .transition().duration(500)
        .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format("d")));

    // --- 8. Update Grid Lines ---
    const yTicks = y.ticks(5);
    const gridLines = svg.select('.grid-lines').selectAll('line.horizontal').data(yTicks, d => d);
    gridLines.exit().remove();
    gridLines.enter().append('line').attr('class', 'horizontal')
        .attr('x1', 0).attr('x2', width).attr('y1', d => y(d)).attr('y2', d => y(d))
        .attr('stroke-opacity', 0)
        .merge(gridLines)
        .transition().duration(500)
        .attr('y1', d => y(d)).attr('y2', d => y(d))
        .attr('stroke-opacity', 1);

    // --- 9. Create Tooltip Div (Attached to Chart Container) ---
    const tooltipContainer = d3.select(containerElement)
                               .style('position', 'relative');

    const tooltipDiv = tooltipContainer.append('div')
        .attr('class', 'chart-tooltip-timeseries')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('top', '10px')
        .style('left', '10px')
        .style('background-color', 'rgba(255, 255, 255, 0.95)')
        .style('border', '1px solid #ccc')
        .style('padding', '8px 12px')
        .style('border-radius', '4px')
        .style('pointer-events', 'none')
        .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
        .style('font-size', '12px')
        .style('z-index', 10)
        .style('max-width', '200px');

    // --- 10. Draw Visualization (Common Elements First) ---
    let overallMaxPoint = null;
    let pointSelection; // To hold the selection of all points for hover later

    // Draw Lines and Points (slightly different attributes based on type)
    if (type === 'single') {
        // Find Peak
        if (timeData.length > 0) {
            overallMaxPoint = timeData.reduce((max, current) => (current.value > max.value ? current : max), timeData[0]);
        }
        // Draw Area
        const area = d3.area().x(d => x(d.date)).y0(height).y1(d => y(d.value)).curve(d3.curveMonotoneX);
        svg.append('path').datum(timeData).attr('class', 'area-path')
            .attr('fill', 'rgba(54, 148, 209, 0.1)').attr('d', area)
            .attr('opacity', 0).transition().duration(500).delay(200).attr('opacity', 1);
        // Draw Line + Animation
        const line = d3.line().x(d => x(d.date)).y(d => y(d.value)).curve(d3.curveMonotoneX);
        const path = svg.append('path').datum(timeData).attr('class', 'line-path single-line')
            .attr('fill', 'none').attr('stroke', '#3694d1').attr('stroke-width', 3).attr('d', line);
        const pathLength = path.node()?.getTotalLength() || 0;
        if (pathLength > 0) {
            path.attr('stroke-dasharray', pathLength + ' ' + pathLength).attr('stroke-dashoffset', pathLength)
                .transition().duration(1000).ease(d3.easeLinear).attr('stroke-dashoffset', 0);
        }
        // Draw Points + Animation (Store selection)
        pointSelection = svg.selectAll('.data-point')
            .data(timeData)
            .enter()
            .append('circle')
            .attr('class', 'data-point single-point') // Class for styling/selection
            .attr('cx', d => x(d.date))
            .attr('cy', d => y(d.value))
            .attr('r', 0)
            .attr('fill', '#e5007d'); // Accent color for single line points

    } else { // type === 'multi'
        // Find Peak
        let currentOverallMax = 0;
        timeData.forEach(category => {
            category.values.forEach(point => {
                if (point.value > currentOverallMax) {
                    currentOverallMax = point.value;
                    overallMaxPoint = { ...point, category: category.key };
                }
            });
        });
        // Draw Lines + Animation
        const line = d3.line().x(d => x(d.date)).y(d => y(d.value)).defined(d => d.value !== null && !isNaN(d.value)).curve(d3.curveMonotoneX);
        const categoryGroups = svg.selectAll('.category-line-group').data(timeData, d => d.key);
        categoryGroups.exit().remove();
        const enterGroups = categoryGroups.enter().append('g').attr('class', 'category-line-group');
        const paths = enterGroups.append('path').attr('class', 'line-path multi-line enter')
            .style('mix-blend-mode', 'multiply').attr('fill', 'none')
            .attr('stroke', d => color(d.key)).attr('stroke-width', 2.5)
            .merge(categoryGroups.select('.line-path'))
            .attr('d', d => line(d.values));
        paths.filter('.enter')
             .each(function(d) {
                 const path = d3.select(this);
                 const totalLength = path.node()?.getTotalLength() || 0;
                 if (totalLength > 0) {
                     path.attr('stroke-dasharray', totalLength + ' ' + totalLength).attr('stroke-dashoffset', totalLength)
                         .transition().duration(1000).ease(d3.easeLinear).attr('stroke-dashoffset', 0);
                 }
                 path.classed('enter', false);
             });
        // Draw Points + Animation (Store selection)
        pointSelection = categoryGroups.merge(enterGroups)
            .selectAll('.data-point')
            .data(d => d.values.map(v => ({ ...v, category: d.key })), d => `${d.category}-${d.date.getTime()}`)
            .enter()
            .append('circle')
            .attr('class', 'data-point multi-point') // Class for styling/selection
            .attr('cx', d => x(d.date))
            .attr('cy', d => y(d.value))
            .attr('r', 0)
            .attr('fill', d => color(d.category));
    }

    // Animate points appearing (common to both types)
    if (pointSelection) {
        pointSelection.transition()
            .delay((d, i) => Math.random() * 500 + 500) // Staggered delay after line animation starts
            .duration(500)
            .attr('r', 3); // Final radius
    }

    // --- 11. Hover/Tooltip (using Voronoi - Common Logic) ---
    if (pointsDataForHover.length > 0) {
        // Create Delaunay triangulation based on screen coordinates
        const delaunay = d3.Delaunay.from(pointsDataForHover, d => x(d.date), d => y(d.value));
        // Create Voronoi diagram within the chart bounds
        const voronoi = delaunay.voronoi([0, 0, width, height]);

        svg.append('g')
            .attr('class', 'voronoi-hover-layer')
            .selectAll('path')
            .data(pointsDataForHover) // Use the flattened data for Voronoi cells
            .join('path')
              // .attr('stroke', 'rgba(128,128,128,0.2)') // Uncomment to visualize Voronoi cells
              .attr('fill', 'transparent')
              .attr('d', (d, i) => voronoi.renderCell(i)) // Render each cell
              .style('pointer-events', 'all') // Make cells capture mouse events
              .on('mouseover', (event, d) => { // d is the data point closest to the mouse
                  // Highlight the corresponding point(s) - might be multiple in multi-line at same spot
                  pointSelection // Use the stored selection of actual circle elements
                      .filter(pointData => pointData.date.getTime() === d.date.getTime() && pointData.value === d.value)
                      .transition().duration(100)
                      .attr('r', 5); // Enlarge the point

                  // Show tooltip
                  tooltipDiv.transition().duration(200).style('opacity', .95);
                  let tooltipContent = `<div style="font-weight: bold; margin-bottom: 4px; color: #333;">${d3.timeFormat(displayFormat)(d.date)}</div>`;
                  if (d.category) { // Check if it's multi-line data
                      tooltipContent += `<div style="font-weight: bold; margin-bottom: 4px; color:${color(d.category)};">${d.category}</div>`;
                  }
                  tooltipContent += `<div style="color: #555;"><span style="font-weight: bold; color: #333;">${d.value}</span> articles</div>`;
                  tooltipDiv.html(tooltipContent);
              })
              .on('mouseout', (event, d) => {
                  // Restore point size
                  pointSelection
                      .filter(pointData => pointData.date.getTime() === d.date.getTime() && pointData.value === d.value)
                      .transition().duration(100)
                      .attr('r', 3); // Restore original radius

                  // Hide tooltip
                  tooltipDiv.transition().duration(500).style('opacity', 0);
              });
    }


    // --- 12. Add Peak Annotation (Simplified Text) ---
    const annotationsGroup = svg.select('.annotations');
    if (overallMaxPoint && overallMaxPoint.value > 0) {
        const peakX = x(overallMaxPoint.date);
        const peakY = y(overallMaxPoint.value);
        const peakValue = overallMaxPoint.value;
        const peakCategory = overallMaxPoint.category; // Still needed for color

        annotationsGroup.append('circle')
            .attr('class', 'annotation-marker')
            .attr('cx', peakX).attr('cy', peakY).attr('r', 5).attr('fill', 'none')
            .attr('stroke', peakCategory ? color(peakCategory) : '#e5007d') // Use category color or default
            .attr('stroke-width', 2).attr('opacity', 0)
            .transition().delay(1200).duration(300).attr('opacity', 0.8);

        annotationsGroup.append('text')
            .attr('class', 'annotation-text')
            .attr('x', peakX).attr('y', peakY - 15).attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', peakCategory ? color(peakCategory) : '#e5007d')
            .text(`Peak: ${peakValue}`)
            .attr('opacity', 0)
            .transition().delay(1200).duration(300).attr('opacity', 1);
    }

    console.log("Time Series Chart update complete.");
}


/**
 * Update the category breakdown chart with data
 * @param {Object} chart The chart reference
 * @param {Array} data Filtered data array (this is the FULL filtered list for context)
 * @param {Object} options Chart options
 */
export function updateCategoryChart(chart, data, options = { showHealthCategories: false }) {
    console.log(`Updating category chart with ${data.length} data points`);

    // Determine which category type to show based on options
    const categoryType = options.showHealthCategories ? 'Sector Categories' : 'Corruption Categories';

    // Update chart title to reflect current view
    d3.select('#category-breakdown-card .card-header h3')
        .text(options.showHealthCategories ? 'Health Sector Categories' : 'Integrity Issues Categories');

    // Flatten and count all selected categories FROM THE PROVIDED DATA
    const categoryCounts = {};
    data.forEach(item => {
        if (Array.isArray(item[categoryType])) {
            item[categoryType].forEach(category => {
                if (category && category.trim()) {
                    const trimmedCat = category.trim();
                    categoryCounts[trimmedCat] = (categoryCounts[trimmedCat] || 0) + 1;
                }
            });
        }
    });

    // Convert to array format for D3
    const categoryDataForChart = Object.entries(categoryCounts).map(([category, count]) => {
        return { category, count };
    });

    // Sort by count descending
    categoryDataForChart.sort((a, b) => b.count - a.count);

    // Get top 10 categories (or all if fewer than 10)
    const topCategories = categoryDataForChart.slice(0, 10);

    // Remove any existing tooltip if chart is cleared/updated
    d3.select('#category-chart').selectAll('.chart-tooltip.category-tooltip').remove();

    // Set up dimensions and margins
    const margin = {top: 20, right: 30, bottom: 50, left: 160};
    const containerWidth = document.getElementById('category-chart').clientWidth || 500;
    const width = Math.max(containerWidth - margin.left - margin.right, 100);
    const height = 260 - margin.top - margin.bottom;

    // Clear previous chart elements (bars, axes labels etc.) before potentially showing 'No data'
    chart.selectAll('*').remove(); // Clear everything within the 'g' tag

    // Re-add axis groups needed for 'No data' message or actual chart
    chart.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${height})`);
    chart.append('g').attr('class', 'y-axis');

    if (topCategories.length === 0) {
        console.log("No category data to display.");
        // Show 'No data' message centered in the chart area
        chart.append('text')
            .attr('class', 'no-data-message')
            .attr('x', width / 2) // Center based on calculated width
            .attr('y', height / 2) // Center based on calculated height
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('fill', '#666')
            .text('No data available for the selected filters');

        // Draw empty axes for consistency
        const x = d3.scaleLinear().domain([0, 10]).range([0, width]);
        const y = d3.scaleBand().domain([]).range([0, height]).padding(0.2);
        chart.select('.x-axis').call(d3.axisBottom(x).ticks(5));
        chart.select('.y-axis').call(d3.axisLeft(y));

        return; // Stop processing
    }

    // Set scales based on the topCategories data
    const x = d3.scaleLinear()
        .domain([0, d3.max(topCategories, d => d.count) * 1.1]) // Add some padding to max count
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(topCategories.map(d => d.category))
        .range([0, height])
        .padding(0.2);

    // Update axes with transitions
    chart.select('.x-axis')
        .transition()
        .duration(500)
        .call(d3.axisBottom(x).ticks(5));

    chart.select('.y-axis')
        .transition()
        .duration(500)
        .call(d3.axisLeft(y))
        .selectAll('text') // Style axis labels
        .style('text-anchor', 'end')
        .each(function(d) { // Add tooltips to long labels
            if (this.getComputedTextLength() > margin.left - 10) {
                d3.select(this).append("title").text(d);
            }
        });


    // Set bar color based on category type
    const barColor = options.showHealthCategories ? '#e5007d' : '#3694d1';

    // Handle bars with enter/update/exit pattern
    const bars = chart.selectAll('.category-bar')
        .data(topCategories, d => d.category); // Key function for object constancy

    // Remove bars that are no longer in the data
    bars.exit()
        .transition()
        .duration(300)
        .attr('width', 0)
        .remove();

    // Update existing bars
    bars.transition()
        .duration(500)
        .attr('y', d => y(d.category))
        .attr('height', y.bandwidth())
        .attr('width', d => x(d.count))
        .attr('fill', barColor);

    // Add new bars with animation
    const enterBars = bars.enter()
        .append('rect')
        .attr('class', 'category-bar')
        .attr('x', 0)
        .attr('y', d => y(d.category))
        .attr('height', y.bandwidth())
        .attr('width', 0) // Start with zero width for animation
        .attr('fill', barColor)
        .style('cursor', 'pointer'); // Add cursor pointer for hover interaction

    // Transition new bars to their final width
    enterBars.transition()
        .duration(800)
        .attr('width', d => x(d.count));

    // Merge enter and update selections for attaching events
    const allBars = enterBars.merge(bars);

    // --- TOOLTIP LOGIC START ---
    allBars.on('mouseover', function(event, d) { // Use event, d for D3 v7+
            d3.select(this)
                .transition()
                .duration(100)
                .attr('fill', options.showHealthCategories ? '#3694d1' : '#e5007d'); // Highlight color swap

            // Remove any lingering tooltips first
            d3.select('#category-chart').selectAll('.chart-tooltip.category-tooltip').remove();

            // Append new tooltip div
            const tooltip = d3.select('#category-chart') // Select container
                .append('div')
                .attr('class', 'chart-tooltip category-tooltip') // Specific class
                .style('opacity', 0) // Start invisible for fade-in
                .style('position', 'absolute')
                .style('left', `10px`) // Static position as before
                .style('top', `10px`);

            // Robust tooltip content generation
            const categoryName = d && d.category ? d.category : 'Unknown Category';
            const articleCount = d && typeof d.count === 'number' ? d.count : 0;
            let percentageText = 'N/A'; // Default text

            // Calculate percentage safely using the 'data' variable (full filtered dataset)
            if (data && data.length > 0 && typeof articleCount === 'number') {
                percentageText = `${(articleCount / data.length * 100).toFixed(1)}% of selected data`;
            } else if (data && data.length === 0) {
                 // Handle case where filter yields 0 results but chart might still show old bars briefly
                percentageText = `0% (no data selected)`;
            }

            // Set tooltip HTML
            tooltip.html(`
                <div class="chart-tooltip-title">${categoryName}</div>
                <div><span class="chart-tooltip-value">${articleCount}</span> articles</div>
                <div>${percentageText}</div>
            `);

            // Fade in the tooltip
            tooltip.transition().duration(200).style('opacity', 0.95);
        })
        .on('mouseout', function() {
            // Revert bar color
            d3.select(this)
                .transition()
                .duration(100)
                .attr('fill', barColor); // Use the calculated barColor

            // Remove the tooltip
            d3.select('#category-chart').selectAll('.chart-tooltip.category-tooltip').remove();
        });
    // --- TOOLTIP LOGIC END ---

    // Handle count labels (drawn on top of bars)
    const labels = chart.selectAll('.count-label')
        .data(topCategories, d => d.category); // Key function

    // Remove old labels
    labels.exit().remove();

    // Update existing labels
    labels
        .transition()
        .duration(500)
        .attr('x', d => x(d.count) + 5)
        .attr('y', d => y(d.category) + y.bandwidth() / 2 + 4) // Adjust vertical alignment
        .text(d => d.count);

    // Add new labels
    labels.enter()
        .append('text')
        .attr('class', 'count-label')
        .attr('x', d => x(d.count) + 5)
        .attr('y', d => y(d.category) + y.bandwidth() / 2 + 4) // Adjust vertical alignment
        .text(d => d.count)
        .attr('fill', '#333')
        .attr('font-size', '10px') // Slightly smaller font for labels
        .attr('opacity', 0) // Start transparent for fade-in
        .transition()
        .duration(500)
        .delay(300) // Delay label appearance after bars
        .attr('opacity', 1);
}


/**
 * Update the top countries chart with data
 * @param {Object} chart The chart reference
 * @param {Array} data Filtered data array (this is the FULL filtered list for context)
 * @param {Object} options Chart options
 */
export function updateTopCountriesChart(chart, data, options = { mapView: false }) {
    console.log(`Updating top countries chart with ${data.length} data points`);

    // If map view is selected, show the map chart instead of bars - Placeholder for future map integration
    if (options.mapView) {
        // updateCountryMapChart(chart, data); // Call map update function if it exists
        chart.selectAll('*').remove(); // Clear bar chart elements
         chart.append('text')
             .attr('class', 'no-data-message') // Re-use class
             .attr('x', (chart.node().closest('svg').clientWidth || 500) / 2) // Approx center
             .attr('y', 130)
             .attr('text-anchor', 'middle')
             .style('font-size', '14px')
             .style('fill', '#666')
             .text('Map view placeholder');
        return;
    }

    // Count articles by country FROM THE PROVIDED DATA
    const countryCounts = {};
    data.forEach(item => {
        if (item.country && item.country.trim()) {
            const trimmedCountry = item.country.trim();
            countryCounts[trimmedCountry] = (countryCounts[trimmedCountry] || 0) + 1;
        }
    });

    // Convert to array format for D3
    const countryDataForChart = Object.entries(countryCounts).map(([country, count]) => {
        return { country, count };
    });

    // Sort by count descending and limit to top 10
    countryDataForChart.sort((a, b) => b.count - a.count);
    const topCountries = countryDataForChart.slice(0, 10);

    // Remove any existing tooltip if chart is cleared/updated
    d3.select('#top-countries-chart').selectAll('.chart-tooltip.country-tooltip').remove();

    // Set up dimensions and margins
    const margin = {top: 20, right: 30, bottom: 50, left: 110}; // Adjusted left margin for country names
    const containerWidth = document.getElementById('top-countries-chart').clientWidth || 500;
    const width = Math.max(containerWidth - margin.left - margin.right, 100);
    const height = 260 - margin.top - margin.bottom;

    // Clear previous chart elements
    chart.selectAll('*').remove();

    // Re-add axis groups
    chart.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${height})`);
    chart.append('g').attr('class', 'y-axis');

    if (topCountries.length === 0) {
         console.log("No country data to display.");
        // Show 'No data' message
        chart.append('text')
            .attr('class', 'no-data-message')
            .attr('x', width / 2)
            .attr('y', height / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('fill', '#666')
            .text('No data available for the selected filters');

        // Draw empty axes
        const x = d3.scaleLinear().domain([0, 10]).range([0, width]);
        const y = d3.scaleBand().domain([]).range([0, height]).padding(0.2);
        chart.select('.x-axis').call(d3.axisBottom(x).ticks(5));
        chart.select('.y-axis').call(d3.axisLeft(y));

        return;
    }

    // Set scales based on topCountries data
    const x = d3.scaleLinear()
        .domain([0, d3.max(topCountries, d => d.count) * 1.1]) // Padding
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(topCountries.map(d => d.country))
        .range([0, height])
        .padding(0.2);

    // Update axes with transitions
    chart.select('.x-axis')
        .transition()
        .duration(500)
        .call(d3.axisBottom(x).ticks(5));

    chart.select('.y-axis')
        .transition()
        .duration(500)
        .call(d3.axisLeft(y))
        .selectAll('text') // Style axis labels
        .style('text-anchor', 'end')
        .each(function(d) { // Add tooltips to long labels
            if (this.getComputedTextLength() > margin.left - 10) {
                d3.select(this).append("title").text(d);
            }
        });


    // Bar color
    const barColor = '#e5007d'; // Specific color for country chart

    // Handle bars with enter/update/exit pattern
    const bars = chart.selectAll('.country-bar')
        .data(topCountries, d => d.country); // Key function

    // Remove bars that are no longer in the data
    bars.exit()
        .transition()
        .duration(300)
        .attr('width', 0)
        .remove();

    // Update existing bars
    bars.transition()
        .duration(500)
        .attr('y', d => y(d.country))
        .attr('height', y.bandwidth())
        .attr('width', d => x(d.count))
        .attr('fill', barColor);

    // Add new bars with animation
    const enterBars = bars.enter()
        .append('rect')
        .attr('class', 'country-bar')
        .attr('x', 0)
        .attr('y', d => y(d.country))
        .attr('height', y.bandwidth())
        .attr('width', 0) // Start at zero width
        .attr('fill', barColor)
        .style('cursor', 'pointer'); // Add cursor pointer

    // Animate new bars
    enterBars.transition()
        .duration(800)
        .attr('width', d => x(d.count));

    // Merge enter and update selections for events
    const allBars = enterBars.merge(bars);

    // --- TOOLTIP LOGIC START ---
    allBars.on('mouseover', function(event, d) { // D3 v7+ convention
            d3.select(this)
                .transition()
                .duration(100)
                .attr('fill', '#3694d1'); // Highlight color

            // Remove any lingering tooltips first
            d3.select('#top-countries-chart').selectAll('.chart-tooltip.country-tooltip').remove();

            // Append new tooltip div
            const tooltip = d3.select('#top-countries-chart') // Select container
                .append('div')
                .attr('class', 'chart-tooltip country-tooltip') // Specific class
                .style('opacity', 0) // Start invisible for fade-in
                .style('position', 'absolute')
                .style('left', `10px`) // Static position
                .style('top', `10px`);

            // Robust tooltip content generation
            const countryName = d && d.country ? d.country : 'Unknown Country';
            const articleCount = d && typeof d.count === 'number' ? d.count : 0;
            let percentageText = 'N/A'; // Default

             // Calculate percentage safely using the 'data' variable (full filtered dataset)
            if (data && data.length > 0 && typeof articleCount === 'number') {
                percentageText = `${(articleCount / data.length * 100).toFixed(1)}% of selected data`;
            } else if (data && data.length === 0) {
                percentageText = `0% (no data selected)`;
            }


            tooltip.html(`
                <div class="chart-tooltip-title">${countryName}</div>
                <div><span class="chart-tooltip-value">${articleCount}</span> articles</div>
                <div>${percentageText}</div>
            `);

            // Fade in tooltip
            tooltip.transition().duration(200).style('opacity', .95);
        })
        .on('mouseout', function() {
            d3.select(this)
                .transition()
                .duration(100)
                .attr('fill', barColor); // Revert to original bar color

            // Remove the tooltip
            d3.select('#top-countries-chart').selectAll('.chart-tooltip.country-tooltip').remove();
        });
    // --- TOOLTIP LOGIC END ---

    // Update count labels
    const labels = chart.selectAll('.count-label')
        .data(topCountries, d => d.country); // Key function

    // Remove old labels
    labels.exit().remove();

    // Update existing labels
    labels
        .transition()
        .duration(500)
        .attr('x', d => x(d.count) + 5)
        .attr('y', d => y(d.country) + y.bandwidth() / 2 + 4) // Adjust alignment
        .text(d => d.count);

    // Add new labels
    labels.enter()
        .append('text')
        .attr('class', 'count-label')
        .attr('x', d => x(d.count) + 5)
        .attr('y', d => y(d.country) + y.bandwidth() / 2 + 4) // Adjust alignment
        .text(d => d.count)
        .attr('fill', '#333')
        .attr('font-size', '10px') // Smaller font
        .attr('opacity', 0) // Start transparent
        .transition()
        .duration(500)
        .delay(300) // Delay appearance
        .attr('opacity', 1);
}


export default {
    initializeTimeSeriesChart,
    initializeCategoryChart,
    initializeTopCountriesChart,
    updateTimeSeriesChart,
    updateCategoryChart,
    updateTopCountriesChart
    // Removed duplicate updateTimeSeriesChart export
};
