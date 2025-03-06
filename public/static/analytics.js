/**
 * Analytics integration script
 * Simple version that only handles the essentials
 */

(function() {
    console.log("Analytics script loading...");
    
    // Run after the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Add a slight delay to ensure map.js has initialized
        setTimeout(setupAnalytics, 1000);
    });
    
    function setupAnalytics() {
        console.log("Setting up analytics tab");
        addTabAndContainer();
        setupClickHandlers();
    }
    
    // Add the tab button and chart container
    function addTabAndContainer() {
        // 1. Add the analytics tab button
        const switchContainer = document.querySelector('.switch-container');
        if (switchContainer && !document.getElementById('analytics-btn')) {
            const analyticsBtn = document.createElement('button');
            analyticsBtn.id = 'analytics-btn';
            analyticsBtn.className = 'switch-button';
            analyticsBtn.textContent = 'Analytics';
            switchContainer.appendChild(analyticsBtn);
            console.log("Analytics button added");
        }
        
        // 2. Create analytics container
        const mapHolder = document.getElementById('mapholder');
        if (mapHolder && !document.getElementById('analytics-container')) {
            const container = document.createElement('div');
            container.id = 'analytics-container';
            container.style.display = 'none';
            container.style.width = '100%';
            container.style.height = '500px';
            container.style.backgroundColor = '#f8f9fa';
            container.style.padding = '20px';
            container.style.border = '1px solid #ddd';
            container.style.borderRadius = '5px';
            
            // Add it to the DOM
            const shareRow = mapHolder.querySelector('.row.share');
            if (shareRow) {
                mapHolder.insertBefore(container, shareRow);
                console.log("Analytics container added");
            } else {
                mapHolder.appendChild(container);
                console.log("Analytics container added (fallback)");
            }
        }
    }
    
    // Set up click handlers for the tabs
    function setupClickHandlers() {
        // Get references to buttons
        const mapBtn = document.getElementById('map-overview-btn');
        const listBtn = document.getElementById('list-btn') || document.getElementById('cases-btn');
        const analyticsBtn = document.getElementById('analytics-btn');
        
        if (!mapBtn || !listBtn || !analyticsBtn) {
            console.error("Tab buttons not found:", mapBtn, listBtn, analyticsBtn);
            return;
        }
        
        // Add click handler for analytics tab
        analyticsBtn.addEventListener('click', function() {
            console.log("Analytics tab clicked");
            
            // Deactivate all tabs
            const allButtons = document.querySelectorAll('.switch-button');
            allButtons.forEach(btn => btn.classList.remove('active'));
            
            // Activate this tab
            analyticsBtn.classList.add('active');
            
            // Show analytics container, hide others
            const mapElement = document.getElementById('map');
            const tableElement = document.getElementById('mask');
            const analyticsElement = document.getElementById('analytics-container');
            
            if (mapElement) mapElement.style.display = 'none';
            if (tableElement) tableElement.style.display = 'none';
            if (analyticsElement) {
                analyticsElement.style.display = 'block';
                
                // Initialize or refresh chart
                if (!window.analyticsChart) {
                    initializeChart(analyticsElement);
                } else {
                    updateChart();
                }
            }
        });
        
        // Update handlers for other tabs
        mapBtn.addEventListener('click', function() {
            // Update active tab
            const allButtons = document.querySelectorAll('.switch-button');
            allButtons.forEach(btn => btn.classList.remove('active'));
            mapBtn.classList.add('active');
            
            // Show map view, hide others
            const mapElement = document.getElementById('map');
            const tableElement = document.getElementById('mask');
            const analyticsElement = document.getElementById('analytics-container');
            
            if (mapElement) mapElement.style.display = 'block';
            if (tableElement) tableElement.style.display = 'none';
            if (analyticsElement) analyticsElement.style.display = 'none';
        });
        
        listBtn.addEventListener('click', function() {
            // Update active tab
            const allButtons = document.querySelectorAll('.switch-button');
            allButtons.forEach(btn => btn.classList.remove('active'));
            listBtn.classList.add('active');
            
            // Show list view, hide others
            const mapElement = document.getElementById('map');
            const tableElement = document.getElementById('mask');
            const analyticsElement = document.getElementById('analytics-container');
            
            if (mapElement) mapElement.style.display = 'none';
            if (tableElement) tableElement.style.display = 'block';
            if (analyticsElement) analyticsElement.style.display = 'none';
        });
        
        console.log("Tab click handlers added");
    }
    
    // Initialize the chart
    function initializeChart(container) {
        console.log("Initializing chart");
        
        try {
            // Make sure D3 is available
            if (!window.d3) {
                console.error("D3 library not found");
                container.innerHTML = '<div style="color: red; text-align: center; padding: 20px;">Error: D3 library not available</div>';
                return;
            }
            
            // Chart dimensions and margins
            const margin = {top: 40, right: 150, bottom: 60, left: 80};
            const width = container.clientWidth - margin.left - margin.right;
            const height = 400;
            
            console.log("Chart dimensions:", width, "×", height);
            
            // Clear container
            container.innerHTML = '';
            
            // Create SVG
            const svg = d3.select(container)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
            
            // Add chart title
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", -margin.top / 2)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("font-weight", "bold")
                .text("Articles by Health Category Over Time");
            
            // Add axes
            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0,${height})`);
            
            svg.append("g")
                .attr("class", "y-axis");
            
            // Add axis labels
            svg.append("text")
                .attr("transform", `translate(${width/2}, ${height + 40})`)
                .attr("text-anchor", "middle")
                .text("Date");
            
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -60)
                .attr("x", -(height / 2))
                .attr("text-anchor", "middle")
                .text("Number of Articles");
            
            // Add legend placeholder
            svg.append("g")
                .attr("class", "legend")
                .attr("transform", `translate(${width + 10}, 0)`);
            
            // Store chart configuration
            window.analyticsChart = {
                container: container,
                svg: svg,
                margin: margin,
                width: width,
                height: height
            };
            
            console.log("Chart initialized, drawing data");
            
            // Draw data
            updateChart();
            
            // Handle window resize
            window.addEventListener('resize', function() {
                if (container.style.display === 'block') {
                    resizeChart();
                }
            });
        } catch (e) {
            console.error("Error initializing chart:", e);
            container.innerHTML = `<div style="color: red; text-align: center; padding: 20px;">Error initializing chart: ${e.message}</div>`;
        }
    }
    
    // Update chart with current data
    window.updateChart = function() {
        console.log("Updating chart with data");
        
        // Get chart configuration
        const chart = window.analyticsChart;
        if (!chart) {
            console.error("Chart not initialized");
            return;
        }
        
        try {
            const { svg, width, height } = chart;
            
            // Clear previous content
            svg.selectAll(".line-path, .dot-group, .no-data-message").remove();
            
            // Get data
            const data = getData();
            
            // Exit if no data
            if (!data || data.length === 0) {
                console.log("No data to display");
                svg.append("text")
                    .attr("class", "no-data-message")
                    .attr("x", width / 2)
                    .attr("y", height / 2)
                    .attr("text-anchor", "middle")
                    .style("font-size", "16px")
                    .text("No data available for the current filters");
                return;
            }
            
            console.log("Processing data:", data.length, "items");
            
            // Process data
            const dateParser = d3.timeParse("%d/%m/%y");
            const monthFormat = d3.timeFormat("%b %Y");
            
            // Get data with valid dates
            const validData = data.filter(d => {
                if (d.parsedDate) return true;
                if (d.Date) {
                    try {
                        d.parsedDate = dateParser(d.Date);
                        return !!d.parsedDate;
                    } catch (e) {
                        return false;
                    }
                }
                return false;
            });
            
            if (validData.length === 0) {
                console.log("No valid dates in data");
                svg.append("text")
                    .attr("class", "no-data-message")
                    .attr("x", width / 2)
                    .attr("y", height / 2)
                    .attr("text-anchor", "middle")
                    .style("font-size", "16px")
                    .text("No data with valid dates available");
                return;
            }
            
            console.log("Valid data:", validData.length, "items");
            
            // Group by month and category
            const nestedData = d3.nest()
                .key(d => monthFormat(d.parsedDate))
                .key(d => {
                    if (!d['Sector Categories'] || !Array.isArray(d['Sector Categories']) || d['Sector Categories'].length === 0) {
                        return "Uncategorized";
                    }
                    return d['Sector Categories'][0];
                })
                .rollup(v => v.length)
                .entries(validData);
            
            // Sort by date
            nestedData.sort((a, b) => {
                const parseMonthYear = d3.timeParse("%b %Y");
                return parseMonthYear(a.key) - parseMonthYear(b.key);
            });
            
            // Get unique categories
            const categories = new Set();
            nestedData.forEach(month => {
                month.values.forEach(category => {
                    categories.add(category.key);
                });
            });
            
            // Format data for line chart
            const lineData = Array.from(categories).map(category => {
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
                .domain([0, d3.max(lineData, d => d3.max(d.values, v => v.count)) || 10])
                .nice()
                .range([height, 0]);
            
            // Set up color scale
            const color = d3.scaleOrdinal(d3.schemeCategory10)
                .domain(Array.from(categories));
            
            // Create line generator
            const line = d3.line()
                .x(d => x(d.date) + x.bandwidth() / 2)
                .y(d => y(d.count))
                .curve(d3.curveMonotoneX);
            
            // Update x-axis
            svg.select('.x-axis')
                .call(d3.axisBottom(x))
                .selectAll('text')
                .style('text-anchor', 'end')
                .attr('dx', '-.8em')
                .attr('dy', '.15em')
                .attr('transform', 'rotate(-45)');
            
            // Update y-axis
            svg.select('.y-axis')
                .transition()
                .duration(500)
                .call(d3.axisLeft(y));
            
            // Draw lines and points
            lineData.forEach(d => {
                // Draw line
                svg.append('path')
                    .attr('class', 'line-path')
                    .datum(d.values)
                    .attr('fill', 'none')
                    .attr('stroke', color(d.category))
                    .attr('stroke-width', 2)
                    .attr('d', line);
                
                // Add dots
                const dots = svg.append('g')
                    .attr('class', 'dot-group')
                    .selectAll('.dot')
                    .data(d.values)
                    .enter().append('circle')
                    .attr('class', 'dot')
                    .attr('cx', v => x(v.date) + x.bandwidth() / 2)
                    .attr('cy', v => y(v.count))
                    .attr('r', 3) // Smaller dots
                    .attr('fill', color(d.category))
                    .attr('data-category', d.category)
                    .attr('data-date', v => v.date)
                    .attr('data-count', v => v.count);
            });
            
            // Update legend
            const legend = svg.select('.legend');
            legend.selectAll('*').remove();
            
            Array.from(categories).forEach((category, i) => {
                const legendItem = legend.append('g')
                    .attr('transform', `translate(0, ${i * 20})`);
                
                legendItem.append('rect')
                    .attr('width', 15)
                    .attr('height', 15)
                    .attr('fill', color(category));
                
                legendItem.append('text')
                    .attr('x', 20)
                    .attr('y', 12)
                    .text(category)
                    .style('font-size', '12px');
            });
            
            // Add tooltip
            let tooltip = svg.select('.tooltip');
            if (tooltip.empty()) {
                tooltip = svg.append('g')
                    .attr('class', 'tooltip')
                    .style('display', 'none');
                
                tooltip.append('rect')
                    .attr('width', 160)
                    .attr('height', 60)
                    .attr('fill', 'white')
                    .attr('stroke', '#ccc')
                    .attr('rx', 5)
                    .attr('ry', 5)
                    .style('opacity', 0.9);
                
                tooltip.append('text')
                    .attr('class', 'tooltip-category')
                    .attr('x', 10)
                    .attr('y', 20)
                    .style('font-weight', 'bold');
                
                tooltip.append('text')
                    .attr('class', 'tooltip-value')
                    .attr('x', 10)
                    .attr('y', 40);
            }
            
            // Add hover interactions
            svg.selectAll('.dot')
                .on('mouseover', function() {
                    tooltip.style('display', null);
                    
                    const category = this.getAttribute('data-category');
                    const date = this.getAttribute('data-date');
                    const count = this.getAttribute('data-count');
                    
                    tooltip.select('.tooltip-category').text(category);
                    tooltip.select('.tooltip-value').text(`${date}: ${count} articles`);
                    
                    const cx = parseFloat(this.getAttribute('cx'));
                    const cy = parseFloat(this.getAttribute('cy'));
                    
                    // Position tooltip
                    let tx = cx + 10;
                    let ty = cy - 70;
                    
                    // Keep in bounds
                    if (tx + 160 > width) tx = cx - 170;
                    if (ty < 0) ty = cy + 10;
                    
                    tooltip.attr('transform', `translate(${tx}, ${ty})`);
                })
                .on('mouseout', function() {
                    tooltip.style('display', 'none');
                });
            
            console.log("Chart updated successfully");
        } catch (e) {
            console.error("Error updating chart:", e);
            chart.container.innerHTML = `<div style="color: red; text-align: center; padding: 20px;">Error updating chart: ${e.message}</div>`;
        }
    }
    
    // Get data from application state
    function getData() {
        if (window.appState) {
            if (window.appState.filteredData && window.appState.filteredData.length > 0) {
                return window.appState.filteredData;
            }
            if (window.appState.allData && window.appState.allData.length > 0) {
                return window.appState.allData;
            }
        }
        
        // Try to get from DataTable
        try {
            const tableData = $('#dc-data-table').DataTable().data().toArray();
            if (tableData && tableData.length > 0) {
                return tableData;
            }
        } catch (e) {
            console.log("Could not get data from DataTable");
        }
        
        return null;
    }
    
    // Handle chart resizing
    function resizeChart() {
        const chart = window.analyticsChart;
        if (!chart) return;
        
        const containerWidth = chart.container.clientWidth;
        const newWidth = Math.max(300, containerWidth - chart.margin.left - chart.margin.right);
        
        // Update SVG dimensions
        d3.select(chart.container)
            .select('svg')
            .attr('width', newWidth + chart.margin.left + chart.margin.right);
        
        // Update chart width
        chart.width = newWidth;
        
        // Redraw the chart
        updateChart();
    }
    
    // A more robust filter monitoring system is implemented in extra-data-hook.js
    // This function is just a placeholder to prevent any potential errors
    function setupFilterMonitoring() {
        console.log("Deferring filter monitoring to extra-data-hook.js");
    }
    
    // We don't need to call this anymore, as extra-data-hook.js will handle it
})();
