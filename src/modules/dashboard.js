/**
 * Enhanced dashboard module that orchestrates dashboard functionality
 * with improved visualizations and insights
 */
import * as d3 from 'd3'; // Make sure d3 is imported if used directly (like in aggregateTimeSeriesData)
import * as dashboardLayout from './dashboardLayout';
import * as dashboardCharts from './dashboardCharts';
import * as dashboardStats from './dashboardStats';
import * as interconnectionChart from './interconnectionChart';

// Dashboard state
let dashboardData = [];
let previousData = [];
let timeSeriesChart;
let categoryChart;
let topCountriesChart;
let interconnectionViz;
let dateRange;
let chartOptions = {
    timeSeries: {
        yearly: false,
        contentMode: 'total' // Initial mode
    },
    category: { showHealthCategories: false },
    country: { mapView: false },
    interconnection: { alternate: false }
};
// Store the last aggregated data for resize events to avoid re-aggregation if not needed
let lastAggregatedTimeSeriesData = { type: 'single', data: [] };

/**
 * Aggregates data for the time series chart based on selected options.
 *
 * @param {Array} data The filtered data array.
 * @param {Object} options Options object containing 'yearly' (boolean) and 'contentMode' ('total', 'integrity', 'health').
 * @returns {Object} An object { type: 'single' | 'multi', data: Array } structured for the time series chart.
 */
/**
 * Aggregates data for the time series chart based on selected options.
 * Uses d3.nest() for compatibility with older D3 versions.
 *
 * @param {Array} data The filtered data array.
 * @param {Object} options Options object containing 'yearly' (boolean) and 'contentMode' ('total', 'integrity', 'health').
 * @returns {Object} An object { type: 'single' | 'multi', data: Array } structured for the time series chart.
 */
function aggregateTimeSeriesData(data, options) {
    const { yearly, contentMode } = options;
    const timeFormat = yearly ? '%Y' : '%Y-%m';
    const dateParser = yearly ? d3.timeParse('%Y') : d3.timeParse('%Y-%m');

    console.log(`Aggregating time series data (D3 v7) - Mode: ${contentMode}, Yearly: ${yearly}`);

    if (!data || data.length === 0) {
         console.log("No data provided for aggregation.");
         return { type: contentMode === 'total' ? 'single' : 'multi', data: [] };
    }

    // Helper function to get the time key, handling invalid dates
    const getTimeKey = (d) => {
        return d.parsedDate && d.parsedDate instanceof Date && !isNaN(d.parsedDate)
            ? d3.timeFormat(timeFormat)(d.parsedDate)
            : null; // Return null for invalid dates
    };

    // --- Mode 1: Total Articles Over Time ---
    if (contentMode === 'total') {
        console.log("Aggregating total articles...");

        // Group by time key and count
        const groupedData = d3.rollup(
            data.filter(d => getTimeKey(d) !== null), // Filter out items with invalid dates first
            v => v.length, // Count items in each group
            getTimeKey // Group by the formatted time string
        );

        // Convert Map to array, parse dates, and sort
        const timeData = Array.from(groupedData, ([key, value]) => {
            const date = dateParser(key);
            return date ? { key, date, value } : null; // Return null if date parsing fails
        })
        .filter(d => d !== null) // Remove entries where date parsing failed
        .sort((a, b) => d3.ascending(a.date, b.date)); // Sort by Date object

        console.log(`Aggregated total: ${timeData.length} time points.`);
        return { type: 'single', data: timeData };

    }
    // --- Mode 2: Top Categories Over Time ---
    else {
        const categoryType = contentMode === 'integrity' ? 'Corruption Categories' : 'Sector Categories';
        const topN = 5;
        console.log(`Aggregating top ${topN} ${categoryType}...`);

        // --- Step 1: Find the Top N Categories Overall ---
        const categoryCounts = {};
        data.forEach(item => {
            if (Array.isArray(item[categoryType])) {
                item[categoryType].forEach(cat => {
                    if (cat && typeof cat === 'string' && cat.trim()) {
                         const trimmedCat = cat.trim();
                        categoryCounts[trimmedCat] = (categoryCounts[trimmedCat] || 0) + 1;
                    }
                });
            }
        });

        const topCategories = Object.entries(categoryCounts)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, topN)
            .map(([name]) => name);

        if (topCategories.length === 0) {
            console.log(`No ${categoryType} found in the data.`);
            return { type: 'multi', data: [] };
        }
        console.log(`Top ${topN} categories identified:`, topCategories);

        // --- Step 2: Group Data by Time Period AND Filter/Count by Top Category ---
        // Group first by time, then rollup counts for each top category within that time period
        const timeCategoryGroup = d3.rollup(
            data.filter(d => getTimeKey(d) !== null), // Filter invalid dates
            group => { // Rollup function for each time group
                const counts = {};
                topCategories.forEach(tc => counts[tc] = 0); // Initialize counts for top categories
                group.forEach(item => {
                    if (Array.isArray(item[categoryType])) {
                        item[categoryType].forEach(cat => {
                            if (cat && typeof cat === 'string') {
                                const trimmedCat = cat.trim();
                                if (counts.hasOwnProperty(trimmedCat)) { // Check if it's a top category
                                    counts[trimmedCat]++;
                                }
                            }
                        });
                    }
                });
                return counts; // Return { cat1: count, cat2: count, ... } for this time period
            },
            getTimeKey // Group by time key
        );

        // --- Step 3: Restructure and Pad for D3 Multi-Line Chart Format ---
        const categoryTimeSeries = {}; // Structure: { categoryKey: [{ date: Date, value: count }, ...] }
        topCategories.forEach(cat => categoryTimeSeries[cat] = []);

        const allDateKeys = Array.from(timeCategoryGroup.keys());
        if (allDateKeys.length === 0) {
             console.log("No valid time points found after grouping by category.");
             return { type: 'multi', data: [] };
        }

        // Create Date objects from keys and sort them
        const sortedDates = allDateKeys
            .map(key => ({ key, date: dateParser(key) }))
            .filter(d => d.date) // Filter out failed parses
            .sort((a, b) => d3.ascending(a.date, b.date));

        // Populate the categoryTimeSeries structure
        sortedDates.forEach(({ key: timeKey, date: dateObj }) => {
            const countsForTime = timeCategoryGroup.get(timeKey) || {}; // Get the counts map for this time
            topCategories.forEach(cat => {
                categoryTimeSeries[cat].push({
                    date: dateObj,
                    value: countsForTime[cat] || 0 // Get count or default to 0
                });
            });
        });

        // Convert the temporary object into the final array format needed by D3
        const finalData = Object.entries(categoryTimeSeries).map(([key, values]) => {
             // Values are already sorted by date due to sortedDates iteration
             return { key, values };
         });

        console.log(`Aggregated multi-line data: ${finalData.length} categories.`);
        return { type: 'multi', data: finalData };
    }
}


