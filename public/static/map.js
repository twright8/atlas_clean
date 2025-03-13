// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"modules/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tileLayers = exports.markerSettings = exports.infoBoxes = exports.dataTableSettings = void 0;
// Shared constants across the application

// Info tooltips content
var infoBoxes = exports.infoBoxes = {
  country: "Country mentioned in the article. This is usually, but not always, where the story occured.",
  corruption: "We used AI to identify when a story is related to a particular theme related to integrity. See our 'About' page for qualifications and limitations.",
  health: "We used AI to identify when a story is related to a particular area of health. See our 'About' page for qualifications and limitations.",
  date: "Set a date range to view which events have happened within a specific time period. Our archived data uses publication date.",
  archived: "When checked, this includes articles collected using our earlier data gathering methods. We've since improved our collection process. Unchecked shows only articles collected with our current methods.",
  cased: "When checked, this filters out general discussions and commentaries to focus on stories about specific corruption cases. Check it to include all articles.",
  unreliable: "We use AI to identify potentially unreliable news stories based on their writing style and content. While keeping this checked can help reduce exposure to low-quality news, please note: The filter works automatically with no human oversight. It may incorrectly flag legitimate stories as unreliable. It may miss unreliable stories. It can reflect biases present in AI training data. Think of it as a helpful but unverified first pass rather than a definitive assessment of reliability.",
  countryLevel: "When checked, this shows only articles where a specific location within the country could be determined. Check it to include articles where only the country-level location was identified."
};

// Map marker settings
var markerSettings = exports.markerSettings = {
  countryIcon: {
    className: 'custom-div-icon',
    html: '<i style="color: #e5007d;" class="fa fa-map-marker fa-3x"></i>',
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  },
  specificIcon: {
    className: 'custom-div-icon',
    html: '<i style="color: #3694d1;" class="fa fa-map-marker fa-3x"></i>',
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  },
  legendPosition: 'bottomright'
};

// Data table settings
var dataTableSettings = exports.dataTableSettings = {
  searching: false,
  lengthChange: false,
  columns: [{
    data: 'Title',
    width: '50%',
    defaultContent: "N/A",
    render: function render(data, type, row) {
      return data ? "\"".concat(data, "\"") : 'N/A';
    }
  }, {
    data: 'country'
  }, {
    data: 'url',
    render: function render(data, type, row) {
      return data ? "<a href=\"".concat(data, "\" target=\"_blank\">Link</a>") : '';
    }
  }, {
    data: 'Date'
  }, {
    data: 'Corruption Categories',
    render: function render(data, type, row) {
      if (!data) return '';
      var strData = String(data);
      return strData.replace(/,(?=[^\s])/g, ', ');
    }
  }],
  columnDefs: [{
    type: 'date-eu',
    targets: 3
  }],
  order: [[3, 'desc']]
};

// Tile layer URLs
var tileLayers = exports.tileLayers = {
  openStreetMap: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }
  },
  stamenTerrain: {
    url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png',
    options: {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: 'abcd',
      minZoom: 2,
      maxZoom: 18
    }
  }
};
},{}],"modules/map.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addMarkers = addMarkers;
exports.clearMarkers = clearMarkers;
exports.createMarker = createMarker;
exports.default = void 0;
exports.fitMapToBounds = fitMapToBounds;
exports.getMapBounds = getMapBounds;
exports.getMarkerIcon = getMarkerIcon;
exports.initializeMap = initializeMap;
exports.isMapMoving = isMapMoving;
exports.onMoveEnd = void 0;
exports.toggleLegend = toggleLegend;
var _constants = require("./constants");
// Map state
var map;
var currentLayer;
var markers;
var legend;
var legendAdded = false;
var consecutiveErrors = 0;
var maxConsecutiveErrors = 5;

/**
 * Initialize the map with the base layer and configuration
 * @returns {Object} The map instance and related objects
 */
function initializeMap() {
  console.time('Map Initialization');

  // Initialize map centered at [0, 0] with zoom level 2
  map = L.map('map', {
    maxZoom: 18,
    minZoom: 2
  }).setView([0, 0], 2);

  // Create marker cluster group for better performance with many markers
  markers = L.markerClusterGroup({
    chunkedLoading: true,
    chunkInterval: 200,
    chunkDelay: 50,
    maxClusterRadius: 80,
    disableClusteringAtZoom: 16,
    spiderfyOnMaxZoom: true
  });
  map.addLayer(markers);

  // Initialize with OpenStreetMap base layer
  var openStreetMapLayer = L.tileLayer(_constants.tileLayers.openStreetMap.url, _constants.tileLayers.openStreetMap.options);
  currentLayer = openStreetMapLayer.addTo(map);

  // Setup legend control
  setupLegend();

  // Setup tile error handling
  setupTileErrorHandling();

  // Setup map event listeners
  setupMapEvents();
  console.timeEnd('Map Initialization');
  return {
    map: map,
    markers: markers,
    legend: legend
  };
}

