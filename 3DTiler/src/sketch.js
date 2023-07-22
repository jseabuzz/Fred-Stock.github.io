// import "convexHull.js"

canvasW = window.screen.width*.99;
canvasH = window.screen.height*.8;
canvasZ = 75;
twoDtileSize = canvasW/(2*30);
layer = 0;
highlight = false;

function saveConfig(){
    var output = "";
    for(i = 0; i < blocks.length; i++){
        output += blocks[i].x + "," + blocks[i].y + ",";
    }

    dwnldAsTxt("3Dtiles.txt", output);

}

function dwnldAsTxt(filename, text){
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

function ChangeLabel(newString){
    document.getElementById("curLayer").textContent = newString;
}

function upLayer(){
    layer++;
    ChangeLabel("Current Layer = " + layer);
}

function downLayer(){
    layer--;
    ChangeLabel("Current Layer = " + layer);
}

function highlightLayer(){
    highlight = !highlight;
}

var sketch1 = function(sketch){
    
    sketch.setup = function(){
        canv1 = sketch.createCanvas(canvasW/2, canvasH);
        canv1.position(0,30);
        screen = new twoDScreen(canvasW/2, canvasH, twoDtileSize);
        prevLayer = layer;
    }
    
    sketch.draw = function(){
        if(layer > prevLayer){
            screen.upLayer();
        }
        if(layer < prevLayer){
            screen.downLayer();
        }
        sketch.background(0, 255, 0);
        screen.draw(sketch);
        prevLayer = layer;
        // sketch.rect(10, 10, 1000, 1000); 
    }
    
    sketch.mousePressed = function(){
        console.log(sketch.mouseY);
        if(sketch.mouseX < canvasW/2 && sketch.mouseY < canvasH && sketch.mouseY > 0){
            console.log(sketch.mouseX);
            x = math.floor(sketch.mouseX/twoDtileSize);
            y = math.floor(sketch.mouseY/twoDtileSize);
            console.log(x + ", " + y);

            if(!screen.removeCube(x,y,screen.layer)){
                screen.addCube(new Cube(x,y,screen.layer));
            }
        }
    }
}

new p5(sketch1);

var sketch2 = function(sketch){
    sketch.setup = function() {
        canv2 = sketch.createCanvas(canvasW/2, canvasH, sketch.WEBGL);
        canv2.position(canvasW/2, 30);
        threeScreen = new threeDScreen(canvasW/2, canvasH, twoDtileSize/5);
        
        // threeScreen = new threeDScreen(canvasW/2, canvasH, twoDtileSize);
    }
    
    sketch.draw = function(){
        sketch.background(205, 102, 94);
        sketch.orbitControl();  
        threeScreen.draw(sketch, highlight, layer);
    }
    
    sketch.mousePressed = function(){
        let mX = sketch.mouseX+(canvasW/2);
        if(mX < canvasW/2 && sketch.mouseY < canvasH && sketch.mouseY > 0){
            x = math.floor(mX/twoDtileSize);
            y = math.floor(sketch.mouseY/twoDtileSize);
            console.log(x + ", " + y);

            if(!threeScreen.removeCube(x,y,layer)){
                threeScreen.addCube(new Cube(x,y,layer));
            }
        }
    }
}

new p5(sketch2);

// var upButton = document.getElementById("zUp");
// var downButton = document.getElementById("zDown");
//functions for each state
// function start(){
//     //#region start

//     //#endregion
// }


// function draw(){
//     background(205, 102, 94);
//     // console.log("rotSpeed = " + );
//     // rotateY( (millis() / 1000)*rotSpeed.value());
//     orbitControl();
//     stroke(211, 211, 211);
//     fill(150, 150, 150);

// }
