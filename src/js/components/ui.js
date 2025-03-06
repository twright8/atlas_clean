/**
 * UI module
 * Handles UI interactions not directly related to the map or filters
 */

/**
 * Initialize UI components
 */
export function initializeUI() {
    setupViewToggle();
    setupFilterToggle();
    setupInfoCard();
    setupShareButtons();
    setupExportButton();
    setupHelpButton();
}

/**
 * Setup view toggle (Map/List/Analytics)
 */
function setupViewToggle() {
    const buttons = document.querySelectorAll('.switch-button');
    const mapOverviewBtn = document.getElementById('map-overview-btn');
    const listBtn = document.getElementById('list-btn');
    const analyticsBtn = document.getElementById('analytics-btn');
    const mapElement = document.getElementById('map');
    const dataTables = document.getElementById('mask');
    const analyticsContainer = document.getElementById('analytics-container');

    function updateVisibility() {
        if (mapOverviewBtn.classList.contains('active')) {
            mapElement.style.display = 'block';
            dataTables.style.display = 'none';
            analyticsContainer.style.display = 'none';
        } else if (listBtn.classList.contains('active')) {
            mapElement.style.display = 'none';
            dataTables.style.display = 'block';
            analyticsContainer.style.display = 'none';
        } else if (analyticsBtn.classList.contains('active')) {
            mapElement.style.display = 'none';
            dataTables.style.display = 'none';
            analyticsContainer.style.display = 'block';
            
            // Trigger a resize event to ensure the chart redraws correctly
            window.dispatchEvent(new Event('resize'));
            
            // Update analytics chart if needed
            if (window.appState && window.appState.updateAnalyticsChart) {
                window.appState.updateAnalyticsChart();
            }
        }
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateVisibility();
        });
    });

    // Initial visibility setup
    updateVisibility();
}

/**
 * Setup filter toggle
 */
function setupFilterToggle() {
    document.querySelector('#clicker').addEventListener('click', function() {
        const content = document.querySelector('.filter-content');
        const icon = document.querySelector('.expand-icon');
        
        content.classList.toggle('expanded');
        icon.classList.toggle('expanded');
    });
}

/**
 * Setup info card overlay
 */
function setupInfoCard() {
    const overlay = document.getElementById('infoCardOverlay');
    
    // Show info card on first visit
    if (!sessionStorage.getItem('hasVisitedBefore')) {
        setTimeout(function() {
            overlay.classList.add('show');
        }, 100);
    }

    // Close button functionality
    document.getElementById('closeInfoCard').addEventListener('click', function() {
        overlay.classList.remove('show');
        sessionStorage.setItem('hasVisitedBefore', 'true');
    });

    // Close when clicking overlay background
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('show');
        }
    });
}

/**
 * Setup social share buttons
 */
function setupShareButtons() {
    // Twitter share
    function shareOnTwitter() {
        var thisPage = window.location.href.split('?')[0];
        var shareText = 'Explore global health sector integrity issues and scandals: ' + thisPage;
        var shareURL = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText);
        window.open(shareURL, '_blank');
    }

    // Facebook share
    function shareOnFacebook() {
        var thisPage = window.location.href.split('?')[0];
        var toShareUrl = 'https://ti-health.org/';
        var shareURL = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(toShareUrl);
        window.open(shareURL, '_blank', 'toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250,top=300,left=300');
    }

    var twitterButton = document.getElementById('twitter_share');
    if (twitterButton) {
        twitterButton.addEventListener('click', shareOnTwitter);
    }

    var facebookButton = document.getElementById('lin_share');
    if (facebookButton) {
        facebookButton.addEventListener('click', shareOnFacebook);
    }
}

/**
 * Setup export button for CSV download
 */
function setupExportButton() {
    var exportButton = $('<button>')
        .addClass('btn btn-sm btn-outline-secondary export-csv-button btn-sharer')
        .html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1z"/><path fill-rule="evenodd" d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708z"/></svg>')
        .attr('title', 'Export filtered data to CSV')
        .appendTo('#export-button-container')
        .on('click', function() {
            // This function needs to access the app state to get filtered data
            // In the actual implementation, we'll use a proper state management approach
            if (window.appState && window.appState.filteredData) {
                exportToCsv(window.appState.filteredData);
            }
        });
}

/**
 * Export data to CSV file
 * @param {Array} dataToExport - Data to export
 */
function exportToCsv(dataToExport) {
    var csv = [];
    var headers = ['Title', 'Country/Region', 'URL', 'Date'];
    csv.push(headers.join(','));

    dataToExport.forEach(function(row) {
        var csvRow = [
            '"' + (row.Title || '').replace(/"/g, '""') + '"',
            '"' + (row.country || '').replace(/"/g, '""') + '"',
            '"' + (row.url || '').replace(/"/g, '""') + '"',
            '"' + (row['Date'] || '').replace(/"/g, '""') + '"'
        ];
        csv.push(csvRow.join(','));
    });

    var csvContent = csv.join('\n');
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement("a");
    if (link.download !== undefined) {
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "export.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

/**
 * Setup help button
 */
function setupHelpButton() {
    var helpButton = $('<button>')
        .addClass('btn btn-sm btn-outline-secondary export-csv-button btn-sharer')
        .html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3l58.3 0c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24l0-13.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1l-58.3 0c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>')
        .attr('title', 'Open the Quick start menu')
        .appendTo('#help-button-container')
        .css({
            'min-height': '34px',
            'display': 'flex',
            'align-items': 'center',
            'justify-content': 'center'
        })
        .on('click', function(){
            $('#infoCardOverlay').addClass('show');
        });
}
