/**
 * Enhanced module for dashboard statistics functionality
 * Provides detailed statistics and metrics for the dashboard
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
    

    
    // Format date range
    let timePeriodText = '-';
    let timePeriodDisplayText = '-';
    if (dateRange && dateRange.minDate && dateRange.maxDate) {
        const formatDate = d3.timeFormat('%b %Y');
        const formatMonthYear = d3.timeFormat('%B %Y');
        timePeriodText = `${formatDate(dateRange.minDate)} - ${formatDate(dateRange.maxDate)}`;
        timePeriodDisplayText = `${formatMonthYear(dateRange.minDate)} - ${formatMonthYear(dateRange.maxDate)}`;
    }
    
    // Update DOM elements for stats
    document.getElementById('total-articles').textContent = totalArticles.toLocaleString();
    document.getElementById('total-countries').textContent = uniqueCountries.size.toLocaleString();
    document.getElementById('time-period').textContent = timePeriodText;
    
    // Update the date range indicator in the card header if it exists
    const timeDisplayElement = document.getElementById('time-period-display');
    if (timeDisplayElement) {
        timeDisplayElement.textContent = timePeriodDisplayText;
    }
    
    // Calculate and update additional metrics
    updateTrendMetrics(data);
}

/**
 * Update trend metrics with data for key insights
 * @param {Array} data Filtered data array
 */
function updateTrendMetrics(data) {
    const metricsContainer = document.getElementById('key-metrics');
    if (!metricsContainer) return;
    
    // Calculate key metrics
    
    // 1. Articles per month ratio
    const monthsCount = getMonthsCount(data);
    const articlesPerMonth = monthsCount > 0 ? Math.round(data.length / monthsCount * 10) / 10 : 0;
    
    // 2. Country coverage percentage (compared to all possible countries ~195)
    const uniqueCountries = new Set();
    data.forEach(item => {
        if (item.country && item.country.trim()) {
            uniqueCountries.add(item.country);
        }
    });
    const countryCoverage = Math.round((uniqueCountries.size / 195) * 100);
    
    // 3. Category distribution - dominant category percentage
    const categoryData = getCategoryDistribution(data);
    let topCategoryPercentage = 0;
    let topCategoryName = "N/A";
    
    if (categoryData.length > 0) {
        topCategoryName = categoryData[0].category;
        topCategoryPercentage = Math.round((categoryData[0].count / data.length) * 100);
    }
    
    // Create metrics HTML
    const metricsHTML = `
        <div class="key-metric">
            <span class="key-metric-value">${articlesPerMonth}</span>
            <span class="key-metric-label">Articles/Month</span>
        </div>
        <div class="key-metric">
            <span class="key-metric-value">${countryCoverage}%</span>
            <span class="key-metric-label">Country Coverage</span>
        </div>
        <div class="key-metric">
            <span class="key-metric-value">${topCategoryPercentage}%</span>
            <span class="key-metric-label">${topCategoryName}</span>
        </div>
        <div class="key-metric">
            <span class="key-metric-value">${data.length.toLocaleString()}</span>
            <span class="key-metric-label">Total Articles</span>
        </div>
    `;
    
    metricsContainer.innerHTML = metricsHTML;
    
    // Update trend indicators with insightful analysis
    updateTrendIndicators(data);
}

/**
 * Update trend indicators with insightful analysis
 * @param {Array} data Filtered data array
 */
