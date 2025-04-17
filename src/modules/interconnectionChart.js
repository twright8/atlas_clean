/**
 * Module for the advanced category interconnection visualization (Fixed Radial Layout)
 * Uses specific translate values for visual centering in dashboard context.
 */
import * as d3 from 'd3';

/**
 * Initialize the categories interconnection chart
 * @returns {Object} The chart reference (the main <g> element)
 */
export function initializeInterconnectionChart() {
    const container = d3.select('#interconnection-chart');
    container.select('svg').remove(); // Clear previous SVG

    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const containerElement = document.getElementById('interconnection-chart');
    const containerWidth = containerElement ? containerElement.clientWidth : 700;
    const containerHeight = 400;
    // Calculate drawing area dimensions
    const width = Math.max(containerWidth - margin.left - margin.right, 100);
    const height = Math.max(containerHeight - margin.top - margin.bottom, 100);

    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        // *** RESTORED: Translate figures as specified by user for visual centering ***
        // This positions the origin (0,0) of the chart group based on visual preference
        // rather than standard D3 drawing area centering.
        .attr('transform', `translate(${margin.left + width * 2},${margin.top + height / 3})`);

    svg.append('g').attr('class', 'links');
    svg.append('g').attr('class', 'nodes'); // Nodes group to contain circles and labels
    svg.append('g').attr('class', 'labels'); // For overall chart labels/legends
    svg.append('defs');

    // Store drawing area dimensions for update function
    svg.node()._chartWidth = width;
    svg.node()._chartHeight = height;

    return svg;
}

/**
 * Update the categories interconnection chart (Fixed Radial Layout)
 * Creates an interactive fixed radial bipartite graph showing category connections.
 * Tooltip is pinned to the bottom right and truncates long category names.
 * Uses large radius corresponding to the specific translate for visual layout.
 * @param {Object} chart The chart reference (the main <g> element from initialize)
 * @param {Array} data Filtered data array
 */
