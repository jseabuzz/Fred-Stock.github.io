let canvasX = 1000;
let canvasY = 600;
let horHeight = canvasY;
let horWidth = canvasX;
let gridsize = 10;

let lightsrc;

let light1Moving = false;
let light2Moving = false;

let makingObst = false;
let obstx = -1;
let obsty = -1;
let obstr = 5;

function setup(){
    createCanvas(canvasX, canvasY);
    lightsrc1 = new light(100, 100, horHeight, horWidth, 0, 0, 255);
    lightsrc2 = new light(700, 100, horHeight, horWidth, 255, 0, 0);

    // lightsrc.addOb(new obstacle(500, 500, 600, 550, horHeight));
}


function draw(){
    
    clear();
    if(makingObst){
        push();
        fill(0, 0, 0);
        circle(obstx, obsty, obstr*2);
        pop();
    }
    
    push();
    stroke(211, 211, 211);
    // console.log(this.canvasX/this.gridsize);
    for(let i = 0; i < canvasX/gridsize; i++){
        line(0, i*gridsize, canvasX, i*gridsize);
        line(i*gridsize, 0, i*gridsize, canvasY);
    }
    pop();
    line(0, horHeight, canvasX, horHeight);

    lightsrc1.draw();
    lightsrc2.draw();

}

function mousePressed(){
    console.log(mouseX + " , " + mouseY);
    let rMouseX = Math.round(mouseX/gridsize)*gridsize;
    let rMouseY = Math.round(mouseY/gridsize)*gridsize;
    console.log(rMouseX + " , " + rMouseY);

    if(light1Moving){
        light1Moving = false;
        return;
    }
    if(lightsrc1.clicked(mouseX, mouseY)){ 
        light1Moving = true;
        return; 
    }

    if(light2Moving){
        light2Moving = false;
        return;
    }
    if(lightsrc2.clicked(mouseX, mouseY)){ 
        light2Moving = true;
        return; 
    }
    
    if(!makingObst){
        makingObst = true;
        obstx = rMouseX;
        obsty = rMouseY;
        console.log(obstx + " , " + obsty);
    }
    else{
        makingObst = false;
        if(pow(rMouseX - obstx, 2) + pow(rMouseY - obsty, 2) < ((obstr * obstr))){
            lightsrc1.addOb(new obstacle(obstx, obsty, -1, -1, horHeight));
            lightsrc2.addOb(new obstacle(obstx, obsty, -1, -1, horHeight));

        }
        else{
            lightsrc1.addOb(new obstacle(obstx, obsty, mouseX, rMouseY, horHeight));
            lightsrc2.addOb(new obstacle(obstx, obsty, mouseX, rMouseY, horHeight));

        }
    }


}

function mouseMoved(){

    let rMouseX = Math.round(mouseX/gridsize)*gridsize;
    let rMouseY = Math.round(mouseY/gridsize)*gridsize;
    if(light1Moving){
        lightsrc1.move(rMouseX, rMouseY);
    }
    if(light2Moving){
        lightsrc2.move(rMouseX, rMouseY);
    }
}

