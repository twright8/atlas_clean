/**
 * Markers module
 * Handles creation and management of map markers
 */
import { debounce } from '../utils/formatters.js';

/**
 * Update map markers based on filtered data
 * @param {Object} mapConfig - Map configuration object 
 * @param {Array} filteredData - Filtered data to display on map
 * @param {Object} state - Application state
 * @param {Function} updateVisibleDataCallback - Callback for updating visible data
 */
export function updateMapMarkers(mapConfig, filteredData, state, updateVisibleDataCallback) {
    console.time('Updating Map and Table');
    
    const { markers, icons } = mapConfig;
    
    // Clear existing markers
    markers.clearLayers();
    state.markerMap.clear();
    
    if (filteredData.length > 0) {
        const chunk = 1000;
        let index = 0;

        function addNextChunk() {
            const limit = Math.min(index + chunk, filteredData.length);
            const newMarkers = [];

            for (let i = index; i < limit; i++) {
                const location = filteredData[i];
                const uniqueId = `${location.lat}-${location.long}-${location.Title}`;

                if (!state.markerMap.has(uniqueId)) {
                    // Use country or specific icon based on country_level
                    const icon = location.country_level ? icons.countryIcon : icons.specificIcon;
                    
                    const marker = L.marker([location.lat, location.long], {icon: icon})
                        .bindPopup(createPopupContent(location));
                    
                    newMarkers.push(marker);
                    state.markerMap.set(uniqueId, marker);
                }
            }

            markers.addLayers(newMarkers);
            index = limit;

            if (index < filteredData.length) {
                setTimeout(addNextChunk, 0);
            } else {
                mapConfig.map.fitBounds(markers.getBounds());
                updateVisibleDataCallback();
            }
        }

        addNextChunk();
    } else {
        updateVisibleDataCallback();
    }

    console.timeEnd('Updating Map and Table');
}

/**
 * Create popup content for a marker
 * @param {Object} location - Location data
 * @returns {string} HTML content for popup
 */
function createPopupContent(location) {
    return `
        <div class="popup-content">
            <h3 class="popup-title">"${location.Title}"</h3>
            <div class="popup-details">
                <p><strong>Country:</strong> ${location.country}</p>
                <p><strong>URL:</strong> <a href="${location.url}" target="_blank">Link</a></p>
                <p><strong>Date:</strong> ${location['Date']}</p>
                <p><strong>Integrity Area:</strong> ${String(location['Corruption Categories'] || '').replace(/,(?=[^\s])/g, ', ')}</p>
                <p><strong>Sector Area:</strong> ${String(location['Sector Categories'] || '').replace(/,(?=[^\s])/g, ', ')}</p>
            </div>
        </div>
    `;
}

/**
 * Set up map move events to update visible data
 * @param {Object} mapConfig - Map configuration 
 * @param {Array} filteredData - Filtered data
 * @param {Object} dataTable - DataTable instance
 */
export function setupMapMoveEvents(mapConfig, filteredData, dataTable) {
    const updateVisibleData = debounce(function() {
        console.time('Updating Visible Data');
        if (mapConfig.map.isMoving()) {
            return;
        }
        const bounds = mapConfig.map.getBounds();
        const visibleData = filteredData.filter(d => bounds.contains(L.latLng(d.lat, d.long)));
        
        dataTable.clear().rows.add(visibleData).draw();
        $('.filter-count').text(formatNumber(visibleData.length));
        console.timeEnd('Updating Visible Data');
    }, 1000);

    mapConfig.map.on('movestart', function() {
        mapConfig.map.isMoving = function() { return true; };
    });

    mapConfig.map.on('moveend', function() {
        mapConfig.map.isMoving = function() { return false; };
        updateVisibleData();
    });

    return updateVisibleData;
}

/**
 * Format number with locale-specific formatting
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    const numberFormatter = new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 0
    });
    return numberFormatter.format(num);
}
