/**
 * Data table component
 * Handles initialization and updating of the data table
 */

/**
 * Initialize the data table
 * @returns {Object} DataTable instance
 */
export function initializeDataTable() {
    console.time('DataTable Initialization');
    const dataTable = $('#dc-data-table').DataTable({
        searching: false,
        lengthChange: false,
        columns: [
            { 
                data: 'Title', 
                width: '50%', 
                defaultContent: "N/A",
                render: function(data, type, row) {
                    return data ? `"${data}"` : 'N/A';
                }
            },
            { data: 'country' },
            { data: 'url', render: function(data, type, row) {
                return data ? `<a href="${data}" target="_blank">Link</a>` : '';
            }},
            { data: 'Date' },
            { data: 'Corruption Categories', render: function(data, type, row) {
                if (!data) return '';
                let strData = String(data);
                return strData.replace(/,(?=[^\s])/g, ', ');
            }}
        ],
        columnDefs: [
            { type: 'date-eu', targets: 3 }
        ],
        order: [[3, 'desc']]
    });
    console.timeEnd('DataTable Initialization');
    return dataTable;
}

/**
 * Update the data table with new data
 * @param {Object} dataTable - DataTable instance 
 * @param {Array} data - Data to display
 */
export function updateDataTable(dataTable, data) {
    dataTable.clear().rows.add(data).draw();
}
