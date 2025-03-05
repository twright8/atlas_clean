/**
 * Data Loader module
 * Handles data fetching and initial processing
 */
import { formatNumber } from '../utils/formatters.js';

/**
 * Load and parse data from server
 * @param {Function} callback - Callback function to run when data is loaded
 */
export function loadData(callback) {
    console.time('Data Fetching');
    fetch('./data/loc3.json')
        .then(response => response.json())
        .then(data => {
            console.timeEnd('Data Fetching');
            callback(data);
        })
        .catch(error => console.error('Error loading data:', error));
}

/**
 * Process loaded data for use in the application
 * @param {Array} data - Raw data from server
 * @returns {Object} Processed data and metadata
 */
export function processData(data) {
    console.time('Data Processing');
    
    // Parse dates
    const dateParser = d3.timeParse("%d/%m/%y");
    const allData = data.map(d => ({
        ...d,
        parsedDate: dateParser(d['Date'])
    }));

    // Update total count display
    $('.total-count').text(formatNumber(allData.length));

    // Extract unique values for filters
    const uniqueCountries = [...new Set(allData.map(item => item.country))].sort((a, b) => a.localeCompare(b));
    const uniqueCorruptionCategories = [...new Set(allData.flatMap(item => item['Corruption Categories']))].sort((a, b) => a.localeCompare(b));
    const uniqueHealthCategories = [...new Set(allData.flatMap(item => item['Sector Categories']))].sort((a, b) => a.localeCompare(b));

    // Get min and max dates for date filters
    const minDate = d3.min(allData, d => d.parsedDate);
    const maxDate = d3.max(allData, d => d.parsedDate);

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