/**
 * Set up the legend for the map
 */
function setupLegend() {
  legend = L.control({
    position: _constants.markerSettings.legendPosition
  });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = "\n            <div class=\"legend-content\">\n                <h4>Location Precision</h4>\n                <i style=\"color: #3694d1;\" class=\"fa fa-map-marker\"></i> Specific Location in Country (e.g., city, facility)<br>\n                <i style=\"color: #e5007d;\" class=\"fa fa-map-marker\"></i> Country Only (no specific location)\n            </div>\n        ";
    return div;
  };
}

/**
 * Set up tile error handling to switch between providers if one fails
 */
function setupTileErrorHandling() {
  currentLayer.on('tileerror', function (error) {
    console.log('Tile loading error:', error);
    consecutiveErrors++;
    if (consecutiveErrors >= maxConsecutiveErrors) {
      console.log("".concat(maxConsecutiveErrors, " consecutive errors. Switching tile layer."));
      switchTileLayer();
      consecutiveErrors = 0;
    }
  });
  currentLayer.on('tileload', function () {
    consecutiveErrors = 0;
  });
}

/**
 * Switch between tile layers when the current one has issues
 */
function switchTileLayer() {
  map.removeLayer(currentLayer);
  var openStreetMapLayer = L.tileLayer(_constants.tileLayers.openStreetMap.url, _constants.tileLayers.openStreetMap.options);
  var stamenTerrainLayer = L.tileLayer(_constants.tileLayers.stamenTerrain.url, _constants.tileLayers.stamenTerrain.options);
  if (currentLayer._url === _constants.tileLayers.openStreetMap.url) {
    currentLayer = stamenTerrainLayer.addTo(map);
    console.log('Switched to Stamen Terrain tiles');
  } else {
    currentLayer = openStreetMapLayer.addTo(map);
    console.log('Switched to OpenStreetMap tiles');
  }
}

// Callback for when map move ends
var onMoveEnd = exports.onMoveEnd = null;

/**
 * Setup map event listeners
 */
function setupMapEvents() {
  map.on('movestart', function () {
    map.isMoving = function () {
      return true;
    };
  });
  map.on('moveend', function () {
    map.isMoving = function () {
      return false;
    };
    if (typeof onMoveEnd === 'function') {
      onMoveEnd();
    }
  });
}

/**
 * Get marker icon based on location type
 * @param {Boolean} isCountryLevel Whether the location is country-level only
 * @returns {Object} Leaflet divIcon for the marker
 */
function getMarkerIcon(isCountryLevel) {
  if (isCountryLevel) {
    return L.divIcon(_constants.markerSettings.countryIcon);
  }
  return L.divIcon(_constants.markerSettings.specificIcon);
}

/**
 * Create a marker with popup for a location
 * @param {Object} location Location data object
 * @returns {Object} Leaflet marker
 */
function createMarker(location) {
  var icon = getMarkerIcon(location.country_level);

  // Handle potential missing values safely
  var title = location.Title || 'No Title';
  var country = location.country || 'Unknown';
  var url = location.url || '#';
  var date = location['Date'] || 'Unknown Date';
  var corruptionCategories = Array.isArray(location['Corruption Categories']) ? String(location['Corruption Categories']).replace(/,(?=[^\s])/g, ', ') : '';
  var sectorCategories = Array.isArray(location['Sector Categories']) ? String(location['Sector Categories']).replace(/,(?=[^\s])/g, ', ') : '';
  return L.marker([location.lat, location.long], {
    icon: icon
  }).bindPopup("\n            <div class=\"popup-content\">\n                <h3 class=\"popup-title\">\"".concat(title, "\"</h3>\n                <div class=\"popup-details\">\n                    <p><strong>Country:</strong> ").concat(country, "</p>\n                    <p><strong>URL:</strong> ").concat(url !== '#' ? "<a href=\"".concat(url, "\" target=\"_blank\">Link</a>") : 'No URL', "</p>\n                    <p><strong>Date:</strong> ").concat(date, "</p>\n                    <p><strong>Integrity Area:</strong> ").concat(corruptionCategories, "</p>\n                    <p><strong>Sector Area:</strong> ").concat(sectorCategories, "</p>\n                </div>\n            </div>\n        "));
}

/**
 * Show or hide the legend based on the country level filter
 * @param {Boolean} showLegend Whether to show the legend
 */
