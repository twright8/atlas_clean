/**
 * Analytics chart integration
 * This file handles the analytics chart integration with the rest of the application
 */
import { cleanupAnalyticsChart } from './analytics.js';

// Store event handler references for proper cleanup
const tabEventHandlers = new Map();

/**
 * Function to add the analytics tab
 */
export function setupAnalyticsTab() {
    // Add the analytics button if it doesn't exist already
    if (!document.getElementById('analytics-btn')) {
        // Get the switch container
        const switchContainer = document.querySelector('.switch-container');
        
        // Find existing buttons
        const mapBtn = document.getElementById('map-overview-btn');
        const listBtn = document.querySelector('.switch-button:not(#map-overview-btn)');
        
        // Add the analytics button if the container exists
        if (switchContainer && mapBtn && listBtn) {
            // Create new button
            const analyticsBtn = document.createElement('button');
            analyticsBtn.id = 'analytics-btn';
            analyticsBtn.className = 'switch-button';
            analyticsBtn.textContent = 'Analytics';
            
            // Add it after the list button
            switchContainer.appendChild(analyticsBtn);
            
            // Create event handlers with proper cleanup
            const handleAnalyticsClick = function() {
                switchView('analytics', analyticsBtn);
            };
            
            const handleMapClick = function() {
                switchView('map', mapBtn);
            };
            
            const handleListClick = function() {
                switchView('list', listBtn);
            };
            
            // Store handlers for later cleanup
            tabEventHandlers.set(analyticsBtn, handleAnalyticsClick);
            tabEventHandlers.set(mapBtn, handleMapClick);
            tabEventHandlers.set(listBtn, handleListClick);
            
            // Set up the click handlers
            analyticsBtn.addEventListener('click', handleAnalyticsClick);
            mapBtn.addEventListener('click', handleMapClick);
            listBtn.addEventListener('click', handleListClick);
        }
    }
    
    // Create the analytics container if it doesn't exist
    if (!document.getElementById('analytics-container')) {
        const mapHolder = document.getElementById('mapholder');
        
        if (mapHolder) {
            // Find where to insert the analytics container
            const mapElement = document.getElementById('map');
            const maskElement = document.getElementById('mask');
            
            if (mapElement && maskElement) {
                // Create analytics container
                const analyticsContainer = document.createElement('div');
                analyticsContainer.id = 'analytics-container';
                analyticsContainer.style.display = 'none';
                analyticsContainer.style.width = '100%';
                analyticsContainer.style.height = 'auto'; // Let height adjust based on content
                analyticsContainer.style.minHeight = '400px'; // Minimum height
                analyticsContainer.style.maxHeight = '800px'; // Maximum height
                analyticsContainer.style.padding = '20px 0';
                
                // Insert after mask element
                maskElement.after(analyticsContainer);
            }
        }
    }
}

/**
 * Switch between different views (map, list, analytics)
 * @param {string} view - The view to switch to
 * @param {Element} activeButton - The button to make active
 */
function switchView(view, activeButton) {
    try {
        // Remove active class from all buttons
        document.querySelectorAll('.switch-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to the active button
        activeButton.classList.add('active');
        
        // Get containers
        const mapElement = document.getElementById('map');
        const maskElement = document.getElementById('mask');
        const analyticsContainer = document.getElementById('analytics-container');
        
        // Hide all views first
        if (mapElement) mapElement.style.display = 'none';
        if (maskElement) maskElement.style.display = 'none';
        if (analyticsContainer) analyticsContainer.style.display = 'none';
        
        // Show the selected view
        switch(view) {
            case 'map':
                if (mapElement) mapElement.style.display = 'block';
                break;
            case 'list':
                if (maskElement) maskElement.style.display = 'block';
                break;
            case 'analytics':
                if (analyticsContainer) {
                    analyticsContainer.style.display = 'block';
                    
                    // Trigger resize event to ensure chart displays properly
                    window.dispatchEvent(new Event('resize'));
                    
                    // Update chart if we have the state function
                    if (window.appState && window.appState.updateAnalyticsChart) {
                        window.appState.updateAnalyticsChart();
                    }
                }
                break;
        }
        
        // Clean up resources when leaving analytics view
        if (view !== 'analytics' && window.appState && window.appState.analyticsChart) {
            cleanupAnalyticsChart(window.appState.analyticsChart);
        }
    } catch (error) {
        console.error('Error switching views:', error);
    }
}

/**
 * Clean up all event listeners and resources
 */
export function cleanupAnalyticsTabs() {
    try {
        // Remove all stored event handlers
        tabEventHandlers.forEach((handler, element) => {
            if (element && typeof element.removeEventListener === 'function') {
                element.removeEventListener('click', handler);
            }
        });
        
        // Clear the handlers map
        tabEventHandlers.clear();
        
        // Clean up chart resources
        if (window.appState && window.appState.analyticsChart) {
            cleanupAnalyticsChart(window.appState.analyticsChart);
        }
    } catch (error) {
        console.error('Error cleaning up analytics tabs:', error);
    }
}
