mobility = {}

function initMap() {
    var travelModes = ["BICYCLING","DRIVING","TRANSIT","TWO_WHEELER","WALKING"]
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 32.109, lng: 34.855 },
        zoom: 8
    });
    directionsDisplay.setMap(map);
    var origin = 'oak park, il';
    var destination = 'chicago, il';
    for (let i = 0; i < travelModes.length; i++) {
        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: travelModes[i]
        }, function (response, status) {
            if (status === 'OK'&& i === 0) {
                directionsDisplay.setDirections(response);
                console.log(response);
                console.log(response.routes[0].legs[0].steps[0].lat_lngs[0].lat());
                console.log(response.routes[0].legs[0].steps[0].lat_lngs[0].lng());
            } else if (status === 'OK') {
                console.log(response.routes[0].legs[0].steps);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
}

function openNav() {
    document.getElementById("myNav").style.width = "100%";
  }
  
  function closeNav() {
    document.getElementById("myNav").style.width = "0%";
  }
