import { tileLayers, markerSettings } from './constants';

// Map state
let map;
let currentLayer;
let markers;
let legend;
let legendAdded = false;
let consecutiveErrors = 0;
const maxConsecutiveErrors = 5;

/**
 * Initialize the map with the base layer and configuration
 * @returns {Object} The map instance and related objects
 */
export function initializeMap() {
    console.time('Map Initialization');
    
    // Initialize map centered at [0, 0] with zoom level 2
    map = L.map('map', {
        maxZoom: 18,
        minZoom: 2,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true,
        zoomSnap: 0.5,
        zoomDelta: 0.5,
        wheelPxPerZoomLevel: 120
    }).setView([0, 0], 2);
    
    // Make map instance available globally
    window.map = map;
    
    // Create marker cluster group for better performance with many markers
    try {
        // Try to create a MarkerClusterGroup directly
        markers = L.markerClusterGroup({
            chunkedLoading: true,
            chunkInterval: 200,
            chunkDelay: 50,
            maxClusterRadius: 80,
            disableClusteringAtZoom: 16,
            spiderfyOnMaxZoom: true,
            animate: true,
            animateAddingMarkers: true,
            spiderfyDistanceMultiplier: 1.5,
            showCoverageOnHover: true,
            zoomToBoundsOnClick: true,
            // Configure cluster icon sizes and colors
            iconCreateFunction: function(cluster) {
                const count = cluster.getChildCount();
                let size, className;
                
                // Define size and class based on marker count
                if (count < 10) {
                    size = 'small';
                } else if (count < 100) {
                    size = 'medium';
                } else {
                    size = 'large';
                }
                
                // Apply appropriate CSS class
                className = 'marker-cluster marker-cluster-' + size;
                
                return L.divIcon({ 
                    html: '<div><span>' + count + '</span></div>', 
                    className: className, 
                    iconSize: L.point(40, 40) 
                });
            }
        });
        console.log('Using MarkerClusterGroup for markers');
    } catch (e) {
        console.error('Leaflet.markercluster is not loaded, falling back to normal markers:', e);
        markers = L.layerGroup();
    }
    map.addLayer(markers);
    
    // Initialize with OpenStreetMap base layer
    const openStreetMapLayer = L.tileLayer(
        tileLayers.openStreetMap.url, 
        tileLayers.openStreetMap.options
    );
    
    currentLayer = openStreetMapLayer.addTo(map);
    
    // Setup legend control
    setupLegend();
    
    // Setup tile error handling
    setupTileErrorHandling();
    
    // Setup map event listeners
    setupMapEvents();
    
    console.timeEnd('Map Initialization');
    
    return { map, markers, legend };
}

/**
 * Set up the legend for the map
 */
function setupLegend() {
    legend = L.control({ position: markerSettings.legendPosition });
    legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = `
            <div class="legend-content">
                <h4>Location Precision</h4>
                <i style="color: #3694d1;" class="fa fa-map-marker"></i> Specific Location in Country (e.g., city, facility)<br>
                <i style="color: #e5007d;" class="fa fa-map-marker"></i> Country Only (no specific location)
            </div>
        `;
        return div;
    };
}

/**
 * Set up tile error handling to switch between providers if one fails
 */
function setupTileErrorHandling() {
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
}

/**
 * Switch between tile layers when the current one has issues
 */
function switchTileLayer() {
    map.removeLayer(currentLayer);
    
    const openStreetMapLayer = L.tileLayer(
        tileLayers.openStreetMap.url, 
        tileLayers.openStreetMap.options
    );
    
    const stamenTerrainLayer = L.tileLayer(
        tileLayers.stamenTerrain.url, 
        tileLayers.stamenTerrain.options
    );
    
    if (currentLayer._url === tileLayers.openStreetMap.url) {
        currentLayer = stamenTerrainLayer.addTo(map);
        console.log('Switched to Stamen Terrain tiles');
    } else {
        currentLayer = openStreetMapLayer.addTo(map);
        console.log('Switched to OpenStreetMap tiles');
    }
}

// Callback for when map move ends
export let onMoveEnd = null;

/**
 * Setup map event listeners
 */
