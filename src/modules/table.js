import { dataTableSettings } from './constants';

let dataTable;

/**
 * Initialize the data table with configuration
 * @returns {Object} DataTable instance
 */
export function initializeDataTable() {
    console.time('DataTable Initialization');
    
    // Extend jQuery DataTables with custom date sorting for European date format (dd/mm/yy)
    extendDataTableSorting();
    
    // Initialize the datatable with settings
    dataTable = $('#dc-data-table').DataTable(dataTableSettings);
    
    console.timeEnd('DataTable Initialization');
    return dataTable;
}

/**
 * Extend DataTable with custom date sorting for European format dates
 */
function extendDataTableSorting() {
    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        "date-eu-pre": function(date) {
            if (date.indexOf("Cancelled") > -1) {
                date = date.split(" ")[0];
            }
            return parseDateDMY(date);
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
 * @param {String} dateStr Date string to parse
 * @returns {Date|null} Parsed date or null
 */
function parseDateDMY(dateStr) {
    // Use d3's built-in parser or implement our own
    const dmy = d3.timeParse("%d/%m/%y");
    return dmy(dateStr);
}

/**
 * Update the data table with new data
 * @param {Array} data Data array to display in the table
 */
export function updateDataTable(data) {
    dataTable.clear().rows.add(data).draw();
}

/**
 * Get current data table instance
 * @returns {Object} DataTable instance
 */
export function getDataTable() {
    return dataTable;
}

export default {
    initializeDataTable,
    updateDataTable,
    getDataTable
};
