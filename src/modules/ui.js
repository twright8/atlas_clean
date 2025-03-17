import { infoBoxes } from './constants';

let currentInfoBox = null;

/**
 * Initialize view toggling between map, dashboard, and table
 */
export function initializeViewToggle() {
    const buttons = document.querySelectorAll('.switch-button');
    const mapOverviewBtn = document.getElementById('map-overview-btn');
    const dashboardBtn = document.getElementById('dashboard-btn');
    const listBtn = document.getElementById('cases-btn');
    const mapElement = document.getElementById('map');
    const dashboardElement = document.getElementById('dashboard');
    const dataTables = document.getElementById('mask');

    function updateVisibility() {
        if (mapOverviewBtn.classList.contains('active')) {
            mapElement.style.display = 'block';
            dashboardElement.style.display = 'none';
            dataTables.style.display = 'none';
            
            // Trigger map resize event to ensure proper rendering
            if (window.map) {
                setTimeout(() => {
                    window.map.invalidateSize();
                    
                    // Trigger an update of visible data when switching to map
                    if (typeof window.updateMapView === 'function') {
                        window.updateMapView();
                    }
                }, 100);
            }
        } else if (listBtn.classList.contains('active')) {
            mapElement.style.display = 'none';
            dashboardElement.style.display = 'none';
            dataTables.style.display = 'block';
        } else if (dashboardBtn.classList.contains('active')) {
            mapElement.style.display = 'none';
            dashboardElement.style.display = 'block';
            dataTables.style.display = 'none';
            
            // Force dashboard refresh when displaying
            if (typeof window.handleDashboardResize === 'function') {
                setTimeout(window.handleDashboardResize, 100);
            }
            
            // Force update of all dashboard charts with current filtered data
            if (typeof window.forceUpdateDashboard === 'function') {
                setTimeout(window.forceUpdateDashboard, 200);
            }
        }
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateVisibility();
            
            // Force dashboard refresh when dashboard tab is selected
            if (button.id === 'dashboard-btn') {
                if (typeof window.handleDashboardResize === 'function') {
                    setTimeout(window.handleDashboardResize, 200);
                }
                
                if (typeof window.forceUpdateDashboard === 'function') {
                    setTimeout(window.forceUpdateDashboard, 300);
                }
            }
            
            // When switching to the map view, ensure the filter updates with visible data
            if (button.id === 'map-overview-btn') {
                setTimeout(() => {
                    if (typeof window.updateMapView === 'function') {
                        window.updateMapView();
                    } else if (typeof window.updateVisibleData === 'function') {
                        window.updateVisibleData();
                    }
                }, 200);
            }
        });
    });

    // Initial visibility setup
    updateVisibility();
}

/**
 * Initialize the filter box expand/collapse functionality
 */
export function initializeFilterBox() {
    document.querySelector('#clicker').addEventListener('click', function() {
        const content = document.querySelector('.filter-content');
        const icon = document.querySelector('.expand-icon');
        
        content.classList.toggle('expanded');
        icon.classList.toggle('expanded');
    });
}

/**
 * Initialize filter functionality for Select2 dropdowns
 * @param {String} selector CSS selector for the dropdown
 * @param {Array} data Array of options
 * @param {String} placeholder Placeholder text
 * @param {Function} onChange Function to call when selection changes
 */
export function initializeSelect2Filter(selector, data, placeholder, onChange) {
    $(selector).select2({
        data: data.map(item => ({ id: item, text: item })),
        placeholder: placeholder,
    }).on('change', onChange);
}

/**
 * Initialize date picker widgets
 * @param {Function} onChange Function to call when date changes
 * @param {Object} dateRange Object with minDate and maxDate
 */
export function initializeDatePickers(onChange, dateRange) {
    $('#startDate, #endDate').datepicker({
        format: 'dd/mm/yy',
        autoclose: true
    }).on('changeDate', onChange);

    // Set initial dates
    $('#startDate').datepicker('setDate', "01/01/2022");
    $('#endDate').datepicker('setDate', dateRange.maxDate);
}

/**
 * Initialize search input with debounce
 * @param {Function} onChange Function to call when search input changes
 * @param {Number} debounceTime Debounce time in milliseconds
 */
export function initializeSearchInput(onChange, debounceTime = 500) {
    $('#search-input').on('input', debounce(onChange, debounceTime));
}

/**
 * Initialize filter checkboxes
 * @param {Object} checkboxes Object with checkbox IDs and change handlers
 */
export function initializeFilterCheckboxes(checkboxes) {
    Object.entries(checkboxes).forEach(([id, handler]) => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener('change', handler);
        }
    });
}

/**
 * Initialize reset filters button
 * @param {Function} resetFunction Function to reset all filters
 */
