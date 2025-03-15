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
        .style('text-anchor', 'middle')
        .text('Date');
    
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
        .style('text-anchor', 'middle')
        .text('Count');
    
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
        .style('text-anchor', 'middle')
        .text('Articles');
    
    // Add Y axis placeholder
    svg.append('g')
        .attr('class', 'y-axis');
    
    // Store reference to chart
    topCountriesChart = svg;
    return svg;
}

/**
 * Update the time series chart with data
 * @param {Object} chart The chart reference
 * @param {Array} data Filtered data array
 * @param {Object} dateRange Object with minDate and maxDate
 * @param {Object} options Chart options
 */
export function updateTimeSeriesChart(chart, data, dateRange, options = { yearly: false }) {
    // Group data by month or year based on options
    const timeFormat = options.yearly ? '%Y' : '%Y-%m';
    const displayFormat = options.yearly ? '%Y' : '%b %Y';
    
    const timeData = d3.nest()
        .key(d => {
            const date = d.parsedDate;
            return date ? d3.timeFormat(timeFormat)(date) : 'Unknown';
        })
        .rollup(v => v.length)
        .entries(data)
        .filter(d => d.key !== 'Unknown')
        .sort((a, b) => d3.ascending(a.key, b.key));
    
    if (timeData.length === 0) {
        // Clear the chart if no data
        chart.selectAll('.line-path, .data-point, .hover-area, .annotation, .grid-lines line').remove();
        
        // Show 'No data' message
        if (chart.select('.no-data-message').empty()) {
            chart.append('text')
                .attr('class', 'no-data-message')
                .attr('x', chart.node().getBBox().width / 2)
                .attr('y', chart.node().getBBox().height / 2)
                .attr('text-anchor', 'middle')
                .style('font-size', '14px')
                .style('fill', '#666')
                .text('No data available for the selected filters');
        }
        return;
    } else {
        // Remove 'No data' message if it exists
        chart.select('.no-data-message').remove();
    }
    
    // Convert string dates back to Date objects for the chart
    timeData.forEach(d => {
        if (options.yearly) {
            // For yearly view, set to January 1st of the year
            d.date = d3.timeParse('%Y')(d.key);
        } else {
            // For monthly view, set to the 1st of the month
            d.date = d3.timeParse('%Y-%m')(d.key);
        }
    });
    
    // Set up dimensions and margins
    const margin = {top: 20, right: 30, bottom: 60, left: 60};
    const containerWidth = document.getElementById('time-series-chart').clientWidth || 500;
    const width = Math.max(containerWidth - margin.left - margin.right, 100);
    const height = 260 - margin.top - margin.bottom;
    
    // Set scales
    const x = d3.scaleTime()
        .domain(d3.extent(timeData, d => d.date))
        .range([0, width])
        .nice();
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(timeData, d => d.value) * 1.1])
        .range([height, 0])
        .nice();
    
    // Update axes
    chart.select('.x-axis')
        .transition()
        .duration(500)
        .call(d3.axisBottom(x)
            .ticks(options.yearly ? timeData.length : Math.min(timeData.length, 12))
            .tickFormat(d3.timeFormat(displayFormat)))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)');
    
    chart.select('.y-axis')
        .transition()
        .duration(500)
        .call(d3.axisLeft(y).ticks(5));
    
    // Update grid lines
    const gridLines = chart.select('.grid-lines').selectAll('line.horizontal')
        .data(y.ticks(5));
    
    gridLines.exit().remove();
    
    gridLines.enter()
        .append('line')
        .attr('class', 'horizontal')
        .merge(gridLines)
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', d => y(d))
        .attr('y2', d => y(d));
    
    // Remove existing elements
    chart.selectAll('.line-path, .area-path, .data-point, .hover-area, .annotation').remove();
    
    // Add area underneath the line
    const area = d3.area()
        .x(d => x(d.date))
        .y0(height)
        .y1(d => y(d.value))
        .curve(d3.curveMonotoneX);
    
    chart.append('path')
        .datum(timeData)
        .attr('class', 'area-path')
        .attr('fill', 'rgba(54, 148, 209, 0.1)')
        .attr('d', area);
    
    // Create line
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value))
        .curve(d3.curveMonotoneX);
    
    // Add line with animation
    const path = chart.append('path')
        .datum(timeData)
        .attr('class', 'line-path')
        .attr('fill', 'none')
        .attr('stroke', '#3694d1')
        .attr('stroke-width', 3)
        .attr('d', line);
    
    // Animate the line
    const pathLength = path.node().getTotalLength();
    
    path
        .attr('stroke-dasharray', pathLength + ' ' + pathLength)
        .attr('stroke-dashoffset', pathLength)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);
    
    // Add data points with animation
    chart.selectAll('.data-point')
        .data(timeData)
        .enter()
        .append('circle')
        .attr('class', 'data-point')
        .attr('cx', d => x(d.date))
        .attr('cy', d => y(d.value))
        .attr('r', 0)
        .attr('fill', '#e5007d')
        .transition()
        .delay((d, i) => i * 50)
        .duration(500)
        .attr('r', 5);
    
    // Add hover area with improved tooltips
    chart.append('g')
        .attr('class', 'hover-area')
        .selectAll('rect')
        .data(timeData)
        .enter()
        .append('rect')
        .attr('x', d => x(d.date) - width / (2 * timeData.length))
        .attr('y', 0)
        .attr('width', width / timeData.length)
        .attr('height', height)
        .attr('fill', 'transparent')
        .on('mouseover', function(d) {
            // Highlight the point
            d3.select(this.parentNode.parentNode)
                .selectAll('.data-point')
                .filter(point => point.key === d.key)
                .transition()
                .duration(100)
                .attr('r', 7)
                .attr('fill', '#ff4081');
            
            const tooltip = d3.select('#time-series-chart')
                .append('div')
                .attr('class', 'chart-tooltip')
                .style('position', 'absolute')
                .style('left', `${d3.event.pageX - d3.select('#time-series-chart').node().getBoundingClientRect().left}px`)
                .style('top', `${d3.event.pageY - d3.select('#time-series-chart').node().getBoundingClientRect().top - 60}px`);
            
            const formatDate = options.yearly ? '%Y' : '%B %Y';
            
            tooltip.html(`
                <div class="chart-tooltip-title">${d3.timeFormat(formatDate)(d.date)}</div>
                <div><span class="chart-tooltip-value">${d.value}</span> articles</div>
                <div>${Math.round(d.value / data.length * 100)}% of selected data</div>
            `);
        })
        .on('mouseout', function() {
            // Restore point style
            d3.select(this.parentNode.parentNode)
                .selectAll('.data-point')
                .transition()
                .duration(100)
                .attr('r', 5)
                .attr('fill', '#e5007d');
            
            d3.selectAll('.chart-tooltip').remove();
        });
    
    // Add annotation for max value
    const maxPoint = timeData.reduce((max, current) => 
        current.value > max.value ? current : max, timeData[0]);
    
    chart.append('circle')
        .attr('class', 'annotation')
        .attr('cx', x(maxPoint.date))
        .attr('cy', y(maxPoint.value))
        .attr('r', 7)
        .attr('fill', 'none')
        .attr('stroke', '#e5007d')
        .attr('stroke-width', 2)
        .attr('opacity', 0)
        .transition()
        .delay(1200)
        .duration(300)
        .attr('opacity', 1);
    
    chart.append('text')
        .attr('class', 'annotation')
        .attr('x', x(maxPoint.date))
        .attr('y', y(maxPoint.value) - 15)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#e5007d')
        .text(`Peak: ${maxPoint.value}`)
        .attr('opacity', 0)
        .transition()
        .delay(1200)
        .duration(300)
        .attr('opacity', 1);
}

