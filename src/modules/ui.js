// ui.js
import { infoBoxes } from './constants';

let currentInfoBox = null;

export function initializeViewToggle() {
    const buttons = document.querySelectorAll('.switch-button');
    const mapOverviewBtn = document.getElementById('map-overview-btn');
    const dashboardBtn = document.getElementById('dashboard-btn');
    const listBtn = document.getElementById('cases-btn');
    const mapElement = document.getElementById('map');
    const dashboardElement = document.getElementById('dashboard');
    const dataTables = document.getElementById('mask');

    function updateVisibility() {
        const previouslyActiveButton = document.querySelector('.switch-button.active');
        let activeView = null;
        if (mapOverviewBtn.classList.contains('active')) activeView = 'map';
        else if (listBtn.classList.contains('active')) activeView = 'list';
        else if (dashboardBtn.classList.contains('active')) activeView = 'dashboard';

        mapElement.style.display = (activeView === 'map') ? 'block' : 'none';
        dashboardElement.style.display = (activeView === 'dashboard') ? 'block' : 'none';
        dataTables.style.display = (activeView === 'list') ? 'block' : 'none';

        if (activeView === 'map') {
            if (window.map) {
                setTimeout(() => {
                    window.map.invalidateSize();
                    if (typeof window.updateMapView === 'function') {
                        window.updateMapView();
                    } else if (typeof window.updateVisibleData === 'function') {
                         window.updateVisibleData();
                    }
                }, 150);
            }
        } else if (activeView === 'dashboard') {
             if (typeof window.forceUpdateDashboard === 'function') {
                 setTimeout(window.forceUpdateDashboard, 150);
             }
             if (typeof window.handleDashboardResize === 'function') {
                 setTimeout(window.handleDashboardResize, 250);
             }
        } else if (activeView === 'list') {
             if (typeof window.updateVisibleData === 'function') {
                window.updateVisibleData.cancel?.();
                window.updateVisibleData();
             }
        }
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (!button.classList.contains('active')) {
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // GA Event Tracking for Tab Switch
                if (typeof gtag === 'function') {
                    let viewName = 'unknown_view';
                    if (button.id === 'map-overview-btn') viewName = 'map_view';
                    else if (button.id === 'cases-btn') viewName = 'list_view';
                    else if (button.id === 'dashboard-btn') viewName = 'dashboard_view';

                    gtag('event', 'switch_view', {
                        'event_category': 'navigation',
                        'event_label': viewName
                    });
                }
                updateVisibility();
            }
        });
    });
    updateVisibility();
}

export function initializeFilterBox() {
    const clicker = document.querySelector('#clicker');
    if (clicker) {
        clicker.addEventListener('click', function() {
            const content = document.querySelector('.filter-content');
            const icon = document.querySelector('.expand-icon');
            if (content) content.classList.toggle('expanded');
            if (icon) icon.classList.toggle('expanded');
        });
    }
}

export function initializeSelect2Filter(selector, data, placeholder, onChange) {
    $(selector).select2({
        data: data.map(item => ({ id: item, text: item })),
        placeholder: placeholder,
        allowClear: true // Good to have for filters
    }).on('change', onChange);
}

export function initializeDatePickers(onChange, dateRange) {
    $('#startDate, #endDate').datepicker({
        format: 'dd/mm/yy',
        autoclose: true
    }).on('changeDate', onChange);

    if (dateRange && dateRange.maxDate) { // Ensure dateRange and maxDate exist
        $('#startDate').datepicker('setDate', "01/01/2022"); // Or a dynamic min if available
        $('#endDate').datepicker('setDate', dateRange.maxDate);
    }
}

export function initializeSearchInput(onChange, debounceTime = 500) {
    $('#search-input').on('input', debounce(onChange, debounceTime));
}

export function initializeFilterCheckboxes(checkboxes) {
    Object.entries(checkboxes).forEach(([id, handler]) => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener('change', handler);
        }
    });
}

export function initializeResetButton(resetFunction) {
    $('#resetFilters').on('click', resetFunction);
}

export function updateResetButtonVisibility(isActive) {
    if (isActive) {
        $('#resetFilters').show();
    } else {
        $('#resetFilters').hide();
    }
}

export function createInfoBox(content, target) {
    if (currentInfoBox) {
        currentInfoBox.remove();
    }
    const infoBox = document.createElement('div');
    infoBox.className = 'info-box';
    infoBox.textContent = content;
    document.body.appendChild(infoBox);
    const targetRect = target.getBoundingClientRect();
    infoBox.style.top = `${targetRect.bottom + window.scrollY + 5}px`;
    infoBox.style.left = `${targetRect.left + window.scrollX - 150}px`; // Adjust as needed
    infoBox.style.display = 'block';
    currentInfoBox = infoBox;
}