/**
 * Initialize the dashboard visualizations
 * @param {HTMLElement} container The container element for the dashboard
 */
export function initializeDashboard(container) {
    console.time('Dashboard Initialization');

    dashboardLayout.createDashboardLayout(container);

    timeSeriesChart = dashboardCharts.initializeTimeSeriesChart();
    categoryChart = dashboardCharts.initializeCategoryChart();
    topCountriesChart = dashboardCharts.initializeTopCountriesChart();
    interconnectionViz = interconnectionChart.initializeInterconnectionChart();

    setupEventListeners();

    console.timeEnd('Dashboard Initialization');
}

/**
 * Setup event listeners for dashboard interactions
 */
function setupEventListeners() {
    // Listener for content mode toggle (Total, Integrity, Health)
    document.addEventListener('timeContentToggle', function(e) {
        console.log('Event: timeContentToggle received', e.detail);
        chartOptions.timeSeries.contentMode = e.detail.mode;
        if (dashboardData.length > 0) {
            // Re-aggregate data based on the new mode
            lastAggregatedTimeSeriesData = aggregateTimeSeriesData(dashboardData, chartOptions.timeSeries);
            dashboardCharts.updateTimeSeriesChart(timeSeriesChart, lastAggregatedTimeSeriesData, dateRange, chartOptions.timeSeries);
        }
    });

    // Listener for time aggregation toggle (Monthly/Yearly)
    document.addEventListener('timeViewToggle', function(e) {
        console.log('Event: timeViewToggle received', e.detail);
        chartOptions.timeSeries.yearly = e.detail.yearly;
        if (dashboardData.length > 0) {
            // Re-aggregate data based on the new yearly setting
            lastAggregatedTimeSeriesData = aggregateTimeSeriesData(dashboardData, chartOptions.timeSeries);
            dashboardCharts.updateTimeSeriesChart(timeSeriesChart, lastAggregatedTimeSeriesData, dateRange, chartOptions.timeSeries);
        }
    });

    document.addEventListener('categoryViewToggle', function(e) {
        console.log('Event: categoryViewToggle received', e.detail);
        chartOptions.category.showHealthCategories = e.detail.showHealthCategories;
        if (dashboardData.length > 0) {
            dashboardCharts.updateCategoryChart(categoryChart, dashboardData, chartOptions.category);
        }
    });

    document.addEventListener('countryViewToggle', function(e) {
        console.log('Event: countryViewToggle received', e.detail);
        chartOptions.country.mapView = e.detail.mapView;
        if (dashboardData.length > 0) {
            dashboardCharts.updateTopCountriesChart(topCountriesChart, dashboardData, chartOptions.country);
        }
    });

    document.addEventListener('interconnectionViewToggle', function(e) {
        console.log('Event: interconnectionViewToggle received', e.detail);
        chartOptions.interconnection.alternate = e.detail.alternate;
        if (dashboardData.length > 0) {
            interconnectionChart.updateInterconnectionChart(interconnectionViz, dashboardData, chartOptions.interconnection);
        }
    });

    document.addEventListener('refreshRecentArticles', function() {
        console.log('Event: refreshRecentArticles received');
        if (dashboardData.length > 0) {
            updateRecentArticles(dashboardData); // Assuming updateRecentArticles is defined below
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
    console.log(`Updating dashboard with ${data.length} data points.`);

    previousData = [...dashboardData]; // Store previous raw data if needed for trend analysis
    dashboardData = data; // Store current raw data
    dateRange = dataDateRange; // Store date range context

    // --- Aggregate and Update Time Series Chart ---
    // This is the main update point, always re-aggregate here
    lastAggregatedTimeSeriesData = aggregateTimeSeriesData(data, chartOptions.timeSeries);
    dashboardCharts.updateTimeSeriesChart(timeSeriesChart, lastAggregatedTimeSeriesData, dateRange, chartOptions.timeSeries);

    // --- Update Other Charts and Stats (using raw data) ---
    dashboardCharts.updateCategoryChart(categoryChart, data, chartOptions.category);
    dashboardCharts.updateTopCountriesChart(topCountriesChart, data, chartOptions.country);
    interconnectionChart.updateInterconnectionChart(interconnectionViz, data, chartOptions.interconnection);
    dashboardStats.updateSummaryStats(data, dateRange);

    // --- Update Additional Components ---
    updateKeyMetrics(data);
    updateRecentArticles(data);
    // updateTrendAnalysis(data, previousData); // Uncomment if trend analysis is needed

    console.timeEnd('Dashboard Update');
}

/**
 * Update the key metrics in the dashboard header
 * @param {Array} data Filtered data array
 */
function updateKeyMetrics(data) {
    const keyMetricsContainer = document.getElementById('key-metrics');
    if (!keyMetricsContainer) return;

    keyMetricsContainer.innerHTML = ''; // Clear previous

    const latestDate = getLatestArticleDate(data);
    const topCountry = getTopCountry(data);
    const topCategory = getTopCategory(data); // Assuming this gets top *Integrity* category

    const metricsHTML = `
        <div class="key-metric">
            <span class="key-metric-value">${latestDate}</span>
            <span class="key-metric-label">Latest Article</span>
        </div>
        <div class="key-metric">
            <span class="key-metric-value">${topCountry.name}</span>
            <span class="key-metric-label">Top Country</span>
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
    if (!data || data.length === 0) return 'N/A';

    let latestParsedDate = null;
    data.forEach(item => {
        if (item.parsedDate && (!latestParsedDate || item.parsedDate > latestParsedDate)) {
            latestParsedDate = item.parsedDate;
        }
    });

    if (!latestParsedDate) return 'N/A';

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return latestParsedDate.toLocaleDateString(undefined, options);
}

/**
 * Get the most mentioned country and its count
 * @param {Array} data Filtered data array
 * @returns {Object} Object with country name and count
 */
function getTopCountry(data) {
    if (!data || data.length === 0) return { name: 'N/A', count: 0 };

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
        name: sortedCountries[0][0].length > 20 ? sortedCountries[0][0].substring(0, 17) + '...' : sortedCountries[0][0], // Truncate long names
        count: sortedCountries[0][1]
    };
}

/**
 * Get the most common integrity issue category
 * @param {Array} data Filtered data array
 * @returns {Object} Object with category name and count
 */
function getTopCategory(data) {
    if (!data || data.length === 0) return { name: 'N/A', count: 0 };

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
        name: sortedCategories[0][0].length > 20 ? sortedCategories[0][0].substring(0, 17) + '...' : sortedCategories[0][0], // Truncate long names
        count: sortedCategories[0][1]
    };
}

/**
 * Update the recent articles section
 * @param {Array} data Filtered data array
 */
function updateRecentArticles(data) {
    const recentArticlesList = document.getElementById('recent-articles-list');
    if (!recentArticlesList) return;

    recentArticlesList.innerHTML = ''; // Clear previous

    if (!data || data.length === 0) {
        recentArticlesList.innerHTML = '<p class="no-data-message">No articles available</p>';
        return;
    }

    // Sort data by date (newest first), handling potential null dates
    const sortedData = [...data].sort((a, b) => {
        const dateA = a.parsedDate;
        const dateB = b.parsedDate;
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1; // Put items without dates last
        if (!dateB) return -1; // Put items without dates last
        return dateB - dateA; // Newest first
    });

    const recentArticles = sortedData.slice(0, 5);

    const articlesHTML = recentArticles.map(article => {
        const title = article.Title || 'Untitled';
        const country = article.country || 'Unknown';
        let date = 'Unknown date';
        if (article.parsedDate) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            date = article.parsedDate.toLocaleDateString(undefined, options);
        } else if (article.Date) {
            date = article.Date; // Fallback to original string if parsing failed
        }
        const url = article.url || '#'; // Ensure URL exists

        // Make the entire item clickable
        return `
            <div class="article-item" onclick="window.open('${url}', '_blank')" style="cursor: pointer;">
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
 * Force update all dashboard charts with the current data
 * Typically called when switching to the dashboard view.
 */
export function forceUpdateCharts() {
    if (dashboardData.length > 0) {
        console.log('Forcing update to all dashboard charts');

        // --- Re-aggregate and Update Time Series ---
        lastAggregatedTimeSeriesData = aggregateTimeSeriesData(dashboardData, chartOptions.timeSeries);
        dashboardCharts.updateTimeSeriesChart(timeSeriesChart, lastAggregatedTimeSeriesData, dateRange, chartOptions.timeSeries);

        // --- Update Others ---
        dashboardCharts.updateCategoryChart(categoryChart, dashboardData, chartOptions.category);
        dashboardCharts.updateTopCountriesChart(topCountriesChart, dashboardData, chartOptions.country);
        interconnectionChart.updateInterconnectionChart(interconnectionViz, dashboardData, chartOptions.interconnection);
        dashboardStats.updateSummaryStats(dashboardData, dateRange);
        updateKeyMetrics(dashboardData);
        updateRecentArticles(dashboardData);
    } else {
        console.log('Force update requested, but no data available.');
        // Optionally clear charts or show "no data" messages explicitly here if needed
    }
}

/**
 * Handle window resize event to make charts responsive
 */
export function handleDashboardResize() {
    // Check if the dashboard is actually visible before resizing
    const dashboardElement = document.getElementById('dashboard');
    if (dashboardElement && dashboardElement.style.display !== 'none' && dashboardData.length > 0) {
        console.log('Handling dashboard resize');

        // --- Re-aggregate and Update Time Series ---
        // Use the last aggregated data if available and options haven't changed,
        // otherwise re-aggregate. For simplicity on resize, let's just re-aggregate.
        lastAggregatedTimeSeriesData = aggregateTimeSeriesData(dashboardData, chartOptions.timeSeries);
        dashboardCharts.updateTimeSeriesChart(timeSeriesChart, lastAggregatedTimeSeriesData, dateRange, chartOptions.timeSeries);

        // --- Update Others ---
        dashboardCharts.updateCategoryChart(categoryChart, dashboardData, chartOptions.category);
        dashboardCharts.updateTopCountriesChart(topCountriesChart, dashboardData, chartOptions.country);
        interconnectionChart.updateInterconnectionChart(interconnectionViz, dashboardData, chartOptions.interconnection);
        // Stats don't usually need resizing
    }
}

// Export necessary functions
export default {
    initializeDashboard,
    updateDashboard,
    handleDashboardResize,
    forceUpdateCharts
    // Do not export aggregateTimeSeriesData unless needed externally
};