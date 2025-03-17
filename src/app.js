import * as mapModule from './modules/map';
import * as dataModule from './modules/data';
import * as uiModule from './modules/ui';
import * as tableModule from './modules/table';
import * as dashboardModule from './modules/dashboard';

// App state
let markerMap = new Map();

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', function() {
    console.time('Total Initialization');
    console.log("Initialization started");
    
    // Initialize UI components
    uiModule.initializeWelcomeOverlay();
    uiModule.initializeViewToggle();
    uiModule.initializeFilterBox();
    uiModule.initializeInfoIcons();
    
    // Initialize map
    mapModule.initializeMap();
    
    // Initialize data table
    tableModule.initializeDataTable();
    
    // Initialize dashboard
    const dashboardContainer = document.getElementById('dashboard');
    dashboardModule.initializeDashboard(dashboardContainer);
    
    // Get filter checkbox elements
    const archivedFilter = document.getElementById('archivedFilter');
    const caseFilter = document.getElementById('caseFilter');    
    const unreliableFilter = document.getElementById('unreliableFilter');
    const countryLevelFilter = document.getElementById('countryLevelFilter');
    
    // Load data
    console.time('Data Fetching');
    dataModule.loadData('./data/loc3.json')
        .then(data => {
            console.timeEnd('Data Fetching');
            initializeWithData(data, {
                archivedFilter,
                caseFilter,
                unreliableFilter,
                countryLevelFilter
            });
        })
        .catch(error => console.error('Error loading data:', error));
    
    console.timeEnd('Total Initialization');
});

/**
 * Initialize app with loaded data
 * @param {Array} data Loaded data
 * @param {Object} filterElements Filter checkbox DOM elements
 */
function initializeWithData(data, filterElements) {
    const { archivedFilter, caseFilter, unreliableFilter, countryLevelFilter } = filterElements;
    
    // Process the data
    const dateParser = d3.timeParse("%d/%m/%y");
    const processedData = dataModule.processData(data, dateParser);
    
    // Set total count
    $('.total-count').text(dataModule.formatNumber(processedData.allData.length));
    
    // Initialize filters
    initializeFilters(processedData, {
        archivedFilter, 
        caseFilter, 
        unreliableFilter, 
        countryLevelFilter
    });
    
    // Initialize additional UI components that depend on data
    uiModule.initializeHelpButton();
    uiModule.initializeShareButtons();
    uiModule.initializeExportButton(() => dataModule.getFilteredData());
    
    // Apply initial filter
    updateFilters();
}

/**
 * Initialize filter components
 * @param {Object} processedData Processed data object
 * @param {Object} filterElements Filter checkbox DOM elements
 */
function initializeFilters(processedData, filterElements) {
    const { archivedFilter, caseFilter, unreliableFilter, countryLevelFilter } = filterElements;
    const { uniqueCountries, uniqueCorruptionCategories, uniqueHealthCategories, minDate, maxDate } = processedData;
    
    // Initialize select2 dropdowns
    uiModule.initializeSelect2Filter('#countryFilter', uniqueCountries, 'Select multiple', filterChangeHandler);
    uiModule.initializeSelect2Filter('#corruptionCategoriesFilter', uniqueCorruptionCategories, 'Select multiple', filterChangeHandler);
    uiModule.initializeSelect2Filter('#healthCategoriesFilter', uniqueHealthCategories, 'Select multiple', filterChangeHandler);
    
    // Initialize date pickers
    uiModule.initializeDatePickers(filterChangeHandler, { minDate, maxDate });
    
    // Initialize search input
    uiModule.initializeSearchInput(filterChangeHandler);
    
    // Initialize filter checkboxes
    uiModule.initializeFilterCheckboxes({
        'archivedFilter': () => {
            updateFilters();
            updateResetButtonVisibility();
        },
        'unreliableFilter': () => {
            updateFilters();
            updateResetButtonVisibility();
        },
        'caseFilter': () => {
            updateFilters();
            updateResetButtonVisibility();
        },
        'countryLevelFilter': () => {
            // Show/hide legend based on filter state
            mapModule.toggleLegend(!countryLevelFilter.checked);
            // Update filters
            updateFilters();
            updateResetButtonVisibility();
        }
    });
    
    // Initialize reset button
    uiModule.initializeResetButton(() => {
        if (isAnyFilterActive()) {
            $('#countryFilter, #corruptionCategoriesFilter, #healthCategoriesFilter').val(null).trigger('change');
            $('#startDate').datepicker('setDate', minDate);
            $('#endDate').datepicker('setDate', maxDate);
            $('#search-input').val('');
            archivedFilter.checked = false;
            caseFilter.checked = true;
            unreliableFilter.checked = true;
            countryLevelFilter.checked = true;
            updateFilters();
            updateResetButtonVisibility();
            
            mapModule.toggleLegend(false);
        }
    });
}