export function initializeInfoIcons() {
    function handleInfoIconClick(e) {
        e.preventDefault();
        e.stopPropagation();
        const filterType = this.getAttribute('data-filter');
        const infoContent = infoBoxes[filterType];
        if (infoContent) {
            createInfoBox(infoContent, this);
        }
    }
    const infoIconIds = [
        'main-info', 'country-info', 'corruption-info', 'health-info',
        'date-info', 'archived-info', 'case-info', 'unreliable-info',
        'country-level-info'
    ];
    infoIconIds.forEach(id => {
        const icon = document.getElementById(id);
        if (icon) {
            icon.addEventListener('click', handleInfoIconClick);
            icon.addEventListener('mousedown', e => e.preventDefault()); // Prevent text selection
        }
    });
    document.addEventListener('click', function(e) {
        if (currentInfoBox && !e.target.classList.contains('info-icon') && !e.target.closest('.info-box')) {
            currentInfoBox.remove();
            currentInfoBox = null;
        }
    });
}

export function initializeWelcomeOverlay() {
    const overlay = document.getElementById('infoCardOverlay');
    const closeButton = document.getElementById('closeInfoCard');

    if (overlay && !sessionStorage.getItem('hasVisitedBefore')) {
        setTimeout(function() {
            overlay.classList.add('show');
        }, 100);
    }

    if (closeButton) {
        closeButton.addEventListener('click', function() {
            if (overlay) overlay.classList.remove('show');
            sessionStorage.setItem('hasVisitedBefore', 'true');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
                sessionStorage.setItem('hasVisitedBefore', 'true'); // Also set if clicked outside
            }
        });
    }
}

export function initializeHelpButton() {
    var helpButtonContainer = document.getElementById('help-button-container');
    if (helpButtonContainer) {
        var helpButton = $('<button>')
            .addClass('btn btn-sm btn-outline-secondary export-csv-button btn-sharer') // Re-using classes
            .html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3l58.3 0c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24l0-13.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1l-58.3 0c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>')
            .attr('title', 'Open the Quick start menu')
            .appendTo(helpButtonContainer) // Use jQuery's appendTo
            .css({
                'min-height': '34px',
                'display': 'flex',
                'align-items': 'center',
                'justify-content': 'center'
            })
            .on('click', function(){
                const overlay = document.getElementById('infoCardOverlay');
                if (overlay) $(overlay).addClass('show'); // Use jQuery for consistency if preferred
            });
    }
}

export function initializeShareButtons() {
    function shareOnTwitter() {
        var thisPage = window.location.href.split('?')[0];
        var shareText = 'Explore global health sector integrity issues and scandals: ' + thisPage;
        var shareURL = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText);
        window.open(shareURL, '_blank');
    }

    function shareOnFacebook() { // Changed from LinkedIn to Facebook as per your HTML
        var toShareUrl = 'https://ti-health.org/'; // Or window.location.href.split('?')[0];
        var shareURL = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(toShareUrl);
        window.open(shareURL, '_blank', 'toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250,top=300,left=300');
    }

    var twitterButton = document.getElementById('twitter_share');
    if (twitterButton) {
        twitterButton.addEventListener('click', shareOnTwitter);
    }

    var facebookButton = document.getElementById('lin_share'); // ID is lin_share but function is for Facebook
    if (facebookButton) {
        facebookButton.addEventListener('click', shareOnFacebook);
    }
}

export function initializeExportButton(getDataFunction) {
    var exportButtonContainer = document.getElementById('export-button-container');
    if (exportButtonContainer) {
        var exportButton = $('<button>')
            .addClass('btn btn-sm btn-outline-secondary export-csv-button btn-sharer')
            .html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1z"/><path fill-rule="evenodd" d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708z"/></svg>')
            .attr('title', 'Export filtered data to CSV')
            .appendTo(exportButtonContainer) // Use jQuery's appendTo
            .on('click', function() {
                var dataToExport = getDataFunction();
                var csv = [];
                var headers = ['Title', 'Country/Region', 'URL', 'Date']; // Customize as needed
                csv.push(headers.join(','));

                dataToExport.forEach(function(row) {
                    var csvRow = [
                        '"' + (row.Title || '').replace(/"/g, '""') + '"',
                        '"' + (row.country || '').replace(/"/g, '""') + '"',
                        '"' + (row.url || '').replace(/"/g, '""') + '"',
                        '"' + (row['Date'] || '').replace(/"/g, '""') + '"'
                        // Add more fields if necessary, ensure they match headers
                    ];
                    csv.push(csvRow.join(','));
                });

                var csvContent = csv.join('\n');
                var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                var link = document.createElement("a");
                if (link.download !== undefined) {
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", "health_atlas_export.csv"); // More descriptive filename
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url); // Clean up blob URL

                    // GA Event Tracking for Export
                    if (typeof gtag === 'function') {
                        gtag('event', 'export_data', {
                            'event_category': 'engagement',
                            'event_label': 'csv_export',
                            'value': dataToExport.length
                        });
                    }
                }
            });
    }
}

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

export default {
    initializeViewToggle,
    initializeFilterBox,
    initializeSelect2Filter,
    initializeDatePickers,
    initializeSearchInput,
    initializeFilterCheckboxes,
    initializeResetButton,
    updateResetButtonVisibility,
    createInfoBox,
    initializeInfoIcons,
    initializeWelcomeOverlay,
    initializeHelpButton,
    initializeShareButtons,
    initializeExportButton,
    debounce
};