/**
 * Analytics integration hook
 * This module provides proper integration between filters and the analytics chart
 */
(function() {
    // Track initialization status
    let initialized = false;
    let lastFilterTime = 0;
    
    // Wait for document to be ready
    if (document.readyState === "complete") {
        initializeHook();
    } else {
        window.addEventListener('load', initializeHook);
    }
    
    // Initialize the hook with a slight delay to ensure other scripts are loaded
    function initializeHook() {
        setTimeout(function() {
            console.log("Initializing analytics data hook");
            setupFilterHooks();
            setupDataChangeMonitoring();
            setupResetButtonHook();
            initialized = true;
        }, 1000);
    }
    
    // Set up hooks for filter changes
    function setupFilterHooks() {
        try {
            // Monitor Select2 dropdowns
            hookSelect2Filters();
            
            // Monitor date pickers
            hookDatePickers();
            
            // Monitor checkboxes
            hookCheckboxes();
            
            // Monitor search input
            hookSearchInput();
            
            console.log("Filter hooks established");
        } catch (error) {
            console.error("Error setting up filter hooks:", error);
        }
    }
    
    // Hook into Select2 dropdown changes
    function hookSelect2Filters() {
        const select2Filters = [
            $('#countryFilter'),
            $('#corruptionCategoriesFilter'),
            $('#healthCategoriesFilter')
        ];
        
        select2Filters.forEach(filter => {
            if (filter.length) {
                filter.on('change', function() {
                    notifyFilterChange();
                });
            }
        });
    }
    
    // Hook into date picker changes
    function hookDatePickers() {
        $('#startDate, #endDate').on('changeDate', function() {
            notifyFilterChange();
        });
    }
    
    // Hook into checkbox changes
    function hookCheckboxes() {
        const checkboxes = [
            document.getElementById('archivedFilter'),
            document.getElementById('caseFilter'),
            document.getElementById('unreliableFilter'),
            document.getElementById('countryLevelFilter')
        ];
        
        checkboxes.forEach(checkbox => {
            if (checkbox) {
                checkbox.addEventListener('change', function() {
                    notifyFilterChange();
                });
            }
        });
    }
    
    // Hook into search input
    function hookSearchInput() {
        $('#search-input').on('input', debounce(function() {
            notifyFilterChange();
        }, 500));
    }
    
    // Hook into the reset button
    function setupResetButtonHook() {
        const resetButton = document.getElementById('resetFilters');
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                notifyFilterChange(500); // Longer delay for reset
            });
        }
    }
    
    // Set up monitoring for data changes
    function setupDataChangeMonitoring() {
        // Try to hook into the applyFilters function if it exists
        if (typeof window.applyFilters === 'function') {
            const originalApplyFilters = window.applyFilters;
            window.applyFilters = function() {
                const result = originalApplyFilters.apply(this, arguments);
                notifyFilterChange();
                return result;
            };
            console.log("Successfully hooked into applyFilters function");
        }
        
        // Monitor DataTable updates
        try {
            const dataTable = $('#dc-data-table');
            if (dataTable.length) {
                dataTable.on('draw.dt', function() {
                    notifyFilterChange();
                });
                console.log("Successfully hooked into DataTable updates");
            }
        } catch (e) {
            console.error("Error setting up DataTable monitoring:", e);
        }
        
        // Fallback: Monitor appState data changes
        let lastDataCount = 0;
        setInterval(function() {
            if (window.appState && window.appState.filteredData) {
                const currentCount = window.appState.filteredData.length;
                if (currentCount !== lastDataCount) {
                    lastDataCount = currentCount;
                    notifyFilterChange();
                }
            }
        }, 1000);
    }
    
    // Notify that filters have changed and analytics chart should update
    function notifyFilterChange(delay = 250) {
        // Avoid duplicate notifications within a short time period
        const now = Date.now();
        if (now - lastFilterTime < 200) return;
        lastFilterTime = now;
        
        setTimeout(function() {
            // Check if analytics tab is active
            const analyticsBtn = document.getElementById('analytics-btn');
            if (!analyticsBtn || !analyticsBtn.classList.contains('active')) {
                return; // Don't update if analytics tab isn't active
            }
            
            console.log("Filter change detected, updating analytics chart");
            
            // Try using window.appState.updateAnalyticsChart first (preferred method)
            if (window.appState && typeof window.appState.updateAnalyticsChart === 'function') {
                try {
                    window.appState.updateAnalyticsChart();
                    console.log("Chart updated via appState function");
                    return;
                } catch (e) {
                    console.error("Error updating via appState:", e);
                }
            }
            
            // Fall back to the updateChart function in analytics.js if available
            if (typeof window.updateChart === 'function') {
                try {
                    window.updateChart();
                    console.log("Chart updated via updateChart function");
                    return;
                } catch (e) {
                    console.error("Error updating via updateChart:", e);
                }
            }
            
            // If direct access to updateAnalyticsChart is available, use it
            if (window.updateAnalyticsChart) {
                try {
                    window.updateAnalyticsChart(
                        window.analyticsChart, 
                        window.appState.filteredData
                    );
                    console.log("Chart updated via direct function call");
                    return;
                } catch (e) {
                    console.error("Error updating via direct function:", e);
                }
            }
            
            // Last resort: Trigger a resize event which might trigger a chart update
            try {
                window.dispatchEvent(new Event('resize'));
                console.log("Resize event triggered as fallback");
            } catch (e) {
                console.error("Error triggering resize:", e);
            }
        }, delay);
    }
    
    // Debounce function to limit how often a function runs
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }
})();
