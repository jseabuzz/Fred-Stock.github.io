const UPK = 0;
const LEFTK = 1;
const DOWNK = 2;
const RIGHTK = 3;

function setup() {
  createCanvas(cellSize*x, cellSize*y);
  // put setup code here
}

function mousePressed(){
  onGridClick(mouseX, mouseY);
}

function keyPressed(){
  if(keyCode === LEFT_ARROW){
    gridTilt(LEFTK);
  }
  else if(keyCode === RIGHT_ARROW){
    gridTilt(RIGHTK);
  }
  else if(keyCode === UP_ARROW){
    gridTilt(UPK);
  }
  else if(keyCode === DOWN_ARROW){
    gridTilt(DOWNK);
  }
  else if(keyCode === 90){ //Z key
    undoTilt();
  }
  else if(keyCode === 86){ //V key
    redoTilt();
  }
  return false;
}

function draw() {
  // put drawing code here
  drawGrid();
}

