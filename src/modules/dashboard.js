// dashboard.js
import * as d3 from 'd3';
import * as dashboardLayout from './dashboardLayout';
import * as dashboardCharts from './dashboardCharts';
import * as dashboardStats from './dashboardStats';
import * as interconnectionChart from './interconnectionChart';

let dashboardData = [];
let previousData = [];
let timeSeriesChart;
let categoryChart;
let topCountriesChart;
let interconnectionViz;
let dateRange;
let chartOptions = {
    timeSeries: { yearly: false, contentMode: 'total' },
    category: { showHealthCategories: false },
    country: { mapView: false },
    interconnection: { alternate: false }
};
let lastAggregatedTimeSeriesData = { type: 'single', data: [] };

function aggregateTimeSeriesData(data, options) {
    const { yearly, contentMode } = options;
    const timeFormat = yearly ? '%Y' : '%Y-%m';
    const dateParser = yearly ? d3.timeParse('%Y') : d3.timeParse('%Y-%m');

    if (!data || data.length === 0) {
         return { type: contentMode === 'total' ? 'single' : 'multi', data: [] };
    }
    const getTimeKey = (d) => {
        return d.parsedDate && d.parsedDate instanceof Date && !isNaN(d.parsedDate)
            ? d3.timeFormat(timeFormat)(d.parsedDate)
            : null;
    };
    if (contentMode === 'total') {
        const groupedData = d3.rollup(
            data.filter(d => getTimeKey(d) !== null),
            v => v.length,
            getTimeKey
        );
        const timeData = Array.from(groupedData, ([key, value]) => {
            const date = dateParser(key);
            return date ? { key, date, value } : null;
        })
        .filter(d => d !== null)
        .sort((a, b) => d3.ascending(a.date, b.date));
        return { type: 'single', data: timeData };
    } else {
        const categoryType = contentMode === 'integrity' ? 'Corruption Categories' : 'Sector Categories';
        const topN = 5;
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
            return { type: 'multi', data: [] };
        }
        const timeCategoryGroup = d3.rollup(
            data.filter(d => getTimeKey(d) !== null),
            group => {
                const counts = {};
                topCategories.forEach(tc => counts[tc] = 0);
                group.forEach(item => {
                    if (Array.isArray(item[categoryType])) {
                        item[categoryType].forEach(cat => {
                            if (cat && typeof cat === 'string') {
                                const trimmedCat = cat.trim();
                                if (counts.hasOwnProperty(trimmedCat)) {
                                    counts[trimmedCat]++;
                                }
                            }
                        });
                    }
                });
                return counts;
            },
            getTimeKey
        );
        const categoryTimeSeries = {};
        topCategories.forEach(cat => categoryTimeSeries[cat] = []);
        const allDateKeys = Array.from(timeCategoryGroup.keys());
        if (allDateKeys.length === 0) {
             return { type: 'multi', data: [] };
        }
        const sortedDates = allDateKeys
            .map(key => ({ key, date: dateParser(key) }))
            .filter(d => d.date)
            .sort((a, b) => d3.ascending(a.date, b.date));
        sortedDates.forEach(({ key: timeKey, date: dateObj }) => {
            const countsForTime = timeCategoryGroup.get(timeKey) || {};
            topCategories.forEach(cat => {
                categoryTimeSeries[cat].push({
                    date: dateObj,
                    value: countsForTime[cat] || 0
                });
            });
        });
        const finalData = Object.entries(categoryTimeSeries).map(([key, values]) => {
             return { key, values };
         });
        return { type: 'multi', data: finalData };
    }
}

export function initializeDashboard(container) {
    dashboardLayout.createDashboardLayout(container);
    timeSeriesChart = dashboardCharts.initializeTimeSeriesChart();
    categoryChart = dashboardCharts.initializeCategoryChart();
    topCountriesChart = dashboardCharts.initializeTopCountriesChart();
    interconnectionViz = interconnectionChart.initializeInterconnectionChart();
    setupEventListeners();
}