function updateTrendIndicators(data) {
    const trendContainer = document.getElementById('trend-indicators');
    if (!trendContainer) return;
    
    // Initialize trend indicators
    let trendsHTML = '';
    
    // If not enough data for trends, show appropriate message
    if (data.length < 10) {
        trendsHTML = `
            <div class="trend-indicator">
                <div class="trend-title">
                    <i class="fa fa-info-circle"></i>
                    <span>Dataset Analysis</span>
                </div>
                <div class="trend-value trend-neutral">
                    <i class="fa fa-exclamation-circle"></i>
                    <span>Need more data for detailed trends</span>
                </div>
            </div>
        `;
        trendContainer.innerHTML = trendsHTML;
        return;
    }
    
    // 1. Time trend analysis - Are articles increasing or decreasing over time?
    const timeTrend = analyzeTimeTrend(data);
    
    // 2. Geographic focus - Is there a concentration in specific regions?
    const geoFocus = analyzeGeographicFocus(data);
    
    // 3. Category trend - Which integrity issues are gaining more attention?
    const categoryTrend = analyzeCategoryTrend(data);
    
    trendsHTML = `
        <div class="trend-indicator">
            <div class="trend-title">
                <i class="fa fa-calendar"></i>
                <span>Time Pattern</span>
            </div>
            <div class="trend-value ${timeTrend.direction}">
                <i class="fa fa-${getTrendIcon(timeTrend.direction)}"></i>
                <span>${timeTrend.label}</span>
            </div>
        </div>
        <div class="trend-indicator">
            <div class="trend-title">
                <i class="fa fa-globe"></i>
                <span>Geographic Focus</span>
            </div>
            <div class="trend-value">
                <span>${geoFocus.label}</span>
            </div>
        </div>
        <div class="trend-indicator">
            <div class="trend-title">
                <i class="fa fa-tag"></i>
                <span>Rising Issue</span>
            </div>
            <div class="trend-value">
                <span>${categoryTrend.label}</span>
            </div>
        </div>
    `;
    
    trendContainer.innerHTML = trendsHTML;
    
    // Update recent articles
    updateRecentArticles(data);
}

/**
 * Update recent articles list
 * @param {Array} data Filtered data array
 */