/**
 * Handler for filter changes
 */
function filterChangeHandler() {
    updateFilters();
    updateResetButtonVisibility();
}

/**
 * Update filters and apply to data
 */
function updateFilters() {
    // Get filter values
    const selectedCountries = new Set($('#countryFilter').val() || []);
    const selectedCorruptionCategories = new Set($('#corruptionCategoriesFilter').val() || []);
    const selectedHealthCategories = new Set($('#healthCategoriesFilter').val() || []);
    const startDate = $('#startDate').datepicker('getDate');
    const endDate = $('#endDate').datepicker('getDate');
    const searchTerm = $('#search-input').val().toLowerCase().trim();
    const showArchived = document.getElementById('archivedFilter').checked;
    const showCase = document.getElementById('caseFilter').checked;
    const unreliableCase = document.getElementById('unreliableFilter').checked;
    const showCountryLevel = document.getElementById('countryLevelFilter').checked;
    
    // Create filter criteria object
    const filterCriteria = {
        selectedCountries,
        selectedCorruptionCategories,
        selectedHealthCategories,
        startDate,
        endDate,
        searchTerm,
        showArchived,
        showCase,
        unreliableCase,
        showCountryLevel
    };
    
    // Apply filters
    const filteredData = dataModule.filterData(filterCriteria);
    
    // Store the filtered data for reference
    window.currentFilteredData = filteredData;
    
    // Update map and table
    updateMapAndTable();
}

/**
 * Check if any filter is currently active
 * @returns {Boolean} Whether any filter is active
 */
function isAnyFilterActive() {
    const dateRange = dataModule.getDateRange();
    const selectedCountries = $('#countryFilter').val() || [];
    const selectedCorruptionCategories = $('#corruptionCategoriesFilter').val() || [];
    const selectedHealthCategories = $('#healthCategoriesFilter').val() || [];
    const startDate = $('#startDate').datepicker('getDate');
    const endDate = $('#endDate').datepicker('getDate');
    const searchTerm = $('#search-input').val().trim();
    const isArchivedFilterActive = document.getElementById('archivedFilter').checked;
    const isUnreliableFilterActive = !document.getElementById('unreliableFilter').checked;
    const isCaseFilterActive = !document.getElementById('caseFilter').checked;
    const isCountryLevelFilterActive = !document.getElementById('countryLevelFilter').checked;

    const isDateFilterActive = (startDate && dateRange.minDate && startDate.getTime() !== dateRange.minDate.getTime()) || 
                               (endDate && dateRange.maxDate && endDate.getTime() !== dateRange.maxDate.getTime());

    return selectedCountries.length > 0 || 
           selectedCorruptionCategories.length > 0 || 
           selectedHealthCategories.length > 0 || 
           isDateFilterActive || 
           searchTerm !== '' ||
           isArchivedFilterActive ||
           isUnreliableFilterActive || 
           isCaseFilterActive ||
           isCountryLevelFilterActive;
}