/**
 * Update the category breakdown chart with data
 * @param {Object} chart The chart reference
 * @param {Array} data Filtered data array
 * @param {Object} options Chart options
 */
export function updateCategoryChart(chart, data, options = { showHealthCategories: false }) {
    // Determine which category type to show based on options
    const categoryType = options.showHealthCategories ? 'Sector Categories' : 'Corruption Categories';
    
    // Update chart title to reflect current view
    d3.select('#category-breakdown-card .card-header h3')
        .text(options.showHealthCategories ? 'Health Sector Categories' : 'Integrity Issues Categories');
    
    // Flatten and count all selected categories
    const categoryData = [];
    const categoryCounts = {};
    
    data.forEach(item => {
        if (Array.isArray(item[categoryType])) {
            item[categoryType].forEach(category => {
                if (category && category.trim()) {
                    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
                }
            });
        }
    });
    
    // Convert to array format for D3
    Object.entries(categoryCounts).forEach(([category, count]) => {
        categoryData.push({ category, count });
    });
    
    // Sort by count descending
    categoryData.sort((a, b) => b.count - a.count);
    
    // Get top 10 categories (or all if fewer than 10)
    const topCategories = categoryData.slice(0, 10);
    
    if (topCategories.length === 0) {
        // Clear the chart if no data
        chart.selectAll('.category-bar, .count-label').remove();
        
        // Show 'No data' message
        if (chart.select('.no-data-message').empty()) {
            chart.append('text')
                .attr('class', 'no-data-message')
                .attr('x', chart.node().getBBox().width / 2)
                .attr('y', chart.node().getBBox().height / 2)
                .attr('text-anchor', 'middle')
                .style('font-size', '14px')
                .style('fill', '#666')
                .text('No data available for the selected filters');
        }
        return;
    } else {
        // Remove 'No data' message if it exists
        chart.select('.no-data-message').remove();
    }
    
    // Set up dimensions and margins
    const margin = {top: 20, right: 30, bottom: 50, left: 160};
    const containerWidth = document.getElementById('category-chart').clientWidth || 500;
    const width = Math.max(containerWidth - margin.left - margin.right, 100);
    const height = 260 - margin.top - margin.bottom;
    
    // Set scales
    const x = d3.scaleLinear()
        .domain([0, d3.max(topCategories, d => d.count) * 1.1])
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
        .selectAll('text')
        .style('text-anchor', 'end');
    
    // Set bar color based on category type
    const barColor = options.showHealthCategories ? '#e5007d' : '#3694d1';
    
    // Handle bars with enter/update/exit pattern
    const bars = chart.selectAll('.category-bar')
        .data(topCategories, d => d.category);
    
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
    bars.enter()
        .append('rect')
        .attr('class', 'category-bar')
        .attr('x', 0)
        .attr('y', d => y(d.category))
        .attr('height', y.bandwidth())
        .attr('width', 0)
        .attr('fill', barColor)
        .transition()
        .duration(800)
        .attr('width', d => x(d.count));
    
    // Handle interactive hover effects
    chart.selectAll('.category-bar')
        .on('mouseover', function(d) {
            d3.select(this)
                .transition()
                .duration(100)
                .attr('fill', options.showHealthCategories ? '#3694d1' : '#e5007d');
            
            const tooltip = d3.select('#category-chart')
                .append('div')
                .attr('class', 'chart-tooltip')
                .style('position', 'absolute')
                .style('left', `${d3.event.pageX - d3.select('#category-chart').node().getBoundingClientRect().left}px`)
                .style('top', `${d3.event.pageY - d3.select('#category-chart').node().getBoundingClientRect().top - 40}px`);
            
            tooltip.html(`
                <div class="chart-tooltip-title">${d.category}</div>
                <div><span class="chart-tooltip-value">${d.count}</span> articles</div>
                <div>${(d.count / data.length * 100).toFixed(1)}% of selected data</div>
            `);
        })
        .on('mouseout', function() {
            d3.select(this)
                .transition()
                .duration(100)
                .attr('fill', barColor);
            
            d3.selectAll('.chart-tooltip').remove();
        });
    
    // Update count labels
    const labels = chart.selectAll('.count-label')
        .data(topCategories, d => d.category);
    
    // Remove old labels
    labels.exit().remove();
    
    // Update existing labels
    labels
        .transition()
        .duration(500)
        .attr('x', d => x(d.count) + 5)
        .attr('y', d => y(d.category) + y.bandwidth() / 2 + 5)
        .text(d => d.count);
    
    // Add new labels
    labels.enter()
        .append('text')
        .attr('class', 'count-label')
        .attr('x', d => x(d.count) + 5)
        .attr('y', d => y(d.category) + y.bandwidth() / 2 + 5)
        .text(d => d.count)
        .attr('fill', '#333')
        .attr('font-size', '12px')
        .attr('opacity', 0)
        .transition()
        .duration(500)
        .attr('opacity', 1);
}