function toggleLegend(showLegend) {
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
function fitMapToBounds() {
  if (markers.getBounds().isValid()) {
    map.fitBounds(markers.getBounds());
  }
}

/**
 * Get the current map bounds
 * @returns {Object} Map bounds
 */
function getMapBounds() {
  return map.getBounds();
}

/**
 * Check if map is currently moving
 * @returns {Boolean} Whether map is moving
 */
function isMapMoving() {
  return map.isMoving ? map.isMoving() : false;
}

/**
 * Clear all markers from the map
 */
function clearMarkers() {
  markers.clearLayers();
}

/**
 * Add markers to the map in chunks to maintain performance
 * @param {Array} markerArray Array of Leaflet markers
 */
function addMarkers(markerArray) {
  markers.addLayers(markerArray);
}

/**
 * Export map module state for external use
 */
var _default = exports.default = {
  initializeMap: initializeMap,
  getMarkerIcon: getMarkerIcon,
  createMarker: createMarker,
  toggleLegend: toggleLegend,
  fitMapToBounds: fitMapToBounds,
  getMapBounds: getMapBounds,
  isMapMoving: isMapMoving,
  clearMarkers: clearMarkers,
  addMarkers: addMarkers
};
},{"./constants":"modules/constants.js"}],"modules/data.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.filterData = filterData;
exports.formatNumber = formatNumber;
exports.getDateRange = getDateRange;
exports.getFilteredData = getFilteredData;
exports.getVisibleData = getVisibleData;
exports.loadData = loadData;
exports.processData = processData;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Module for handling data loading, processing, and filter operations
 */

// State variables
var allData = [];
var filteredData = [];
var minDate, maxDate;

/**
 * Format numbers with thousand separators
 * @param {Number} num The number to format
 * @returns {String} Formatted number
 */
function formatNumber(num) {
  var numberFormatter = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0
  });
  return numberFormatter.format(num);
}

/**
 * Load data from the specified URL
 * @param {String} url URL to fetch data from
 * @returns {Promise} Promise that resolves with the loaded data
 */
function loadData(url) {
  console.time('Data Fetching');
  return fetch(url).then(function (response) {
    return response.json();
  }).then(function (data) {
    console.timeEnd('Data Fetching');
    return data;
  }).catch(function (error) {
    console.error('Error loading data:', error);
    throw error;
  });
}

/**
 * Process the raw data and extract information
 * @param {Array} data Raw data array
 * @param {Function} dateParser Function to parse dates
 * @returns {Object} Processed data and metadata
 */
function processData(data, dateParser) {
  console.time('Data Processing');

  // Parse dates and create a copy of data with additional fields
  allData = data.map(function (d) {
    return _objectSpread(_objectSpread({}, d), {}, {
      parsedDate: dateParser(d['Date'])
    });
  });

  // Extract unique values for filters
  var uniqueCountries = _toConsumableArray(new Set(allData.map(function (item) {
    return item.country;
  }))).filter(function (country) {
    return country;
  }) // Filter out null/undefined
  .sort(function (a, b) {
    return a.localeCompare(b);
  });
  var uniqueCorruptionCategories = _toConsumableArray(new Set(allData.flatMap(function (item) {
    return Array.isArray(item['Corruption Categories']) ? item['Corruption Categories'] : [];
  }))).filter(function (category) {
    return category;
  }) // Filter out null/undefined
  .sort(function (a, b) {
    return a.localeCompare(b);
  });
  var uniqueHealthCategories = _toConsumableArray(new Set(allData.flatMap(function (item) {
    return Array.isArray(item['Sector Categories']) ? item['Sector Categories'] : [];
  }))).filter(function (category) {
    return category;
  }) // Filter out null/undefined
  .sort(function (a, b) {
    return a.localeCompare(b);
  });

  // Get min and max dates for date range filter
  minDate = d3.min(allData, function (d) {
    return d.parsedDate;
  });
  maxDate = d3.max(allData, function (d) {
    return d.parsedDate;
  });
  console.timeEnd('Data Processing');
  return {
    allData: allData,
    uniqueCountries: uniqueCountries,
    uniqueCorruptionCategories: uniqueCorruptionCategories,
    uniqueHealthCategories: uniqueHealthCategories,
    minDate: minDate,
    maxDate: maxDate
  };
}

/**
 * Apply filters to the data based on user selection
 * @param {Object} filterCriteria Filter criteria object
 * @returns {Array} Filtered data array
 */
