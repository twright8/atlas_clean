/**
 * Module for dashboard statistics functionality
 */
import * as d3 from 'd3';

/**
 * Update the summary statistics with data
 * @param {Array} data Filtered data array
 * @param {Object} dateRange Object with minDate and maxDate
 */
export function updateSummaryStats(data, dateRange) {
    // Calculate summary statistics
    const totalArticles = data.length;
    
    // Count unique countries
    const uniqueCountries = new Set();
    data.forEach(item => {
        if (item.country && item.country.trim()) {
            uniqueCountries.add(item.country);
        }
    });
    
    // Count unique categories
    const uniqueCategories = new Set();
    data.forEach(item => {
        if (Array.isArray(item['Corruption Categories'])) {
            item['Corruption Categories'].forEach(category => {
                if (category && category.trim()) {
                    uniqueCategories.add(category);
                }
            });
        }
    });
    
    // Format date range
    let timePeriodText = '-';
    if (dateRange && dateRange.minDate && dateRange.maxDate) {
        const formatDate = d3.timeFormat('%b %Y');
        timePeriodText = `${formatDate(dateRange.minDate)} - ${formatDate(dateRange.maxDate)}`;
    }
    
    // Update DOM elements
    document.getElementById('total-articles').textContent = totalArticles.toLocaleString();
    document.getElementById('total-countries').textContent = uniqueCountries.size.toLocaleString();
    document.getElementById('total-categories').textContent = uniqueCategories.size.toLocaleString();
    document.getElementById('time-period').textContent = timePeriodText;
}

export default {
    updateSummaryStats
};
