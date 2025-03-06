/**
 * Main application entry point
 * Initializes and coordinates all components
 */
import { initializeMap, setupTileLayerErrorHandling } from './components/map-config.js';
import { initializeDataTable, updateDataTable } from './components/data-table.js';
import { initializeFilters, applyFilters, updateResetButtonVisibility } from './components/filters.js';
import { updateMapMarkers, setupMapMoveEvents } from './components/markers.js';
import { initializeUI } from './components/ui.js';
import { loadData, processData } from './components/data-loader.js';
import { extendDataTableDateSorting } from './utils/formatters.js';
import { initializeAnalyticsChart, updateAnalyticsChart, handleChartResize, cleanupAnalyticsChart } from './components/analytics.js';
import { setupAnalyticsTab, cleanupAnalyticsTabs } from './components/analytics-chart.js';

// Application state
const appState = {
    allData: [],
    filteredData: [],
    markerMap: new Map(),
    minDate: null, 
    maxDate: null,
    mapConfig: null,
    dataTable: null,
    analyticsChart: null,
    updateVisibleData: null,
    updateAnalyticsChart: null,
    // Last applied filter settings for comparison
    lastFilterSettings: null
};

// Make state available globally for components that need it
window.appState = appState;

document.addEventListener('DOMContentLoaded', function() {
    console.time('Total Initialization');
    console.log("Initialization started");
    
    // Extend DataTable functionality
    extendDataTableDateSorting(jQuery);
    
    // Initialize UI components
    initializeUI();
    
    // Setup analytics tab and container
    setupAnalyticsTab();
    
    // Initialize map
    appState.mapConfig = initializeMap();
    setupTileLayerErrorHandling(appState.mapConfig);
    
    // Initialize analytics chart
    const analyticsContainer = document.getElementById('analytics-container');
    if (analyticsContainer) {
        try {
            appState.analyticsChart = initializeAnalyticsChart(analyticsContainer);
            
            // Handle window resize for responsive chart
            const debouncedResize = debounce(function() {
                if (appState.analyticsChart) {
                    handleChartResize(appState.analyticsChart);
                    if (appState.filteredData && appState.filteredData.length > 0) {
                        updateAnalyticsChart(appState.analyticsChart, appState.filteredData);
                    }
                }
            }, 250); // Debounce resize events
            
            window.addEventListener('resize', debouncedResize);
        } catch (error) {
            console.error('Error initializing analytics chart:', error);
        }
    }
    
    // Initialize data table
    appState.dataTable = initializeDataTable();
    
    // Load data
    loadData(function(data) {
        try {
            // Process data
            const processedData = processData(data);
            
            // Update app state
            appState.allData = processedData.allData;
            appState.uniqueCountries = processedData.uniqueCountries;
            appState.uniqueCorruptionCategories = processedData.uniqueCorruptionCategories;
            appState.uniqueHealthCategories = processedData.uniqueHealthCategories;
            appState.minDate = processedData.minDate;
            appState.maxDate = processedData.maxDate;
            
            // Initialize filters
            initializeFilters(appState, updateFilters);
            
            // Setup map move events
            appState.updateVisibleData = setupMapMoveEvents(
                appState.mapConfig, 
                appState.filteredData, 
                appState.dataTable
            );
            
            // Initial filter application
            updateFilters();
            
            // Make updateFilters globally available for external hooks
            window.applyFilters = updateFilters;
        } catch (error) {
            console.error('Error processing data:', error);
        }
    });
    
    console.timeEnd('Total Initialization');
    
    // Clean up resources on page unload
    window.addEventListener('beforeunload', function() {
        cleanup();
    });
});

/**
 * Update filters and refresh the map and data table
 * @returns {Array} Filtered data array
 */
function updateFilters() {
    try {
        console.time('Filter Application');
        
        // Apply filters to get filtered data
        appState.filteredData = applyFilters(appState.allData);
        
        // Update map markers
        updateMapMarkers(appState.mapConfig, appState.filteredData, appState, appState.updateVisibleData);
        
        // Update analytics chart
        if (appState.analyticsChart) {
            // Always update the chart data regardless of visibility
            updateAnalyticsChart(appState.analyticsChart, appState.filteredData);
            
            // Make the function globally available for external scripts
            window.updateAnalyticsChart = updateAnalyticsChart;
        }
        
        // Store update function for external access (both ways to maximize compatibility)
        appState.updateAnalyticsChart = function() {
            if (appState.analyticsChart) {
                updateAnalyticsChart(appState.analyticsChart, appState.filteredData);
            }
        };
        
        // Also make this function globally accessible
        window.updateChart = function() {
            if (appState.analyticsChart) {
                updateAnalyticsChart(appState.analyticsChart, appState.filteredData);
            }
        };
        
        // Update reset button visibility
        updateResetButtonVisibility();
        
        console.timeEnd('Filter Application');
        return appState.filteredData;
    } catch (error) {
        console.error('Error updating filters:', error);
        return [];
    }
}

/**
 * Clean up resources when the application is unloaded
 */
function cleanup() {
    try {
        // Clean up analytics chart resources
        if (appState.analyticsChart) {
            cleanupAnalyticsChart(appState.analyticsChart);
        }
        
        // Clean up analytics tab event listeners
        cleanupAnalyticsTabs();
        
        // Remove window event listeners
        window.removeEventListener('resize', handleChartResize);
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait between calls
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}