function setupEventListeners() {
    document.addEventListener('timeContentToggle', function(e) {
        chartOptions.timeSeries.contentMode = e.detail.mode;
        if (dashboardData.length > 0) {
            lastAggregatedTimeSeriesData = aggregateTimeSeriesData(dashboardData, chartOptions.timeSeries);
            dashboardCharts.updateTimeSeriesChart(timeSeriesChart, lastAggregatedTimeSeriesData, dateRange, chartOptions.timeSeries);
        }
    });
    document.addEventListener('timeViewToggle', function(e) {
        chartOptions.timeSeries.yearly = e.detail.yearly;
        if (dashboardData.length > 0) {
            lastAggregatedTimeSeriesData = aggregateTimeSeriesData(dashboardData, chartOptions.timeSeries);
            dashboardCharts.updateTimeSeriesChart(timeSeriesChart, lastAggregatedTimeSeriesData, dateRange, chartOptions.timeSeries);
        }
    });
    document.addEventListener('categoryViewToggle', function(e) {
        chartOptions.category.showHealthCategories = e.detail.showHealthCategories;
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
    document.addEventListener('interconnectionViewToggle', function(e) {
        chartOptions.interconnection.alternate = e.detail.alternate;
        if (dashboardData.length > 0) {
            interconnectionChart.updateInterconnectionChart(interconnectionViz, dashboardData, chartOptions.interconnection);
        }
    });
    document.addEventListener('refreshRecentArticles', function() {
        if (dashboardData.length > 0) {
            updateRecentArticles(dashboardData);
        }
    });
}

export function updateDashboard(data, dataDateRange) {
    previousData = [...dashboardData];
    dashboardData = data;
    dateRange = dataDateRange;
    lastAggregatedTimeSeriesData = aggregateTimeSeriesData(data, chartOptions.timeSeries);
    dashboardCharts.updateTimeSeriesChart(timeSeriesChart, lastAggregatedTimeSeriesData, dateRange, chartOptions.timeSeries);
    dashboardCharts.updateCategoryChart(categoryChart, data, chartOptions.category);
    dashboardCharts.updateTopCountriesChart(topCountriesChart, data, chartOptions.country);
    interconnectionChart.updateInterconnectionChart(interconnectionViz, data, chartOptions.interconnection);
    dashboardStats.updateSummaryStats(data, dateRange);
    updateKeyMetrics(data);
    updateRecentArticles(data);
}

function updateKeyMetrics(data) {
    const keyMetricsContainer = document.getElementById('key-metrics');
    if (!keyMetricsContainer) return;
    keyMetricsContainer.innerHTML = '';
    const latestDate = getLatestArticleDate(data);
    const topCountry = getTopCountry(data);
    const topCategory = getTopCategory(data);
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

function getTopCountry(data) {
    if (!data || data.length === 0) return { name: 'N/A', count: 0 };
    const countryCounts = {};
    data.forEach(item => {
        if (item.country && item.country.trim()) {
            countryCounts[item.country] = (countryCounts[item.country] || 0) + 1;
        }
    });
    if (Object.keys(countryCounts).length === 0) return { name: 'N/A', count: 0 };
    const sortedCountries = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]);
    return {
        name: sortedCountries[0][0].length > 20 ? sortedCountries[0][0].substring(0, 17) + '...' : sortedCountries[0][0],
        count: sortedCountries[0][1]
    };
}

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
    const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
    return {
        name: sortedCategories[0][0].length > 20 ? sortedCategories[0][0].substring(0, 17) + '...' : sortedCategories[0][0],
        count: sortedCategories[0][1]
    };
}

function updateRecentArticles(data) {
    const recentArticlesList = document.getElementById('recent-articles-list');
    if (!recentArticlesList) return;

    recentArticlesList.innerHTML = '';

    if (!data || data.length === 0) {
        recentArticlesList.innerHTML = '<p class="no-data-message">No articles available</p>';
        return;
    }

    const sortedData = [...data].sort((a, b) => {
        const dateA = a.parsedDate;
        const dateB = b.parsedDate;
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateB - dateA;
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
            date = article.Date;
        }
        const url = article.url || '#';
        const escapedUrl = url.replace(/'/g, "\\'"); // Escape single quotes for JS string

        return `
            <div class="article-item" style="cursor: pointer;"
                 onclick="trackOutboundLink('${escapedUrl}', 'dashboard_recent_articles'); window.open('${escapedUrl}', '_blank');">
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

export function forceUpdateCharts() {
    if (dashboardData.length > 0) {
        lastAggregatedTimeSeriesData = aggregateTimeSeriesData(dashboardData, chartOptions.timeSeries);
        dashboardCharts.updateTimeSeriesChart(timeSeriesChart, lastAggregatedTimeSeriesData, dateRange, chartOptions.timeSeries);
        dashboardCharts.updateCategoryChart(categoryChart, dashboardData, chartOptions.category);
        dashboardCharts.updateTopCountriesChart(topCountriesChart, dashboardData, chartOptions.country);
        interconnectionChart.updateInterconnectionChart(interconnectionViz, dashboardData, chartOptions.interconnection);
        dashboardStats.updateSummaryStats(dashboardData, dateRange);
        updateKeyMetrics(dashboardData);
        updateRecentArticles(dashboardData);
    }
}

export function handleDashboardResize() {
    const dashboardElement = document.getElementById('dashboard');
    if (dashboardElement && dashboardElement.style.display !== 'none' && dashboardData.length > 0) {
        lastAggregatedTimeSeriesData = aggregateTimeSeriesData(dashboardData, chartOptions.timeSeries);
        dashboardCharts.updateTimeSeriesChart(timeSeriesChart, lastAggregatedTimeSeriesData, dateRange, chartOptions.timeSeries);
        dashboardCharts.updateCategoryChart(categoryChart, dashboardData, chartOptions.category);
        dashboardCharts.updateTopCountriesChart(topCountriesChart, dashboardData, chartOptions.country);
        interconnectionChart.updateInterconnectionChart(interconnectionViz, dashboardData, chartOptions.interconnection);
    }
}

export default {
    initializeDashboard,
    updateDashboard,
    handleDashboardResize,
    forceUpdateCharts
};