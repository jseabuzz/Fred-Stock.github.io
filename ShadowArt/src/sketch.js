let canvasX = 1000;
let canvasY = 600;
let horHeight = canvasY;
let horWidth = canvasX;
let gridsize = 10;

let lightsrc;

let light1Moving = false;
let light2Moving = false;

let dBlueShadow = false;
let dRedShadow = false;
let dPurpleShadow = false;
let drawingShadow = false;
let shadowX = -1;
let shadows = [];
let shadowColor = [-1, -1, -1];

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
    
    if(drawingShadow){
        push()
        fill(shadowColor[0], shadowColor[1], shadowColor[2]);
        circle(shadowX, 0, 2);
        pop();
    }

    for(let i = 0; i < shadows.length; i++){
        shadows[i].draw();
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

function drawShadow(color){
    
    switch(color){
        case "blue":
            dBlueShadow = !dBlueShadow;

            //Clear previous button pressess
            dRedShadow = false;
            dPurpleShadow = false;

            if(dBlueShadow){
                shadowColor = [0, 255, 0];
            }
        break;
        case "red":
            dRedShadow = !dRedShadow;

            //Clear previous button pressess
            dBlueShadow = false;
            dPurpleShadow = false;


            if(dRedShadow){
                shadowColor = [0, 255, 255];
            }
        break;
        case "purple":
            dPurpleShadow = !dPurpleShadow;

            //Clear previous button pressess
            dBlueShadow = false;
            dRedShadow = false;

            if(dPurpleShadow){
                shadowColor = [0, 0, 0];
            }
        break;
        default:
        break;
    }

}

function mousePressed(){
    console.log(mouseX + " , " + mouseY);
    let rMouseX = Math.round(mouseX/gridsize)*gridsize;
    let rMouseY = Math.round(mouseY/gridsize)*gridsize;
    console.log(rMouseX + " , " + rMouseY);

    if(dBlueShadow || dRedShadow || dPurpleShadow){
        if(!drawingShadow){
            drawingShadow = true;
            shadowX = rMouseX;
        }
        else{
            drawingShadow = false;
        } 
        return;
    }

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

