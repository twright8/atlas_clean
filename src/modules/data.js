/**
 * Module for handling data loading, processing, and filter operations
 */

// State variables
let allData = [];
let filteredData = [];
let minDate, maxDate;

/**
 * Format numbers with thousand separators
 * @param {Number} num The number to format
 * @returns {String} Formatted number
 */
export function formatNumber(num) {
    const numberFormatter = new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 0
    });
    return numberFormatter.format(num);
}

/**
 * Load data from the specified URL
 * @param {String} url URL to fetch data from
 * @returns {Promise} Promise that resolves with the loaded data
 */
export function loadData(url) {
    console.time('Data Fetching');
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            console.timeEnd('Data Fetching');
            return data;
        })
        .catch(error => {
            console.error('Error loading data:', error);
            throw error;
        });
}

/**
 * Process the raw data and extract information
 * @param {Array} data Raw data array
 * @param {Function} dateParser Function to parse dates
 * @returns {Object} Processed data and metadata
 */
export function processData(data, dateParser) {
    console.time('Data Processing');
    
    // Parse dates and create a copy of data with additional fields
    allData = data.map(d => ({
        ...d,
        parsedDate: dateParser(d['Date'])
    }));
    
    // Extract unique values for filters
    const uniqueCountries = [...new Set(allData.map(item => item.country))]
        .filter(country => country) // Filter out null/undefined
        .sort((a, b) => a.localeCompare(b));
    
    const uniqueCorruptionCategories = [...new Set(allData.flatMap(item => 
        Array.isArray(item['Corruption Categories']) ? item['Corruption Categories'] : []
    ))]
        .filter(category => category) // Filter out null/undefined
        .sort((a, b) => a.localeCompare(b));
    
    const uniqueHealthCategories = [...new Set(allData.flatMap(item => 
        Array.isArray(item['Sector Categories']) ? item['Sector Categories'] : []
    ))]
        .filter(category => category) // Filter out null/undefined
        .sort((a, b) => a.localeCompare(b));
    
    // Get min and max dates for date range filter
    minDate = d3.min(allData, d => d.parsedDate);
    maxDate = d3.max(allData, d => d.parsedDate);
    
    console.timeEnd('Data Processing');
    
    return {
        allData,
        uniqueCountries,
        uniqueCorruptionCategories,
        uniqueHealthCategories,
        minDate,
        maxDate
    };
}

/**
 * Apply filters to the data based on user selection
 * @param {Object} filterCriteria Filter criteria object
 * @returns {Array} Filtered data array
 */
export function filterData(filterCriteria) {
    console.time('Filtering Data');
    
    const {
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
    } = filterCriteria;
    
    filteredData = allData.filter(d => {
        // Check country match
        const countryMatch = selectedCountries.size === 0 || 
            selectedCountries.has(d.country);
        
        // Check corruption category match
        const corruptionCategoryMatch = selectedCorruptionCategories.size === 0 || 
            (Array.isArray(d['Corruption Categories']) && 
            d['Corruption Categories'].some(category => selectedCorruptionCategories.has(category)));
        
        // Check health category match
        const healthCategoryMatch = selectedHealthCategories.size === 0 || 
            (Array.isArray(d['Sector Categories']) && 
            d['Sector Categories'].some(category => selectedHealthCategories.has(category)));
        
        // Check date match
        let dateMatch = true;
        if (startDate && endDate && d.parsedDate) {
            dateMatch = (d.parsedDate >= startDate && d.parsedDate <= endDate);
        }
        
        // Check title match
        let titleMatch = true;
        if (searchTerm) {
            const title = d.Title.toLowerCase();
            if (searchTerm.startsWith('"') && searchTerm.endsWith('"')) {
                titleMatch = title.includes(searchTerm.slice(1, -1));
            } else {
                titleMatch = searchTerm.split(' ').every(word => title.includes(word));
            }
        }
        
        // Check special filter matches
        const archivedMatch = !showArchived || !d.Archived;
        const caseMatch = !showCase || d.c_n;
        const unreliableMatch = !unreliableCase || !d.f_n;
        const countryLevelMatch = !showCountryLevel || !d.country_level;
        
        // Combine all filter conditions
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

/**
 * Get data filtered by map bounds
 * @param {Object} bounds Map bounds object
 * @returns {Array} Visible data inside bounds
 */
export function getVisibleData(bounds) {
    return filteredData.filter(d => bounds.contains(L.latLng(d.lat, d.long)));
}

/**
 * Get current filtered data
 * @returns {Array} Filtered data array
 */
export function getFilteredData() {
    return filteredData;
}

/**
 * Get min and max dates from the dataset
 * @returns {Object} Object with minDate and maxDate 
 */
export function getDateRange() {
    return { minDate, maxDate };
}

/**
 * Export the data module
 */
export default {
    formatNumber,
    loadData,
    processData,
    filterData,
    getVisibleData,
    getFilteredData,
    getDateRange
};
