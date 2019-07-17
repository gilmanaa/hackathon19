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
    var routeCoordinates = []
    for (let i = 0; i < travelModes.length; i++) {
        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: travelModes[i]
        }, function (response, status) {
            if (status === 'OK') {
                var lat_lngs = []
                for (let j = 0; j < response.routes[0].overview_path.length; j++) {
                    var lat = response.routes[0].overview_path[j].lat()
                    var lng = response.routes[0].overview_path[j].lng()
                    var newCoord = {'lat':lat,'lng':lng}
                    lat_lngs.push(newCoord);
                }
                var type = travelModes[i]
                var travel = {}
                travel[type] = lat_lngs
                routeCoordinates.push(travel)
                //directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
    console.log(routeCoordinates);
}

function newRoute() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 32.109, lng: 34.855 },
        zoom: 8
    });
    var routeCoordinates = [
        {lat: 37.772, lng: -122.214},
        {lat: 21.291, lng: -157.821},
        {lat: -18.142, lng: 178.431},
        {lat: -27.467, lng: 153.027}
      ];
      var newPath = new google.maps.Polyline({
        path: routeCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      newPath.setMap(map);
}

function openNav() {
    document.getElementById("myNav").style.width = "100%";
  }
  
  function closeNav() {
    document.getElementById("myNav").style.width = "0%";
  }
