document.addEventListener('DOMContentLoaded', function() {
    console.time('Total Initialization');
    console.log("Initialization started");
            var overlay = document.getElementById('infoCardOverlay');
            
            if (!sessionStorage.getItem('hasVisitedBefore')) {
                setTimeout(function() {
                    overlay.classList.add('show');
                }, 100);
            }

            document.getElementById('closeInfoCard').addEventListener('click', function() {
                overlay.classList.remove('show');
                sessionStorage.setItem('hasVisitedBefore', 'true');
            });

    console.time('Map Initialization');
    var map = L.map('map').setView([0, 0], 2);  // Start with a global view

    var openStreetMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 10
    });

    var stamenTerrainLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 10
    });
const buttons = document.querySelectorAll('.switch-button');
const mapOverviewBtn = document.getElementById('map-overview-btn');
const listBtn = document.getElementById('list-btn');
const mapElement = document.getElementById('map'); // Changed variable name
const dataTables = document.getElementById('mask');

function updateVisibility() {
    if (mapOverviewBtn.classList.contains('active')) {
        mapElement.style.display = 'block'; // Updated variable name
        dataTables.style.display = 'none';
    } else {
        mapElement.style.display = 'none'; // Updated variable name
        dataTables.style.display = 'block';
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
    var currentLayer = openStreetMapLayer.addTo(map);

    function switchTileLayer() {
        map.removeLayer(currentLayer);
        if (currentLayer === openStreetMapLayer) {
            currentLayer = stamenTerrainLayer.addTo(map);
            console.log('Switched to Stamen Terrain tiles');
        } else {
            currentLayer = openStreetMapLayer.addTo(map);
            console.log('Switched to OpenStreetMap tiles');
        }
    }

    var consecutiveErrors = 0;
    var maxConsecutiveErrors = 5;

    currentLayer.on('tileerror', function(error) {
        console.log('Tile loading error:', error);
        consecutiveErrors++;
        
        if (consecutiveErrors >= maxConsecutiveErrors) {
            console.log(`${maxConsecutiveErrors} consecutive errors. Switching tile layer.`);
            switchTileLayer();
            consecutiveErrors = 0;
        }
    });

    currentLayer.on('tileload', function() {
        consecutiveErrors = 0;
    });

    var markers = L.markerClusterGroup({
        chunkedLoading: true,
        chunkInterval: 200,
        chunkDelay: 50
    });
    map.addLayer(markers);
    console.timeEnd('Map Initialization');

    console.time('DataTable Initialization');
    var dataTable = $('#dc-data-table').DataTable({
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
            // Check if data exists and convert to string
            if (!data) return '';
            
            // Convert to string if it isn't already
            let strData = String(data);
            
            // Now replace the commas
            return strData.replace(/,(?=[^\s])/g, ', ');
        }}
        ],
        columnDefs: [
            { type: 'date-eu', targets: 3 }
        ],
        order: [[3, 'desc']]
		
    });
    console.timeEnd('DataTable Initialization');

    jQuery.extend( jQuery.fn.dataTableExt.oSort, {
        "date-eu-pre": function (date) {
            if(date.indexOf("Cancelled") > -1){
                date = date.split(" ")[0];
            }
            return dmy(date);
        },
        "date-eu-asc": function ( a, b ) {
            return ((a < b) ? -1 : ((a > b) ? 1 : 0));
        },
        "date-eu-desc": function ( a, b ) {
            return ((a < b) ? 1 : ((a > b) ? -1 : 0));
        }
    });

    const numberFormatter = new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 0
    });

    function formatNumber(num) {
        return numberFormatter.format(num);
    }

    let allData = [];
    let filteredData = [];
    const markerMap = new Map();
    let minDate, maxDate;

    function debounce(func, wait) {
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

    console.time('Data Fetching');
    fetch('./data/loc3.json')
        .then(response => response.json())
        .then(data => {
            console.timeEnd('Data Fetching');
            initMap(data);
        })
        .catch(error => console.error('Error loading data:', error));
			const archivedFilter = document.getElementById('archivedFilter');
		const caseFilter = document.getElementById('caseFilter');	
					const unreliableFilter = document.getElementById('unreliableFilter');
	let selectedIndustries = new Set();

// Add event listeners for industry buttons
document.getElementById('health-industry').addEventListener('click', function() {
    toggleIndustry(this, 'Health');
});

document.getElementById('defence-industry').addEventListener('click', function() {
    toggleIndustry(this, 'Defence');
});
function toggleIndustry(button, industry) {
    button.classList.toggle('active');
    if (selectedIndustries.has(industry)) {
        selectedIndustries.delete(industry);
    } else {
        selectedIndustries.add(industry);
    }
    updateFilters();
    updateResetButtonVisibility();
}
    function initMap(data) {
        console.time('Data Processing');
        const dateParser = d3.timeParse("%d/%m/%y");
        allData = data.map(d => ({
            ...d,
            parsedDate: dateParser(d['Date'])
        }));

        $('.total-count').text(formatNumber(allData.length));

        const uniqueCountries = [...new Set(allData.map(item => item.country))].sort((a, b) => a.localeCompare(b));
        const uniqueCorruptionCategories = [...new Set(allData.flatMap(item => item['Corruption Categories']))].sort((a, b) => a.localeCompare(b));
        const uniqueHealthCategories = [...new Set(allData.flatMap(item => item['Sector Categories']))].sort((a, b) => a.localeCompare(b));

		initializeSelect2Filter('#countryFilter', uniqueCountries, 'Select multiple');
		initializeSelect2Filter('#corruptionCategoriesFilter', uniqueCorruptionCategories, 'Select multiple');
		initializeSelect2Filter('#healthCategoriesFilter', uniqueHealthCategories, 'Select multiple');

        minDate = d3.min(allData, d => d.parsedDate);
        maxDate = d3.max(allData, d => d.parsedDate);

        $('#startDate, #endDate').datepicker({
            format: 'dd/mm/yy',
            autoclose: true
        }).on('changeDate', function() {
            updateFilters();
            updateResetButtonVisibility();
        });

        $('#startDate').datepicker('setDate', minDate);
        $('#endDate').datepicker('setDate', maxDate);
$('#resetFilters').on('click', function() {
    if (isAnyFilterActive()) {
        $('#countryFilter, #corruptionCategoriesFilter, #healthCategoriesFilter').val(null).trigger('change');
        $('#startDate').datepicker('setDate', minDate);
        $('#endDate').datepicker('setDate', maxDate);
        $('#search-input').val('');
        archivedFilter.checked = true;
        caseFilter.checked = !true;
        unreliableFilter.checked = false;
        
        // Reset industry buttons
        selectedIndustries.clear();
        document.querySelectorAll('.industry-btn').forEach(btn => btn.classList.remove('active'));
        
        updateFilters();
        updateResetButtonVisibility();
    }
});

        // Add event listener for the search input
        $('#search-input').on('input', debounce(function() {
            updateFilters();
            updateResetButtonVisibility();
        }, 500));

        console.timeEnd('Data Processing');

        updateFilters();
        updateResetButtonVisibility();
    }

function initializeSelect2Filter(selector, data, placeholder) {
    $(selector).select2({
        data: data.map(item => ({ id: item, text: item })),
        placeholder: placeholder,
    }).on('change', function() {
        updateFilters();
        updateResetButtonVisibility();
    });
}

function isAnyFilterActive() {
    const selectedCountries = $('#countryFilter').val() || [];
    const selectedCorruptionCategories = $('#corruptionCategoriesFilter').val() || [];
    const selectedHealthCategories = $('#healthCategoriesFilter').val() || [];
    const startDate = $('#startDate').datepicker('getDate');
    const endDate = $('#endDate').datepicker('getDate');
    const searchTerm = $('#search-input').val().trim();
    const isArchivedFilterActive = !archivedFilter.checked;
    const isUnreliableFilterActive = unreliableFilter.checked;
    const isCaseFilterActive = caseFilter.checked;
    const isIndustryFilterActive = selectedIndustries.size > 0;

    const isDateFilterActive = (startDate && minDate && startDate.getTime() !== minDate.getTime()) || 
                             (endDate && maxDate && endDate.getTime() !== maxDate.getTime());

    return selectedCountries.length > 0 || 
           selectedCorruptionCategories.length > 0 || 
           selectedHealthCategories.length > 0 || 
           isDateFilterActive || 
           searchTerm !== '' ||
           isArchivedFilterActive ||
           isUnreliableFilterActive || 
           isCaseFilterActive ||
           isIndustryFilterActive;
}

    function updateResetButtonVisibility() {
        if (isAnyFilterActive()) {
            $('#resetFilters').show();
        } else {
            $('#resetFilters').hide();
        }
    }

    const dmy = d3.timeParse("%d/%m/%y");

function updateFilters() {
    console.time('Filtering Data');
    const selectedCountries = new Set($('#countryFilter').val() || []);
    const selectedCorruptionCategories = new Set($('#corruptionCategoriesFilter').val() || []);
    const selectedHealthCategories = new Set($('#healthCategoriesFilter').val() || []);
    const startDate = $('#startDate').datepicker('getDate');
    const endDate = $('#endDate').datepicker('getDate');
    const searchTerm = $('#search-input').val().toLowerCase().trim();
    const showArchived = archivedFilter.checked;
    const showCase = caseFilter.checked;
    const unreliableCase = unreliableFilter.checked;

    filteredData = allData.filter(d => {
        const countryMatch = selectedCountries.size === 0 || selectedCountries.has(d.country);
        const corruptionCategoryMatch = selectedCorruptionCategories.size === 0 || 
            d['Corruption Categories'].some(category => selectedCorruptionCategories.has(category));
        const healthCategoryMatch = selectedHealthCategories.size === 0 || 
            d['Sector Categories'].some(category => selectedHealthCategories.has(category));
        
        let dateMatch = true;
        if (startDate && endDate && d.parsedDate) {
            dateMatch = (d.parsedDate >= startDate && d.parsedDate <= endDate);
        }
        
        let titleMatch = true;
        if (searchTerm) {
            const title = d.Title.toLowerCase();
            if (searchTerm.startsWith('"') && searchTerm.endsWith('"')) {
                titleMatch = title.includes(searchTerm.slice(1, -1));
            } else {
                titleMatch = searchTerm.split(' ').every(word => title.includes(word));
            }
        }

        const archivedMatch = showArchived || !d.Archived;
        const caseMatch = showCase || d.c_n;
        const unreliableMatch = unreliableCase || !d.f_n;

        // Add industry matching
        const industryMatch = selectedIndustries.size === 0 || 
            (d.Industry && d.Industry.some(industry => selectedIndustries.has(industry)));

        return countryMatch && 
               corruptionCategoryMatch && 
               healthCategoryMatch && 
               dateMatch && 
               titleMatch && 
               archivedMatch && 
               unreliableMatch && 
               caseMatch &&
               industryMatch;
    });

    console.timeEnd('Filtering Data');
    updateMapAndTable();
}

document.addEventListener('DOMContentLoaded', function() {
    // Find the Twitter button by ID
    var twitterButton = document.getElementById('twitter_share');
    
    // Add click event listener to the Twitter button
    if (twitterButton) {
        twitterButton.addEventListener('click', shareOnTwitter);
    }

    // Find the LinkedIn button by ID
    var linkedInButton = document.getElementById('lin_share');
    
    // Add click event listener to the LinkedIn button
    if (linkedInButton) {
        linkedInButton.addEventListener('click', shareOnLinkedIn);
    }
});
    function updateMapAndTable() {
        console.time('Updating Map and Table');
        markers.clearLayers();
        markerMap.clear();
        
        if (filteredData.length > 0) {
            const chunk = 1000;
            let index = 0;

            function addNextChunk() {
                const limit = Math.min(index + chunk, filteredData.length);
                const newMarkers = [];

                for (let i = index; i < limit; i++) {
                    const location = filteredData[i];
                    const uniqueId = `${location.lat}-${location.long}-${location.Title}`;

                    if (!markerMap.has(uniqueId)) {
                        const marker = L.marker([location.lat, location.long])
                            .bindPopup(`
  <div class="popup-content">
    <h3 class="popup-title">"${location.Title}"</h3>
    <div class="popup-details">
      <p><strong>Country:</strong> ${location.country}</p>
      <p><strong>URL:</strong> <a href="${location.url}" target="_blank">Link</a></p>
      <p><strong>Date:</strong> ${location['Date']}</p>
      <p><strong>Corruption Type:</strong> ${String(location['Corruption Categories'] || '').replace(/,(?=[^\s])/g, ', ')}</p>
      <p><strong>Sector Area:</strong> ${String(location['Sector Categories'] || '').replace(/,(?=[^\s])/g, ', ')}</p>
    </div>
  </div>
`);
                        newMarkers.push(marker);
                        markerMap.set(uniqueId, marker);
                    }
                }

                markers.addLayers(newMarkers);
                index = limit;

                if (index < filteredData.length) {
                    setTimeout(addNextChunk, 0);
                } else {
                    map.fitBounds(markers.getBounds());
                    updateVisibleData();
                }
            }

            addNextChunk();
        } else {
            updateVisibleData();
        }

        console.timeEnd('Updating Map and Table');
    }
	        document.querySelector('#clicker').addEventListener('click', function() {
            const content = document.querySelector('.filter-content');
            const icon = document.querySelector('.expand-icon');
            
            content.classList.toggle('expanded');
            icon.classList.toggle('expanded');
        });
    const updateVisibleData = debounce(function() {
        console.time('Updating Visible Data');
        if (map.isMoving()) {
            return;
        }
        const bounds = map.getBounds();
        const visibleData = filteredData.filter(d => bounds.contains(L.latLng(d.lat, d.long)));
        
        dataTable.clear().rows.add(visibleData).draw();
        $('.filter-count').text(formatNumber(visibleData.length));
        console.timeEnd('Updating Visible Data');
    }, 1000);

    map.on('movestart', function() {
        map.isMoving = function() { return true; };
    });

    map.on('moveend', function() {
        map.isMoving = function() { return false; };
        updateVisibleData();
    });

    console.timeEnd('Total Initialization');
const infoBoxes = {
    country: "Country mentioned in the article. This is usually, but not always, where the story occured.",
    corruption: "We used AI to identify when a story is related to a particular type of corruption. See our 'About' page for qualifications and limitations.",
    health: "We used AI to identify when a story is related to a particular area of health. See our 'About' page for qualifications and limitations.",
    date: "Set a date range to view which events have happened within a specific time period. Our archived data uses publication date.",
    archived: "When checked, this includes articles collected using our earlier data gathering methods. We've since improved our collection process. Unchecked shows only articles collected with our current methods.",
    cased: "When unchecked, this filters out general discussions and commentaries to focus on stories about specific corruption cases. Check it to include all articles.",
    unreliable: `We use AI to identify potentially unreliable news stories based on their writing style and content. While keeping this unchecked can help reduce exposure to low-quality news, please note: The filter works automatically and cannot fully understand context. It may incorrectly flag legitimate stories as unreliable. It may miss unreliable stories. It can reflect biases present in AI training data. Think of it as a helpful but unverified first pass rather than a definitive assessment of reliability.`,
industry:"Filter articles by industry sector. Select Health, Defence, or both. When both are selected, no filter is applied."
}


    let currentInfoBox = null;
	
	
	archivedFilter.addEventListener('change', function() {
        updateFilters();
        updateResetButtonVisibility();
    });
	unreliableFilter.addEventListener('change', function() {
        updateFilters();
        updateResetButtonVisibility();
    });
	caseFilter.addEventListener('change', function() {
        updateFilters();
        updateResetButtonVisibility();
    });
    function createInfoBox(content, target) {
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

    function handleInfoIconClick(e) {
        console.log('Info icon clicked:', this.id);
        e.preventDefault();
        e.stopPropagation();
        const filterType = this.getAttribute('data-filter');
        const infoContent = infoBoxes[filterType];
        createInfoBox(infoContent, this);
    }

    // Attach click event to specific info icons
    const infoIconIds = ['main-info', 'country-info', 'corruption-info', 'health-info', 'date-info', 'archived-info', 'case-info', 'unreliable-info', 'industry-info'];

    infoIconIds.forEach(id => {
        const icon = document.getElementById(id);
        if (icon) {
            console.log('Attaching click event to:', id);
            icon.addEventListener('click', handleInfoIconClick);
            icon.addEventListener('mousedown', e => e.preventDefault()); // Prevent text selection
        } else {
            console.warn('Info icon not found:', id);
        }
    });

    // Close info box when clicking outside
    document.addEventListener('click', function(e) {
        if (currentInfoBox && !e.target.classList.contains('info-icon')) {
            console.log('Closing info box');
            currentInfoBox.remove();
            currentInfoBox = null;
        }
    });

    // Ensure info icons work with Select2
    $('.filter-group select').off('select2:open');

	// Add this after your DataTable initialization
	

var exportButton = $('<button>')
    .addClass('btn btn-sm btn-outline-secondary export-csv-button btn-sharer')
    .html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1z"/><path fill-rule="evenodd" d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708z"/></svg>')
    .attr('title', 'Export filtered data to CSV')
    .appendTo('#export-button-container')
    .on('click', function() {
        // Get the current filtered data
        var dataToExport = filteredData;

        // Create CSV content
        var csv = [];
        
        // Add headers
        var headers = ['Title', 'Country/Region', 'URL', 'Date'];
        csv.push(headers.join(','));

        // Add data rows
        dataToExport.forEach(function(row) {
            var csvRow = [
                '"' + (row.Title || '').replace(/"/g, '""') + '"',
                '"' + (row.country || '').replace(/"/g, '""') + '"',
                '"' + (row.url || '').replace(/"/g, '""') + '"',
                '"' + (row['Date'] || '').replace(/"/g, '""') + '"'
            ];
            csv.push(csvRow.join(','));
        });

        // Create and trigger download
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
    function shareOnTwitter() {
        var thisPage = window.location.href.split('?')[0];
        var shareText = 'Explore global health sector integrity issues and scandals: ' + thisPage;
        var shareURL = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText);
        window.open(shareURL, '_blank');
    }
function shareOnLinkedIn() {
	        var thisPage = window.location.href.split('?')[0];

        var toShareUrl = 'https://ti-health.org/';
        var shareURL = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(toShareUrl);
        window.open(shareURL, '_blank', 'toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250,top=300,left=300');
        return;
}
    // Find the Twitter button by ID
    var twitterButton = document.getElementById('twitter_share');
    
    // Add click event listener to the Twitter button
    if (twitterButton) {
        twitterButton.addEventListener('click', shareOnTwitter);
    }

    // Find the LinkedIn button by ID
    var linkedInButton = document.getElementById('lin_share');
    
    // Add click event listener to the LinkedIn button
    if (linkedInButton) {
        linkedInButton.addEventListener('click', shareOnLinkedIn);
    }
});
