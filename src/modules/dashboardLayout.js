/**
 * Module for dashboard layout creation
 */

/**
 * Create the dashboard layout structure
 * @param {HTMLElement} container The container element for the dashboard
 */
export function createDashboardLayout(container) {
    const dashboardHTML = `
        <div class="dashboard-container">
            <!-- Dashboard header with key insights -->
            <div class="dashboard-header-card">
                <div class="dashboard-header-content">
                    <div class="dashboard-header-title">
                        <h2>Health Integrity Insights</h2>
                        <p class="dashboard-subtitle">Analysis of healthcare integrity issues worldwide</p>
                    </div>
                    <div class="dashboard-key-metrics" id="key-metrics">
                        <!-- Filled dynamically -->
                    </div>
                </div>
            </div>
            
            <div class="dashboard-row">
                <!-- Time Series Chart -->
                <div class="dashboard-card" id="time-series-card">
                    <div class="card-header">
                        <h3>Articles Over Time</h3>
                        <div class="card-tools">
                            <button class="view-toggle" id="time-view-toggle" title="Toggle between monthly/yearly view">
                                <i class="fa fa-calendar"></i>
                            </button>
                        </div>
                    </div>
                    <div id="time-series-chart"></div>
                </div>
                
                <!-- Categories Chart -->
                <div class="dashboard-card" id="category-breakdown-card">
                    <div class="card-header">
                        <h3>Integrity Issues by Category</h3>
                        <div class="card-tools">
                            <button class="view-toggle" id="category-view-toggle" title="Toggle between top 5/all categories">
                                <i class="fa fa-bars"></i>
                            </button>
                        </div>
                    </div>
                    <div id="category-chart"></div>
                </div>
            </div>
            
            <div class="dashboard-row">
                <!-- Top Countries Chart -->
                <div class="dashboard-card" id="top-countries-card">
                    <div class="card-header">
                        <h3>Top Countries by Articles</h3>
                        <div class="card-tools">
                            <button class="view-toggle" id="country-view-toggle" title="Toggle between chart/map view">
                                <i class="fa fa-globe"></i>
                            </button>
                        </div>
                    </div>
                    <div id="top-countries-chart"></div>
                </div>
                
                <!-- Summary Statistics -->
                <div class="dashboard-card" id="dashboard-summary-card">
                    <div class="card-header">
                        <h3>Summary Statistics</h3>
                        <div class="date-range-indicator">
                            <i class="fa fa-calendar-o"></i>
                            <span id="time-period-display">-</span>
                        </div>
                    </div>
                    <div id="summary-stats" class="summary-stats-grid">
                        <div class="stat-box">
                            <div class="stat-icon"><i class="fa fa-newspaper-o"></i></div>
                            <div class="stat-content">
                                <span class="stat-value" id="total-articles">0</span>
                                <span class="stat-label">Total Articles</span>
                            </div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-icon"><i class="fa fa-globe"></i></div>
                            <div class="stat-content">
                                <span class="stat-value" id="total-countries">0</span>
                                <span class="stat-label">Countries</span>
                            </div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-icon"><i class="fa fa-tags"></i></div>
                            <div class="stat-content">
                                <span class="stat-value" id="total-categories">0</span>
                                <span class="stat-label">Categories</span>
                            </div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-icon"><i class="fa fa-calendar"></i></div>
                            <div class="stat-content">
                                <span class="stat-value" id="time-period">-</span>
                                <span class="stat-label">Time Period</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- New row for additional insights -->
            <div class="dashboard-row">
                <!-- Trends Analysis Card -->
                <div class="dashboard-card" id="trends-analysis-card">
                    <div class="card-header">
                        <h3>Trend Analysis</h3>
                    </div>
                    <div id="trends-content">
                        <div id="trend-indicators"></div>
                    </div>
                </div>
                
                <!-- Recent Articles Card -->
                <div class="dashboard-card" id="recent-articles-card">
                    <div class="card-header">
                        <h3>Recent Articles</h3>
                        <div class="card-tools">
                            <button class="refresh-btn" id="recent-refresh" title="Refresh list">
                                <i class="fa fa-refresh"></i>
                            </button>
                        </div>
                    </div>
                    <div id="recent-articles-list"></div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = dashboardHTML;
    
    // Initialize event listeners for toggle buttons
    initializeToggleButtons();
}

/**
 * Initialize event listeners for dashboard toggle buttons
 */
function initializeToggleButtons() {
    // Time view toggle (Monthly/Yearly)
    const timeViewToggle = document.getElementById('time-view-toggle');
    if (timeViewToggle) {
        timeViewToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            // The toggle state will be checked in the chart update function
            const event = new CustomEvent('timeViewToggle', {
                detail: { yearly: this.classList.contains('active') }
            });
            document.dispatchEvent(event);
        });
    }
    
    // Category view toggle (Top 5/All)
    const categoryViewToggle = document.getElementById('category-view-toggle');
    if (categoryViewToggle) {
        categoryViewToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            // The toggle state will be checked in the chart update function
            const event = new CustomEvent('categoryViewToggle', {
                detail: { showAll: this.classList.contains('active') }
            });
            document.dispatchEvent(event);
        });
    }
    
    // Country view toggle (Chart/Map)
    const countryViewToggle = document.getElementById('country-view-toggle');
    if (countryViewToggle) {
        countryViewToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            // The toggle state will be checked in the chart update function
            const event = new CustomEvent('countryViewToggle', {
                detail: { mapView: this.classList.contains('active') }
            });
            document.dispatchEvent(event);
        });
    }
    
    // Recent articles refresh button
    const recentRefreshBtn = document.getElementById('recent-refresh');
    if (recentRefreshBtn) {
        recentRefreshBtn.addEventListener('click', function() {
            const event = new CustomEvent('refreshRecentArticles');
            document.dispatchEvent(event);
        });
    }
}

export default {
    createDashboardLayout
};
