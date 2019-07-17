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
    getOrigin()
}

function getOrigin() {
    origin = document.getElementById("where3go").value;
    console.log(document.getElementById("where3go"))
    console.log(origin)
}

function setOrigin() {
    getOrigin()
}

function setMethod() {
    var method = document.getElementsByClassName("radio");
    for (i = 0; i < method.length; i++) {
        method[i].addEventListener(function(){
            console.log(method[i])
        })
    }
}
setMethod()



