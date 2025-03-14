/**
 * Module for dashboard chart visualizations
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
    const margin = {top: 20, right: 30, bottom: 50, left: 60};
    const containerWidth = document.getElementById('time-series-chart').clientWidth || 500;
    const width = Math.max(containerWidth - margin.left - margin.right, 100);
    const height = 250 - margin.top - margin.bottom;
    
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
    const height = 250 - margin.top - margin.bottom;
    
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
    const margin = {top: 20, right: 30, bottom: 50, left: 100};
    const containerWidth = document.getElementById('top-countries-chart').clientWidth || 500;
    const width = Math.max(containerWidth - margin.left - margin.right, 100);
    const height = 250 - margin.top - margin.bottom;
    
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
 */
export function updateTimeSeriesChart(chart, data, dateRange) {
    // Group data by month
    const timeData = d3.nest()
        .key(d => {
            const date = d.parsedDate;
            return date ? d3.timeFormat('%Y-%m')(date) : 'Unknown';
        })
        .rollup(v => v.length)
        .entries(data)
        .filter(d => d.key !== 'Unknown')
        .sort((a, b) => d3.ascending(a.key, b.key));
    
    if (timeData.length === 0) return;
    
    // Convert string dates back to Date objects for the chart
    timeData.forEach(d => {
        d.date = d3.timeParse('%Y-%m')(d.key);
    });
    
    // Set up dimensions and margins
    const margin = {top: 20, right: 30, bottom: 50, left: 60};
    const containerWidth = document.getElementById('time-series-chart').clientWidth || 500;
    const width = Math.max(containerWidth - margin.left - margin.right, 100);
    const height = 250 - margin.top - margin.bottom;
    
    // Set scales
    const x = d3.scaleTime()
        .domain(d3.extent(timeData, d => d.date))
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(timeData, d => d.value) * 1.1])
        .range([height, 0]);
    
    // Update axes
    chart.select('.x-axis')
        .call(d3.axisBottom(x)
            .ticks(Math.min(timeData.length, 10))
            .tickFormat(d3.timeFormat('%b %Y')))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)');
    
    chart.select('.y-axis')
        .call(d3.axisLeft(y));
    
    // Remove existing line and dots
    chart.selectAll('.line-path').remove();
    chart.selectAll('.data-point').remove();
    chart.selectAll('.hover-area').remove();
    
    // Create line
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value))
        .curve(d3.curveMonotoneX);
    
    chart.append('path')
        .datum(timeData)
        .attr('class', 'line-path')
        .attr('fill', 'none')
        .attr('stroke', '#3694d1')
        .attr('stroke-width', 2)
        .attr('d', line);
    
    // Add data points
    chart.selectAll('.data-point')
        .data(timeData)
        .enter()
        .append('circle')
        .attr('class', 'data-point')
        .attr('cx', d => x(d.date))
        .attr('cy', d => y(d.value))
        .attr('r', 4)
        .attr('fill', '#e5007d');
    
    // Add hover area with tooltips
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
            const tooltip = d3.select('#time-series-chart')
                .append('div')
                .attr('class', 'chart-tooltip')
                .style('position', 'absolute')
                .style('background', 'rgba(255,255,255,0.9)')
                .style('padding', '8px')
                .style('border-radius', '4px')
                .style('border', '1px solid #ddd')
                .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
                .style('pointer-events', 'none')
                .style('z-index', 999)
                .style('left', `${d3.event.pageX - d3.select('#time-series-chart').node().getBoundingClientRect().left}px`)
                .style('top', `${d3.event.pageY - d3.select('#time-series-chart').node().getBoundingClientRect().top - 40}px`);
            
            tooltip.html(`
                <div><strong>${d3.timeFormat('%B %Y')(d.date)}</strong></div>
                <div>Articles: ${d.value}</div>
            `);
        })
        .on('mouseout', function() {
            d3.selectAll('.chart-tooltip').remove();
        });
}

/**
 * Update the category breakdown chart with data
 * @param {Object} chart The chart reference
 * @param {Array} data Filtered data array
 */