/**
 * Update reset button visibility
 */
function updateResetButtonVisibility() {
    uiModule.updateResetButtonVisibility(isAnyFilterActive());
}

/**
 * Update map markers, data table, and dashboard with filtered data
 */
function updateMapAndTable() {
    console.time('Updating Map, Table, and Dashboard');
    
    // Clear existing markers
    mapModule.clearMarkers();
    markerMap.clear();
    
    const filteredData = dataModule.getFilteredData();
    const dateRange = dataModule.getDateRange();
    
    // Update dashboard with filtered data
    dashboardModule.updateDashboard(filteredData, dateRange);
    
    if (filteredData.length > 0) {
        const chunk = 1000;
        let index = 0;

        function addNextChunk() {
            const limit = Math.min(index + chunk, filteredData.length);
            const newMarkers = [];

            for (let i = index; i < limit; i++) {
                const location = filteredData[i];
                const uniqueId = `${location.lat}-${location.long}-${location.Title}`;

                if (!markerMap.has(uniqueId)) {
                    const marker = mapModule.createMarker(location);
                    newMarkers.push(marker);
                    markerMap.set(uniqueId, marker);
                }
            }

            mapModule.addMarkers(newMarkers);
            index = limit;

            if (index < filteredData.length) {
                setTimeout(addNextChunk, 0);
            } else {
                mapModule.fitMapToBounds();
                updateVisibleData();
            }
        }

        addNextChunk();
    } else {
        updateVisibleData();
    }

    console.timeEnd('Updating Map, Table, and Dashboard');
}

/**
 * Update visible data in table based on map bounds
 */
const updateVisibleData = uiModule.debounce(function() {
    if (mapModule.isMapMoving()) {
        return;
    }
    
    const bounds = mapModule.getMapBounds();
    const visibleData = dataModule.getVisibleData(bounds);
    
    // Store the visible data for reference
    window.currentVisibleData = visibleData;
    
    // Update the data table with the visible data
    tableModule.updateDataTable(visibleData);
    
    // Update the dashboard with the visible data
    if (typeof dashboardModule.updateDashboard === 'function') {
        const dateRange = dataModule.getDateRange();
        // Log number of data points being processed
        console.log(`Updating dashboard with ${visibleData.length} visible data points`);
        dashboardModule.updateDashboard(visibleData, dateRange);
    }
    
    // Ensure all dashboard charts are updated with the visible data
    if (document.querySelector('#dashboard').style.display === 'block') {
        dashboardModule.handleDashboardResize();
    }
    
    // Update filter count display
    $('.filter-count').text(dataModule.formatNumber(visibleData.length));
}, 1000);

// Make updateVisibleData available to map event handlers
mapModule.onMoveEnd = updateVisibleData;

// Make updateVisibleData available globally for view switching
window.updateVisibleData = updateVisibleData;

// Function to handle updates when switching to map view
window.updateMapView = function() {
    // Ensure the callback is set
    mapModule.onMoveEnd = updateVisibleData;
    
    // Update map state if needed
    if (!mapModule.isMapMoving()) {
        mapModule.fitMapToBounds();
        updateVisibleData();
    }
};

// Make dashboard resize handler available globally
window.handleDashboardResize = function() {
    dashboardModule.handleDashboardResize();
};

// Make dashboard force update function available globally
window.forceUpdateDashboard = function() {
    // Check if we're using visible data from the map
    const bounds = mapModule.getMapBounds();
    const visibleData = dataModule.getVisibleData(bounds);
    
    // Update dashboard with map-visible data
    if (visibleData.length > 0) {
        const dateRange = dataModule.getDateRange();
        dashboardModule.updateDashboard(visibleData, dateRange);
        
        // Force all charts to update
        if (typeof dashboardModule.forceUpdateCharts === 'function') {
            dashboardModule.forceUpdateCharts();
        }
    }
};
