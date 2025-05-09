// map.js
import { tileLayers, markerSettings } from './constants';

let map;
let currentLayer;
let markers;
let legend;
let legendAdded = false;
let consecutiveErrors = 0;
const maxConsecutiveErrors = 5;

export function initializeMap() {
    console.time('Map Initialization');
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
    window.map = map;
    try {
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
            iconCreateFunction: function(cluster) {
                const count = cluster.getChildCount();
                let size, className;
                if (count < 10) { size = 'small'; }
                else if (count < 100) { size = 'medium'; }
                else { size = 'large'; }
                className = 'marker-cluster marker-cluster-' + size;
                return L.divIcon({
                    html: '<div><span>' + count + '</span></div>',
                    className: className,
                    iconSize: L.point(40, 40)
                });
            }
        });
    } catch (e) {
        console.error('Leaflet.markercluster is not loaded, falling back to normal markers:', e);
        markers = L.layerGroup();
    }
    map.addLayer(markers);
    const openStreetMapLayer = L.tileLayer(
        tileLayers.openStreetMap.url,
        tileLayers.openStreetMap.options
    );
    currentLayer = openStreetMapLayer.addTo(map);
    setupLegend();
    setupTileErrorHandling();
    setupMapEvents();
    console.timeEnd('Map Initialization');
    return { map, markers, legend };
}

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
    } else {
        currentLayer = openStreetMapLayer.addTo(map);
    }
}

export let onMoveEnd = null;

function setupMapEvents() {
    map.on('movestart', function() {
        map.isMoving = function() { return true; };
    });
    map.on('moveend', function() {
        map.isMoving = function() { return false; };
        if (typeof onMoveEnd === 'function') {
            onMoveEnd();
        } else if (typeof window.updateVisibleData === 'function') {
            window.updateVisibleData();
        }
    });
}

export function getMarkerIcon(isCountryLevel) {
    if (isCountryLevel) {
        return L.divIcon(markerSettings.countryIcon);
    }
    return L.divIcon(markerSettings.specificIcon);
}

export function createMarker(location) {
    const icon = getMarkerIcon(location.country_level);
    const title = location.Title || 'No Title';
    const country = location.country || 'Unknown';
    const url = location.url || '#';
    const date = location['Date'] || 'Unknown Date';
    const corruptionCategories = Array.isArray(location['Corruption Categories']) ?
        String(location['Corruption Categories']).replace(/,(?=[^\s])/g, ', ') : '';
    const sectorCategories = Array.isArray(location['Sector Categories']) ?
        String(location['Sector Categories']).replace(/,(?=[^\s])/g, ', ') : '';
    const emailSubject = encodeURIComponent('Inquiry about news article');
    const emailBody = encodeURIComponent(`Article: "${title}"\nCountry: ${country}\nDate: ${date}`);
    const emailLink = `mailto:ti-health@transparency.org?subject=${emailSubject}&body=${emailBody}`;

    let linkHTML = 'No URL';
    if (url !== '#') {
        const escapedUrl = url.replace(/'/g, "\\'");
        linkHTML = `<a href="${url}" target="_blank" onclick="trackOutboundLink('${escapedUrl}', 'map_popup'); return true;">Link</a>`;
    }

    return L.marker([location.lat, location.long], {icon: icon})
        .bindPopup(`
            <div class="popup-content">
                <h3 class="popup-title">"${title}"</h3>
                <div class="popup-details">
                    <p><strong>Country:</strong> ${country}</p>
                    <p><strong>URL:</strong> ${linkHTML}</p>
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Integrity Area:</strong> ${corruptionCategories}</p>
                    <p><strong>Sector Area:</strong> ${sectorCategories}</p>
                    <div style="margin-top: 5px; text-align: right;">
                        <button id="reporter" title="Report or request removal of individual articles">
                            <a href="${emailLink}">
                                <i class="fa fa-flag"></i>Report
                            </a>
                        </button>
                    </div>
                </div>
            </div>
        `);
}

export function toggleLegend(showLegend) {
    if (showLegend && !legendAdded) {
        legend.addTo(map);
        legendAdded = true;
    } else if (!showLegend && legendAdded) {
        legend.remove();
        legendAdded = false;
    }
}

export function fitMapToBounds() {
    try {
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

export function getMapBounds() {
    return map.getBounds();
}

export function isMapMoving() {
    return map.isMoving ? map.isMoving() : false;
}

export function clearMarkers() {
    if (markers) {
        markers.clearLayers();
    }
}

export function addMarkers(markerArray) {
    if (markers && markerArray) {
        try {
            markers.addLayers(markerArray);
        } catch (e) {
            markerArray.forEach(marker => markers.addLayer(marker));
        }
    }
}

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