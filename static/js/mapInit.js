/**
 * Map initialization and configuration module
 * Handles the creation and setup of the Leaflet map
 */

const MapInit = (function() {
    // Private variables
    let map;
    let currentLayer;
    let consecutiveErrors = 0;
    const maxConsecutiveErrors = 5;
    let legendAdded = false;
    let legend;

    // Map layer definitions
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

    // Create and define marker icons
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

    // Create the map and add markers layer
    function initializeMap() {
        console.time('Map Initialization');
        
        // Create map centered on [0,0] with zoom level 2
        map = L.map('map').setView([0, 0], 2);
        
        // Add the initial tile layer
        currentLayer = openStreetMapLayer.addTo(map);

        // Setup tile error handling
        setupTileErrorHandling();

        // Create marker cluster group
        const markers = L.markerClusterGroup({
            chunkedLoading: true,
            chunkInterval: 200,
            chunkDelay: 50
        });
        map.addLayer(markers);

        // Create legend control
        setupLegend();

        console.timeEnd('Map Initialization');

        return {
            map: map,
            markers: markers
        };
    }

    // Setup error handling for map tiles
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

    // Switch between tile layers
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

    // Setup the map legend
    function setupLegend() {
        legend = L.control({position: 'bottomright'});
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
    }

    // Public API
    return {
        initializeMap: initializeMap,
        getIcons: function() {
            return {