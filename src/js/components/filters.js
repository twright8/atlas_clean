/**
 * Filters module
 * Handles all filter-related functionality
 */
import { debounce } from '../utils/formatters.js';

/**
 * Initialize all filters
 * @param {Object} state - Application state
 * @param {Function} updateCallback - Function to call when filters change
 */
export function initializeFilters(state, updateCallback) {
    // Initialize Select2 dropdowns for filters
    initializeSelect2Filters(state, updateCallback);
    
    // Initialize date picker filters
    initializeDateFilters(state, updateCallback);
    
    // Initialize checkbox filters
    initializeCheckboxFilters(state, updateCallback);
    
    // Initialize text search
    initializeTextSearch(updateCallback);
    
    // Reset filters button
    initializeResetButton(state, updateCallback);
    
    // Info tooltips
    initializeInfoTooltips();
}

/**
 * Initialize Select2 dropdown filters
 * @param {Object} state - Application state
 * @param {Function} updateCallback - Function to call when filters change
 */
function initializeSelect2Filters(state, updateCallback) {
    const { uniqueCountries, uniqueCorruptionCategories, uniqueHealthCategories } = state;
    
    initializeSelect2Filter('#countryFilter', uniqueCountries, 'Select multiple', updateCallback);
    initializeSelect2Filter('#corruptionCategoriesFilter', uniqueCorruptionCategories, 'Select multiple', updateCallback);
    initializeSelect2Filter('#healthCategoriesFilter', uniqueHealthCategories, 'Select multiple', updateCallback);
}

/**
 * Initialize a single Select2 filter
 * @param {string} selector - CSS selector for the filter
 * @param {Array} data - Data for the dropdown
 * @param {string} placeholder - Placeholder text
 * @param {Function} updateCallback - Function to call when filters change
 */
function initializeSelect2Filter(selector, data, placeholder, updateCallback) {
    $(selector).select2({
        data: data.map(item => ({ id: item, text: item })),
        placeholder: placeholder,
    }).on('change', function() {
        updateCallback();
        updateResetButtonVisibility();
    });
}

/**
 * Initialize date range filters
 * @param {Object} state - Application state
 * @param {Function} updateCallback - Function to call when filters change
 */
function initializeDateFilters(state, updateCallback) {
    const { minDate, maxDate } = state;
    
    $('#startDate, #endDate').datepicker({
        format: 'dd/mm/yy',
        autoclose: true
    }).on('changeDate', function() {
        updateCallback();
        updateResetButtonVisibility();
    });

    $('#startDate').datepicker('setDate', minDate);
    $('#endDate').datepicker('setDate', maxDate);
}

/**
 * Initialize checkbox filters
 * @param {Object} state - Application state 
 * @param {Function} updateCallback - Function to call when filters change
 */
function initializeCheckboxFilters(state, updateCallback) {
    const archivedFilter = document.getElementById('archivedFilter');
    const caseFilter = document.getElementById('caseFilter');
    const unreliableFilter = document.getElementById('unreliableFilter');
    const countryLevelFilter = document.getElementById('countryLevelFilter');
    
    // Set initial state
    archivedFilter.checked = false;
    caseFilter.checked = true;
    unreliableFilter.checked = true;
    countryLevelFilter.checked = true;
    
    // Add change event listeners
    archivedFilter.addEventListener('change', function() {
        updateCallback();
        updateResetButtonVisibility();
    });
    
    caseFilter.addEventListener('change', function() {
        updateCallback();
        updateResetButtonVisibility();
    });
    
    unreliableFilter.addEventListener('change', function() {
        updateCallback();
        updateResetButtonVisibility();
    });
    
    countryLevelFilter.addEventListener('change', function() {
        // Toggle legend based on filter state
        if (!this.checked && !state.mapConfig.legendAdded) {
            state.mapConfig.legend.addTo(state.mapConfig.map);
            state.mapConfig.legendAdded = true;
        } else if (this.checked && state.mapConfig.legendAdded) {
            state.mapConfig.legend.remove();
            state.mapConfig.legendAdded = false;
        }
        
        updateCallback();
        updateResetButtonVisibility();
    });
}

/**
 * Initialize text search
 * @param {Function} updateCallback - Function to call when filters change
 */
function initializeTextSearch(updateCallback) {
    $('#search-input').on('input', debounce(function() {
        updateCallback();
        updateResetButtonVisibility();
    }, 500));
}

/**
 * Initialize reset button
 * @param {Object} state - Application state
 * @param {Function} updateCallback - Function to call when filters change
 */
function initializeResetButton(state, updateCallback) {
    $('#resetFilters').on('click', function() {
        if (isAnyFilterActive()) {
            $('#countryFilter, #corruptionCategoriesFilter, #healthCategoriesFilter').val(null).trigger('change');
            $('#startDate').datepicker('setDate', state.minDate);
            $('#endDate').datepicker('setDate', state.maxDate);
            $('#search-input').val('');
            document.getElementById('archivedFilter').checked = false;
            document.getElementById('caseFilter').checked = true;
            document.getElementById('unreliableFilter').checked = true;
            document.getElementById('countryLevelFilter').checked = true;
            
            updateCallback();
            updateResetButtonVisibility();
            
            if (state.mapConfig.legendAdded) {
                state.mapConfig.legend.remove();
                state.mapConfig.legendAdded = false;
            }
        }
    });
    
    // Initial visibility
    updateResetButtonVisibility();
}

