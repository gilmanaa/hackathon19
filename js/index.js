mobility = {}
var destination;
var origin;
var travelMode;

console.log("JS is here");

function openNav() {
    document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}

document.getElementById("fr").addEventListener("click", languageSelection())
mobility.lang=$(".dropdown-content p") 
for(i=0; i<mobility.lang.length; i++){
    $(mobility.lang[i]).click(function(e){
        languageSelection(e.target.id)
    })
}

mobility.mode=$(".dropdown-content i") 
for(i=0; i<mobility.mode.length; i++){
    $(mobility.mode[i]).click(function(e){
        modeSelection(e.target.id)
    })
}
function modeSelection(modeOfTransit){
    mobility.travelMode=modeOfTransit;
    console.log("hi")
    console.log("Mode of Transit: " + modeOfTransit)
    console.log("TravelMode: " + travelMode)
}
function languageSelection(appLang) {
    if (appLang == "en") {
        document.getElementById("where2go").placeholder = "Where do you want to go?"
        document.getElementById("submit").innerHTML = "Submit"
        document.getElementById("going").innerHTML = "I am going by:"
        document.getElementById("where3go").placeholder = "Where are you now?"

    }
    if (appLang == "sp") {
        document.getElementById("where2go").placeholder = "A donde quieres ir?"
        document.getElementById("submit").innerHTML = "Enviar"
        document.getElementById("going").innerHTML = "Voy en:"
        document.getElementById("where3go").placeholder = "Donde estas ahora?"
    }
    if (appLang == "fr") {
        document.getElementById("where2go").placeholder = "Où veux-tu aller?"
        document.getElementById("submit").innerHTML = "Entree"
        document.getElementById("going").innerHTML = "Moyen de transport"
        document.getElementById("where3go").placeholder = "Où es-tu?"
    }
    if (appLang == "he") {
        document.getElementById("where2go").placeholder = "לאן את/ה נוסע"
        document.getElementById("submit").innerHTML = "שלח"
        document.getElementById("going").innerHTML = "דרך הגעה"
        document.getElementById("where3go").placeholder = "איפה את/ה עכשיו"
    }
    if (appLang == "ru") {
        document.getElementById("where2go").placeholder = "Место назначения"
        document.getElementById("submit").innerHTML = "Поиск"
        document.getElementById("going").innerHTML = "Способ передвижения"
        document.getElementById("where3go").placeholder = "Ваше местоположение"
    }

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



function getGoogleRouteData(dest, orig) {
    var travelModes = ["BICYCLING", "DRIVING", "TRANSIT", "TWO_WHEELER", "WALKING"];
    var directionsService = new google.maps.DirectionsService;
    var origin = orig;
    var destination = dest;
    mobility.routeCoordinates = [];
    var counter = 0;
    mobility.origin = origin;
    mobility.destination = destination;
    mobility.travelMode = travelMode;
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
    $.ajax({
        type: "GET",
        url: "http://localhost:7000/map",
        success: function (response) {
            var newBody = response.split('<body>')[1];
            var newBody1 = newBody.split('</body>')[0];
            document.getElementsByTagName('body')[0].innerHTML = newBody1;
            initMap();
        }
    })
}

function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var tempLat = mobility.routeCoordinates[0];
    var keyLat = Object.keys(tempLat)[0];
    var tempLng = mobility.routeCoordinates[0];
    var keyLng = Object.keys(tempLng)[0];
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: tempLat[keyLat][0].lat, lng: tempLng[keyLng][0].lng },
        zoom: 8
    });
    directionsDisplay.setMap(map);
    newRoute();
}

function newRoute() {
    $.ajax({
        type: "GET",
        url: "http://localhost:7000/newRoute",
        dataType: "json",
        success: function (response) {
            var routeCoordinates = []
            var centerLat;
            var centerLng;
            var startLat;
            var startLng;
            var endLat;
            var endLng;
            for (let i = 0; i < response.length; i++) {
                var lat_lng = {}
                lat_lng['lat'] = response[i][0];
                lat_lng['lng'] = response[i][1];
                routeCoordinates.push(lat_lng)
                if (i === 0) {
                    startLat = response[i][0];
                    startLng = response[i][1];
                }
                if (i === Math.round(response.length / 2)) {
                    centerLat = response[i][0];
                    centerLng = response[i][1];
                }
                if (i === response.length - 1) {
                    endLat = response[i][0];
                    endLng = response[i][1];
                }
            }
            var map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: centerLat, lng: centerLng },
                zoom: 7
            });
            var newPath = new google.maps.Polyline({
                path: routeCoordinates,
                geodesic: true,
                strokeColor: '#008000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            var marker = new google.maps.Marker({
                position: { lat: startLat, lng: startLng },
                map: map,
                title: 'Origin',
                label: 'A',
                animation: google.maps.Animation.DROP
            });
            var marker = new google.maps.Marker({
                position: { lat: endLat, lng: endLng },
                map: map,
                title: 'Destination',
                label: 'B',
                animation: google.maps.Animation.DROP
            });
            newPath.setMap(map);
            var latlngbounds = new google.maps.LatLngBounds();
            for (var i = 0; i < routeCoordinates.length; i++) {
                latlngbounds.extend(routeCoordinates[i]);
            }
            map.fitBounds(latlngbounds);
        }
    })
}

