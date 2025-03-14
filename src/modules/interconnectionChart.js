/**
 * Module for the advanced category interconnection visualization
 */
import * as d3 from 'd3';

/**
 * Initialize the categories interconnection chart
 * @returns {Object} The chart reference
 */
export function initializeInterconnectionChart() {
    const container = d3.select('#interconnection-chart');
    
    // Set up dimensions and margins
    const margin = {top: 40, right: 40, bottom: 40, left: 40};
    const containerWidth = document.getElementById('interconnection-chart').clientWidth || 500;
    const containerHeight = 300;
    const width = Math.max(containerWidth - margin.left - margin.right, 100);
    const height = containerHeight - margin.top - margin.bottom;
    
    // Create SVG
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${width/2 + margin.left},${height/2 + margin.top})`);
    
    // Add placeholder text
    svg.append('text')
        .attr('class', 'placeholder-text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', '#666')
        .text('Loading interconnection visualization...');
    
    return svg;
}

/**
 * Update the categories interconnection chart
 * This creates an interactive radial bubble visualization showing how categories interconnect
 * @param {Object} chart The chart reference
 * @param {Array} data Filtered data array
 */
export function updateInterconnectionChart(chart, data) {
    // Clear existing content
    chart.selectAll('*').remove();
    
    if (data.length === 0) {
        chart.append('text')
            .attr('class', 'no-data-message')
            .attr('x', 0)
            .attr('y', 0)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('fill', '#666')
            .text('No data available for the selected filters');
        return;
    }
    
    // Extract unique corruption and health categories
    const corruptionCategories = new Set();
    const healthCategories = new Set();
    
    data.forEach(item => {
        if (Array.isArray(item['Corruption Categories'])) {
            item['Corruption Categories'].forEach(cat => {
                if (cat && cat.trim()) corruptionCategories.add(cat);
            });
        }
        
        if (Array.isArray(item['Sector Categories'])) {
            item['Sector Categories'].forEach(cat => {
                if (cat && cat.trim()) healthCategories.add(cat);
            });
        }
    });
    
    // Convert to arrays and get top categories
    const getTopCategories = (categorySet, data, categoryType, limit = 5) => {
        const counts = {};
        Array.from(categorySet).forEach(cat => {
            counts[cat] = 0;
            data.forEach(item => {
                if (Array.isArray(item[categoryType]) && item[categoryType].includes(cat)) {
                    counts[cat]++;
                }
            });
        });
        
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([name, count]) => ({ name, count, type: categoryType }));
    };
    
    const topIntegrityCategories = getTopCategories(corruptionCategories, data, 'Corruption Categories', 5);
    const topHealthCategories = getTopCategories(healthCategories, data, 'Sector Categories', 5);
    
    // Create nodes and connections for visualization
    // Format for our node visualization
    const nodes = [];
    const links = [];
    
    // Create connections (links) matrix between corruption and health categories
    topIntegrityCategories.forEach(integrity => {
        topHealthCategories.forEach(health => {
            let coOccurrenceCount = 0;
            
            // Count co-occurrences in articles
            data.forEach(item => {
                const hasIntegrity = Array.isArray(item['Corruption Categories']) && 
                    item['Corruption Categories'].includes(integrity.name);
                const hasHealth = Array.isArray(item['Sector Categories']) && 
                    item['Sector Categories'].includes(health.name);
                
                if (hasIntegrity && hasHealth) {
                    coOccurrenceCount++;
                }
            });
            
            if (coOccurrenceCount > 0) {
                links.push({
                    source: integrity.name,
                    target: health.name,
                    value: coOccurrenceCount
                });
            }
        });
        
        nodes.push({
            id: integrity.name,
            group: 'integrity',
            count: integrity.count
        });
    });
    
    topHealthCategories.forEach(health => {
        nodes.push({
            id: health.name,
            group: 'health',
            count: health.count
        });
    });
    
    // If no connections found, show message
    if (links.length === 0) {
        chart.append('text')
            .attr('class', 'no-data-message')
            .attr('x', 0)
            .attr('y', 0)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('fill', '#666')
            .text('No category connections found in the selected data');
        return;
    }
    
    // Get dimensions
    const containerWidth = document.getElementById('interconnection-chart').clientWidth || 600;
    const containerHeight = 300;
    const width = containerWidth;
    const height = containerHeight;
    
    // Create a radial layout
    const radius = Math.min(width, height) * 0.4;
    
    // Define color scale for nodes
    const color = d3.scaleOrdinal()
        .domain(['integrity', 'health'])
        .range(['#3694d1', '#e5007d']);
    
    // Define node size scale
    const nodeSize = d3.scaleLinear()
        .domain([0, d3.max(nodes, d => d.count)])
        .range([5, 15]);
    
    // Define link width scale
    const linkWidth = d3.scaleLinear()
        .domain([0, d3.max(links, d => d.value)])
        .range([1, 5]);
    
    // Create force simulation for node placement
    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(radius * 0.7))
        .force('charge', d3.forceManyBody().strength(-50))
        .force('center', d3.forceCenter(0, 0))
        .force('collide', d3.forceCollide().radius(d => nodeSize(d.count) + 5));
    
    // Add center circle as guide
    chart.append('circle')
        .attr('r', radius)
        .style('fill', 'none')
        .style('stroke', '#eee')
        .style('stroke-width', 1)
        .style('stroke-dasharray', '3,3');
    
    // Create links with gradients for better visual effect
    const link = chart.append('g')
        .attr('class', 'links')
        .selectAll('path')
        .data(links)
        .enter().append('path')
        .attr('class', 'link')
        .style('stroke', d => {
            // Create unique gradient ID
            const gradientId = `link-gradient-${d.source.id.replace(/\s+/g, '-')}-${d.target.id.replace(/\s+/g, '-')}`;
            
            // Define gradient
            const gradient = chart.append('defs')
                .append('linearGradient')
                .attr('id', gradientId)
                .attr('gradientUnits', 'userSpaceOnUse');
            
            // Add gradient stops
            gradient.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', color('integrity'));
            
            gradient.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', color('health'));
            
            return `url(#${gradientId})`;
        })
        .style('stroke-width', d => linkWidth(d.value))
        .style('stroke-opacity', 0.6)
        .style('fill', 'none');
    
    // Create nodes
    const node = chart.append('g')
        .attr('class', 'nodes')
        .selectAll('g')
        .data(nodes)
        .enter().append('g')
        .attr('class', 'node');
    
    // Add circles to nodes
    node.append('circle')
        .attr('r', d => nodeSize(d.count))
        .attr('fill', d => color(d.group))
        .style('stroke', '#fff')
        .style('stroke-width', 1.5)
        .style('cursor', 'pointer')
        .on('mouseover', function(d) {
            // Highlight connected links and nodes
            const connectedNodeIds = links
                .filter(link => link.source.id === d.id || link.target.id === d.id)
                .map(link => link.source.id === d.id ? link.target.id : link.source.id);
            
            d3.selectAll('.link')
                .style('stroke-opacity', l => 
                    (l.source.id === d.id || l.target.id === d.id) ? 1 : 0.1);
            
            d3.selectAll('.node circle')
                .style('opacity', n => 
                    (n.id === d.id || connectedNodeIds.includes(n.id)) ? 1 : 0.2);
            
            d3.selectAll('.node text')
                .style('opacity', n => 
                    (n.id === d.id || connectedNodeIds.includes(n.id)) ? 1 : 0.2);
            
            // Show tooltip
            const tooltip = d3.select('#interconnection-chart')
                .append('div')
                .attr('class', 'chart-tooltip')
                .style('position', 'absolute')
                .style('left', `${d3.event.pageX - d3.select('#interconnection-chart').node().getBoundingClientRect().left}px`)
                .style('top', `${d3.event.pageY - d3.select('#interconnection-chart').node().getBoundingClientRect().top - 40}px`);
            
            const connectionCount = links
                .filter(link => link.source.id === d.id || link.target.id === d.id)
                .length;
            
            tooltip.html(`
                <div class="chart-tooltip-title">${d.id}</div>
                <div><span class="chart-tooltip-value">${d.count}</span> articles</div>
                <div>Connected to ${connectionCount} ${d.group === 'integrity' ? 'health' : 'integrity'} categories</div>
            `);
        })
        .on('mouseout', function() {
            // Restore all elements
            d3.selectAll('.link').style('stroke-opacity', 0.6);
            d3.selectAll('.node circle').style('opacity', 1);
            d3.selectAll('.node text').style('opacity', 1);
            
            // Remove tooltip
            d3.selectAll('.chart-tooltip').remove();
        });
    
    // Add labels to nodes
    node.append('text')
        .text(d => d.id.length > 15 ? d.id.substring(0, 12) + '...' : d.id)
        .attr('dy', d => nodeSize(d.count) + 12)
        .style('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('fill', d => d3.rgb(color(d.group)).darker())
        .style('pointer-events', 'none')
        .style('font-weight', 'bold');
    
    // Add highlight circles to highlight category types
    chart.append('text')
        .attr('x', -radius - 30)
        .attr('y', -radius + 15)
        .text('Integrity Categories')
        .style('font-size', '11px')
        .style('fill', color('integrity'))
        .style('font-weight', 'bold');
    
    chart.append('text')
        .attr('x', radius - 50)
        .attr('y', -radius + 15)
        .text('Health Categories')
        .style('font-size', '11px')
        .style('fill', color('health'))
        .style('font-weight', 'bold');
    
    // Add animation for links
    link.attr('stroke-dasharray', function() {
            const length = this.getTotalLength();
            return `${length} ${length}`;
        })
        .attr('stroke-dashoffset', function() {
            return this.getTotalLength();
        })
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);
    
    // Initial animation for nodes
    node.attr('opacity', 0)
        .transition()
        .delay((d, i) => i * 50)
        .duration(500)
        .attr('opacity', 1);
    
    // Update position function for simulation
    simulation.on('tick', () => {
        // Position nodes in a radial layout
        nodes.forEach(node => {
            if (node.group === 'integrity') {
                // Position integrity categories on the left side
                const angle = Math.PI + Math.random() * Math.PI - Math.PI/2;
                node.x = Math.cos(angle) * radius * 0.8;
                node.y = Math.sin(angle) * radius * 0.8;
            } else {
                // Position health categories on the right side
                const angle = Math.random() * Math.PI - Math.PI/2;
                node.x = Math.cos(angle) * radius * 0.8;
                node.y = Math.sin(angle) * radius * 0.8;
            }
        });
        
        // Update link paths
        link.attr('d', d => {
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const dr = Math.sqrt(dx * dx + dy * dy) * 1.5; // Adjust curve
            return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
        });
        
        // Update node positions
        node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
    
    // Run simulation for a short time then stop
    simulation.alpha(1).restart();
    setTimeout(() => simulation.stop(), 2000);
}