/**
 * Update the top countries chart with data
 * @param {Object} chart The chart reference
 * @param {Array} data Filtered data array
 * @param {Object} options Chart options
 */
export function updateTopCountriesChart(chart, data, options = { mapView: false }) {
    // If map view is selected, show the map chart instead of bars
    if (options.mapView) {
        updateCountryMapChart(chart, data);
        return;
    }
    
    // Count articles by country
    const countryData = [];
    const countryCounts = {};
    
    data.forEach(item => {
        if (item.country && item.country.trim()) {
            countryCounts[item.country] = (countryCounts[item.country] || 0) + 1;
        }
    });
    
    // Convert to array format for D3
    Object.entries(countryCounts).forEach(([country, count]) => {
        countryData.push({ country, count });
    });
    
    // Sort by count descending and limit to top 10
    countryData.sort((a, b) => b.count - a.count);
    const topCountries = countryData.slice(0, 10);
    
    if (topCountries.length === 0) {
        // Clear the chart if no data
        chart.selectAll('.country-bar, .count-label').remove();
        
        // Show 'No data' message
        if (chart.select('.no-data-message').empty()) {
            chart.append('text')
                .attr('class', 'no-data-message')
                .attr('x', chart.node().getBBox().width / 2)
                .attr('y', chart.node().getBBox().height / 2)
                .attr('text-anchor', 'middle')
                .style('font-size', '14px')
                .style('fill', '#666')
                .text('No data available for the selected filters');
        }
        return;
    } else {
        // Remove 'No data' message if it exists
        chart.select('.no-data-message').remove();
    }
    
    // Set up dimensions and margins
    const margin = {top: 20, right: 30, bottom: 50, left: 110};
    const containerWidth = document.getElementById('top-countries-chart').clientWidth || 500;
    const width = Math.max(containerWidth - margin.left - margin.right, 100);
    const height = 260 - margin.top - margin.bottom;
    
    // Set scales
    const x = d3.scaleLinear()
        .domain([0, d3.max(topCountries, d => d.count) * 1.1])
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
        .selectAll('text')
        .style('text-anchor', 'end');
    
    // Handle bars with enter/update/exit pattern
    const bars = chart.selectAll('.country-bar')
        .data(topCountries, d => d.country);
    
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
        .attr('fill', '#e5007d');
    
    // Add new bars with animation
    bars.enter()
        .append('rect')
        .attr('class', 'country-bar')
        .attr('x', 0)
        .attr('y', d => y(d.country))
        .attr('height', y.bandwidth())
        .attr('width', 0)
        .attr('fill', '#e5007d')
        .transition()
        .duration(800)
        .attr('width', d => x(d.count));
    
    // Handle interactive hover effects
    chart.selectAll('.country-bar')
        .on('mouseover', function(d) {
            d3.select(this)
                .transition()
                .duration(100)
                .attr('fill', '#3694d1');
            
            const tooltip = d3.select('#top-countries-chart')
                .append('div')
                .attr('class', 'chart-tooltip')
                .style('position', 'absolute')
                .style('left', `${d3.event.pageX - d3.select('#top-countries-chart').node().getBoundingClientRect().left}px`)
                .style('top', `${d3.event.pageY - d3.select('#top-countries-chart').node().getBoundingClientRect().top - 40}px`);
            
            tooltip.html(`
                <div class="chart-tooltip-title">${d.country}</div>
                <div><span class="chart-tooltip-value">${d.count}</span> articles</div>
                <div>${(d.count / data.length * 100).toFixed(1)}% of selected data</div>
            `);
        })
        .on('mouseout', function() {
            d3.select(this)
                .transition()
                .duration(100)
                .attr('fill', '#e5007d');
            
            d3.selectAll('.chart-tooltip').remove();
        });
    
    // Update count labels
    const labels = chart.selectAll('.count-label')
        .data(topCountries, d => d.country);
    
    // Remove old labels
    labels.exit().remove();
    
    // Update existing labels
    labels
        .transition()
        .duration(500)
        .attr('x', d => x(d.count) + 5)
        .attr('y', d => y(d.country) + y.bandwidth() / 2 + 5)
        .text(d => d.count);
    
    // Add new labels
    labels.enter()
        .append('text')
        .attr('class', 'count-label')
        .attr('x', d => x(d.count) + 5)
        .attr('y', d => y(d.country) + y.bandwidth() / 2 + 5)
        .text(d => d.count)
        .attr('fill', '#333')
        .attr('font-size', '12px')
        .attr('opacity', 0)
        .transition()
        .duration(500)
        .attr('opacity', 1);
}

