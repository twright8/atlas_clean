/**
 * Enhanced dashboard module that orchestrates dashboard functionality
 * with improved visualizations and insights
 */
import * as dashboardLayout from './dashboardLayout';
import * as dashboardCharts from './dashboardCharts';
import * as dashboardStats from './dashboardStats';
import * as d3 from 'd3';

// Dashboard state
let dashboardData = [];
let previousData = [];
let timeSeriesChart;
let categoryChart;
let topCountriesChart;
let interconnectionChart;
let dateRange;
let chartOptions = {
    timeSeries: { yearly: false },
    category: { showHealthCategories: false }
};

/**
 * Initialize the dashboard visualizations
 * @param {HTMLElement} container The container element for the dashboard
 */
export function initializeDashboard(container) {
    console.time('Dashboard Initialization');
    
    // Create dashboard layout
    dashboardLayout.createDashboardLayout(container);
    
    // Initialize charts with empty data
    timeSeriesChart = dashboardCharts.initializeTimeSeriesChart();
    categoryChart = dashboardCharts.initializeCategoryChart();
    topCountriesChart = dashboardCharts.initializeTopCountriesChart();
    interconnectionChart = dashboardCharts.initializeInterconnectionChart();
    
    // Setup event listeners for dashboard interactions
    setupEventListeners();
    
    console.timeEnd('Dashboard Initialization');
}

/**
 * Setup event listeners for dashboard interactions
 */
function setupEventListeners() {
    // Listen for view toggle events from the dashboardLayout
    document.addEventListener('timeViewToggle', function(e) {
        chartOptions.timeSeries.yearly = e.detail.yearly;
        if (dashboardData.length > 0) {
            dashboardCharts.updateTimeSeriesChart(timeSeriesChart, dashboardData, dateRange, chartOptions.timeSeries);
        }
    });
    
    document.addEventListener('categoryViewToggle', function(e) {
        chartOptions.category.showHealthCategories = e.detail.showHealthCategories;
        if (dashboardData.length > 0) {
            dashboardCharts.updateCategoryChart(categoryChart, dashboardData, chartOptions.category);
        }
    });
    
    document.addEventListener('refreshRecentArticles', function() {
        if (dashboardData.length > 0) {
            dashboardStats.updateRecentArticles(dashboardData);
        }
    });
}

/**
 * Update the dashboard with filtered data
 * @param {Array} data Filtered data array
 * @param {Object} dataDateRange Object with minDate and maxDate
 */
export function updateDashboard(data, dataDateRange) {
    console.time('Dashboard Update');
    
    // Store the previous data for trend analysis
    previousData = [...dashboardData];
    
    // Store the filtered data and date range
    dashboardData = data;
    dateRange = dataDateRange;
    
    // Update each visualization with the options
    dashboardCharts.updateTimeSeriesChart(timeSeriesChart, data, dateRange, chartOptions.timeSeries);
    dashboardCharts.updateCategoryChart(categoryChart, data, chartOptions.category);
    dashboardCharts.updateTopCountriesChart(topCountriesChart, data);
    dashboardCharts.updateInterconnectionChart(interconnectionChart, data);
    dashboardStats.updateSummaryStats(data, dateRange);
    
    // Update additional components
    updateKeyMetrics(data);
    dashboardStats.updateRecentArticles(data);
    
    // Calculate articles per month for the summary stat
    const articlesPerMonth = calculateArticlesPerMonth(data);
    document.getElementById('articles-per-month').textContent = articlesPerMonth;
    
    console.timeEnd('Dashboard Update');
}

/**
 * Update the key metrics in the dashboard header
 * @param {Array} data Filtered data array
 */
