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

// Application state
const appState = {
    allData: [],
    filteredData: [],
    markerMap: new Map(),
    minDate: null, 
    maxDate: null,
    mapConfig: null,
    dataTable: null,
    updateVisibleData: null
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
    
    // Initialize map
    appState.mapConfig = initializeMap();
    setupTileLayerErrorHandling(appState.mapConfig);
    
    // Initialize data table
    appState.dataTable = initializeDataTable();
    
    // Load data
    loadData(function(data) {
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
    });
    
    console.timeEnd('Total Initialization');
});

/**
 * Update filters and refresh the map and data table
 */
function updateFilters() {
    // Apply filters to get filtered data
    appState.filteredData = applyFilters(appState.allData);
    
    // Update map markers
    updateMapMarkers(appState.mapConfig, appState.filteredData, appState, appState.updateVisibleData);
    
    // Update reset button visibility
    updateResetButtonVisibility();
}
