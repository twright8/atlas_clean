/**
 * Map configuration module
 * Handles the initialization and configuration of the map
 */

/**
 * Initialize and configure the Leaflet map
 * @returns {Object} Map configuration object containing map instance and layers
 */
export function initializeMap() {
    // Create the map instance
    const map = L.map('map').setView([0, 0], 2); // Start with a global view
    
    // Define marker icons
    const countryIcon = L.divIcon({
        className: 'custom-div-icon',
        html: '<i style="color: #e5007d;" class="fa fa-map-marker fa-3x"></i>',
        iconSize: [30, 42],
        iconAnchor: [15, 42]
    });

    const specificIcon = L.divIcon({
        className: 'custom-div-icon',
        html: '<i style="color: #3694d1;" class="fa fa-map-marker fa-3x"></i>',
        iconSize: [30, 42],
        iconAnchor: [15, 42]
    });

    // Create tile layers
    const openStreetMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 10
    });

    const stamenTerrainLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 10
    });

    // Add the default layer to the map
    const currentLayer = openStreetMapLayer.addTo(map);

    // Create and add marker cluster group
    const markers = L.markerClusterGroup({
        chunkedLoading: true,
        chunkInterval: 200,
        chunkDelay: 50
    });
    map.addLayer(markers);

    // Create legend
    const legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
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

    return {
        map,
        layers: {
            openStreetMapLayer,
            stamenTerrainLayer,
            currentLayer
        },
        markers,
        icons: {
            countryIcon,
            specificIcon
        },
        legend,
        legendAdded: false
    };
}

/**
 * Set up tile layer error handling and switching
 * @param {Object} mapConfig - Map configuration object from initializeMap
 */
export function setupTileLayerErrorHandling(mapConfig) {
    const { map, layers } = mapConfig;
    let consecutiveErrors = 0;
    const maxConsecutiveErrors = 5;

    function switchTileLayer() {
        map.removeLayer(layers.currentLayer);
        if (layers.currentLayer === layers.openStreetMapLayer) {
            layers.currentLayer = layers.stamenTerrainLayer.addTo(map);
            console.log('Switched to Stamen Terrain tiles');
        } else {
            layers.currentLayer = layers.openStreetMapLayer.addTo(map);
            console.log('Switched to OpenStreetMap tiles');
        }
    }

    layers.currentLayer.on('tileerror', function(error) {
        console.log('Tile loading error:', error);
        consecutiveErrors++;
        
        if (consecutiveErrors >= maxConsecutiveErrors) {
            console.log(`${maxConsecutiveErrors} consecutive errors. Switching tile layer.`);
            switchTileLayer();
            consecutiveErrors = 0;
        }
    });

    layers.currentLayer.on('tileload', function() {
        consecutiveErrors = 0;
    });
}
