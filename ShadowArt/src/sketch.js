let canvasX = 1000;
let canvasY = 600;
let horHeight = canvasY;
let horWidth = canvasX;

let lightsrc;

let lightMoving = false;
let makingObst = false;
let obstx = -1;
let obsty = -1;
let obstr = 5;

function setup(){
    createCanvas(canvasX, canvasY);
    lightsrc = new light(100, 100, horHeight, horWidth);
    // lightsrc.addOb(new obstacle(500, 500, 600, 550, horHeight));
}


function draw(){
    
    clear();
    line(0, horHeight, canvasX, horHeight);
    if(makingObst){
        push();
        fill(0, 0, 0);
        circle(obstx, obsty, obstr*2);
        pop();
    }
    lightsrc.draw();
}

function mousePressed(){
    console.log(mouseX + " , " + mouseY);
    if(lightMoving){
        lightMoving = false;
        return;
    }
    if(lightsrc.clicked(mouseX, mouseY)){ 
        lightMoving = true;
        return; 
    }
    
    if(!makingObst){
        makingObst = true;
        obstx = mouseX;
        obsty = mouseY;
        console.log(obstx + " , " + obsty);
    }
    else{
        makingObst = false;
        if(pow(mouseX - obstx, 2) + pow(mouseY - obsty, 2) < ((obstr * obstr))){
            lightsrc.addOb(new obstacle(obstx, obsty, -1, -1, horHeight));
        }
        else{
            lightsrc.addOb(new obstacle(obstx, obsty, mouseX, mouseY, horHeight));
        }
    }


}

function mouseMoved(){
    if(lightMoving){
        lightsrc.move(mouseX, mouseY);
    }
}

