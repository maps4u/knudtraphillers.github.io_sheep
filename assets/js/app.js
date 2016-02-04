var map, featureList, regionSearch = [], cowSearch = [], goatSearch = [], sheepSearch = [];

map = L.map("map", {
  zoom: 8,
  center: [56, -3],
  zoomControl: false
});

var oms = new OverlappingMarkerSpiderfier(map, {
  keepSpiderfied: true,
  legWeight: 2,
  nearbyDistance: 50,
});

oms.addListener('click', function(marker) {
  var cont = marker.getPopup().getContent();
  // $("#feature-title").html('hello');
  $("#feature-info").html(cont);
  $("#featureModal").modal("show");
});

oms.addListener('click', function(markers) {
  map.closePopup();
});
oms.addListener('spiderfy', function(markers) {
  map.closePopup();
});

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

$(document).on("mouseover", ".feature-row", function(e) {
  highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
});

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(regions.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  $('#sidebar').toggle();
  map.invalidateSize();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  $("#sidebar").toggle();
  map.invalidateSize();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  $('#sidebar').hide();
  map.invalidateSize();
});

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 14);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through cows layer and add only features which are in the map bounds */
  cows.eachLayer(function (layer) {
    if (map.hasLayer(cowLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/cow.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Loop through goats layer and add only features which are in the map bounds */
  goats.eachLayer(function (layer) {
    if (map.hasLayer(goatLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/cheese.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Loop through sheep layer and add only features which are in the map bounds */
  sheep.eachLayer(function (layer) {
    if (map.hasLayer(sheepLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/cheese.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

// /* Basemap Layers */
var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
// map.addLayer(Esri_WorldImagery);
var Stamen_Watercolor = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 5,
  maxZoom: 14,
  ext: 'png'
});
map.addLayer(Stamen_Watercolor);

var mapquestOSM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
  maxZoom: 14,
  minZoom: 5,
  subdomains: ["otile1", "otile2", "otile3", "otile4"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
});
var mapquestOAM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 14,
  minZoom: 5,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
});
var mapquestHYB = L.layerGroup([L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 14,
  minZoom: 5,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"]
}), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
  maxZoom: 14,
  minZoom: 5,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
  attribution: 'Labels courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
})]);

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

// var regions = L.geoJson(null, {
//   style: function (feature) {
//     return {
//       color: "black",
//       fill: true,
//       fillColor: "blue",
//       fillOpacity: 0.2,
//       opacity: 1,
//       clickable: false
//     };
//   },
//   onEachFeature: function (feature, layer) {
//     regionSearch.push({
//       name: layer.feature.properties.name,
//       source: "Regions",
//       id: L.stamp(layer),
//       bounds: layer.getBounds()
//     });
//   }
// });
// $.getJSON("data/regions.geojson", function (data) {
//   regions.addData(data);
// });


/* Empty layer placeholder to add to layer control for listening when to add/remove cheeses to markerClusters layer */
var cowLayer = L.geoJson(null);

var cows = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    var content = "<img src='../img/cheese/" + feature.properties.image + "'.jpg'class='img-responsive' style='width:50%;display:block;margin-left:auto;margin-right:auto'><h4>" + feature.properties.name + "</h4><h5>" + feature.properties.name2 + "</h5><p><i>" + feature.properties.notes + "</i></p>";
    window.alert (feature.properties.herd);
    mrk = L.marker(latlng, {
      icon: L.icon({
        iconUrl: "../img/" + feature.properties.herd + ".png",
        iconSize: [40, 60],
        iconAnchor: [20, 60],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.name,
      riseOnHover: true
    });
    var popup = L.popup(
      closeOnClick=true)

      .setContent(content)

    mrk.bindPopup(popup);
    oms.addMarker(mrk);
    return mrk;
  },
  onEachFeature: function (feature, layer) {
    
    if (feature.properties) {
      var content = "<img src='../img/cheese/" + feature.properties.image + "'.jpg' ><table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.name + "</td></tr>" + "<tr><th>Notes</th><td>" + feature.properties.notes + "</td></tr>" + "<tr><th>Producer</th><td>" + feature.properties.name2 + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.name + "' target='_blank'>" + feature.properties.name + "</a></td></tr>" + "<table>";
      layer.on({
        // click: function (e) {
        //   $("#feature-title").html(feature.properties.name);
        //   $("#feature-info").html(content);
        //   $("#featureModal").modal("show");
        //   highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        // }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/cheese.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      cowSearch.push({
        name: layer.feature.properties.name,
        address: layer.feature.properties.notes,
        source: "Cows",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/cows.geojson", function (data) {
  cows.addData(data);
  markerClusters.addLayer(cows);
  map.addLayer(cowLayer);
});

/* Empty layer placeholder to add to layer control for listening when to add/remove cheeses to markerClusters layer */
var goatLayer = L.geoJson(null);

var goats = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    var content = "<img src='../img/cheese/" + feature.properties.image + "'.jpg'class='img-responsive' style='width:50%;display:block;margin-left:auto;margin-right:auto'><h4>" + feature.properties.name + "</h4><h5>" + feature.properties.name2 + "</h5><p><i>" + feature.properties.notes + "</i></p>";
    window.alert (feature.properties.herd);
    mrk = L.marker(latlng, {
      icon: L.icon({
        iconUrl: "../img/" + feature.properties.herd + ".png",
        iconSize: [40, 60],
        iconAnchor: [20, 60],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.name,
      riseOnHover: true
    });
    var popup = L.popup(
      closeOnClick=true)

      .setContent(content)

    mrk.bindPopup(popup);
    oms.addMarker(mrk);
    return mrk;
  },
  onEachFeature: function (feature, layer) {
    
    if (feature.properties) {
      var content = "<img src='../img/cheese/" + feature.properties.image + "'.jpg' ><table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.name + "</td></tr>" + "<tr><th>Notes</th><td>" + feature.properties.notes + "</td></tr>" + "<tr><th>Producer</th><td>" + feature.properties.name2 + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.name + "' target='_blank'>" + feature.properties.name + "</a></td></tr>" + "<table>";
      layer.on({
        // click: function (e) {
        //   $("#feature-title").html(feature.properties.name);
        //   $("#feature-info").html(content);
        //   $("#featureModal").modal("show");
        //   highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        // }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/cheese.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      goatSearch.push({
        name: layer.feature.properties.name,
        address: layer.feature.properties.notes,
        source: "Goats",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/goats.geojson", function (data) {
  goats.addData(data);
  markerClusters.addLayer(goats);
  map.addLayer(goatLayer);
});

/* Empty layer placeholder to add to layer control for listening when to add/remove cheeses to markerClusters layer */
var sheepLayer = L.geoJson(null);

var sheep = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    var content = "<img src='../img/cheese/" + feature.properties.image + "'.jpg'class='img-responsive' style='width:50%;display:block;margin-left:auto;margin-right:auto'><h4>" + feature.properties.name + "</h4><h5>" + feature.properties.name2 + "</h5><p><i>" + feature.properties.notes + "</i></p>";
    window.alert (feature.properties.herd);
    mrk = L.marker(latlng, {
      icon: L.icon({
        iconUrl: "../img/" + feature.properties.herd + ".png",
        iconSize: [40, 60],
        iconAnchor: [20, 60],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.name,
      riseOnHover: true
    });
    var popup = L.popup(
      closeOnClick=true)

      .setContent(content)

    mrk.bindPopup(popup);
    oms.addMarker(mrk);
    return mrk;
  },
  onEachFeature: function (feature, layer) {
    
    if (feature.properties) {
      var content = "<img src='../img/cheese/" + feature.properties.image + "'.jpg' ><table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.name + "</td></tr>" + "<tr><th>Notes</th><td>" + feature.properties.notes + "</td></tr>" + "<tr><th>Producer</th><td>" + feature.properties.name2 + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.name + "' target='_blank'>" + feature.properties.name + "</a></td></tr>" + "<table>";
      layer.on({
        // click: function (e) {
        //   $("#feature-title").html(feature.properties.name);
        //   $("#feature-info").html(content);
        //   $("#featureModal").modal("show");
        //   highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        // }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/cheese.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      sheepSearch.push({
        name: layer.feature.properties.name,
        address: layer.feature.properties.notes,
        source: "Sheep",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("../../data/sheep.geojson", function (data) {
  sheep.addData(data);
  markerClusters.addLayer(sheep);
  map.addLayer(sheepLayer);
});

/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  iconCreateFunction: function (cluster) {
        var markers = cluster.getAllChildMarkers();
        var n = 0;
        for (var i = 0; i < markers.length; i++) {
          n += markers[i].number;
        }
        return L.divIcon({ html: n, className: 'mycluster', iconSize: L.point(40, 40) });
      },
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: true,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 24
});


// /* Empty layer placeholder to add to layer control for listening when to add/remove theaters to markerClusters layer */
// var producerLayer = L.geoJson(null);
// var producers = L.geoJson(null, {
//   pointToLayer: function (feature, latlng) {
//     var content = "<img src='assets/img/" + feature.properties.image + "'class='img-responsive' style='display:block;margin-left:auto;margin-right:auto'><table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.name + "</td></tr>" + "<tr><th>Phone</th><td>" + feature.properties.phone + "</td></tr>" + "<tr><th>Address</th><td>" + feature.properties.address + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.url + "' target='_blank'>" + feature.properties.url + "</a></td></tr>" + "<table>";

//     mrk = L.marker(latlng, {
//       icon: L.icon({
//         iconUrl: "assets/img/cheese.png",
//         iconSize: [50, 50],
//         iconAnchor: [0, 50],
//         popupAnchor: [0, -25]
//       }),
//       title: feature.properties.name,
//       riseOnHover: true
//     });
//     var popup = L.popup(
//       closeOnClick=true)
    
//       .setContent(content)

//     mrk.bindPopup(popup);
//     oms.addMarker(mrk);

//     return mrk;
    
//   },
//   onEachFeature: function (feature, layer) {
    
//     if (feature.properties) {
//       var content = "<img src='assets/img/" + feature.properties.image + "'class='img-responsive'><table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.name + "</td></tr>" + "<tr><th>Phone</th><td>" + feature.properties.phone + "</td></tr>" + "<tr><th>Address</th><td>" + feature.properties.address + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.url + "' target='_blank'>" + feature.properties.url + "</a></td></tr>" + "<table>";
//       layer.on({
//         // click: function (e) {
//         //   $("#feature-title").html(feature.properties.name);
//         //   $("#feature-info").html(content);
//         //   $("#featureModal").modal("show");
//         //   highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
//         // }
//       });
//       $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/cow.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
//       producerSearch.push({
//         name: layer.feature.properties.name,
//         address: layer.feature.properties.name,
//         source: "Producers",
//         id: L.stamp(layer),
//         lat: layer.feature.geometry.coordinates[1],
//         lng: layer.feature.geometry.coordinates[0]
//       });
//     }
//   }
// });
// $.getJSON("data/producers.geojson", function (data) {
//   producers.addData(data);
//   // map.addLayer(producers);
//   markerClusters.addLayer(producers);
//   map.addLayer(producerLayer);
// });



/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  
  if (e.layer === cowLayer) {
    map.addLayer(cows);
    syncSidebar();
  }
  if (e.layer === goatLayer) {
    map.addLayer(goats);
    syncSidebar();
  }
  if (e.layer === sheepLayer) {
    map.addLayer(sheep);
    syncSidebar();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === cowLayer) {
    map.removeLayer(cows);
    syncSidebar();
  }
  if (e.layer === goatLayer) {
    map.removeLayer(goats);
    syncSidebar();
  }
  if (e.layer === sheepLayer) {
    map.removeLayer(sheep);
    syncSidebar();
  }
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'>Developed by <a href='http://bryanmcbride.com'>bryanmcbride.com</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  metric: false,
  strings: {
    title: "My location",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Street Map": mapquestOSM,
  // "Aerial Imagery": mapquestOAM,
  "Imagery with Streets": mapquestHYB,
  "Stamen Watercolor": Stamen_Watercolor,
  "Imagery": Esri_WorldImagery
};

var groupedOverlays = {
  "Points of Interest": {
    "<img src='assets/img/cow.png' width='24' height='34'>&nbsp;Cow's Cheeses": cowLayer,
    "<img src='assets/img/goat.png' width='24' height='34'>&nbsp;Goat's Cheeses": goatLayer,
    "<img src='assets/img/sheep.png' width='24' height='34'>&nbsp;Sheep's Cheeses": sheepLayer
  // },
  // "Reference": {
  //   "Regions": regions
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  /* Fit map to boroughs bounds */
  // map.fitBounds(regions.getBounds());
  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});

  var cowsBH = new Bloodhound({
    name: "Cows",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: cowSearch,
    limit: 10
  });

  var goatsBH = new Bloodhound({
    name: "Goats",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: goatSearch,
    limit: 10
  });

  var sheepBH = new Bloodhound({
    name: "Sheep",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: sheepSearch,
    limit: 10
  });

  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name + ", " + result.adminCode1,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10
  });
  cowsBH.initialize();
  goatsBH.initialize();
  sheepBH.initialize();
  geonamesBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "Cows",
    displayKey: "name",
    source: cowsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/cow.png' width='24' height='32'>&nbsp;Cow's Cheeses</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "Goats",
    displayKey: "name",
    source: goatsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/goat.png' width='24' height='32'>&nbsp;Goat's Cheeses</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "Sheep",
    displayKey: "name",
    source: sheepBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/sheep.png' width='24' height='32'>&nbsp;Sheep's Cheeses</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    // if (datum.source === "Cows") {
    //   map.fitBounds(datum.bounds);
    // }
    if (datum.source === "Cows") {
      if (!map.hasLayer(cowLayer)) {
        map.addLayer(cowLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Goats") {
      if (!map.hasLayer(goatLayer)) {
        map.addLayer(goatLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Sheep") {
      if (!map.hasLayer(sheepLayer)) {
        map.addLayer(sheepLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}
