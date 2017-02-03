/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

class NamedLayer {
    constructor(name, type, autoAdd) {
        this.name = name;
        this.type = type;
        this.autoAdd = autoAdd;
    }
}
exports.NamedLayer = NamedLayer;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const ParcelPopup_1 = __webpack_require__(2);
const layerManager_1 = __webpack_require__(4);
class FranklinMap {
    constructor() {
        this.lMap = L.map("map", {
            zoom: 11,
            center: [34.4410, -87.8343]
        });
        this.layerManager = new layerManager_1.LayerManager(this);
        this.layerManager.loadJsonLayers();
        this.layerManager.loadComplexLayers().then(() => {
            console.log('loaded complex');
        });
        /* $(window).keypress((e:JQueryKeyEventObject) => {
             if (e.which == 99){
                 this.layerManager.loadComplexLayers().then(()=>{
                     console.log('loaded complex');
                 });
             }
 
             if (e.which == 97){
                 console.log(this.layerManager);
             }
         });*/
    }
    getDataFromId(id) {
        var sql = new cartodb.SQL({ user: 'cartomike' });
        var endpoint = "https://cartomike.carto.com/api/v2/sql/";
        // ownerQ = ownerQ.split("{NAME}").join(name);
        var myQuery = "SELECT *,ST_AsGeoJSON(ST_Centroid(the_geom)) as centroid FROM parcels_carto WHERE cartodb_id = " + id;
        console.log("Making CartoDB GET request for ID: " + id + "...");
        return new Promise((resolve, reject) => {
            $.getJSON(endpoint, { q: myQuery }, (data) => resolve(data.rows[0]));
        });
    }
    openPopup(item) {
        var coords = JSON.parse(item.centroid).coordinates.reverse();
        this.lMap.setView(coords, 16, { animate: false });
        console.log("Should open popup now.");
        console.log("TODO: Add actual popup");
        console.log(item);
        var p = new ParcelPopup_1.ParcelPopup(this, item);
        p.open();
    }
}
exports.FranklinMap = FranklinMap;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//import txt = require('raw-loader!./pop.html');
class ParcelPopup {
    constructor(map, data) {
        this.lPop = L.popup();
        this.data = data;
        this.map = map;
        this.allowedFields = {
            "fulladdress": "Address:",
            "parcelnumber": "Parcel #:",
            "zipcode": "Zip:"
        };
        this.open();
    }
    toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    }
    open() {
        var coords = JSON.parse(this.data.centroid).coordinates.reverse();
        this.lPop.setLatLng(coords);
        this.map.lMap.setView(coords, 16, { animate: true });
        var html = '<div class="popup-container"> <div class="popup-header"> <span class="popup-header-title">Owner</span> <h3 id="owner-name"></h3> </div> <div class="popup-parcel-details"> </div> <a href="#" id="reportLink">More information</a> </div>';
        var el = $(html);
        var details = el.find('.popup-parcel-details');
        var owner = el.find("#owner-name");
        if (this.data.ownername) {
            owner.text(this.toTitleCase(this.data.ownername));
        }
        else {
            owner.text("");
        }
        for (var property in this.allowedFields) {
            if (this.allowedFields.hasOwnProperty(property)) {
                if (this.data[property] && this.data[property].length > 0) {
                    //If property is allowed and included in the item object, create element with details
                    var title = $("<h4></h4>");
                    var desc = $("<p></p>");
                    title.text(this.allowedFields[property]);
                    desc.text(this.data[property]);
                    details.append(title);
                    details.append(desc);
                }
            }
        }
        this.lPop.setContent(el.html());
        this.map.lMap.openPopup(this.lPop);
    }
}
exports.ParcelPopup = ParcelPopup;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const namedLayer_1 = __webpack_require__(0);
var JsonLayerLoader;
(function (JsonLayerLoader) {
    function loadJSONLayers(map) {
        let json = __webpack_require__(5);
        let layerDefinitions = json.layers;
        let namedLayers = new Array();
        layerDefinitions.forEach(def => {
            let nl = this.parseJSONLayer(def);
            if (nl.autoAdd) {
                nl.layer.addTo(map);
            }
            namedLayers.push(nl);
        });
        return namedLayers;
    }
    JsonLayerLoader.loadJSONLayers = loadJSONLayers;
    function parseJSONLayer(layerDef) {
        var name = layerDef.name;
        var type = layerDef.type;
        var opts = layerDef.layerOptions;
        var autoAdd = layerDef.autoAdd;
        var namedLayer = new namedLayer_1.NamedLayer(name, type, autoAdd);
        if (type == "tileLayer") {
            namedLayer.layer = L.tileLayer(opts.url, opts);
            return namedLayer;
        }
        if (type == "esriTiledMapLayer") {
            namedLayer.layer = L.esri.tiledMapLayer(opts);
            return namedLayer;
        }
        if (type == "esriDynamic") {
            namedLayer.layer = L.esri.dynamicMapLayer(opts);
            return namedLayer;
        }
    }
    JsonLayerLoader.parseJSONLayer = parseJSONLayer;
})(JsonLayerLoader = exports.JsonLayerLoader || (exports.JsonLayerLoader = {}));


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const namedLayer_1 = __webpack_require__(0);
const JsonLayerLoader_1 = __webpack_require__(3);
class LayerManager {
    constructor(fMap) {
        this.namedLayers = new Array();
        this.lMap = fMap.lMap;
        this.fMap = fMap;
    }
    loadJsonLayers() {
        let p = new Promise((resolve, reject) => {
            let jLayers = JsonLayerLoader_1.JsonLayerLoader.loadJSONLayers(this.lMap);
            this.namedLayers = this.namedLayers.concat(jLayers);
            resolve(this.namedLayers.length);
        });
    }
    loadComplexLayers() {
        console.log("Loading complex..");
        let longPromise = new Promise(function (resolve, reject) {
            setTimeout(() => {
                console.log("About to fulfill dummy sleep promise");
                resolve();
            }, 1000);
        });
        return Promise.all([this.createCartoLayer(), longPromise]);
    }
    createCartoLayer() {
        new Promise((resolve, reject) => {
            var layerUrl = 'https://cartomike.carto.com/api/v2/viz/92b6a26e-a3c9-11e6-a4a5-0ecd1babdde5/viz.json';
            cartodb.createLayer(this.lMap, layerUrl, { infowindow: false }).addTo(this.lMap).on('done', (layer) => {
                //Config for this carto layer to make interaction work
                layer.setZIndex(10);
                layer.getSubLayer(1).setInteraction(true);
                layer.getSubLayer(1).on('featureClick', (e, latlng, pos, data, lay) => {
                    console.log("CartoDB Layer clicked on.");
                    this.fMap.getDataFromId(data.cartodb_id).then((item) => { this.fMap.openPopup(item); });
                });
                layer.on('mouseover', function () {
                    $('#map').css('cursor', 'pointer');
                });
                layer.on('mouseout', function () {
                    $('#map').css('cursor', '');
                });
                let nl = new namedLayer_1.NamedLayer("cartoParcelLayer", "carto", true);
                nl.layer = layer;
                this.namedLayers.push(nl);
                console.log("About to fulfill carto promise.");
                resolve();
            }).on('error', reject);
        });
    }
}
exports.LayerManager = LayerManager;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = {
	"layers": [
		{
			"name": "osmBasemap",
			"type": "tileLayer",
			"autoAdd": true,
			"layerOptions": {
				"url": "http://{s}.tiles.mapbox.com/v3/spatialnetworks.map-6l9yntw9/{z}/{x}/{y}.png",
				"maxZoom": 19,
				"subdomains": [
					"a",
					"b",
					"c",
					"d"
				],
				"attribution": "Basemap <a href=\"https://www.mapbox.com/about/maps/\" target=\"_blank\">© Mapbox © OpenStreetMap</a>"
			}
		},
		{
			"name": "arcBase",
			"type": "esriTiledMapLayer",
			"autoAdd": false,
			"layerOptions": {
				"url": "http://tiles.arcgis.com/tiles/I97nVdg0OgwKVCpk/arcgis/rest/services/Basemap/MapServer",
				"opacity": "0.5"
			}
		},
		{
			"name": "annotations",
			"type": "esriDynamic",
			"autoAdd": true,
			"layerOptions": {
				"url": "http://8.35.16.158/arcgisserver/rest/services/parcelanno_dyn/MapServer",
				"opacity": 1
			}
		}
	]
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const FranklinMap_1 = __webpack_require__(1);
let m = new FranklinMap_1.FranklinMap();


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map