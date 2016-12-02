function p_wahlKarte_init() {
  'use strict';

  var dummy = 0;

  do
  {
    dummy = 0;
  }
  while (L == undefined);

  var map = new L.Map('leafmap');

  // Basemaps
  // find others at https://leaflet-extras.github.io/leaflet-providers/preview/

  // too many colors to combine it with colored overlays
  var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmAttrib='Kartendaten © <a href="http://openstreetmap.org">OpenStreetMap</a>-Beitragende';
  var wikiosmAttrib ='';
  var OSM_Mapnik = new L.TileLayer(osmUrl, {minZoom: 10, maxZoom: 18, attribution: osmAttrib});

  // allright!
  var OSM_BlackAndWhite = new L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
     subdomains: 'abcd',
     maxZoom: 18
  });

  // quite good!
  var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
  });

  // no, too little detail in low zoom levels
  var Stamen_Toner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
    attribution: 'Kacheln von <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Kartendaten &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  });

  var baseLayers = {
    "Carto Positron": CartoDB_Positron,
    "OSM b/w": OSM_BlackAndWhite
    // "Stamen Toner": Stamen_Toner,
    // "OSM Mapnik": OSM_Mapnik
  };

  var baseControl = L.control.layers(baseLayers);

  var waterDistricts = L.geoJson(districts, {
  	style: style,
  	onEachFeature: onEachFeature
  });

	// map overlay: Potsdam waterworks districts
  map.addLayer(CartoDB_Positron);
	waterDistricts.addTo(map);
  baseControl.addTo(map);

	// Set Viewport adequately
  map.fitBounds(waterDistricts.getBounds());
	map.options.minZoom = 11; // don't zoom out too far!

  return map;
}

var map = p_wahlKarte_init();

mapResetView();

function mapResetView() {
		map.setView([52.3948, 13.0604], 10);
}

function onEachFeature(feature, layer) {
		// Add Listeners to Districts Layer
		layer.on({ mouseover: highlightFeature,
							 mouseout: resetHighlight,
							 click: districtChoosen
		});
}

function style(feature) {
    var color = feature.properties.color;
		return { weight: 1,
						 color: color,
						 opacity: 0.5,
						 fillColor: color,
						 fillOpacity: 0.3,
             // add property to draw doubled lines only once
		};
}

function highlightFeature(e) {
		// highlight district under mouse
		var layer = e.target;

		layer.setStyle({
								 opacity: 0.8,
								 fillOpacity: 0.6
							 });

		if (!L.Browser.ie && !L.Browser.opera) {
				layer.bringToFront();
		}
		$('#waterWorks').html("<b>"+e.target.feature.properties.name+"</b>");
}

function resetHighlight(e) {
		// reset highlight on mouseout
    var layer = e.target;
		layer.setStyle({
								 opacity: 0.5,
								 fillOpacity: 0.3
							 });
}

function districtChoosen(e) {
		var location = e.target.feature.properties.id;
		$('a[data-attribute="'+location+'"]').click();
		$("#wahlKarte").modal('hide');
}

// force loading all tiles when modal is opened
$('#wahlKarte').on('shown.bs.modal', function(){
		map.invalidateSize();
});

// reset map pan and zoom when modal is opened again
$('#wahlKarte').on('hide.bs.modal', function(){
		mapResetView();
});
