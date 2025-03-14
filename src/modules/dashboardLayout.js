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
            <div class="dashboard-row">
                <div class="dashboard-card" id="time-series-card">
                    <h3>Time Series Analysis</h3>
                    <div id="time-series-chart"></div>
                </div>
                <div class="dashboard-card" id="category-breakdown-card">
                    <h3>Integrity Issues by Category</h3>
                    <div id="category-chart"></div>
                </div>
            </div>
            <div class="dashboard-row">
                <div class="dashboard-card" id="top-countries-card">
                    <h3>Top Countries by Articles</h3>
                    <div id="top-countries-chart"></div>
                </div>
                <div class="dashboard-card" id="dashboard-summary-card">
                    <h3>Summary Statistics</h3>
                    <div id="summary-stats">
                        <div class="stat-box">
                            <span class="stat-label">Total Articles</span>
                            <span class="stat-value" id="total-articles">0</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">Countries Represented</span>
                            <span class="stat-value" id="total-countries">0</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">Categories</span>
                            <span class="stat-value" id="total-categories">0</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">Time Period</span>
                            <span class="stat-value" id="time-period">-</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = dashboardHTML;
}

export default {
    createDashboardLayout
};
