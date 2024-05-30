var main = function() {
    var header = document.getElementById("head");
    var button = document.querySelector("button");
    
    if (button.innerHTML === "Change") {
        header.innerHTML = "Sankalpa";
        button.innerHTML = "Revert";
    } else {
        header.innerHTML = "Hello World.";
        button.innerHTML = "Change";
    }
}