function filterData(filterCriteria) {
  console.time('Filtering Data');
  var selectedCountries = filterCriteria.selectedCountries,
    selectedCorruptionCategories = filterCriteria.selectedCorruptionCategories,
    selectedHealthCategories = filterCriteria.selectedHealthCategories,
    startDate = filterCriteria.startDate,
    endDate = filterCriteria.endDate,
    searchTerm = filterCriteria.searchTerm,
    showArchived = filterCriteria.showArchived,
    showCase = filterCriteria.showCase,
    unreliableCase = filterCriteria.unreliableCase,
    showCountryLevel = filterCriteria.showCountryLevel;
  filteredData = allData.filter(function (d) {
    // Check country match
    var countryMatch = selectedCountries.size === 0 || selectedCountries.has(d.country);

    // Check corruption category match
    var corruptionCategoryMatch = selectedCorruptionCategories.size === 0 || Array.isArray(d['Corruption Categories']) && d['Corruption Categories'].some(function (category) {
      return selectedCorruptionCategories.has(category);
    });

    // Check health category match
    var healthCategoryMatch = selectedHealthCategories.size === 0 || Array.isArray(d['Sector Categories']) && d['Sector Categories'].some(function (category) {
      return selectedHealthCategories.has(category);
    });

    // Check date match
    var dateMatch = true;
    if (startDate && endDate && d.parsedDate) {
      dateMatch = d.parsedDate >= startDate && d.parsedDate <= endDate;
    }

    // Check title match
    var titleMatch = true;
    if (searchTerm) {
      var title = d.Title.toLowerCase();
      if (searchTerm.startsWith('"') && searchTerm.endsWith('"')) {
        titleMatch = title.includes(searchTerm.slice(1, -1));
      } else {
        titleMatch = searchTerm.split(' ').every(function (word) {
          return title.includes(word);
        });
      }
    }

    // Check special filter matches
    var archivedMatch = !showArchived || !d.Archived;
    var caseMatch = !showCase || d.c_n;
    var unreliableMatch = !unreliableCase || !d.f_n;
    var countryLevelMatch = !showCountryLevel || !d.country_level;

    // Combine all filter conditions
    return countryMatch && corruptionCategoryMatch && healthCategoryMatch && dateMatch && titleMatch && archivedMatch && unreliableMatch && caseMatch && countryLevelMatch;
  });
  console.timeEnd('Filtering Data');
  return filteredData;
}

/**
 * Get data filtered by map bounds
 * @param {Object} bounds Map bounds object
 * @returns {Array} Visible data inside bounds
 */
function getVisibleData(bounds) {
  return filteredData.filter(function (d) {
    return bounds.contains(L.latLng(d.lat, d.long));
  });
}

/**
 * Get current filtered data
 * @returns {Array} Filtered data array
 */
function getFilteredData() {
  return filteredData;
}

/**
 * Get min and max dates from the dataset
 * @returns {Object} Object with minDate and maxDate 
 */
function getDateRange() {
  return {
    minDate: minDate,
    maxDate: maxDate
  };
}

/**
 * Export the data module
 */
var _default = exports.default = {
  formatNumber: formatNumber,
  loadData: loadData,
  processData: processData,
  filterData: filterData,
  getVisibleData: getVisibleData,
  getFilteredData: getFilteredData,
  getDateRange: getDateRange
};
},{}],"modules/ui.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInfoBox = createInfoBox;
exports.debounce = debounce;
exports.default = void 0;
exports.initializeDatePickers = initializeDatePickers;
exports.initializeExportButton = initializeExportButton;
exports.initializeFilterBox = initializeFilterBox;
exports.initializeFilterCheckboxes = initializeFilterCheckboxes;
exports.initializeHelpButton = initializeHelpButton;
exports.initializeInfoIcons = initializeInfoIcons;
exports.initializeResetButton = initializeResetButton;
exports.initializeSearchInput = initializeSearchInput;
exports.initializeSelect2Filter = initializeSelect2Filter;
exports.initializeShareButtons = initializeShareButtons;
exports.initializeViewToggle = initializeViewToggle;
exports.initializeWelcomeOverlay = initializeWelcomeOverlay;
exports.updateResetButtonVisibility = updateResetButtonVisibility;
var _constants = require("./constants");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var currentInfoBox = null;

/**
 * Initialize view toggling between map and table
 */
function initializeViewToggle() {
  var buttons = document.querySelectorAll('.switch-button');
  var mapOverviewBtn = document.getElementById('map-overview-btn');
  var listBtn = document.getElementById('list-btn');
  var mapElement = document.getElementById('map');
  var dataTables = document.getElementById('mask');
  function updateVisibility() {
    if (mapOverviewBtn.classList.contains('active')) {
      mapElement.style.display = 'block';
      dataTables.style.display = 'none';
    } else {
      mapElement.style.display = 'none';
      dataTables.style.display = 'block';
    }
  }
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      buttons.forEach(function (btn) {
        return btn.classList.remove('active');
      });
      button.classList.add('active');
      updateVisibility();
    });
  });

  // Initial visibility setup
  updateVisibility();
}

/**
 * Initialize the filter box expand/collapse functionality
 */