function updateRecentArticles(data) {
    const recentArticlesList = document.getElementById('recent-articles-list');
    if (!recentArticlesList) return;
    
    if (data.length === 0) {
        recentArticlesList.innerHTML = '<p class="no-data-message">No articles available</p>';
        return;
    }
    
    // Sort by date (newest first)
    const sortedData = [...data].sort((a, b) => {
        if (!a.parsedDate || !b.parsedDate) return 0;
        return b.parsedDate - a.parsedDate;
    });
    
    // Take the 5 most recent
    const recentArticles = sortedData.slice(0, 5);
    
    // Create HTML for article list
    const articlesHTML = recentArticles.map(article => {
        const title = article.Title || 'Untitled';
        const country = article.country || 'Unknown location';
        
        // Format date
        let date = 'Unknown date';
        if (article.parsedDate) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            date = article.parsedDate.toLocaleDateString(undefined, options);
        } else if (article.Date) {
            date = article.Date;
        }
        
        // Get categories
        let categories = 'No categories';
        if (Array.isArray(article['Corruption Categories']) && article['Corruption Categories'].length > 0) {
            categories = article['Corruption Categories'].slice(0, 2).join(', ');
            if (article['Corruption Categories'].length > 2) {
                categories += '...';
            }
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
 * Get the number of months represented in the data
 * @param {Array} data Filtered data array
 * @returns {Number} Number of months
 */
function getMonthsCount(data) {
    if (data.length === 0) return 0;
    
    // Get all dates
    const dates = data
        .map(item => item.parsedDate)
        .filter(date => date !== null && date !== undefined);
    
    if (dates.length === 0) return 0;
    
    // Get min and max dates
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    // Calculate months between min and max dates
    const yearDiff = maxDate.getFullYear() - minDate.getFullYear();
    const monthDiff = maxDate.getMonth() - minDate.getMonth();
    const totalMonths = yearDiff * 12 + monthDiff + 1; // +1 to include both start and end months
    
    return totalMonths;
}

/**
 * Get the distribution of categories in the data
 * @param {Array} data Filtered data array
 * @returns {Array} Array of category objects with counts, sorted by count
 */
function getCategoryDistribution(data) {
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
    
    // Convert to array and sort
    const categoryData = Object.entries(categoryCounts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);
    
    return categoryData;
}

/**
 * Analyze the time trend in the data
 * @param {Array} data Filtered data array
 * @returns {Object} Trend object with direction and label
 */
function analyzeTimeTrend(data) {
    if (data.length < 10) {
        return { direction: 'trend-neutral', label: 'Insufficient data' };
    }
    
    // Group by month
    const monthGroups = d3.nest()
        .key(d => {
            const date = d.parsedDate;
            return date ? d3.timeFormat('%Y-%m')(date) : 'Unknown';
        })
        .rollup(v => v.length)
        .entries(data)
        .filter(d => d.key !== 'Unknown')
        .sort((a, b) => d3.ascending(a.key, b.key));
    
    if (monthGroups.length < 3) {
        return { direction: 'trend-neutral', label: 'Insufficient time span' };
    }
    
    // Compare first third vs last third
    const thirdSize = Math.floor(monthGroups.length / 3);
    const firstThird = monthGroups.slice(0, thirdSize);
    const lastThird = monthGroups.slice(-thirdSize);
    
    const firstThirdAvg = d3.mean(firstThird, d => d.value);
    const lastThirdAvg = d3.mean(lastThird, d => d.value);
    
    const percentChange = ((lastThirdAvg - firstThirdAvg) / firstThirdAvg) * 100;
    
    if (percentChange > 20) {
        return { direction: 'trend-up', label: 'Increasing coverage' };
    } else if (percentChange < -20) {
        return { direction: 'trend-down', label: 'Decreasing coverage' };
    } else {
        return { direction: 'trend-neutral', label: 'Stable coverage' };
    }
}

/**
 * Analyze the geographic focus in the data
 * @param {Array} data Filtered data array
 * @returns {Object} Focus object with label
 */
function analyzeGeographicFocus(data) {
    // Count by country
    const countryData = [];
    const countryCounts = {};
    
    data.forEach(item => {
        if (item.country && item.country.trim()) {
            countryCounts[item.country] = (countryCounts[item.country] || 0) + 1;
        }
    });
    
    // Convert to array
    Object.entries(countryCounts).forEach(([country, count]) => {
        countryData.push({ country, count });
    });
    
    // Sort by count
    countryData.sort((a, b) => b.count - a.count);
    
    // Calculate concentration metrics
    const totalCountries = countryData.length;
    if (totalCountries === 0) return { label: 'No geographic data' };
    
    const top3Count = countryData.slice(0, 3).reduce((sum, item) => sum + item.count, 0);
    const top3Percentage = Math.round((top3Count / data.length) * 100);
    
    if (top3Percentage > 60) {
        return { label: `High focus on top 3 (${top3Percentage}%)` };
    } else if (top3Percentage > 40) {
        return { label: `Moderate regional focus (${top3Percentage}%)` };
    } else {
        return { label: `Broad global coverage` };
    }
}

/**
 * Analyze the category trends in the data
 * @param {Array} data Filtered data array
 * @returns {Object} Trend object with label
 */
function analyzeCategoryTrend(data) {
    if (data.length < 10) {
        return { label: 'Insufficient data' };
    }
    
    // Sort by date
    const sortedData = [...data].sort((a, b) => {
        if (!a.parsedDate || !b.parsedDate) return 0;
        return a.parsedDate - b.parsedDate;
    });
    
    // Split into two halves by time
    const halfPoint = Math.floor(sortedData.length / 2);
    const firstHalf = sortedData.slice(0, halfPoint);
    const secondHalf = sortedData.slice(halfPoint);
    
    // Get category counts for each half
    const firstHalfCounts = {};
    const secondHalfCounts = {};
    
    firstHalf.forEach(item => {
        if (Array.isArray(item['Corruption Categories'])) {
            item['Corruption Categories'].forEach(category => {
                if (category && category.trim()) {
                    firstHalfCounts[category] = (firstHalfCounts[category] || 0) + 1;
                }
            });
        }
    });
    
    secondHalf.forEach(item => {
        if (Array.isArray(item['Corruption Categories'])) {
            item['Corruption Categories'].forEach(category => {
                if (category && category.trim()) {
                    secondHalfCounts[category] = (secondHalfCounts[category] || 0) + 1;
                }
            });
        }
    });
    
    // Find categories with the most growth
    let maxGrowth = -Infinity;
    let growingCategory = null;
    
    Object.keys(secondHalfCounts).forEach(category => {
        const firstCount = firstHalfCounts[category] || 0;
        const secondCount = secondHalfCounts[category];
        
        // Only consider categories with at least 3 mentions
        if (secondCount >= 3) {
            const growthRate = firstCount > 0 ? (secondCount - firstCount) / firstCount : Infinity;
            
            if (growthRate > maxGrowth) {
                maxGrowth = growthRate;
                growingCategory = category;
            }
        }
    });
    
    if (growingCategory) {
        // Truncate long category names
        const displayCategory = growingCategory.length > 18 ? 
            growingCategory.slice(0, 15) + '...' : 
            growingCategory;
            
        return { label: displayCategory };
    } else {
        return { label: 'No clear trend' };
    }
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

export default {
    updateSummaryStats
};
