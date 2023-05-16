
var playerOffsets = document.getElementById('player').getBoundingClientRect();
var leftValue = playerOffsets.left;
var topValue = playerOffsets.top;
var screenHeight = window.innerHeight;
var screenThird = screenHeight / 3;
var missileContainer = document.getElementById("missile-container");

function update() {
    
    document.getElementById("player").style.left = leftValue + "px";
    document.getElementById("player").style.top = topValue + "px";

}

function moveEnemies() {
    var enemies = document.querySelectorAll(".enemy");
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        var currentTop = parseInt(enemy.style.top);
        var currentLeft = parseInt(enemy.style.left);
        var max = 10;
        var min = -10
        var movementX = Math.round(Math.random()) * (max - min) + min;
        var movementY = Math.round(Math.random()) * (max - min) + min;
        if ((currentTop + movementX) <= 0) {
            movementX = movementX * -1;
        }
        if ((currentLeft + movementY) <= 0) {
            movementY = movementY * -1;
        } 
        enemy.style.top = (currentTop + movementX) + "px";
        enemy.style.left = (currentLeft + movementY) + "px";
    }
}

function fireMissile() {
    var missile = document.createElement("div");
    missile.classList.add("missile");
    missile.style.left = leftValue + "px";
    var missileTop = topValue + 100;
    missile.style.top = missileTop + "px";
    missileContainer.appendChild(missile);
}

function moveMissiles(){
    var missiles = document.querySelectorAll(".missile");
    for (var i = 0; i < missiles.length; i++) {
        var missile = missiles[i];
        var currentTop = parseInt(missile.style.top);
        missile.style.top = (currentTop - 10) + "px";
        if (currentTop < 0) {
            missile.parentNode.removeChild(missile);
        }
    }
}

function gameLoop() {
    moveEnemies();
    moveMissiles();
}
function missileLoop(){
    fireMissile();
}

document.onkeydown = function(e){
    console.log(e);
    if(e.keyCode == 37 && leftValue > 0) { // LEFT
        leftValue = leftValue - 10;
    } else if (e.keyCode == 38 && topValue > screenThird ) { // UP
        topValue = topValue - 10;
    } else if (e.keyCode == 39 && leftValue < window.innerWidth - 90) { // RIGHT
        leftValue = leftValue + 10;
    } else if (e.keyCode == 40 && topValue < screenHeight - 90) { // DOWN
        topValue = topValue + 10;
    } else if (e.keyCode == 32) { // SPACE BAR
        fireMissile();
    }
    update();
}

setInterval(gameLoop, 100);
setInterval(missileLoop, 200);