export function updateInterconnectionChart(chart, data) {
    console.log(`Updating interconnection chart with ${data.length} data points (Fixed Radial, Custom Center)`);

    const width = chart.node()._chartWidth;
    const height = chart.node()._chartHeight;
    // *** RESTORED: Large radius multiplier as preferred by user ***
    const radius = Math.min(width, height) * 1.2;

    // Clear previous elements
    chart.select('.links').selectAll('*').remove();
    chart.select('.nodes').selectAll('*').remove(); // Clear nodes group specifically
    chart.select('.labels').selectAll('*').remove();
    chart.select('defs').selectAll('*').remove();

    // --- Tooltip Setup (Pinned via CSS) ---
    const tooltipContainer = d3.select('#interconnection-chart');
    tooltipContainer.selectAll('.chart-tooltip-interconnect').remove();
    const tooltip = tooltipContainer
        .append('div')
        .attr('class', 'chart-tooltip-interconnect')
        .style('opacity', 0);

    if (!data || data.length === 0) { // No data handling
         chart.select('.labels').append('text') // Add message to labels group
            .attr('class', 'no-data-message')
            .attr('x', 0).attr('y', 0).attr('text-anchor', 'middle') // Centered relative to the (translated) group origin
            .style('font-size', '14px').style('fill', '#666')
            .text('No data available');
        return;
    }

    // --- Data Processing --- (Same as before)
    const corruptionCategories = new Map();
    const healthCategories = new Map();
    data.forEach(item => {
        if (Array.isArray(item['Corruption Categories'])) {
            item['Corruption Categories'].forEach(cat => { if (cat?.trim()) corruptionCategories.set(cat.trim(), (corruptionCategories.get(cat.trim()) || 0) + 1); });
        }
        if (Array.isArray(item['Sector Categories'])) {
            item['Sector Categories'].forEach(cat => { if (cat?.trim()) healthCategories.set(cat.trim(), (healthCategories.get(cat.trim()) || 0) + 1); });
        }
    });
    const integrityNodes = Array.from(corruptionCategories.entries()).map(([name, count]) => ({ id: name, group: 'integrity', count: count }));
    const healthNodes = Array.from(healthCategories.entries()).map(([name, count]) => ({ id: name, group: 'health', count: count }));
    const allNodes = [...integrityNodes, ...healthNodes];
    const links = [];
    integrityNodes.forEach(integrity => {
        healthNodes.forEach(health => {
            let coOccurrenceCount = 0;
            data.forEach(item => {
                const hasIntegrity = Array.isArray(item['Corruption Categories']) && item['Corruption Categories'].includes(integrity.id);
                const hasHealth = Array.isArray(item['Sector Categories']) && item['Sector Categories'].includes(health.id);
                if (hasIntegrity && hasHealth) coOccurrenceCount++;
            });
            if (coOccurrenceCount > 0) {
                 links.push({ source: integrity.id, target: health.id, value: coOccurrenceCount });
            }
        });
    });
     if (links.length === 0 && allNodes.length > 0) { /* ... no connections message ... */
        chart.select('.labels').append('text').attr('class', 'no-connections-message')
            .attr('x', 0).attr('y', 0).attr('text-anchor', 'middle')
            .style('font-size', '14px').style('fill', '#666').text('No connections found');
     }
     if (allNodes.length === 0) { /* ... no categories message ... */
        chart.select('.labels').append('text').attr('class', 'no-data-message')
            .attr('x', 0).attr('y', 0).attr('text-anchor', 'middle')
            .style('font-size', '14px').style('fill', '#666').text('No categories found');
        return;
     }

    // --- Visualization Setup ---
    const color = d3.scaleOrdinal().domain(['integrity', 'health']).range(['#3694d1', '#e5007d']);
    const maxNodeCount = d3.max(allNodes, d => d.count) || 1;
    const nodeSize = d3.scaleSqrt().domain([0, maxNodeCount]).range([3, 12]);
    const maxLinkValue = d3.max(links, d => d.value) || 1;
    const linkWidth = d3.scaleLinear().domain([0, maxLinkValue]).range([1, 7]);

    // --- Force Simulation (Collision/Charge Only) ---
    const simulation = d3.forceSimulation(allNodes)
        .force('link', d3.forceLink(links).id(d => d.id).strength(0.01))
        .force('charge', d3.forceManyBody().strength(-50))
        .force('collide', d3.forceCollide(d => nodeSize(d.count) + 15).strength(0.9));

    // --- Drawing Elements ---
    const defs = chart.select('defs');
    const linkGroup = chart.select('.links');
    const nodeGroup = chart.select('.nodes'); // Select the dedicated nodes group

    const link = linkGroup.selectAll('path').data(links).enter().append('path')
        .attr('class', 'link').style('stroke-width', d => linkWidth(d.value))
        .style('stroke-opacity', 0.5).style('fill', 'none')
        .style('stroke', d => { /* Gradient logic */
            // Ensure source/target objects exist if link data uses them
            const sourceGroup = d.source.group || allNodes.find(n => n.id === d.source)?.group;
            const targetGroup = d.target.group || allNodes.find(n => n.id === d.target)?.group;
            if (!sourceGroup || !targetGroup) return '#ccc'; // Fallback if group info is missing

            const sourceIdClean = String(d.source.id || d.source).replace(/[^a-zA-Z0-9-_]/g, '_');
            const targetIdClean = String(d.target.id || d.target).replace(/[^a-zA-Z0-9-_]/g, '_');
            const gradientId = `link-gradient-${sourceIdClean}-${targetIdClean}`;
            if (defs.select(`#${gradientId}`).empty()) {
                 const gradient = defs.append('linearGradient').attr('id', gradientId).attr('gradientUnits', 'userSpaceOnUse');
                 gradient.append('stop').attr('offset', '0%').attr('stop-color', color(sourceGroup));
                 gradient.append('stop').attr('offset', '100%').attr('stop-color', color(targetGroup));
            } return `url(#${gradientId})`;
        });

    // Create node groups
    const node = nodeGroup.selectAll('g.node').data(allNodes, d => d.id)
        .enter().append('g').attr('class', 'node');

    // Append text label WITHIN the node group
     node.append('text')
        .attr('class', 'node-label') // Add class for potential styling
        .text(d => d.id.length > 22 ? d.id.substring(0, 19) + '...' : d.id) // Truncate label on chart
        .attr('dy', d => -(nodeSize(d.count) + 8)) // Adjust vertical position
         // *** UPDATED LABEL STYLE ***
        .style('text-anchor', 'middle')
        .style('font-size', '12px') // Increased size
        .style('font-weight', 'bold') // Added boldness
        .style('fill', '#333') // Slightly darker fill
        .style('pointer-events', 'none');

    // Append circle WITHIN the node group (drawn on top of text)
    node.append('circle')
        .attr('r', d => nodeSize(d.count))
        .attr('fill', d => color(d.group))
        .style('stroke', '#fff').style('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
            // --- Highlight logic ---
             const connectedNodeIds = new Set([d.id]);
             // Ensure robust check for source/target IDs
             links.forEach(l => {
                 const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
                 const targetId = typeof l.target === 'object' ? l.target.id : l.target;
                 if (sourceId === d.id) connectedNodeIds.add(targetId);
                 else if (targetId === d.id) connectedNodeIds.add(sourceId);
             });
             link
                .filter(l => {
                    const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
                    const targetId = typeof l.target === 'object' ? l.target.id : l.target;
                    return sourceId === d.id || targetId === d.id;
                })
                .transition().duration(100).style('stroke-opacity', 0.9).style('stroke-width', l => linkWidth(l.value) + 1);
             link
                .filter(l => {
                     const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
                     const targetId = typeof l.target === 'object' ? l.target.id : l.target;
                     return sourceId !== d.id && targetId !== d.id;
                 })
                .transition().duration(100).style('stroke-opacity', 0.1);
             nodeGroup.selectAll('g.node').transition().duration(100).style('opacity', n => connectedNodeIds.has(n.id) ? 1 : 0.2);
             d3.select(this).transition().duration(100).attr('r', nodeSize(d.count) + 3).style('stroke', '#333');

            // --- Tooltip Update ---
            const tooltipMaxLength = 10;
            // *** Truncate the main title (d.id) ***
            const truncatedTitle = d.id.length > tooltipMaxLength ? d.id.substring(0, tooltipMaxLength) + '...' : d.id;
            let tooltipHtml = `<div style="font-weight: bold; margin-bottom: 5px; border-bottom: 1px solid #555;">${truncatedTitle}</div>`; // Use truncated title
            tooltipHtml += `<div>Articles: <span style="font-weight:bold;">${d.count}</span></div>`;
            // Connection list generation with truncation
            const connections = links.filter(l => {
                 const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
                 const targetId = typeof l.target === 'object' ? l.target.id : l.target;
                 return sourceId === d.id || targetId === d.id;
            });
            if (connections.length > 0) {
                tooltipHtml += `<div style="margin-top: 8px; font-weight: bold;">Connections (${connections.length}):</div><ul style="margin: 2px 0 0 0; padding-left: 18px; list-style: disc;">`;
                connections.sort((a, b) => b.value - a.value).forEach(conn => {
                    const sourceId = typeof conn.source === 'object' ? conn.source.id : conn.source;
                    const targetId = typeof conn.target === 'object' ? conn.target.id : conn.target;
                    const otherNodeId = sourceId === d.id ? targetId : sourceId;
                    const truncatedName = otherNodeId.length > tooltipMaxLength ? otherNodeId.substring(0, tooltipMaxLength) + '...' : otherNodeId;
                    tooltipHtml += `<li style="margin-bottom: 2px;">${truncatedName}: <span style="font-weight:bold;">${conn.value}</span></li>`;
                });
                tooltipHtml += `</ul>`;
            } else {
                tooltipHtml += `<div style="margin-top: 8px; font-style: italic;">No connections.</div>`;
            }
            tooltip.html(tooltipHtml);
            tooltip.transition().duration(200).style('opacity', 1);
        })
        .on('mouseout', function(event, d) { // --- Mouseout ---
             link.transition().duration(200).style('stroke-opacity', 0.5).style('stroke-width', l => linkWidth(l.value));
             nodeGroup.selectAll('g.node').transition().duration(200).style('opacity', 1);
             d3.select(this).transition().duration(100).attr('r', nodeSize(d.count)).style('stroke', '#fff');
             tooltip.transition().duration(200).style('opacity', 0);
        });


    // --- Simulation Tick (Fixed Radial Layout) ---
    simulation.on('tick', () => {
        // Calculate target positions based on angles (relative to the translated group's 0,0)
        const integrityGroup = allNodes.filter(n => n.group === 'integrity');
        const healthGroup = allNodes.filter(n => n.group === 'health');

        integrityGroup.forEach((node, i) => {
            const angleStep = Math.PI / (integrityGroup.length + 1 || 1);
            const angle = Math.PI / 2 + (i + 1) * angleStep; // Left semi-circle (90 to 270 deg)
            // Use the main radius variable
            node.x = Math.cos(angle) * radius;
            node.y = Math.sin(angle) * radius;
        });

        healthGroup.forEach((node, i) => {
            const angleStep = Math.PI / (healthGroup.length + 1 || 1);
            const angle = -Math.PI / 2 + (i + 1) * angleStep; // Right semi-circle (-90 to 90 deg)
            node.x = Math.cos(angle) * radius;
            node.y = Math.sin(angle) * radius;
        });

        // Update link paths using the calculated/adjusted d.x, d.y
        link.attr('d', d => {
            // Need source/target objects for x/y coordinates
            const sourceNode = allNodes.find(n => n.id === (d.source.id || d.source));
            const targetNode = allNodes.find(n => n.id === (d.target.id || d.target));
            if (!sourceNode?.x || !targetNode?.x) return null; // Check positions exist
            const dx = targetNode.x - sourceNode.x;
            const dy = targetNode.y - sourceNode.y;
            const dr = Math.sqrt(dx * dx + dy * dy) * 1.5;
            return `M${sourceNode.x},${sourceNode.y}A${dr},${dr} 0 0,1 ${targetNode.x},${targetNode.y}`;
         });
        // Update gradient coordinates
         link.each(function(d) {
            const sourceNode = allNodes.find(n => n.id === (d.source.id || d.source));
            const targetNode = allNodes.find(n => n.id === (d.target.id || d.target));
            if (!sourceNode?.x || !targetNode?.x) return;
            const sourceIdClean = String(sourceNode.id).replace(/[^a-zA-Z0-9-_]/g, '_');
            const targetIdClean = String(targetNode.id).replace(/[^a-zA-Z0-9-_]/g, '_');
            const gradient = defs.select(`#link-gradient-${sourceIdClean}-${targetIdClean}`);
             if (!gradient.empty()) {
                 gradient.attr('x1', sourceNode.x).attr('y1', sourceNode.y)
                         .attr('x2', targetNode.x).attr('y2', targetNode.y);
             }
         });

        // Update node group positions based on final d.x, d.y
        node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
    });

    // --- Legend --- (Positioned relative to drawing area using width/height)
    // Note: With the custom translate, these positions might need adjusting if they look off
    const legendGroup = chart.select('.labels');
    legendGroup.append('text')
        .attr('x', -width / 1.5) // Adjusted position relative to group origin
        .attr('y', -height / 2 - 15)
        .text('Integrity Categories').style('font-size', '12px')
        .style('fill', color('integrity')).style('font-weight', 'bold')
        .attr('text-anchor', 'start'); // Align left
    legendGroup.append('text')
        .attr('x', width / 1.5) // Adjusted position relative to group origin
        .attr('y', -height / 2 - 15)
        .text('Health Categories').style('font-size', '12px')
        .style('fill', color('health')).style('font-weight', 'bold')
        .attr('text-anchor', 'end'); // Align right

    // --- Run Simulation Briefly ---
    simulation.alpha(0.8).restart();
    setTimeout(() => {
        simulation.stop();
        console.log("Interconnection simulation stopped (Fixed Radial, Custom Center).");
        // Apply final positions one last time
        node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
        link.attr('d', d => {
            const sourceNode = allNodes.find(n => n.id === (d.source.id || d.source));
            const targetNode = allNodes.find(n => n.id === (d.target.id || d.target));
            if (!sourceNode?.x || !targetNode?.x) return null;
            const dx = targetNode.x - sourceNode.x;
            const dy = targetNode.y - sourceNode.y;
            const dr = Math.sqrt(dx * dx + dy * dy) * 1.5;
            return `M${sourceNode.x},${sourceNode.y}A${dr},${dr} 0 0,1 ${targetNode.x},${targetNode.y}`;
         });
    }, 2000);

}

// Export functions
export default {
    initializeInterconnectionChart,
    updateInterconnectionChart
};