var x = 100;
var y = 50;
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

    half = this.cellSize/2;
    //bounding box
    line(xLeft*this.cellSize+half, xTop*this.cellSize+half,
         xRight*this.cellSize-half, xTop*this.cellSize+half);
    line(xRight*this.cellSize-half, xTop*this.cellSize+half,
         xRight*this.cellSize-half, xBot*this.cellSize-half);
    line(xRight*this.cellSize-half, xBot*this.cellSize-half,
         xLeft*this.cellSize+half, xBot*this.cellSize-half);
    line(xLeft*this.cellSize+half, xBot*this.cellSize-half,
         xLeft*this.cellSize+half, xTop*this.cellSize+half);

    strokeWeight(1);
}

function onGridClick(mouseX, mouseY){
    gridX = Math.floor(mouseX/this.cellSize);
    gridY = Math.floor(mouseY/this.cellSize);
    if(gridX >= this.x || gridY >= this.y){
        return;
    }

    // console.log("---------Click Position-----------")
    // console.log(gridX);
    // console.log(gridY);
    if(blocks == null){blocks = [];}
    
    if(gridPos[gridY][gridX].clicked()){
        blocks.push(gridPos[gridY][gridX]);
    }
    else{
        blocks.splice(blocks.indexOf(gridPos[gridY][gridX]), 1);
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

function saveGrid(){
    saveCanvas("PushingBlocks", 'png');
}

