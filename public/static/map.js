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
})({"map.js":[function(require,module,exports) {
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
document.addEventListener('DOMContentLoaded', function () {
  console.time('Total Initialization');
  console.log("Initialization started");
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
  console.time('Map Initialization');
  var map = L.map('map').setView([0, 0], 2); // Start with a global view

  // Define marker icons
  var countryIcon = L.divIcon({
    className: 'custom-div-icon',
    html: '<i style="color: #e5007d;" class="fa fa-map-marker fa-3x"></i>',
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  });
  var specificIcon = L.divIcon({
    className: 'custom-div-icon',
    html: '<i style="color: #3694d1;" class="fa fa-map-marker fa-3x"></i>',
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  });
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
  var markers = L.markerClusterGroup({
    chunkedLoading: true,
    chunkInterval: 200,
    chunkDelay: 50
  });
  map.addLayer(markers);

  // Add the legend
  var legend = L.control({
    position: 'bottomright'
  });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = "\n        <div class=\"legend-content\">\n            <h4>Location Precision</h4>\n            <i style=\"color: #3694d1;\" class=\"fa fa-map-marker\"></i> Specific Location in Country (e.g., city, facility)<br>\n            <i style=\"color: #e5007d;\" class=\"fa fa-map-marker\"></i> Country Only (no specific location)\n        </div>\n    ";
    return div;
  };

  // Add this variable to track if legend is currently added
  var legendAdded = false;
  console.timeEnd('Map Initialization');
  console.time('DataTable Initialization');
  var dataTable = $('#dc-data-table').DataTable({
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
  });
  console.timeEnd('DataTable Initialization');
  jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "date-eu-pre": function dateEuPre(date) {
      if (date.indexOf("Cancelled") > -1) {
        date = date.split(" ")[0];
      }
      return dmy(date);
    },
    "date-eu-asc": function dateEuAsc(a, b) {
      return a < b ? -1 : a > b ? 1 : 0;
    },
    "date-eu-desc": function dateEuDesc(a, b) {
      return a < b ? 1 : a > b ? -1 : 0;
    }
  });
  var numberFormatter = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0
  });
  function formatNumber(num) {
    return numberFormatter.format(num);
  }
  var allData = [];
  var filteredData = [];
  var markerMap = new Map();
  var minDate, maxDate;
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
  console.time('Data Fetching');
  fetch('./data/loc3.json').then(function (response) {
    return response.json();
  }).then(function (data) {
    console.timeEnd('Data Fetching');
    initMap(data);
  }).catch(function (error) {
    return console.error('Error loading data:', error);
  });
  var archivedFilter = document.getElementById('archivedFilter');
  var caseFilter = document.getElementById('caseFilter');
  var unreliableFilter = document.getElementById('unreliableFilter');
  var countryLevelFilter = document.getElementById('countryLevelFilter');
  function initMap(data) {
    console.time('Data Processing');
    var dateParser = d3.timeParse("%d/%m/%y");
    allData = data.map(function (d) {
      return _objectSpread(_objectSpread({}, d), {}, {
        parsedDate: dateParser(d['Date'])
      });
    });
    $('.total-count').text(formatNumber(allData.length));
    var uniqueCountries = _toConsumableArray(new Set(allData.map(function (item) {
      return item.country;
    }))).sort(function (a, b) {
      return a.localeCompare(b);
    });
    var uniqueCorruptionCategories = _toConsumableArray(new Set(allData.flatMap(function (item) {
      return item['Corruption Categories'];
    }))).sort(function (a, b) {
      return a.localeCompare(b);
    });
    var uniqueHealthCategories = _toConsumableArray(new Set(allData.flatMap(function (item) {
      return item['Sector Categories'];
    }))).sort(function (a, b) {
      return a.localeCompare(b);
    });
    initializeSelect2Filter('#countryFilter', uniqueCountries, 'Select multiple');
    initializeSelect2Filter('#corruptionCategoriesFilter', uniqueCorruptionCategories, 'Select multiple');
    initializeSelect2Filter('#healthCategoriesFilter', uniqueHealthCategories, 'Select multiple');
    minDate = d3.min(allData, function (d) {
      return d.parsedDate;
    });
    maxDate = d3.max(allData, function (d) {
      return d.parsedDate;
    });
    $('#startDate, #endDate').datepicker({
      format: 'dd/mm/yy',
      autoclose: true
    }).on('changeDate', function () {
      updateFilters();
      updateResetButtonVisibility();
    });
    $('#startDate').datepicker('setDate', minDate);
    $('#endDate').datepicker('setDate', maxDate);
    $('#resetFilters').on('click', function () {
      if (isAnyFilterActive()) {
        $('#countryFilter, #corruptionCategoriesFilter, #healthCategoriesFilter').val(null).trigger('change');
        $('#startDate').datepicker('setDate', minDate);
        $('#endDate').datepicker('setDate', maxDate);
        $('#search-input').val('');
        archivedFilter.checked = false;
        caseFilter.checked = true;
        unreliableFilter.checked = true;
        countryLevelFilter.checked = true;
        updateFilters();
        updateResetButtonVisibility();
        if (legendAdded) {
          legend.remove();
          legendAdded = false;
        }
      }
    });
    $('#search-input').on('input', debounce(function () {
      updateFilters();
      updateResetButtonVisibility();
    }, 500));
    console.timeEnd('Data Processing');
    updateFilters();
    updateResetButtonVisibility();
  }
  function initializeSelect2Filter(selector, data, placeholder) {
    $(selector).select2({
      data: data.map(function (item) {
        return {
          id: item,
          text: item
        };
      }),
      placeholder: placeholder
    }).on('change', function () {
      updateFilters();
      updateResetButtonVisibility();
    });
  }
  function isAnyFilterActive() {
    var selectedCountries = $('#countryFilter').val() || [];
    var selectedCorruptionCategories = $('#corruptionCategoriesFilter').val() || [];
    var selectedHealthCategories = $('#healthCategoriesFilter').val() || [];
    var startDate = $('#startDate').datepicker('getDate');
    var endDate = $('#endDate').datepicker('getDate');
    var searchTerm = $('#search-input').val().trim();
    var isArchivedFilterActive = archivedFilter.checked;
    var isUnreliableFilterActive = !unreliableFilter.checked;
    var isCaseFilterActive = !caseFilter.checked;
    var isCountryLevelFilterActive = !countryLevelFilter.checked;
    var isDateFilterActive = startDate && minDate && startDate.getTime() !== minDate.getTime() || endDate && maxDate && endDate.getTime() !== maxDate.getTime();
    return selectedCountries.length > 0 || selectedCorruptionCategories.length > 0 || selectedHealthCategories.length > 0 || isDateFilterActive || searchTerm !== '' || isArchivedFilterActive || isUnreliableFilterActive || isCaseFilterActive || isCountryLevelFilterActive;
  }
  function updateResetButtonVisibility() {
    if (isAnyFilterActive()) {
      $('#resetFilters').show();
    } else {
      $('#resetFilters').hide();
    }
  }
  var dmy = d3.timeParse("%d/%m/%y");
  function updateFilters() {
    console.time('Filtering Data');
    var selectedCountries = new Set($('#countryFilter').val() || []);
    var selectedCorruptionCategories = new Set($('#corruptionCategoriesFilter').val() || []);
    var selectedHealthCategories = new Set($('#healthCategoriesFilter').val() || []);
    var startDate = $('#startDate').datepicker('getDate');
    var endDate = $('#endDate').datepicker('getDate');
    var searchTerm = $('#search-input').val().toLowerCase().trim();
    var showArchived = archivedFilter.checked;
    var showCase = caseFilter.checked;
    var unreliableCase = unreliableFilter.checked;
    var showCountryLevel = countryLevelFilter.checked;
    filteredData = allData.filter(function (d) {
      var countryMatch = selectedCountries.size === 0 || selectedCountries.has(d.country);
      var corruptionCategoryMatch = selectedCorruptionCategories.size === 0 || d['Corruption Categories'].some(function (category) {
        return selectedCorruptionCategories.has(category);
      });
      var healthCategoryMatch = selectedHealthCategories.size === 0 || d['Sector Categories'].some(function (category) {
        return selectedHealthCategories.has(category);
      });
      var dateMatch = true;
      if (startDate && endDate && d.parsedDate) {
        dateMatch = d.parsedDate >= startDate && d.parsedDate <= endDate;
      }
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
      var archivedMatch = !showArchived || !d.Archived;
      var caseMatch = !showCase || d.c_n;
      var unreliableMatch = !unreliableCase || !d.f_n;
      var countryLevelMatch = !showCountryLevel || !d.country_level;
      return countryMatch && corruptionCategoryMatch && healthCategoryMatch && dateMatch && titleMatch && archivedMatch && unreliableMatch && caseMatch && countryLevelMatch;
    });
    console.timeEnd('Filtering Data');
    updateMapAndTable();
  }
  function updateMapAndTable() {
    console.time('Updating Map and Table');
    markers.clearLayers();
    markerMap.clear();
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
            // Use country or specific icon based on country_level
            var icon = location.country_level ? countryIcon : specificIcon;
            var marker = L.marker([location.lat, location.long], {
              icon: icon
            }).bindPopup("\n                                <div class=\"popup-content\">\n                                    <h3 class=\"popup-title\">\"".concat(location.Title, "\"</h3>\n                                    <div class=\"popup-details\">\n                                        <p><strong>Country:</strong> ").concat(location.country, "</p>\n                                        <p><strong>URL:</strong> <a href=\"").concat(location.url, "\" target=\"_blank\">Link</a></p>\n                                        <p><strong>Date:</strong> ").concat(location['Date'], "</p>\n                                        <p><strong>Integrity Area:</strong> ").concat(String(location['Corruption Categories'] || '').replace(/,(?=[^\s])/g, ', '), "</p>\n                                        <p><strong>Sector Area:</strong> ").concat(String(location['Sector Categories'] || '').replace(/,(?=[^\s])/g, ', '), "</p>\n                                    </div>\n                                </div>\n                            "));
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
  document.querySelector('#clicker').addEventListener('click', function () {
    var content = document.querySelector('.filter-content');
    var icon = document.querySelector('.expand-icon');
    content.classList.toggle('expanded');
    icon.classList.toggle('expanded');
  });
  var updateVisibleData = debounce(function () {
    console.time('Updating Visible Data');
    if (map.isMoving()) {
      return;
    }
    var bounds = map.getBounds();
    var visibleData = filteredData.filter(function (d) {
      return bounds.contains(L.latLng(d.lat, d.long));
    });
    dataTable.clear().rows.add(visibleData).draw();
    $('.filter-count').text(formatNumber(visibleData.length));
    console.timeEnd('Updating Visible Data');
  }, 1000);
  map.on('movestart', function () {
    map.isMoving = function () {
      return true;
    };
  });
  map.on('moveend', function () {
    map.isMoving = function () {
      return false;
    };
    updateVisibleData();
  });
  var infoBoxes = {
    country: "Country mentioned in the article. This is usually, but not always, where the story occured.",
    corruption: "We used AI to identify when a story is related to a particular theme related to integrity. See our 'About' page for qualifications and limitations.",
    health: "We used AI to identify when a story is related to a particular area of health. See our 'About' page for qualifications and limitations.",
    date: "Set a date range to view which events have happened within a specific time period. Our archived data uses publication date.",
    archived: "When checked, this includes articles collected using our earlier data gathering methods. We've since improved our collection process. Unchecked shows only articles collected with our current methods.",
    cased: "When checked, this filters out general discussions and commentaries to focus on stories about specific corruption cases. Check it to include all articles.",
    unreliable: "We use AI to identify potentially unreliable news stories based on their writing style and content. While keeping this checked can help reduce exposure to low-quality news, please note: The filter works automatically with no human oversight. It may incorrectly flag legitimate stories as unreliable. It may miss unreliable stories. It can reflect biases present in AI training data. Think of it as a helpful but unverified first pass rather than a definitive assessment of reliability.",
    countryLevel: "When checked, this shows only articles where a specific location within the country could be determined. Check it to include articles where only the country-level location was identified."
  };
  var currentInfoBox = null;
  archivedFilter.addEventListener('change', function () {
    updateFilters();
    updateResetButtonVisibility();
  });
  unreliableFilter.addEventListener('change', function () {
    updateFilters();
    updateResetButtonVisibility();
  });
  caseFilter.addEventListener('change', function () {
    updateFilters();
    updateResetButtonVisibility();
  });
  countryLevelFilter.addEventListener('change', function () {
    // Show/hide legend based on filter state
    if (!this.checked && !legendAdded) {
      legend.addTo(map);
      legendAdded = true;
    } else if (this.checked && legendAdded) {
      legend.remove();
      legendAdded = false;
    }
    // Existing filter updates
    updateFilters();
    updateResetButtonVisibility();
  });
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
  function handleInfoIconClick(e) {
    console.log('Info icon clicked:', this.id);
    e.preventDefault();
    e.stopPropagation();
    var filterType = this.getAttribute('data-filter');
    var infoContent = infoBoxes[filterType];
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
  document.addEventListener('click', function (e) {
    if (currentInfoBox && !e.target.classList.contains('info-icon')) {
      console.log('Closing info box');
      currentInfoBox.remove();
      currentInfoBox = null;
    }
  });
  $('.filter-group select').off('select2:open');
  var exportButton = $('<button>').addClass('btn btn-sm btn-outline-secondary export-csv-button btn-sharer').html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1z"/><path fill-rule="evenodd" d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708z"/></svg>').attr('title', 'Export filtered data to CSV').appendTo('#export-button-container').on('click', function () {
    var dataToExport = filteredData;
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
  // Help button to open the overlay
  var helpButton = $('<button>').addClass('btn btn-sm btn-outline-secondary export-csv-button btn-sharer').html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3l58.3 0c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24l0-13.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1l-58.3 0c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>').attr('title', 'Open the Quick start menu').appendTo('#help-button-container').css({
    'min-height': '34px',
    'display': 'flex',
    'align-items': 'center',
    'justify-content': 'center'
  }).on('click', function () {
    $('#infoCardOverlay').addClass('show');
  });
  // Close button functionality
  $('#closeInfoCard').on('click', function () {
    $('#infoCardOverlay').removeClass('show');
  });

  // Close when clicking overlay background
  $('#infoCardOverlay').on('click', function (e) {
    if (e.target === this) {
      $(this).removeClass('show');
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
  console.timeEnd('Total Initialization');
});
},{}],"../../../../AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63812" + '/');
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