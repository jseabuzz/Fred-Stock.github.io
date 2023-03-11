var x = 50;
var y = 40;
var cellSize = 23;

var xLeft = x+1;
var xRight = -1;
var xTop = y+1;
var xBot = -1;

var blocks = [];
var gridPos = [];

var prevBlocks = [];

for (i = 0; i < this.y; i++){
    gridPos[i] = [];
    for(j = 0; j < this.x; j++){
        gridPos[i][j] = new Cell(j, i, this.cellSize);
    }
}

for (i = 1; i < this.y-1; i++){
    for(j = 1; j < this.x-1; j++){
        this.gridPos[i][j].setNeighbors(
                        this.gridPos[i][j-1], this.gridPos[i][j+1],
                        this.gridPos[i-1][j], this.gridPos[i+1][j]);
    }
}

function gridTilt(input){

    for(i = 0; i < blocks.length; i++){

        if(input === UPK && blocks[i].y === xBot-1){
            blocks[i].transfer(input)
        }
        else if(input === LEFTK && blocks[i].x === xRight-1){
            blocks[i].transfer(input)
        }
        else if(input === DOWNK && blocks[i].y === xTop){
            blocks[i].transfer(input)
        }
        else if(input === RIGHTK && blocks[i].x === xLeft){
            blocks[i].transfer(input)
        }
    }
    blocks = [];
    for (i = xTop-1; i < xBot+1; i++){
        for(j = xLeft-1; j < xRight+1; j++){
            if(gridPos[i][j].active){
                blocks.push(gridPos[i][j]);
            }
        }
    }
    findBBox();
    this.futureBlocks = [];
}

function drawGrid(){
    stroke(0);
    for(i = 0; i < this.y; i++){
        for(j = 0; j < this.x; j++){
            gridPos[i][j].draw();
        }
    }
    stroke(255, 0, 0);
    strokeWeight(2);

    //bounding box
    line(xLeft*this.cellSize, xTop*this.cellSize,
         xRight*this.cellSize, xTop*this.cellSize);
    line(xRight*this.cellSize, xTop*this.cellSize,
         xRight*this.cellSize, xBot*this.cellSize);
    line(xRight*this.cellSize, xBot*this.cellSize,
         xLeft*this.cellSize, xBot*this.cellSize);
    line(xLeft*this.cellSize, xBot*this.cellSize,
         xLeft*this.cellSize, xTop*this.cellSize);

    strokeWeight(1);
}

function onGridClick(mouseX, mouseY){
    gridX = Math.floor(mouseX/this.cellSize);
    gridY = Math.floor(mouseY/this.cellSize);
    if(gridX >= this.x || gridY >= this.y ||
        gridX < 0 || gridY < 0){
        return;
    }

    // console.log("---------Click Position-----------")
    // console.log(gridX);
    // console.log(gridY);
    if(blocks == null){blocks = [];}
    
    switch(gridPos[gridY][gridX].clicked()){
        case 0: 
            blocks.splice(blocks.indexOf(gridPos[gridY][gridX]), 1);
            break;
        
        case 1: 
            blocks.push(gridPos[gridY][gridX]);
            break;
    }


    // console.log("-------Blocks Count--------");
    // console.log(blocks.length);

    findBBox();
    this.futureBlocks = [];
}

//this is gross, revist better if too slow for large configurations
function findBBox(){

    xLeft = x+1;
    xRight = -1;
    xTop = y+1;
    xBot = -1;

    tempArr = [];

    for(i = 0; i < this.blocks.length; i++){
        this.xRight = Math.max(this.xRight, (this.blocks[i].x+1));
        this.xLeft = Math.min(this.xLeft, this.blocks[i].x);
        this.xBot = Math.max(this.xBot, (this.blocks[i].y+1));
        this.xTop = Math.min(this.xTop, this.blocks[i].y);

        tempArr.push(blocks[i]);
    }
    
    this.prevBlocks.push(tempArr);

    // console.log("-----------Bounding Box-----------")
    // console.log(xRight);
    // console.log(xLeft);
    // console.log(xBot);
    // console.log(xTop);
}

function clearGrid(){
    for(i = 0; i < blocks.length; i++){
        gridPos[blocks[i].y][blocks[i].x].active = false;
    }

}

function undoTilt(){
    if(blocks == null){return;}

    clearGrid();

    if(this.prevBlocks == null){
        this.prevBlocks = [];
    }
    if(this.futureBlocks == null){
        this.futureBlocks = [];
    }

    this.futureBlocks.push(this.prevBlocks.pop());
    this.blocks = [];
    this.blocks = this.prevBlocks.pop();

    if(blocks == null){return;}

    for(i = 0; i < blocks.length; i++){
        gridPos[blocks[i].y][blocks[i].x].active = true;
    }

    findBBox();

}

function redoTilt(){
    if(blocks == null){return;}
    if(this.futureBlocks == null || this.futureBlocks.length == 0){return;}
    
    clearGrid();

    this.blocks = [];
    this.blocks = this.futureBlocks.pop();

    if(blocks == null){return;}
    for(i = 0; i < blocks.length; i++){
        gridPos[blocks[i].y][blocks[i].x].active = true;
    }

    findBBox();

}

function saveAsPNG(){
    saveCanvas("PushingBlocks", 'png');
}


function saveAsTxt(){
    var output = "";
    for(i = 0; i < blocks.length; i++){
        output += blocks[i].x + "," + blocks[i].y + ",";
    }

    dwnldAsTxt("blocks.txt", output);

}

function saveStackAsTxt(){

    output = "";
    for(i = 0; i < this.prevBlocks.length; i++){
        output +=("Step: " + i);
        output +=("\n");
        
        for(j = 0; j < (tempBs = this.prevBlocks[i]).length; j++){
            output += tempBs[j].x + "," + tempBs[j].y + ",";
        }
        output +=("\n\n");
        

    }
    dwnldAsTxt("block-steps.txt", output);
}

//https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server

function dwnldAsTxt(filename, text){
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

function loadFromTxt(){
    inputString = document.getElementById("blockInput").value;
    coords = inputString.split(",");
    console.log(coords);
    for(i = 0; i < coords.length-1; i+=2){
        x1 = parseInt(coords[i]);
        y1 = parseInt(coords[i+1]);
        
        if((tempBlock = gridPos[y1][x1]).active === false){
            tempBlock.active = true;
            tempBlock.color = 1;
            this.blocks.push(tempBlock);
        }
    }
    findBBox();

    return false;
}


