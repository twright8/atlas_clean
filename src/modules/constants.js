// Shared constants across the application

// Info tooltips content
export const infoBoxes = {
    country: "Country mentioned in the article. This is usually, but not always, where the story occured.",
    corruption: "We used AI to identify when a story is related to a particular theme related to integrity. See our 'About' page for qualifications and limitations.",
    health: "We used AI to identify when a story is related to a particular area of health. See our 'About' page for qualifications and limitations.",
    date: "Set a date range to view which events have happened within a specific time period. Our archived data uses publication date.",
    archived: "When checked, this includes articles collected using our earlier data gathering methods. We've since improved our collection process. Unchecked shows only articles collected with our current methods.",
    cased: "When checked, this filters out general discussions and commentaries to focus on stories about specific corruption cases. Check it to include all articles.",
    unreliable: "We use AI to identify potentially unreliable news stories based on their writing style and content. While keeping this checked can help reduce exposure to low-quality news, please note: The filter works automatically with no human oversight. It may incorrectly flag legitimate stories as unreliable. It may miss unreliable stories. It can reflect biases present in AI training data. Think of it as a helpful but unverified first pass rather than a definitive assessment of reliability.",
    countryLevel: "When checked, this shows only articles where a specific location within the country could be determined. Check it to include articles where only the country-level location was identified."
};

// Map marker settings
export const markerSettings = {
    countryIcon: {
        className: 'custom-div-icon',
        html: '<i style="color: #e5007d;" class="fa fa-map-marker fa-3x"></i>',
        iconSize: [30, 42],
        iconAnchor: [15, 42]
    },
    specificIcon: {
        className: 'custom-div-icon',
        html: '<i style="color: #3694d1;" class="fa fa-map-marker fa-3x"></i>',
        iconSize: [30, 42],
        iconAnchor: [15, 42]
    },
    legendPosition: 'bottomright'
};

// Data table settings
export const dataTableSettings = {
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
};

// Tile layer URLs
export const tileLayers = {
    openStreetMap: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
        options: {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }
    },
    stamenTerrain: {
        url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png',
        options: {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: 'abcd',
            minZoom: 2,
            maxZoom: 18
        }
    }
};
