    
mapboxgl.accessToken = 'pk.eyJ1IjoiY29vcGVyNjEwMSIsImEiOiJjazB2Z2l2OHIwZzNxM2NxZjRiYm9kZHByIn0.rtB6dmBbrrkHwVce-mO0EA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: post.coordinates,
    zoom: 7
});

// create a HTML element for our post location/marker
var el = document.createElement('div');
el.className = 'marker';

// make a marker for our location and add to the map
new mapboxgl.Marker(el)
.setLngLat(post.coordinates)
.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
.setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
.addTo(map);

//toggle edit review form
$('.toggle-edit-form').on('click', function() {
    //toggle the edit button text on click
    $(this).text() === 'Edit' ? $(this).text('Cancel') : $(this).text('Edit');
    //toggle visibility of edit review form
    $(this).siblings('.edit-review-form').toggle();
});

// Add click listener for clearing of rating from edit and new form
$('.clear-rating').click(function() {
    $(this).siblings('.input-no-rate').click();
});