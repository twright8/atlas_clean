/**
 * Utility functions for formatting data
 */

/**
 * Format numbers with locale-specific formatting
 * @param {number} num - The number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
    const numberFormatter = new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 0
    });
    return numberFormatter.format(num);
}

/**
 * Extend DataTable sorting for date formats
 * @param {jQuery} jQuery - jQuery instance
 */
export function extendDataTableDateSorting(jQuery) {
    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        "date-eu-pre": function(date) {
            if (date.indexOf("Cancelled") > -1) {
                date = date.split(" ")[0];
            }
            return dmy(date);
        },
        "date-eu-asc": function(a, b) {
            return ((a < b) ? -1 : ((a > b) ? 1 : 0));
        },
        "date-eu-desc": function(a, b) {
            return ((a < b) ? 1 : ((a > b) ? -1 : 0));
        }
    });
}

/**
 * Parse date in dd/mm/yy format
 * @param {string} date - Date string in dd/mm/yy format
 * @returns {Date} Parsed date
 */
export function dmy(date) {
    // This function was referenced but not defined in the original code
    // Implementing a simple date parser for dd/mm/yy format
    if (!date) return null;
    
    const parts = date.split('/');
    if (parts.length !== 3) return 0;
    
    // Convert to YYYY-MM-DD for proper sorting
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-based
    let year = parseInt(parts[2], 10);
    
    // Handle 2-digit years
    if (year < 100) {
        year += year < 50 ? 2000 : 1900;
    }
    
    return new Date(year, month, day).getTime();
}

/**
 * Creates a debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
