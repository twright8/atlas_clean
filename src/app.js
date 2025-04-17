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
            $('#startDate').datepicker('setDate', "01/01/2022");
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
    console.log("updateFilters called. Clearing window.currentVisibleData.");
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

    // *** ADD THIS LINE ***
    // When a main filter changes, invalidate any previously stored map-bound data.
    window.currentVisibleData = null;

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

    // Store the full filtered data for reference
    window.currentFilteredData = filteredData;

    // Update map and table (which will eventually call updateVisibleData)
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

// Check if start date is different from default (01/01/2022)
const defaultStartDate = new Date(2022, 0, 1); // January 1, 2022
const isStartDateChanged = startDate && startDate.getTime() !== defaultStartDate.getTime();

// Check if end date is different from max date
const isEndDateChanged = endDate && dateRange.maxDate && endDate.getTime() !== dateRange.maxDate.getTime();

const isDateFilterActive = isStartDateChanged || isEndDateChanged;
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
/**
 * Update visible data in table based on map bounds
 */
const updateVisibleData = uiModule.debounce(function() {
    console.log("updateVisibleData triggered.");

    const mapOverviewBtn = document.getElementById('map-overview-btn');
    const isMapViewActive = mapOverviewBtn && mapOverviewBtn.classList.contains('active');

    let dataToDisplay;
    const dateRange = dataModule.getDateRange();

    if (isMapViewActive) {
        // --- Map View Logic ---
        console.log("Map view is active. Filtering by map bounds.");
        if (mapModule.isMapMoving()) {
            console.log("Map is moving, deferring update.");
            return;
        }
        const bounds = mapModule.getMapBounds();
        if (!bounds || !bounds.isValid || !bounds.isValid()) {
             console.warn("Map bounds invalid. Using full filtered data as fallback in map view.");
             dataToDisplay = dataModule.getFilteredData();
             window.currentVisibleData = null; // Clear any stale map bounds data
        } else {
            console.log("Fetching visible data within bounds:", bounds);
            dataToDisplay = dataModule.getVisibleData(bounds);
             // Store the map-bound data for potential use by other views
             window.currentVisibleData = dataToDisplay;
             console.log(`Stored ${window.currentVisibleData?.length} items in window.currentVisibleData`);
        }

    } else {
        // --- List or Dashboard View Logic ---
        // KEY CHANGE HERE: Check if we have stored map data first
        if (window.currentVisibleData !== null) {
             // Use the stored map-bound data if it exists (means user likely just interacted with map)
             console.log("Map view NOT active, but using stored map-bound data (window.currentVisibleData).");
             dataToDisplay = window.currentVisibleData;
        } else {
             // Otherwise (no recent map interaction OR a filter was changed), use the full filtered data
             console.log("Map view NOT active and no stored map data. Using all filtered data (dataModule.getFilteredData()).");
             dataToDisplay = dataModule.getFilteredData();
        }
    }

    console.log(`Final dataToDisplay count for UI updates: ${dataToDisplay.length}`);

    // --- Update UI Elements (Common to all views) ---

    // Update the data table (relevant primarily for List view, but harmless otherwise)
    const dataTablesElement = document.getElementById('mask');
    if (typeof tableModule.updateDataTable === 'function') {
        tableModule.updateDataTable(dataToDisplay); // Always update table data model
        if (dataTablesElement && dataTablesElement.style.display !== 'none') {
            console.log("Data table is visible and updated.");
        } else {
            console.log("Data table is hidden, but updated its internal data.");
        }
    }

    // Update the dashboard's DATA regardless of its visibility
    const dashboardElement = document.getElementById('dashboard');
    const isDashboardVisible = dashboardElement && dashboardElement.style.display !== 'none';
    if (typeof dashboardModule.updateDashboard === 'function') {
        // Always update the dashboard's internal data with the appropriate dataset
        console.log(`Calling dashboardModule.updateDashboard with ${dataToDisplay.length} items.`);
        dashboardModule.updateDashboard(dataToDisplay, dateRange);
        console.log("Dashboard data updated internally.");
        // Only perform expensive resize/redraw operations if the dashboard is actually visible *at this moment*
        if (isDashboardVisible) {
            console.log("Dashboard is visible during updateVisibleData, handling resize.");
            if (typeof dashboardModule.handleDashboardResize === 'function') {
                 dashboardModule.handleDashboardResize();
            }
        }
    } else {
        console.warn("dashboardModule.updateDashboard is not a function");
    }

    // Update the filter count display (always reflects the count for the current view context)
    $('.filter-count').text(dataModule.formatNumber(dataToDisplay.length));

}, 300); // Keep the debounce (adjust time if needed)
mapModule.onMoveEnd = updateVisibleData;

// Make updateVisibleData available globally for view switching
window.updateVisibleData = updateVisibleData;

// Function to handle updates when switching to map view
window.updateMapView = function() {
    // Ensure the callback is set
    mapModule.onMoveEnd = updateVisibleData;

    // Update map state if needed
    if (!mapModule.isMapMoving()) {
        // Fit bounds might be too aggressive if user manually zoomed/panned
        // Consider only calling updateVisibleData directly
        // mapModule.fitMapToBounds();
        updateVisibleData(); // Trigger update based on current map view
    }
};

// Make dashboard resize handler available globally
window.handleDashboardResize = function() {
    dashboardModule.handleDashboardResize();
};

// Make dashboard force update function available globally
window.forceUpdateDashboard = function() {
    // This function should trigger the dashboard to re-render using its *current* internal data.
    // It should NOT fetch data again here, as that would overwrite map-bound data.
    console.log("forceUpdateDashboard called (app.js). Triggering dashboard module redraw.");

    // Tell the dashboard module to force a redraw of all its components
    // using its currently stored data.
    if (typeof dashboardModule.forceUpdateCharts === 'function') {
        dashboardModule.forceUpdateCharts();
    } else {
         console.warn("dashboardModule.forceUpdateCharts is not defined.");
    }

    // Also ensure layout is correct, as this is often called when the dashboard becomes visible.
    if (typeof dashboardModule.handleDashboardResize === 'function') {
        dashboardModule.handleDashboardResize();
    } else {
        console.warn("dashboardModule.handleDashboardResize is not defined.");
    }
};