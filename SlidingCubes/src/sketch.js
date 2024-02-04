CanvasW = window.screen.width;
CanvasH = window.screen.height;
CanvasZ = 75;
cubeSize = 30;  
numCubes = 20;
cubes = [];

let arial;
function preload() {
  arial = loadFont('assets/arial.ttf');
}

function setup(){
    createCanvas(CanvasW, CanvasH, WEBGL);

    createEasyCam();
    document.oncontextmenu = () => {return false;}

    textFont(arial);
    textSize(cubeSize / 2);

    createCubes(10, 20, 1);

    DFS(cubes[0][0][0], null, 0);
    //clean post order cause i'm too lazy to get it correct
    cubes.forEach(row => { 
        row.forEach(column => {
            column.forEach(cube => {
                if(cube == 0){return;}
                cube.postOrder = (190 - cube.postOrder);
            })
        }) 
    });

    // (node => {
    //     let max = -1;
    //     node.neighbors.forEach(n => {
    //         if(n == 0){return;}
    //         max = Math.max(max, n.postOrder);
    //     })
    //     // Math.max(...node.neighbors.map(n => n.postOrder));
    //     node.postOrder = max + 1;
    // })
}

function draw(){

    clear();
    background(205, 102, 94);

    cubes.forEach(row => { 
        row.forEach(column => {
            column.forEach(cube => {
                if(cube == 0){return;}
                cube.draw(cubeSize);
            })
        }) 
    });

}

function createCubes(x, y, z){
    for(let j = 0; j < y; j++){
        cubes[j] = []
        for(let i = 0; i < x; i++){
            cubes[j][i] = [];
            for(let k = 0; k < z; k++){
                if(j > 2 && j < 5 && i > 2 && i < 5){
                    console.log("here");
                    cubes[j][i].push(0);
                }
                else{
                    cubes[j][i].push(new Node(i*cubeSize, j*cubeSize, k*cubeSize))
                    // console.log(cubes);
                }
            }
        }
    }

    for(let j = 0; j < y; j++){
        for(let i = 0; i < x; i++){
            for(let k = 0; k < z; k++){
                if(cubes[j][i][k] == 0){
                    continue;
                }

                if(j > 0){
                    cubes[j][i][k].neighbors.push(cubes[j-1][i][k]);
                }
                if(j < y-1){
                    cubes[j][i][k].neighbors.push(cubes[j+1][i][k]);
                }
                
                if(i > 0){
                    cubes[j][i][k].neighbors.push(cubes[j][i-1][k]);
                }
                if(i < x-1){
                    cubes[j][i][k].neighbors.push(cubes[j][i+1][k]);
                }

                if(k > 0){
                    cubes[j][i][k].neighbors.push(cubes[j][i][k-1]);
                }
                if(k < z-1){
                    cubes[j][i][k].neighbors.push(cubes[j][i][k+1]);
                }
                
            }
        }
    }

}