function updateKeyMetrics(data) {
    const keyMetricsContainer = document.getElementById('key-metrics');
    if (!keyMetricsContainer) return;
    
    // Clear previous metrics
    keyMetricsContainer.innerHTML = '';
    
    // Calculate key metrics
    
    // 1. Latest article date
    const latestDate = getLatestArticleDate(data);
    
    // 2. Most mentioned country
    const topCountry = getTopCountry(data);
    
    // 3. Most common integrity issue
    const topCategory = getTopCategory(data);
    
    // Create metrics HTML
    const metricsHTML = `
        <div class="key-metric">
            <span class="key-metric-value">${latestDate}</span>
            <span class="key-metric-label">Latest Article</span>
        </div>
        <div class="key-metric">
            <span class="key-metric-value">${topCountry.name}</span>
            <span class="key-metric-label">Most Mentioned Country</span>
        </div>
        <div class="key-metric">
            <span class="key-metric-value">${topCategory.name}</span>
            <span class="key-metric-label">Top Integrity Issue</span>
        </div>
    `;
    
    keyMetricsContainer.innerHTML = metricsHTML;
}

/**
 * Get the date of the most recent article
 * @param {Array} data Filtered data array
 * @returns {String} Formatted date string
 */
function getLatestArticleDate(data) {
    if (data.length === 0) return 'N/A';
    
    const sortedByDate = [...data].sort((a, b) => {
        if (!a.parsedDate || !b.parsedDate) return 0;
        return b.parsedDate - a.parsedDate;
    });
    
    if (!sortedByDate[0].parsedDate) return 'N/A';
    
    // Format date to DD Month YYYY
    const date = sortedByDate[0].parsedDate;
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

/**
 * Get the most mentioned country and its count
 * @param {Array} data Filtered data array
 * @returns {Object} Object with country name and count
 */
function getTopCountry(data) {
    if (data.length === 0) return { name: 'N/A', count: 0 };
    
    const countryCounts = {};
    
    data.forEach(item => {
        if (item.country && item.country.trim()) {
            countryCounts[item.country] = (countryCounts[item.country] || 0) + 1;
        }
    });
    
    if (Object.keys(countryCounts).length === 0) return { name: 'N/A', count: 0 };
    
    const sortedCountries = Object.entries(countryCounts)
        .sort((a, b) => b[1] - a[1]);
    
    return {
        name: sortedCountries[0][0],
        count: sortedCountries[0][1]
    };
}

/**
 * Get the most common integrity issue category
 * @param {Array} data Filtered data array
 * @returns {Object} Object with category name and count
 */
function getTopCategory(data) {
    if (data.length === 0) return { name: 'N/A', count: 0 };
    
    const categoryCounts = {};
    
    data.forEach(item => {
        if (Array.isArray(item['Corruption Categories'])) {
            item['Corruption Categories'].forEach(category => {
                if (category && category.trim()) {
                    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
                }
            });
        }
    });
    
    if (Object.keys(categoryCounts).length === 0) return { name: 'N/A', count: 0 };
    
    const sortedCategories = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1]);
    
    return {
        name: sortedCategories[0][0],
        count: sortedCategories[0][1]
    };
}

/**
 * Calculate the average articles per month
 * @param {Array} data Filtered data array
 * @returns {String} Articles per month (formatted)
 */
function calculateArticlesPerMonth(data) {
    if (data.length === 0) return '0';
    
    // Get all dates
    const dates = data
        .map(item => item.parsedDate)
        .filter(date => date !== null && date !== undefined);
    
    if (dates.length === 0) return '0';
    
    // Get min and max dates
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    // Calculate months between min and max dates
    const yearDiff = maxDate.getFullYear() - minDate.getFullYear();
    const monthDiff = maxDate.getMonth() - minDate.getMonth();
    const totalMonths = yearDiff * 12 + monthDiff + 1; // +1 to include both start and end months
    
    // Calculate average articles per month
    const avgArticlesPerMonth = (data.length / totalMonths).toFixed(1);
    
    return avgArticlesPerMonth;
}



/**
 * Handle window resize event to make charts responsive
 */
export function handleDashboardResize() {
    if (dashboardData.length > 0) {
        // Only update the charts, not the entire dashboard
        dashboardCharts.updateTimeSeriesChart(timeSeriesChart, dashboardData, dateRange, chartOptions.timeSeries);
        dashboardCharts.updateCategoryChart(categoryChart, dashboardData, chartOptions.category);
        dashboardCharts.updateTopCountriesChart(topCountriesChart, dashboardData);
        dashboardCharts.updateInterconnectionChart(interconnectionChart, dashboardData);
    }
}

export default {
    initializeDashboard,
    updateDashboard,
    handleDashboardResize
};
