/**
 * Enhanced dashboard module that orchestrates dashboard functionality
 * with improved visualizations and insights
 */
import * as dashboardLayout from './dashboardLayout';
import * as dashboardCharts from './dashboardCharts';
import * as dashboardStats from './dashboardStats';

// Dashboard state
let dashboardData = [];
let previousData = [];
let timeSeriesChart;
let categoryChart;
let topCountriesChart;
let dateRange;
let chartOptions = {
    timeSeries: { yearly: false },
    category: { showAll: false },
    country: { mapView: false }
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
        chartOptions.category.showAll = e.detail.showAll;
        if (dashboardData.length > 0) {
            dashboardCharts.updateCategoryChart(categoryChart, dashboardData, chartOptions.category);
        }
    });
    
    document.addEventListener('countryViewToggle', function(e) {
        chartOptions.country.mapView = e.detail.mapView;
        if (dashboardData.length > 0) {
            dashboardCharts.updateTopCountriesChart(topCountriesChart, dashboardData, chartOptions.country);
        }
    });
    
    document.addEventListener('refreshRecentArticles', function() {
        if (dashboardData.length > 0) {
            updateRecentArticles(dashboardData);
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
    dashboardCharts.updateTopCountriesChart(topCountriesChart, data, chartOptions.country);
    dashboardStats.updateSummaryStats(data, dateRange);
    
    // Update additional components
    updateKeyMetrics(data);
    updateTrendAnalysis(data, previousData);
    updateRecentArticles(data);
    
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
 * Update the trend analysis section
 * @param {Array} currentData Current filtered data array
 * @param {Array} previousData Previous filtered data array
 */
function updateTrendAnalysis(currentData, previousData) {
    const trendIndicatorsContainer = document.getElementById('trend-indicators');
    if (!trendIndicatorsContainer) return;
    
    // Clear previous trends
    trendIndicatorsContainer.innerHTML = '';
    
    // Skip if no previous data to compare with
    if (previousData.length === 0) {
        trendIndicatorsContainer.innerHTML = `
            <div class="trend-indicator">
                <div class="trend-title">Trend Analysis</div>
                <div class="trend-value trend-neutral">
                    <i class="fa fa-info-circle"></i>
                    <span>Not enough data for trends</span>
                </div>
            </div>
        `;
        return;
    }
    
    // Calculate trends
    
    // 1. Change in total articles
    const totalArticlesTrend = calculatePercentageChange(
        currentData.length, 
        previousData.length
    );
    
    // 2. Change in countries covered
    const currentCountries = new Set(currentData.map(item => item.country).filter(Boolean)).size;
    const previousCountries = new Set(previousData.map(item => item.country).filter(Boolean)).size;
    const countriesTrend = calculatePercentageChange(currentCountries, previousCountries);
    
    // 3. Change in top category
    const currentTopCategory = getTopCategory(currentData);
    const previousTopCategory = getTopCategory(previousData);
    let categoryTrendValue = 'New';
    let categoryTrendClass = 'trend-neutral';
    
    if (currentTopCategory.name === previousTopCategory.name) {
        const categoryTrend = calculatePercentageChange(
            currentTopCategory.count, 
            previousTopCategory.count
        );
        categoryTrendValue = `${categoryTrend.value}%`;
        categoryTrendClass = categoryTrend.direction;
    }
    
    // Create trends HTML
    const trendsHTML = `
        <div class="trend-indicator">
            <div class="trend-title">
                <i class="fa fa-newspaper-o"></i>
                <span>Articles</span>
            </div>
            <div class="trend-value ${totalArticlesTrend.direction}">
                <i class="fa fa-${getTrendIcon(totalArticlesTrend.direction)}"></i>
                <span>${totalArticlesTrend.value}%</span>
            </div>
        </div>
        <div class="trend-indicator">
            <div class="trend-title">
                <i class="fa fa-globe"></i>
                <span>Countries</span>
            </div>
            <div class="trend-value ${countriesTrend.direction}">
                <i class="fa fa-${getTrendIcon(countriesTrend.direction)}"></i>
                <span>${countriesTrend.value}%</span>
            </div>
        </div>
        <div class="trend-indicator">
            <div class="trend-title">
                <i class="fa fa-tag"></i>
                <span>Top Category</span>
            </div>
            <div class="trend-value ${categoryTrendClass}">
                <i class="fa fa-${getTrendIcon(categoryTrendClass)}"></i>
                <span>${categoryTrendValue}</span>
            </div>
        </div>
    `;
    
    trendIndicatorsContainer.innerHTML = trendsHTML;
}

/**
 * Calculate percentage change between two values
 * @param {Number} current Current value
 * @param {Number} previous Previous value
 * @returns {Object} Object with percentage value and direction
 */
function calculatePercentageChange(current, previous) {
    if (previous === 0) return { value: 0, direction: 'trend-neutral' };
    
    const change = current - previous;
    const percentageChange = Math.round((change / previous) * 100);
    
    let direction;
    if (percentageChange > 0) {
        direction = 'trend-up';
    } else if (percentageChange < 0) {
        direction = 'trend-down';
    } else {
        direction = 'trend-neutral';
    }
    
    return {
        value: Math.abs(percentageChange),
        direction: direction
    };
}

/**
 * Get icon name based on trend direction
 * @param {String} direction Trend direction class
 * @returns {String} Icon name
 */
function getTrendIcon(direction) {
    switch (direction) {
        case 'trend-up':
            return 'arrow-up';
        case 'trend-down':
            return 'arrow-down';
        default:
            return 'minus';
    }
}

/**
 * Update the recent articles section
 * @param {Array} data Filtered data array
 */
function updateRecentArticles(data) {
    const recentArticlesList = document.getElementById('recent-articles-list');
    if (!recentArticlesList) return;
    
    // Clear previous articles
    recentArticlesList.innerHTML = '';
    
    if (data.length === 0) {
        recentArticlesList.innerHTML = '<p class="no-data-message">No articles available</p>';
        return;
    }
    
    // Sort data by date (newest first)
    const sortedData = [...data].sort((a, b) => {
        if (!a.parsedDate || !b.parsedDate) return 0;
        return b.parsedDate - a.parsedDate;
    });
    
    // Take only the 5 most recent articles
    const recentArticles = sortedData.slice(0, 5);
    
    // Create HTML for recent articles
    const articlesHTML = recentArticles.map(article => {
        const title = article.Title || 'Untitled';
        const country = article.country || 'Unknown';
        
        // Format date properly or use a fallback
        let date = 'Unknown date';
        if (article.parsedDate) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            date = article.parsedDate.toLocaleDateString(undefined, options);
        } else if (article.Date) {
            date = article.Date;
        }
        
        return `
            <div class="article-item" data-url="${article.url || '#'}" onclick="window.open('${article.url || '#'}', '_blank')">
                <div class="article-title">${title}</div>
                <div class="article-meta">
                    <span><i class="fa fa-map-marker"></i> ${country}</span>
                    <span><i class="fa fa-calendar"></i> ${date}</span>
                </div>
            </div>
        `;
    }).join('');
    
    recentArticlesList.innerHTML = articlesHTML;
}

/**
 * Handle window resize event to make charts responsive
 */
export function handleDashboardResize() {
    if (dashboardData.length > 0) {
        // Only update the charts, not the entire dashboard
        dashboardCharts.updateTimeSeriesChart(timeSeriesChart, dashboardData, dateRange, chartOptions.timeSeries);
        dashboardCharts.updateCategoryChart(categoryChart, dashboardData, chartOptions.category);
        dashboardCharts.updateTopCountriesChart(topCountriesChart, dashboardData, chartOptions.country);
    }
}

export default {
    initializeDashboard,
    updateDashboard,
    handleDashboardResize
};