/**
 * Check if any filter is active
 * @returns {boolean} True if any filter is active
 */
export function isAnyFilterActive() {
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

    // Get min and max dates from the application state
    // This is a simplification - you'll need to access state properly
    const minDate = window.appState?.minDate;
    const maxDate = window.appState?.maxDate;

    const isDateFilterActive = (startDate && minDate && startDate.getTime() !== minDate.getTime()) || 
                             (endDate && maxDate && endDate.getTime() !== maxDate.getTime());

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
 * Update reset button visibility based on filter state
 */
export function updateResetButtonVisibility() {
    if (isAnyFilterActive()) {
        $('#resetFilters').show();
    } else {
        $('#resetFilters').hide();
    }
}

/**
 * Initialize info tooltips
 */
function initializeInfoTooltips() {
    const infoBoxes = {
        country: "Country mentioned in the article. This is usually, but not always, where the story occured.",
        corruption: "We used AI to identify when a story is related to a particular theme related to integrity. See our 'About' page for qualifications and limitations.",
        health: "We used AI to identify when a story is related to a particular area of health. See our 'About' page for qualifications and limitations.",
        date: "Set a date range to view which events have happened within a specific time period. Our archived data uses publication date.",
        archived: "When checked, this includes articles collected using our earlier data gathering methods. We've since improved our collection process. Unchecked shows only articles collected with our current methods.",
        cased: "When checked, this filters out general discussions and commentaries to focus on stories about specific corruption cases. Check it to include all articles.",
        unreliable: "We use AI to identify potentially unreliable news stories based on their writing style and content. While keeping this checked can help reduce exposure to low-quality news, please note: The filter works automatically with no human oversight. It may incorrectly flag legitimate stories as unreliable. It may miss unreliable stories. It can reflect biases present in AI training data. Think of it as a helpful but unverified first pass rather than a definitive assessment of reliability.",
        countryLevel: "When checked, this shows only articles where a specific location within the country could be determined. Check it to include articles where only the country-level location was identified."
    };

    let currentInfoBox = null;

    function createInfoBox(content, target) {
        console.log('Creating info box for:', content);
        if (currentInfoBox) {
            currentInfoBox.remove();
        }

        const infoBox = document.createElement('div');
        infoBox.className = 'info-box';
        infoBox.textContent = content;
        document.body.appendChild(infoBox);

        const targetRect = target.getBoundingClientRect();
        infoBox.style.top = `${targetRect.bottom + window.scrollY + 5}px`;
        infoBox.style.left = `${targetRect.left + window.scrollX - 150}px`;
        infoBox.style.display = 'block';

        currentInfoBox = infoBox;
        console.log('Info box created and displayed');
    }

    function handleInfoIconClick(e) {
        console.log('Info icon clicked:', this.id);
        e.preventDefault();
        e.stopPropagation();
        const filterType = this.getAttribute('data-filter');
        const infoContent = infoBoxes[filterType];
        createInfoBox(infoContent, this);
    }

    const infoIconIds = ['main-info', 'country-info', 'corruption-info', 'health-info', 'date-info', 'archived-info', 'case-info', 'unreliable-info', 'country-level-info'];

    infoIconIds.forEach(id => {
        const icon = document.getElementById(id);
        if (icon) {
            console.log('Attaching click event to:', id);
            icon.addEventListener('click', handleInfoIconClick);
            icon.addEventListener('mousedown', e => e.preventDefault());
        } else {
            console.warn('Info icon not found:', id);
        }
    });

    document.addEventListener('click', function(e) {
        if (currentInfoBox && !e.target.classList.contains('info-icon')) {
            console.log('Closing info box');
            currentInfoBox.remove();
            currentInfoBox = null;
        }
    });
}

/**
 * Apply filters to data
 * @param {Array} allData - All data
 * @returns {Array} Filtered data
 */
export function applyFilters(allData) {
    console.time('Filtering Data');
    
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

    const filteredData = allData.filter(d => {
        const countryMatch = selectedCountries.size === 0 || selectedCountries.has(d.country);
        const corruptionCategoryMatch = selectedCorruptionCategories.size === 0 || 
            d['Corruption Categories'].some(category => selectedCorruptionCategories.has(category));
        const healthCategoryMatch = selectedHealthCategories.size === 0 || 
            d['Sector Categories'].some(category => selectedHealthCategories.has(category));
        
        let dateMatch = true;
        if (startDate && endDate && d.parsedDate) {
            dateMatch = (d.parsedDate >= startDate && d.parsedDate <= endDate);
        }
        
        let titleMatch = true;
        if (searchTerm) {
            const title = d.Title.toLowerCase();
            if (searchTerm.startsWith('"') && searchTerm.endsWith('"')) {
                titleMatch = title.includes(searchTerm.slice(1, -1));
            } else {
                titleMatch = searchTerm.split(' ').every(word => title.includes(word));
            }
        }

        const archivedMatch = !showArchived || !d.Archived;
        const caseMatch = !showCase || d.c_n;
        const unreliableMatch = !unreliableCase || !d.f_n;
        const countryLevelMatch = !showCountryLevel || !d.country_level;

        return countryMatch && 
               corruptionCategoryMatch && 
               healthCategoryMatch && 
               dateMatch && 
               titleMatch && 
               archivedMatch && 
               unreliableMatch && 
               caseMatch &&
               countryLevelMatch;
    });

    console.timeEnd('Filtering Data');
    return filteredData;
}
