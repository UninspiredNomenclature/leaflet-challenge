//create basemap
let basemap = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",
  {
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  });

let map = L.map("map", {center: [45.0, -90.0], zoom: 5 });

basemap.addTo(map);


//create earthquake layer
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data){

    //style function 
    function styleMap(feature){
        return {
            fillColor: depthColor(feature.geometry.coordinates[2]),
            radius: magnitudeRadius(feature.properties.mag),
            color: "#000000",
            stroke: true,
            opacity: 1,
        
    };
    }

    function depthColor(depth){
        switch (true){
            case depth >90:
                return "#ea2c2c";
            case depth >70:
                return "#ea822c";
            case depth >50:
                return "#ee9c00";
            case depth >30:
                return "#eecc00";
            case depth >10:
                return "#d4ee00";
            default:
                return "#98ee00";
        }
    }

    function magnitudeRadius(magnitude){
        if (magnitude===0){
            return 1;

        }
        return magnitude*4;

    }
    L.geoJson(data, {
        pointToLayer: function (feature, latlng){
            return L.circleMarker(latlng);
            },
        style: styleMap,
        onEachFeature: function (feature, layer){
            layer.bindPopup(
            "Location"+feature.properties.place
            );
            }
    }).addTo(map);
})

//create legend
let legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let depths = [0, 10, 30, 50, 70, 90];
    let colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
    ];

    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' +
            colors[i] +
            '"></i> ' +
            depths[i] +
            (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
    }

    return div;
};

legend.addTo(map);