function initializeFilterBox() {
  document.querySelector('#clicker').addEventListener('click', function () {
    var content = document.querySelector('.filter-content');
    var icon = document.querySelector('.expand-icon');
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
function initializeSelect2Filter(selector, data, placeholder, onChange) {
  $(selector).select2({
    data: data.map(function (item) {
      return {
        id: item,
        text: item
      };
    }),
    placeholder: placeholder
  }).on('change', onChange);
}

/**
 * Initialize date picker widgets
 * @param {Function} onChange Function to call when date changes
 * @param {Object} dateRange Object with minDate and maxDate
 */
function initializeDatePickers(onChange, dateRange) {
  $('#startDate, #endDate').datepicker({
    format: 'dd/mm/yy',
    autoclose: true
  }).on('changeDate', onChange);

  // Set initial dates
  $('#startDate').datepicker('setDate', dateRange.minDate);
  $('#endDate').datepicker('setDate', dateRange.maxDate);
}

/**
 * Initialize search input with debounce
 * @param {Function} onChange Function to call when search input changes
 * @param {Number} debounceTime Debounce time in milliseconds
 */
function initializeSearchInput(onChange) {
  var debounceTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  $('#search-input').on('input', debounce(onChange, debounceTime));
}

/**
 * Initialize filter checkboxes
 * @param {Object} checkboxes Object with checkbox IDs and change handlers
 */
function initializeFilterCheckboxes(checkboxes) {
  Object.entries(checkboxes).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      id = _ref2[0],
      handler = _ref2[1];
    var checkbox = document.getElementById(id);
    if (checkbox) {
      checkbox.addEventListener('change', handler);
    }
  });
}

/**
 * Initialize reset filters button
 * @param {Function} resetFunction Function to reset all filters
 */
function initializeResetButton(resetFunction) {
  $('#resetFilters').on('click', resetFunction);
}

/**
 * Update reset button visibility based on filter state
 * @param {Boolean} isActive Whether any filter is active
 */
function updateResetButtonVisibility(isActive) {
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
function createInfoBox(content, target) {
  console.log('Creating info box for:', content);
  if (currentInfoBox) {
    currentInfoBox.remove();
  }
  var infoBox = document.createElement('div');
  infoBox.className = 'info-box';
  infoBox.textContent = content;
  document.body.appendChild(infoBox);
  var targetRect = target.getBoundingClientRect();
  infoBox.style.top = "".concat(targetRect.bottom + window.scrollY + 5, "px");
  infoBox.style.left = "".concat(targetRect.left + window.scrollX - 150, "px");
  infoBox.style.display = 'block';
  currentInfoBox = infoBox;
  console.log('Info box created and displayed');
}

/**
 * Initialize info icons for tooltips
 */
function initializeInfoIcons() {
  function handleInfoIconClick(e) {
    console.log('Info icon clicked:', this.id);
    e.preventDefault();
    e.stopPropagation();
    var filterType = this.getAttribute('data-filter');
    var infoContent = _constants.infoBoxes[filterType];
    createInfoBox(infoContent, this);
  }
  var infoIconIds = ['main-info', 'country-info', 'corruption-info', 'health-info', 'date-info', 'archived-info', 'case-info', 'unreliable-info', 'country-level-info'];
  infoIconIds.forEach(function (id) {
    var icon = document.getElementById(id);
    if (icon) {
      console.log('Attaching click event to:', id);
      icon.addEventListener('click', handleInfoIconClick);
      icon.addEventListener('mousedown', function (e) {
        return e.preventDefault();
      });
    } else {
      console.warn('Info icon not found:', id);
    }
  });

  // Close info box when clicking elsewhere
  document.addEventListener('click', function (e) {
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
function initializeWelcomeOverlay() {
  var overlay = document.getElementById('infoCardOverlay');
  if (!sessionStorage.getItem('hasVisitedBefore')) {
    setTimeout(function () {
      overlay.classList.add('show');
    }, 100);
  }
  document.getElementById('closeInfoCard').addEventListener('click', function () {
    overlay.classList.remove('show');
    sessionStorage.setItem('hasVisitedBefore', 'true');
  });

  // Close when clicking overlay background
  $('#infoCardOverlay').on('click', function (e) {
    if (e.target === this) {
      $(this).removeClass('show');
    }
  });
}

/**
 * Initialize help button to open overlay
 */
function initializeHelpButton() {
  var helpButton = $('<button>').addClass('btn btn-sm btn-outline-secondary export-csv-button btn-sharer').html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3l58.3 0c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24l0-13.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1l-58.3 0c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>').attr('title', 'Open the Quick start menu').appendTo('#help-button-container').css({
    'min-height': '34px',
    'display': 'flex',
    'align-items': 'center',
    'justify-content': 'center'
  }).on('click', function () {
    $('#infoCardOverlay').addClass('show');
  });
}

/**
 * Initialize share buttons
 */
function initializeShareButtons() {
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
function initializeExportButton(getDataFunction) {
  var exportButton = $('<button>').addClass('btn btn-sm btn-outline-secondary export-csv-button btn-sharer').html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1z"/><path fill-rule="evenodd" d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708z"/></svg>').attr('title', 'Export filtered data to CSV').appendTo('#export-button-container').on('click', function () {
    var dataToExport = getDataFunction();
    var csv = [];
    var headers = ['Title', 'Country/Region', 'URL', 'Date'];
    csv.push(headers.join(','));
    dataToExport.forEach(function (row) {
      var csvRow = ['"' + (row.Title || '').replace(/"/g, '""') + '"', '"' + (row.country || '').replace(/"/g, '""') + '"', '"' + (row.url || '').replace(/"/g, '""') + '"', '"' + (row['Date'] || '').replace(/"/g, '""') + '"'];
      csv.push(csvRow.join(','));
    });
    var csvContent = csv.join('\n');
    var blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
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
function debounce(func, wait) {
  var timeout;
  return function executedFunction() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var later = function later() {
      clearTimeout(timeout);
      func.apply(void 0, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
var _default = exports.default = {
  initializeViewToggle: initializeViewToggle,
  initializeFilterBox: initializeFilterBox,
  initializeSelect2Filter: initializeSelect2Filter,
  initializeDatePickers: initializeDatePickers,
  initializeSearchInput: initializeSearchInput,
  initializeFilterCheckboxes: initializeFilterCheckboxes,
  initializeResetButton: initializeResetButton,
  updateResetButtonVisibility: updateResetButtonVisibility,
  createInfoBox: createInfoBox,
  initializeInfoIcons: initializeInfoIcons,
  initializeWelcomeOverlay: initializeWelcomeOverlay,
  initializeHelpButton: initializeHelpButton,
  initializeShareButtons: initializeShareButtons,
  initializeExportButton: initializeExportButton,
  debounce: debounce
};
},{"./constants":"modules/constants.js"}],"modules/table.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.getDataTable = getDataTable;
exports.initializeDataTable = initializeDataTable;
exports.updateDataTable = updateDataTable;
var _constants = require("./constants");
var dataTable;

/**
 * Initialize the data table with configuration
 * @returns {Object} DataTable instance
 */
function initializeDataTable() {
  console.time('DataTable Initialization');

  // Extend jQuery DataTables with custom date sorting for European date format (dd/mm/yy)
  extendDataTableSorting();

  // Initialize the datatable with settings
  dataTable = $('#dc-data-table').DataTable(_constants.dataTableSettings);
  console.timeEnd('DataTable Initialization');
  return dataTable;
}

/**
 * Extend DataTable with custom date sorting for European format dates
 */
function extendDataTableSorting() {
  jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "date-eu-pre": function dateEuPre(date) {
      if (date.indexOf("Cancelled") > -1) {
        date = date.split(" ")[0];
      }
      return parseDateDMY(date);
    },
    "date-eu-asc": function dateEuAsc(a, b) {
      return a < b ? -1 : a > b ? 1 : 0;
    },
    "date-eu-desc": function dateEuDesc(a, b) {
      return a < b ? 1 : a > b ? -1 : 0;
    }
  });
}

/**
 * Parse date in dd/mm/yy format
 * @param {String} dateStr Date string to parse
 * @returns {Date|null} Parsed date or null
 */
function parseDateDMY(dateStr) {
  // Use d3's built-in parser or implement our own
  var dmy = d3.timeParse("%d/%m/%y");
  return dmy(dateStr);
}

/**
 * Update the data table with new data
 * @param {Array} data Data array to display in the table
 */
function updateDataTable(data) {
  dataTable.clear().rows.add(data).draw();
}

/**
 * Get current data table instance
 * @returns {Object} DataTable instance
 */
function getDataTable() {
  return dataTable;
}
var _default = exports.default = {
  initializeDataTable: initializeDataTable,
  updateDataTable: updateDataTable,
  getDataTable: getDataTable
};
},{"./constants":"modules/constants.js"}],"app.js":[function(require,module,exports) {
"use strict";

var mapModule = _interopRequireWildcard(require("./modules/map"));
var dataModule = _interopRequireWildcard(require("./modules/data"));
var uiModule = _interopRequireWildcard(require("./modules/ui"));
var tableModule = _interopRequireWildcard(require("./modules/table"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// App state
var markerMap = new Map();

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', function () {
  console.time('Total Initialization');
  console.log("Initialization started");

  // Initialize UI components
  uiModule.initializeWelcomeOverlay();
  uiModule.initializeViewToggle();
  uiModule.initializeFilterBox();
  uiModule.initializeInfoIcons();

  // Initialize map
  mapModule.initializeMap();

  // Initialize data table
  tableModule.initializeDataTable();

  // Get filter checkbox elements
  var archivedFilter = document.getElementById('archivedFilter');
  var caseFilter = document.getElementById('caseFilter');
  var unreliableFilter = document.getElementById('unreliableFilter');
  var countryLevelFilter = document.getElementById('countryLevelFilter');

  // Load data
  console.time('Data Fetching');
  dataModule.loadData('./data/loc3.json').then(function (data) {
    console.timeEnd('Data Fetching');
    initializeWithData(data, {
      archivedFilter: archivedFilter,
      caseFilter: caseFilter,
      unreliableFilter: unreliableFilter,
      countryLevelFilter: countryLevelFilter
    });
  }).catch(function (error) {
    return console.error('Error loading data:', error);
  });
  console.timeEnd('Total Initialization');
});

/**
 * Initialize app with loaded data
 * @param {Array} data Loaded data
 * @param {Object} filterElements Filter checkbox DOM elements
 */
function initializeWithData(data, filterElements) {
  var archivedFilter = filterElements.archivedFilter,
    caseFilter = filterElements.caseFilter,
    unreliableFilter = filterElements.unreliableFilter,
    countryLevelFilter = filterElements.countryLevelFilter;

  // Process the data
  var dateParser = d3.timeParse("%d/%m/%y");
  var processedData = dataModule.processData(data, dateParser);

  // Set total count
  $('.total-count').text(dataModule.formatNumber(processedData.allData.length));

  // Initialize filters
  initializeFilters(processedData, {
    archivedFilter: archivedFilter,
    caseFilter: caseFilter,
    unreliableFilter: unreliableFilter,
    countryLevelFilter: countryLevelFilter
  });

  // Initialize additional UI components that depend on data
  uiModule.initializeHelpButton();
  uiModule.initializeShareButtons();
  uiModule.initializeExportButton(function () {
    return dataModule.getFilteredData();
  });

  // Apply initial filter
  updateFilters();
}

/**
 * Initialize filter components
 * @param {Object} processedData Processed data object
 * @param {Object} filterElements Filter checkbox DOM elements
 */
function initializeFilters(processedData, filterElements) {
  var archivedFilter = filterElements.archivedFilter,
    caseFilter = filterElements.caseFilter,
    unreliableFilter = filterElements.unreliableFilter,
    _countryLevelFilter = filterElements.countryLevelFilter;
  var uniqueCountries = processedData.uniqueCountries,
    uniqueCorruptionCategories = processedData.uniqueCorruptionCategories,
    uniqueHealthCategories = processedData.uniqueHealthCategories,
    minDate = processedData.minDate,
    maxDate = processedData.maxDate;

  // Initialize select2 dropdowns
  uiModule.initializeSelect2Filter('#countryFilter', uniqueCountries, 'Select multiple', filterChangeHandler);
  uiModule.initializeSelect2Filter('#corruptionCategoriesFilter', uniqueCorruptionCategories, 'Select multiple', filterChangeHandler);
  uiModule.initializeSelect2Filter('#healthCategoriesFilter', uniqueHealthCategories, 'Select multiple', filterChangeHandler);

  // Initialize date pickers
  uiModule.initializeDatePickers(filterChangeHandler, {
    minDate: minDate,
    maxDate: maxDate
  });

  // Initialize search input
  uiModule.initializeSearchInput(filterChangeHandler);

  // Initialize filter checkboxes
  uiModule.initializeFilterCheckboxes({
    'archivedFilter': function archivedFilter() {
      updateFilters();
      updateResetButtonVisibility();
    },
    'unreliableFilter': function unreliableFilter() {
      updateFilters();
      updateResetButtonVisibility();
    },
    'caseFilter': function caseFilter() {
      updateFilters();
      updateResetButtonVisibility();
    },
    'countryLevelFilter': function countryLevelFilter() {
      // Show/hide legend based on filter state
      mapModule.toggleLegend(!_countryLevelFilter.checked);
      // Update filters
      updateFilters();
      updateResetButtonVisibility();
    }
  });

  // Initialize reset button
  uiModule.initializeResetButton(function () {
    if (isAnyFilterActive()) {
      $('#countryFilter, #corruptionCategoriesFilter, #healthCategoriesFilter').val(null).trigger('change');
      $('#startDate').datepicker('setDate', minDate);
      $('#endDate').datepicker('setDate', maxDate);
      $('#search-input').val('');
      archivedFilter.checked = false;
      caseFilter.checked = true;
      unreliableFilter.checked = true;
      _countryLevelFilter.checked = true;
      updateFilters();
      updateResetButtonVisibility();
      mapModule.toggleLegend(false);
    }
  });
}

/**
 * Handler for filter changes
 */
function filterChangeHandler() {
  updateFilters();
  updateResetButtonVisibility();
}

/**
 * Update filters and apply to data
 */
function updateFilters() {
  // Get filter values
  var selectedCountries = new Set($('#countryFilter').val() || []);
  var selectedCorruptionCategories = new Set($('#corruptionCategoriesFilter').val() || []);
  var selectedHealthCategories = new Set($('#healthCategoriesFilter').val() || []);
  var startDate = $('#startDate').datepicker('getDate');
  var endDate = $('#endDate').datepicker('getDate');
  var searchTerm = $('#search-input').val().toLowerCase().trim();
  var showArchived = document.getElementById('archivedFilter').checked;
  var showCase = document.getElementById('caseFilter').checked;
  var unreliableCase = document.getElementById('unreliableFilter').checked;
  var showCountryLevel = document.getElementById('countryLevelFilter').checked;

  // Create filter criteria object
  var filterCriteria = {
    selectedCountries: selectedCountries,
    selectedCorruptionCategories: selectedCorruptionCategories,
    selectedHealthCategories: selectedHealthCategories,
    startDate: startDate,
    endDate: endDate,
    searchTerm: searchTerm,
    showArchived: showArchived,
    showCase: showCase,
    unreliableCase: unreliableCase,
    showCountryLevel: showCountryLevel
  };

  // Apply filters
  var filteredData = dataModule.filterData(filterCriteria);

  // Update map and table
  updateMapAndTable();
}

/**
 * Check if any filter is currently active
 * @returns {Boolean} Whether any filter is active
 */
function isAnyFilterActive() {
  var dateRange = dataModule.getDateRange();
  var selectedCountries = $('#countryFilter').val() || [];
  var selectedCorruptionCategories = $('#corruptionCategoriesFilter').val() || [];
  var selectedHealthCategories = $('#healthCategoriesFilter').val() || [];
  var startDate = $('#startDate').datepicker('getDate');
  var endDate = $('#endDate').datepicker('getDate');
  var searchTerm = $('#search-input').val().trim();
  var isArchivedFilterActive = document.getElementById('archivedFilter').checked;
  var isUnreliableFilterActive = !document.getElementById('unreliableFilter').checked;
  var isCaseFilterActive = !document.getElementById('caseFilter').checked;
  var isCountryLevelFilterActive = !document.getElementById('countryLevelFilter').checked;
  var isDateFilterActive = startDate && dateRange.minDate && startDate.getTime() !== dateRange.minDate.getTime() || endDate && dateRange.maxDate && endDate.getTime() !== dateRange.maxDate.getTime();
  return selectedCountries.length > 0 || selectedCorruptionCategories.length > 0 || selectedHealthCategories.length > 0 || isDateFilterActive || searchTerm !== '' || isArchivedFilterActive || isUnreliableFilterActive || isCaseFilterActive || isCountryLevelFilterActive;
}

/**
 * Update reset button visibility
 */
function updateResetButtonVisibility() {
  uiModule.updateResetButtonVisibility(isAnyFilterActive());
}

/**
 * Update map markers and data table with filtered data
 */
function updateMapAndTable() {
  console.time('Updating Map and Table');

  // Clear existing markers
  mapModule.clearMarkers();
  markerMap.clear();
  var filteredData = dataModule.getFilteredData();
  if (filteredData.length > 0) {
    var chunk = 1000;
    var index = 0;
    function addNextChunk() {
      var limit = Math.min(index + chunk, filteredData.length);
      var newMarkers = [];
      for (var i = index; i < limit; i++) {
        var location = filteredData[i];
        var uniqueId = "".concat(location.lat, "-").concat(location.long, "-").concat(location.Title);
        if (!markerMap.has(uniqueId)) {
          var marker = mapModule.createMarker(location);
          newMarkers.push(marker);
          markerMap.set(uniqueId, marker);
        }
      }
      mapModule.addMarkers(newMarkers);
      index = limit;
      if (index < filteredData.length) {
        setTimeout(addNextChunk, 0);
      } else {
        mapModule.fitMapToBounds();
        updateVisibleData();
      }
    }
    addNextChunk();
  } else {
    updateVisibleData();
  }
  console.timeEnd('Updating Map and Table');
}

/**
 * Update visible data in table based on map bounds
 */
var updateVisibleData = uiModule.debounce(function () {
  console.time('Updating Visible Data');
  if (mapModule.isMapMoving()) {
    return;
  }
  var bounds = mapModule.getMapBounds();
  var visibleData = dataModule.getVisibleData(bounds);
  tableModule.updateDataTable(visibleData);
  $('.filter-count').text(dataModule.formatNumber(visibleData.length));
  console.timeEnd('Updating Visible Data');
}, 1000);

// Make updateVisibleData available to map event handlers
mapModule.onMoveEnd = updateVisibleData;
},{"./modules/map":"modules/map.js","./modules/data":"modules/data.js","./modules/ui":"modules/ui.js","./modules/table":"modules/table.js"}],"map.js":[function(require,module,exports) {
"use strict";

require("./app");
},{"./app":"app.js"}],"../../../../AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54565" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../../../../AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","map.js"], null)