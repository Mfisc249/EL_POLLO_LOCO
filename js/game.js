let canvas;
let ctx;
let character = new Character();





function init() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    console.log("My Character is", character);


}

   