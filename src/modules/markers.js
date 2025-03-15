/**
 * Markers module
 * Handles creation and management of map markers
 */
import { formatNumber } from './utils';

/**
 * Initialize marker cluster group with proper settings
 * @returns {Object} Configured marker cluster group
 */
export function initializeMarkerCluster() {
    // Create marker cluster group with specific settings for proper clustering
    return L.markerClusterGroup({
        chunkedLoading: true,
        chunkInterval: 200,
        chunkDelay: 50,
        maxClusterRadius: 80,
        disableClusteringAtZoom: 16,
        spiderfyOnMaxZoom: true,
        // These settings are important for the heat circle appearance
        iconCreateFunction: function(cluster) {
            const childCount = cluster.getChildCount();
            let c = ' marker-cluster-';
            
            if (childCount < 10) {
                c += 'small';
            } else if (childCount < 100) {
                c += 'medium';
            } else {
                c += 'large';
            }
            
            return new L.DivIcon({
                html: '<div><span>' + childCount + '</span></div>',
                className: 'marker-cluster' + c,
                iconSize: new L.Point(40, 40)
            });
        }
    });
}

/**
 * Update map markers based on filtered data
 * @param {Object} mapConfig - Map configuration object 
 * @param {Array} filteredData - Filtered data to display on map
 * @param {Object} state - Application state
 * @param {Function} updateVisibleDataCallback - Callback for updating visible data
 */
export function updateMapMarkers(mapConfig, filteredData, state, updateVisibleDataCallback) {
    console.time('Updating Map and Table');
    
    // Get markers from mapConfig
    const markers = mapConfig.markers;
    
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
                    // Create marker with popup
                    const icon = location.country_level ? 
                        L.divIcon({
                            className: 'custom-div-icon',
                            html: '<i style="color: #e5007d;" class="fa fa-map-marker fa-3x"></i>',
                            iconSize: [30, 42],
                            iconAnchor: [15, 42]
                        }) : 
                        L.divIcon({
                            className: 'custom-div-icon',
                            html: '<i style="color: #3694d1;" class="fa fa-map-marker fa-3x"></i>',
                            iconSize: [30, 42],
                            iconAnchor: [15, 42]
                        });
                    
                    // Handle potential missing values safely
                    const title = location.Title || 'No Title';
                    const country = location.country || 'Unknown';
                    const url = location.url || '#';
                    const date = location['Date'] || 'Unknown Date';
                    const corruptionCategories = Array.isArray(location['Corruption Categories']) ? 
                        String(location['Corruption Categories']).replace(/,(?=[^\s])/g, ', ') : '';
                    const sectorCategories = Array.isArray(location['Sector Categories']) ? 
                        String(location['Sector Categories']).replace(/,(?=[^\s])/g, ', ') : '';
                    
                    const marker = L.marker([location.lat, location.long], {icon: icon})
                        .bindPopup(`
                            <div class="popup-content">
                                <h3 class="popup-title">"${title}"</h3>
                                <div class="popup-details">
                                    <p><strong>Country:</strong> ${country}</p>
                                    <p><strong>URL:</strong> ${url !== '#' ? `<a href="${url}" target="_blank">Link</a>` : 'No URL'}</p>
                                    <p><strong>Date:</strong> ${date}</p>
                                    <p><strong>Integrity Area:</strong> ${corruptionCategories}</p>
                                    <p><strong>Sector Area:</strong> ${sectorCategories}</p>
                                </div>
                            </div>
                        `);
                    
                    newMarkers.push(marker);
                    state.markerMap.set(uniqueId, marker);
                }
            }

            // Add markers in batch for better performance
            markers.addLayers(newMarkers);
            index = limit;

            if (index < filteredData.length) {
                setTimeout(addNextChunk, 0);
            } else {
                // Only fit bounds if we have valid bounds
                if (markers.getBounds().isValid()) {
                    mapConfig.map.fitBounds(markers.getBounds());
                }
                if (typeof updateVisibleDataCallback === 'function') {
                    updateVisibleDataCallback();
                }
            }
        }

        addNextChunk();
    } else {
        if (typeof updateVisibleDataCallback === 'function') {
            updateVisibleDataCallback();
        }
    }

    console.timeEnd('Updating Map and Table');
}

/**
 * Set up map move events to update visible data
 * @param {Object} mapConfig - Map configuration 
 * @param {Function} getFilteredData - Function to get current filtered data
 * @param {Object} dataTable - DataTable instance
 * @returns {Function} The update visible data function
 */
export function setupMapMoveEvents(mapConfig, getFilteredData, dataTable) {
    // Function to update data table with data visible in current map bounds
    const updateVisibleData = function() {
        console.time('Updating Visible Data');
        
        if (mapConfig.isMapMoving()) {
            return;
        }
        
        const bounds = mapConfig.getMapBounds();
        const filteredData = getFilteredData();
        const visibleData = filteredData.filter(d => bounds.contains(L.latLng(d.lat, d.long)));
        
        dataTable.clear().rows.add(visibleData).draw();
        $('.filter-count').text(formatNumber(visibleData.length));
        
        console.timeEnd('Updating Visible Data');
    };

    // Debounced function to avoid too many updates when moving the map
    const debouncedUpdate = debounce(updateVisibleData, 300);

    // Set up event handlers
    mapConfig.map.on('moveend', debouncedUpdate);

    return debouncedUpdate;
}

/**
 * Utility function to debounce function calls
 * @param {Function} func - Function to debounce 
 * @param {Number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * Module exports
 */
export default {
    initializeMarkerCluster,
    updateMapMarkers,
    setupMapMoveEvents
};
