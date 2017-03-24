	// Get the modal
    var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementsByClassName("leaflet-bar leaflet-control leaflet-control-custom");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

	// Get the button 
    var btnAct = document.getElementById("btnAct");
	// When the user clicks
	btnAct.onclick = function() {
		changeStyle(cartodbq);
	}	


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function removeElements(elements){
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}