/**
 * Update the countries chart with a map visualization
 * @param {Object} chart The chart reference
 * @param {Array} data Filtered data array
 */
function updateCountryMapChart(chart, data) {
    // Clear existing chart content
    chart.selectAll('*').remove();
    
    // Show message that this is just a placeholder - in a real implementation, 
    // we'd integrate with a proper map visualization
    chart.append('text')
        .attr('class', 'map-placeholder')
        .attr('x', chart.node().getBBox().width / 2)
        .attr('y', chart.node().getBBox().height / 2 - 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('fill', '#666')
        .text('Map view is active');
    
    chart.append('text')
        .attr('class', 'map-placeholder-note')
        .attr('x', chart.node().getBBox().width / 2)
        .attr('y', chart.node().getBBox().height / 2 + 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#666')
        .text('Use the main map view for more detailed geographic analysis');
    
    // Add instruction to toggle back
    chart.append('text')
        .attr('class', 'map-placeholder-instruction')
        .attr('x', chart.node().getBBox().width / 2)
        .attr('y', chart.node().getBBox().height / 2 + 40)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#3694d1')
        .text('Click the globe icon to return to bar chart view');
}

export default {
    initializeTimeSeriesChart,
    initializeCategoryChart,
    initializeTopCountriesChart,
    updateTimeSeriesChart,
    updateCategoryChart,
    updateTopCountriesChart
};
