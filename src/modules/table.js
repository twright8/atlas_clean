// table.js
import { dataTableSettings as originalDataTableSettings } from './constants'; // Keep original for other settings
import * as d3 from 'd3'; // Assuming d3 is used for date parsing as in your original file

let dataTable;

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

function parseDateDMY(dateStr) {
    const dmy = d3.timeParse("%d/%m/%y");
    return dmy(dateStr);
}

export function initializeDataTable() {
    console.time('DataTable Initialization');
    extendDataTableSorting();

    const dataTableSettings = {
        ...originalDataTableSettings, // Spread original settings
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
            {
                data: 'url',
                render: function(data, type, row) {
                    if (data) {
                        // IMPORTANT: Ensure the URL is properly escaped for use in JavaScript string
                        const escapedUrl = data.replace(/'/g, "\\'");
                        return `<a href="${data}" target="_blank" onclick="trackOutboundLink('${escapedUrl}', 'table_view'); return true;">Link</a>`;
                    }
                    return '';
                }
            },
            { data: 'Date' },
            {
                data: 'Corruption Categories', render: function(data, type, row) {
                    if (!data) return '';
                    let strData = String(data);
                    return strData.replace(/,(?=[^\s])/g, ', ');
                }
            }
        ]
    };

    dataTable = $('#dc-data-table').DataTable(dataTableSettings);
    console.timeEnd('DataTable Initialization');
    return dataTable;
}

export function updateDataTable(data) {
    if (dataTable) {
        dataTable.clear().rows.add(data).draw();
    }
}

export function getDataTable() {
    return dataTable;
}

export default {
    initializeDataTable,
    updateDataTable,
    getDataTable
};