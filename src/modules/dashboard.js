/**
 * Main dashboard module that orchestrates dashboard functionality
 */
import * as dashboardLayout from './dashboardLayout';
import * as dashboardCharts from './dashboardCharts';
import * as dashboardStats from './dashboardStats';

// Dashboard state
let dashboardData = [];
let timeSeriesChart;
let categoryChart;
let topCountriesChart;
let dateRange;

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
    
    console.timeEnd('Dashboard Initialization');
}

/**
 * Update the dashboard with filtered data
 * @param {Array} data Filtered data array
 * @param {Object} dataDateRange Object with minDate and maxDate
 */
export function updateDashboard(data, dataDateRange) {
    console.time('Dashboard Update');
    
    // Store the filtered data and date range
    dashboardData = data;
    dateRange = dataDateRange;
    
    // Update each visualization
    dashboardCharts.updateTimeSeriesChart(timeSeriesChart, data, dateRange);
    dashboardCharts.updateCategoryChart(categoryChart, data);
    dashboardCharts.updateTopCountriesChart(topCountriesChart, data);
    dashboardStats.updateSummaryStats(data, dateRange);
    
    console.timeEnd('Dashboard Update');
}

/**
 * Handle window resize event to make charts responsive
 */
export function handleDashboardResize() {
    if (dashboardData.length > 0) {
        updateDashboard(dashboardData, dateRange);
    }
}

export default {
    initializeDashboard,
    updateDashboard,
    handleDashboardResize
};
