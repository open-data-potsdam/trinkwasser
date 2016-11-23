function p_wahlKarte_init() {
  'use strict';

	// Basemap
  // var wikiosmUrl='http://maps.wikimedia.org/osm-intl/{z}}/{x}/{y}.png';
	// var hikebikeUrl='http://toolserver.org/tiles/hikebike/{z}}/{x}/{y}.png';
	var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Kartendaten © <a href="http://openstreetmap.org">OpenStreetMap</a>-Beitragende';
	var wikiosmAttrib ='';
	var basemap = new L.TileLayer(osmUrl, {minZoom: 10, maxZoom: 18, attribution: osmAttrib});

	// // Add Basemap (only testing, not for production!)
	// var basemap = new L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWxjb2ZyaWJhcyIsImEiOiJjaXB0anlxZWgwMDM2aHVtMnZyZXdkeHIxIn0.ABRkbCUsPYK-bjfaDJ0PZw', {
	// 		// maxZoom: crs.options.resolutions.length,
	// 		// continuousWorld: true,
	// 	attribution: 'Kartendaten &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
	// 					 '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
	// 					 'Bilddaten © <a href="http://mapbox.com">Mapbox</a>',
	// 	id: 'mapbox.streets'
	// });
	basemap.addTo(map);

	// map overlay: Potsdam waterworks districts
	waterDistricts.addTo(map);

	// Set Viewport adequately
	map.setMaxBounds(waterDistricts.getBounds());
	map.options.minZoom = map.getZoom(); // not nescessary?

	mapResetView();
}

var map = new L.Map('leafmap');

var waterDistricts = L.geoJson(districts, {
	style: style,
	onEachFeature: onEachFeature
});

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
		return { weight: 1,
						 color: '#f78307',
						 opacity: 0.5,
						 fillColor: '#f78307',
						 fillOpacity: 0.3,
             // add property to draw doubled lines only once
		};
}

function highlightFeature(e) {
		// highlight district under mouse
		var layer = e.target;

		layer.setStyle({
								 opacity: 0.7,
								 fillOpacity: 0.5
							 });

		if (!L.Browser.ie && !L.Browser.opera) {
				layer.bringToFront();
		}
		$('#waterWorks').html("<b>"+e.target.feature.properties.name+"</b>");
}

function resetHighlight(e) {
		// reset highlight on mouseout
		waterDistricts.resetStyle(e.target);
}

function districtChoosen(e) {
		var location = e.target.feature.properties.id;
		console.log('Klick für',location);
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