function setupMapEvents() {
    console.log('Setting up map events');
    map.on('movestart', function() {
        map.isMoving = function() { return true; };
    });

    map.on('moveend', function() {
        map.isMoving = function() { return false; };
        // First check the module-level callback
        if (typeof onMoveEnd === 'function') {
            onMoveEnd();
        }
        // Then check if we have a global callback as fallback
        else if (typeof window.updateVisibleData === 'function') {
            window.updateVisibleData();
        }
    });
}

/**
 * Get marker icon based on location type
 * @param {Boolean} isCountryLevel Whether the location is country-level only
 * @returns {Object} Leaflet divIcon for the marker
 */
export function getMarkerIcon(isCountryLevel) {
    if (isCountryLevel) {
        return L.divIcon(markerSettings.countryIcon);
    }
    return L.divIcon(markerSettings.specificIcon);
}

/**
 * Create a marker with popup for a location
 * @param {Object} location Location data object
 * @returns {Object} Leaflet marker
 */
export function createMarker(location) {
    const icon = getMarkerIcon(location.country_level);
    
    // Handle potential missing values safely
    const title = location.Title || 'No Title';
    const country = location.country || 'Unknown';
    const url = location.url || '#';
    const date = location['Date'] || 'Unknown Date';
    const corruptionCategories = Array.isArray(location['Corruption Categories']) ? 
        String(location['Corruption Categories']).replace(/,(?=[^\s])/g, ', ') : '';
    const sectorCategories = Array.isArray(location['Sector Categories']) ? 
        String(location['Sector Categories']).replace(/,(?=[^\s])/g, ', ') : '';
    
    return L.marker([location.lat, location.long], {icon: icon})
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
}

/**
 * Show or hide the legend based on the country level filter
 * @param {Boolean} showLegend Whether to show the legend
 */
export function toggleLegend(showLegend) {
    if (showLegend && !legendAdded) {
        legend.addTo(map);
        legendAdded = true;
    } else if (!showLegend && legendAdded) {
        legend.remove();
        legendAdded = false;
    }
}

/**
 * Fit the map view to the marker bounds
 */
export function fitMapToBounds() {
    try {
        // Try the MarkerClusterGroup getBounds method first
        const bounds = markers.getBounds();
        if (bounds.isValid()) {
            map.fitBounds(bounds, {
                padding: [30, 30],
                maxZoom: 12,
                animate: true,
                duration: 0.5
            });
        }
    } catch (e) {
        // Fall back to calculating bounds manually if getBounds doesn't exist
        try {
            const layers = markers.getLayers();
            if (layers && layers.length > 0) {
                const bounds = L.latLngBounds();
                layers.forEach(marker => {
                    bounds.extend(marker.getLatLng());
                });
                
                if (bounds.isValid()) {
                    map.fitBounds(bounds, {
                        padding: [30, 30],
                        maxZoom: 12,
                        animate: true,
                        duration: 0.5
                    });
                }
            }
        } catch (e2) {
            console.error('Error fitting map to bounds:', e2);
        }
    }
}

/**
 * Get the current map bounds
 * @returns {Object} Map bounds
 */
export function getMapBounds() {
    return map.getBounds();
}

/**
 * Check if map is currently moving
 * @returns {Boolean} Whether map is moving
 */
export function isMapMoving() {
    return map.isMoving ? map.isMoving() : false;
}

/**
 * Clear all markers from the map
 */
export function clearMarkers() {
    markers.clearLayers();
}

/**
 * Add markers to the map in chunks to maintain performance
 * @param {Array} markerArray Array of Leaflet markers
 */
export function addMarkers(markerArray) {
    try {
        // Try the MarkerClusterGroup addLayers method first
        markers.addLayers(markerArray);
    } catch (e) {
        // Fall back to adding markers individually
        markerArray.forEach(marker => markers.addLayer(marker));
    }
}

/**
 * Export map module state for external use
 */
export default {
    initializeMap,
    getMarkerIcon,
    createMarker,
    toggleLegend,
    fitMapToBounds,
    getMapBounds,
    isMapMoving,
    clearMarkers,
    addMarkers
};
