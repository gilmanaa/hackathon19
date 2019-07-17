var destination;
var origin;

console.log("JS is here");

function openNav() {
    document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}

function getDestination() {
    destination = document.getElementById("where2go").value;
    console.log(document.getElementById("where2go"))
    console.log(destination)
}

function setDest() {
    getDestination()
    console.log("this works")
}

function getOrigin() {
    origin = document.getElementById("where3go").value;
    console.log(document.getElementById("where3go"))
    console.log(origin)
}

function setOrigin() {
    getOrigin();
    getGoogleRouteData(destination, origin);
}

function setMethod(e) {
    var method = document.getElementsByClassName("radio");
    console.log(method)
}

mobility = {}

function getGoogleRouteData(dest, orig) {
    var travelModes = ["BICYCLING", "DRIVING", "TRANSIT", "TWO_WHEELER", "WALKING"];
    var directionsService = new google.maps.DirectionsService;
    var origin = orig;
    var destination = dest;
    mobility.routeCoordinates = [];
    var counter = 0;
    for (let i = 0; i < travelModes.length; i++) {
        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: travelModes[i]
        }, function (response, status) {
            if (status === 'OK') {
                counter++;
                var lat_lngs = []
                for (let j = 0; j < response.routes[0].overview_path.length; j++) {
                    var lat = response.routes[0].overview_path[j].lat()
                    var lng = response.routes[0].overview_path[j].lng()
                    var newCoord = { 'lat': lat, 'lng': lng }
                    lat_lngs.push(newCoord);
                }
                var type = travelModes[i]
                var travel = {}
                travel[type] = lat_lngs
                mobility.routeCoordinates.push(travel)
                if (counter === 5) {
                    sendRouteData();
                }
                
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
    console.log(mobility.routeCoordinates);
}

function sendRouteData() {
    var data = JSON.stringify(mobility.routeCoordinates)
    $.ajax({
        type: "POST",
        url: "http://localhost:7000/gatherRouteData",
        data: { route: data },
        success: function () {
            console.log("sent route data to server")
        },
        error: function (response) {
            console.log("error in sending route data to server")
            console.log(response)
        }
    })
}

function initMap() {
    var travelModes = ["BICYCLING", "DRIVING", "TRANSIT", "TWO_WHEELER", "WALKING"]
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
                    var newCoord = { 'lat': lat, 'lng': lng }
                    lat_lngs.push(newCoord);
                }
                var type = travelModes[i]
                var travel = {}
                travel[type] = lat_lngs
                routeCoordinates.push(travel)
                directionsDisplay.setDirections(response);
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
        { lat: 37.772, lng: -122.214 },
        { lat: 21.291, lng: -157.821 },
        { lat: -18.142, lng: 178.431 },
        { lat: -27.467, lng: 153.027 }
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