export function initializeResetButton(resetFunction) {
    $('#resetFilters').on('click', resetFunction);
}

/**
 * Update reset button visibility based on filter state
 * @param {Boolean} isActive Whether any filter is active
 */
export function updateResetButtonVisibility(isActive) {
    if (isActive) {
        $('#resetFilters').show();
    } else {
        $('#resetFilters').hide();
    }
}

/**
 * Create an info box tooltip
 * @param {String} content Content for the tooltip
 * @param {HTMLElement} target Target element to position tooltip near
 */
export function createInfoBox(content, target) {
    console.log('Creating info box for:', content);
    if (currentInfoBox) {
        currentInfoBox.remove();
    }

    const infoBox = document.createElement('div');
    infoBox.className = 'info-box';
    infoBox.textContent = content;
    document.body.appendChild(infoBox);

    const targetRect = target.getBoundingClientRect();
    infoBox.style.top = `${targetRect.bottom + window.scrollY + 5}px`;
    infoBox.style.left = `${targetRect.left + window.scrollX - 150}px`;
    infoBox.style.display = 'block';

    currentInfoBox = infoBox;
    console.log('Info box created and displayed');
}

/**
 * Initialize info icons for tooltips
 */
export function initializeInfoIcons() {
    function handleInfoIconClick(e) {
        console.log('Info icon clicked:', this.id);
        e.preventDefault();
        e.stopPropagation();
        const filterType = this.getAttribute('data-filter');
        const infoContent = infoBoxes[filterType];
        createInfoBox(infoContent, this);
    }

    const infoIconIds = [
        'main-info', 'country-info', 'corruption-info', 'health-info', 
        'date-info', 'archived-info', 'case-info', 'unreliable-info', 
        'country-level-info'
    ];

    infoIconIds.forEach(id => {
        const icon = document.getElementById(id);
        if (icon) {
            console.log('Attaching click event to:', id);
            icon.addEventListener('click', handleInfoIconClick);
            icon.addEventListener('mousedown', e => e.preventDefault());
        } else {
            console.warn('Info icon not found:', id);
        }
    });

    // Close info box when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (currentInfoBox && !e.target.classList.contains('info-icon')) {
            console.log('Closing info box');
            currentInfoBox.remove();
            currentInfoBox = null;
        }
    });
}

/**
 * Initialize welcome dialog/overlay
 */
export function initializeWelcomeOverlay() {
    const overlay = document.getElementById('infoCardOverlay');
            
    if (!sessionStorage.getItem('hasVisitedBefore')) {
        setTimeout(function() {
            overlay.classList.add('show');
        }, 100);
    }

    document.getElementById('closeInfoCard').addEventListener('click', function() {
        overlay.classList.remove('show');
        sessionStorage.setItem('hasVisitedBefore', 'true');
    });
    
    // Close when clicking overlay background
    $('#infoCardOverlay').on('click', function(e) {
        if (e.target === this) {
            $(this).removeClass('show');
        }
    });
}

/**
 * Initialize help button to open overlay
 */
export function initializeHelpButton() {
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

/**
 * Initialize share buttons
 */
export function initializeShareButtons() {
    function shareOnTwitter() {
        var thisPage = window.location.href.split('?')[0];
        var shareText = 'Explore global health sector integrity issues and scandals: ' + thisPage;
        var shareURL = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText);
        window.open(shareURL, '_blank');
    }

    function shareOnLinkedIn() {
        var thisPage = window.location.href.split('?')[0];
        var toShareUrl = 'https://ti-health.org/';
        var shareURL = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(toShareUrl);
        window.open(shareURL, '_blank', 'toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250,top=300,left=300');
        return;
    }

    var twitterButton = document.getElementById('twitter_share');
    if (twitterButton) {
        twitterButton.addEventListener('click', shareOnTwitter);
    }

    var linkedInButton = document.getElementById('lin_share');
    if (linkedInButton) {
        linkedInButton.addEventListener('click', shareOnLinkedIn);
    }
}

/**
 * Initialize export data button
 * @param {Function} getDataFunction Function to get current filtered data
 */
export function initializeExportButton(getDataFunction) {
    var exportButton = $('<button>')
        .addClass('btn btn-sm btn-outline-secondary export-csv-button btn-sharer')
        .html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1z"/><path fill-rule="evenodd" d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708z"/></svg>')
        .attr('title', 'Export filtered data to CSV')
        .appendTo('#export-button-container')
        .on('click', function() {
            var dataToExport = getDataFunction();
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
        });
}

/**
 * Utility function to debounce function calls
 * @param {Function} func Function to debounce
 * @param {Number} wait Wait time in milliseconds
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