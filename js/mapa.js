
var map = L.map('map').setView([42, -1], 3);

	// http://www.coffeegnome.net/creating-contr…button-leaflet
	var customControl =  L.Control.extend({

		options: {
			position: 'topleft'
		},

		onAdd: function (map) {
			var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

			container.style.backgroundColor = 'white';     
			container.style.backgroundImage = "url(images/icon.png)";
			container.style.backgroundSize = "30px 30px";
			container.style.width = '30px';
			container.style.height = '30px';

			container.onclick = function(){
				console.log('buttonClicked');
				modal.style.display = "block";
			}

			return container;
		}
	});


//TODO: hacer dinámicos los intervalos
// Colores
getGradientColor = function(start_color, end_color, percent) {
   // strip the leading # if it's there
   start_color = start_color.replace(/^\s*#|\s*$/g, '');
   end_color = end_color.replace(/^\s*#|\s*$/g, '');

   // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
   if(start_color.length == 3){
   	start_color = start_color.replace(/(.)/g, '$1$1');
   }

   if(end_color.length == 3){
   	end_color = end_color.replace(/(.)/g, '$1$1');
   }

   // get colors
   var start_red = parseInt(start_color.substr(0, 2), 16),
   start_green = parseInt(start_color.substr(2, 2), 16),
   start_blue = parseInt(start_color.substr(4, 2), 16);

   var end_red = parseInt(end_color.substr(0, 2), 16),
   end_green = parseInt(end_color.substr(2, 2), 16),
   end_blue = parseInt(end_color.substr(4, 2), 16);

   // calculate new color
   var diff_red = end_red - start_red;
   var diff_green = end_green - start_green;
   var diff_blue = end_blue - start_blue;

   diff_red = ( (diff_red * percent) + start_red ).toString(16).split('.')[0];
   diff_green = ( (diff_green * percent) + start_green ).toString(16).split('.')[0];
   diff_blue = ( (diff_blue * percent) + start_blue ).toString(16).split('.')[0];

   // ensure 2 digits by color
   if( diff_red.length == 1 )
   	diff_red = '0' + diff_red

   if( diff_green.length == 1 )
   	diff_green = '0' + diff_green

   if( diff_blue.length == 1 )
   	diff_blue = '0' + diff_blue

   return '#' + diff_red + diff_green + diff_blue;
};

//
function colorInt(){
	var color1 = document.getElementById("fill1").value;;
	var color2 = document.getElementById("fill2").value;;
	var middle =  getGradientColor(color1,color2,0.5);
	var colores = [color1, middle, color2];
	return colores
}


// 	tres intervalos para población
function getColor(d) {
	return d > 1000000 ? colorInt()[0] :
		   d > 10000   ? colorInt()[1] :
			             colorInt()[2];
}
//	tres intervalos para radio	
function getRadius(d) {
	var rmax = document.getElementById("size").value;
	return d > 1000000 ? rmax :
	       d > 10000   ? rmax/2 :
	                     2;
}
// Estilo inicial		
function style(feature) {
	return {
		fillColor: 'blue',
		radius: 2.5,
		weight: 1,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7
	};
}
//
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}).addTo(map);

var cartodbq = new L.geoJson('',{
	pointToLayer : function(feature, latlog){
		return L.circleMarker(latlog,style(feature))},
		onEachFeature: function (feature, layer) {
			layer.bindPopup(feature.properties.name);
		}	
	});
		cartodbq.addTo(map);

		$.ajax({
			dataType: "json",
			url: "data/cartodb-query.geojson",
			success: function(data) {
				$(data.features).each(function(key, data) {
					cartodbq.addData(data);
				});
			}
		}).error(function() {});

function changeStyle(data){

		// recojo datos
		//var size = document.getElementById("size").value;
		//var fill = document.getElementById("fill").value;	
		var fillo = document.getElementById("fillo").value;
		var color = document.getElementById("color").value;
		var oo = document.getElementById("oo").value;

		//LEGEND EXITS
		leyenda = document.getElementsByClassName('info legend leaflet-control');
		if (leyenda != undefined){
			removeElements(leyenda);
		}
		
		cartodbq.eachLayer(function (layer) {
			
			layer.setStyle({radius : getRadius(layer.feature.properties.pop_max),
							fillColor : getColor(layer.feature.properties.pop_max),
							fillOpacity : fillo,
							color : color,
							opacity: oo});
		});

		var legend = L.control({position: 'bottomright'});

		legend.onAdd = function (map) {

			var div = L.DomUtil.create('div', 'info legend'),
			grades = interv(),
			labels = [];

			// loop through our density intervals and generate a label with a colored square for each interval
			for (var i = 0; i < grades.length; i++) {
				div.innerHTML +=
				'<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
				grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
			}

			return div;
		};

		legend.addTo(map)		
}	

	
	function interv(){
		var maximo = maximoCampo("pop_max");
		var intervalos = [0, 10000, 10000000];
		
		return intervalos;
	}

function maximoCampo(campo){
	var elementos = cartodbq.getLayers();
	var max = -10000000;
    for (var i=0 ; i<elementos.length ; i++) {
        max = Math.max(parseInt(elementos[i]["feature"]["properties"][campo]), max);
    }
    return max;
}

	map.addControl(new customControl());