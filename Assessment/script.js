mapboxgl.accessToken =
  "pk.eyJ1IjoiamlucnVvIiwiYSI6ImNsY3FhbzNzZDAzemszdmxoaGpkdXFucjgifQ._ssDmVa80cf3ujKxcm1t3Q";


const map = new mapboxgl.Map({
  container: "map",
  // Replace YOUR_STYLE_URL with your style URL.
  style: "mapbox://styles/jinruo/cleg2df6q002501pvnuulx3p0"
});
map.on("mousemove", (event) => {
  const dzone = map.queryRenderedFeatures(event.point, {
    layers: ["weekdays-barcelona-airbnb"]
  });
  document.getElementById("pd").innerHTML = dzone.length
    ? `<p><strong>Price:</strong> ￡${dzone[0].properties.realSum}</p>
    <p><strong>Room type:</strong> ${dzone[0].properties.room_type}</strong> </p>
    <p><strong>Person capacity:</strong> ${dzone[0].properties.person_capacity}</strong> </p>
    <p><strong>Distance from metro:</strong> ${dzone[0].properties.metro_dist}mils </p>`
    : `<p>Hover over an Airbnb!</p>`;
});

/*
Add an event listener that runs
 when a user clicks on the map element.
*/
map.on('click', (event) => {
// If the user clicked on one of your markers, get its information.
const features = map.queryRenderedFeatures(event.point, {
 layers: ['weekdays-barcelona-airbnb'] 
});
if (!features.length) {
 return;
}
const feature = features[0];
  
 map.flyTo({
   center: feature.geometry.coordinates, //keepthis
   zoom:17
 })

const popup = new mapboxgl.Popup({ offset: [0, -15], className:"my-popup" })
.setLngLat(feature.geometry.coordinates)
.setHTML(
 
`<P>❤ Guest satisfaction: ${feature.properties.guest_satisfaction_overall}</p>`
)
.addTo(map);
});

map.on("load", () => {

  // create legend
  const legend = document.getElementById("legend");

  layer.forEach((layer, i) => {
    const color = colors[i];
    const key = document.createElement("div");
    //place holder
    if (i <= 1 || i >= 8) {
      key.style.color = "white";
    }
    key.className = "legend-key";
    key.style.backgroundColor = color;
    key.innerHTML = `${layer}`;
    
  });
  map.addSource("hover", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] }
  });

  map.addLayer({
    id: "hover",
    type: "line",
    source: "hover",
    layout: {},
    paint: {
      "line-color": "black",
      "line-width": 4
    }
  });
});

 //Slider interaction code goes below
  filterType = ['!=', ['get', 'host_is_superhost'], 'placeholder']
  filterCleanliness = ['==', ['get', 'cleanliness_rating'], "4"]
  document.getElementById('slider').addEventListener('input', (event) => {
//Get the value from the slider
  const Cleanliness_rating = parseInt(event.target.value);

  filterCleanliness = ['==', ['get', 'Cleanliness_rating']]

  //set the map filter
  map.setFilter('weekdays-barcelona-airbnb', ['all', filterCleanliness]);

  // update text in the UI
  document.getElementById('active-cleanliness_rating').innerText = Cleanlinessrating;
});
  
 //Radio button interaction code goes below
  document.getElementById('filters').addEventListener('change', (event) => {
  const type = event.target.value;
    console.log(type);
  // update the map filter
  if (type == 'all') {
    filterType = ['==', ['get', 'host_is_superhost'], 'all'];
  } else if (type == 'TRUE') {
    filterType = ['==', ['get', 'host_is_superhost'], 'TRUE'];
  } else if (type == 'FALSE') {
    filterType = ['==', ['get', 'host_is_superhost'], 'FALSE'];
  } else {
    console.log('error');
  }
  map.setFilter('weekdays-barcelona-airbnb', ['all', filterCleanliness, filterType]);
});



const geocoder = new MapboxGeocoder({
  // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: "Search for places in Barcelona", // Placeholder text for the search bar
  proximity: {
    longitude: 41.390205,
    latitude: 2.154007
  } 
});
map.addControl(geocoder, "top-left");

map.addControl(new mapboxgl.NavigationControl(), "top-left");

map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
  }),
  "top-left"
);