export function updateCategoryChart(chart, data) {
    // Flatten and count all corruption categories
    const categoryData = [];
    const categoryCounts = {};
    
    data.forEach(item => {
        if (Array.isArray(item['Corruption Categories'])) {
            item['Corruption Categories'].forEach(category => {
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
    
    // Sort by count descending and limit to top 10
    categoryData.sort((a, b) => b.count - a.count);
    const topCategories = categoryData.slice(0, 10);
    
    if (topCategories.length === 0) return;
    
    // Set up dimensions and margins
    const margin = {top: 20, right: 30, bottom: 50, left: 160};
    const containerWidth = document.getElementById('category-chart').clientWidth || 500;
    const width = Math.max(containerWidth - margin.left - margin.right, 100);
    const height = 250 - margin.top - margin.bottom;
    
    // Set scales
    const x = d3.scaleLinear()
        .domain([0, d3.max(topCategories, d => d.count) * 1.1])
        .range([0, width]);
    
    const y = d3.scaleBand()
        .domain(topCategories.map(d => d.category))
        .range([0, height])
        .padding(0.1);
    
    // Update axes
    chart.select('.x-axis')
        .call(d3.axisBottom(x).ticks(5));
    
    chart.select('.y-axis')
        .call(d3.axisLeft(y))
        .selectAll('text')
        .style('text-anchor', 'end');
    
    // Remove existing bars
    chart.selectAll('.category-bar').remove();
    
    // Create bars
    chart.selectAll('.category-bar')
        .data(topCategories)
        .enter()
        .append('rect')
        .attr('class', 'category-bar')
        .attr('x', 0)
        .attr('y', d => y(d.category))
        .attr('width', d => x(d.count))
        .attr('height', y.bandwidth())
        .attr('fill', '#3694d1')
        .on('mouseover', function(d) {
            d3.select(this).attr('fill', '#e5007d');
            
            const tooltip = d3.select('#category-chart')
                .append('div')
                .attr('class', 'chart-tooltip')
                .style('position', 'absolute')
                .style('background', 'rgba(255,255,255,0.9)')
                .style('padding', '8px')
                .style('border-radius', '4px')
                .style('border', '1px solid #ddd')
                .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
                .style('pointer-events', 'none')
                .style('z-index', 999)
                .style('left', `${d3.event.pageX - d3.select('#category-chart').node().getBoundingClientRect().left}px`)
                .style('top', `${d3.event.pageY - d3.select('#category-chart').node().getBoundingClientRect().top - 40}px`);
            
            tooltip.html(`
                <div><strong>${d.category}</strong></div>
                <div>Articles: ${d.count}</div>
                <div>Percentage: ${(d.count / data.length * 100).toFixed(1)}%</div>
            `);
        })
        .on('mouseout', function() {
            d3.select(this).attr('fill', '#3694d1');
            d3.selectAll('.chart-tooltip').remove();
        });
    
    // Add count labels
    chart.selectAll('.count-label')
        .data(topCategories)
        .enter()
        .append('text')
        .attr('class', 'count-label')
        .attr('x', d => x(d.count) + 5)
        .attr('y', d => y(d.category) + y.bandwidth() / 2 + 5)
        .text(d => d.count)
        .attr('fill', '#333')
        .attr('font-size', '12px');
}

/**
 * Update the top countries chart with data
 * @param {Object} chart The chart reference
 * @param {Array} data Filtered data array
 */
export function updateTopCountriesChart(chart, data) {
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
    
    if (topCountries.length === 0) return;
    
    // Set up dimensions and margins
    const margin = {top: 20, right: 30, bottom: 50, left: 100};
    const containerWidth = document.getElementById('top-countries-chart').clientWidth || 500;
    const width = Math.max(containerWidth - margin.left - margin.right, 100);
    const height = 250 - margin.top - margin.bottom;
    
    // Set scales
    const x = d3.scaleLinear()
        .domain([0, d3.max(topCountries, d => d.count) * 1.1])
        .range([0, width]);
    
    const y = d3.scaleBand()
        .domain(topCountries.map(d => d.country))
        .range([0, height])
        .padding(0.1);
    
    // Update axes
    chart.select('.x-axis')
        .call(d3.axisBottom(x).ticks(5));
    
    chart.select('.y-axis')
        .call(d3.axisLeft(y))
        .selectAll('text')
        .style('text-anchor', 'end');
    
    // Remove existing bars
    chart.selectAll('.country-bar').remove();
    
    // Create bars
    chart.selectAll('.country-bar')
        .data(topCountries)
        .enter()
        .append('rect')
        .attr('class', 'country-bar')
        .attr('x', 0)
        .attr('y', d => y(d.country))
        .attr('width', d => x(d.count))
        .attr('height', y.bandwidth())
        .attr('fill', '#e5007d')
        .on('mouseover', function(d) {
            d3.select(this).attr('fill', '#3694d1');
            
            const tooltip = d3.select('#top-countries-chart')
                .append('div')
                .attr('class', 'chart-tooltip')
                .style('position', 'absolute')
                .style('background', 'rgba(255,255,255,0.9)')
                .style('padding', '8px')
                .style('border-radius', '4px')
                .style('border', '1px solid #ddd')
                .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
                .style('pointer-events', 'none')
                .style('z-index', 999)
                .style('left', `${d3.event.pageX - d3.select('#top-countries-chart').node().getBoundingClientRect().left}px`)
                .style('top', `${d3.event.pageY - d3.select('#top-countries-chart').node().getBoundingClientRect().top - 40}px`);
            
            tooltip.html(`
                <div><strong>${d.country}</strong></div>
                <div>Articles: ${d.count}</div>
                <div>Percentage: ${(d.count / data.length * 100).toFixed(1)}%</div>
            `);
        })
        .on('mouseout', function() {
            d3.select(this).attr('fill', '#e5007d');
            d3.selectAll('.chart-tooltip').remove();
        });
    
    // Add count labels
    chart.selectAll('.count-label')
        .data(topCountries)
        .enter()
        .append('text')
        .attr('class', 'count-label')
        .attr('x', d => x(d.count) + 5)
        .attr('y', d => y(d.country) + y.bandwidth() / 2 + 5)
        .text(d => d.count)
        .attr('fill', '#333')
        .attr('font-size', '12px');
}

export default {
    initializeTimeSeriesChart,
    initializeCategoryChart,
    initializeTopCountriesChart,
    updateTimeSeriesChart,
    updateCategoryChart,
    updateTopCountriesChart
};
