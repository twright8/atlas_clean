import * as mapModule from './modules/map';
import * as dataModule from './modules/data';
import * as uiModule from './modules/ui';
import * as tableModule from './modules/table';

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
 * Update map markers and data table with filtered data
 */
function updateMapAndTable() {
    console.time('Updating Map and Table');
    
    // Clear existing markers
    mapModule.clearMarkers();
    markerMap.clear();
    
    const filteredData = dataModule.getFilteredData();
    
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

    console.timeEnd('Updating Map and Table');
}

/**
 * Update visible data in table based on map bounds
 */
const updateVisibleData = uiModule.debounce(function() {
    console.time('Updating Visible Data');
    
    if (mapModule.isMapMoving()) {
        return;
    }
    
    const bounds = mapModule.getMapBounds();
    const visibleData = dataModule.getVisibleData(bounds);
    
    tableModule.updateDataTable(visibleData);
    $('.filter-count').text(dataModule.formatNumber(visibleData.length));
    
    console.timeEnd('Updating Visible Data');
}, 1000);

// Make updateVisibleData available to map event handlers
mapModule.onMoveEnd = updateVisibleData;
