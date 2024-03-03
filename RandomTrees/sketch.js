let n = Math.pow(2,7) - 1;
let remaining = n;

let activeIndex  = 0;
let activeIndex2 = 0;

let paused = false;

let step = 0;
let steps = [];
let stepText = "Step ";

let activeVert = null;

let vertices = [];
let tests = 10;

function setup(){
    
    createCanvas(windowWidth, windowHeight);
    // for(let i = 0; i < tests; i++){
        
    // }
    initTest();
    // runTest();

    // new Chart("myChart", {
    //     type: "scatter",
    //     data: {
    //       datasets: [{
    //         pointRadius: 100,
    //         pointBackgroundColor: "rgba(0,0,255,1)",
    //         data: xyValues
    //       }]
    //     },
    //   });
    
}

function avg(arr){
    return arr.reduce((a,b) => a + b)/arr.length;
}

let visualInt = null;
function runVisual(){
    initTest();
    visualInt = setInterval(visualMove,100);
}

function visualMove(){
    if(remaining < 2){
        clearInterval(visualInt);
    }
    else{
        moveVertex();
    }
}

function initTest(){

    graph = [];

    edgeList = [];
    vertices = [];

    remaining = n;

    vertices.push(new vertex("0", [], [], null, true, true));

    for(var i = 1; i < n; i++){
        var row = []
        vertices.push(new vertex(str(i), [],
                                 [], vertices[Math.floor((i-1)/2)]));
        vertices[Math.floor((i-1)/2)].children.push(vertices[i]);

    }
    // vertices[activeIndex].active = true;
    // vertices[activeIndex2].active = true;
    activeVert = vertices[0];
    

}

function presentResults(){
    console.log(steps);
    console.log("Mean", avg(steps));  
    
    let xValues = [];
    for(let i = 0; i < steps.length; i++){
        xValues.push( steps[i] );
    }

    xValues = xValues.sort();
    // const newValues = xValues.toSorted();
    console.log(steps);
    // console.log(newValues);

    let freq = getFreq(xValues);

    let x = [];
    let y = [];
    for(let key in freq){
        x.push(key);
        y.push(freq[key]);
    }
    console.log(xValues);
    console.log(freq);

    console.log("x",x);
    console.log("y",y);

    new Chart("myChart", {
        type: "bar",
        data: {
          labels: x,
          datasets: [{
            backgroundColor:"rgba(0,0,255,1.0)",
            borderColor: "rgba(0,0,255,0.1)",
            data: y
          }]
        },
        options:{
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                    }
                }]
            }
        }
      });
    
}

//taken from geeks4geeks post
function getFreq(arr){
    const counts = {};
    for(let i = 0; i < arr.length; i++){
        let ele = arr[i];
        if(counts[ele]){
            counts[ele] += 1;
        }
        else{
            counts[ele] = 1;
        }
    }
    return counts;
}

function runTest(){

    while(tests > 0){

        if(remaining < 2){
            steps.push(step);
            step = 0;
            initTest();
            tests--;    
        }
        moveVertex();
        
    }
    presentResults();

}

function draw(){

    //draw graph

    clear();
    
    const x = windowWidth-100;
    const y = windowHeight-100;
    
    //1. assign corrdinates
    var coords = [];
    let layer_count = 0;
    for(let i = 0; i < n; i++){
        let layer = Math.floor(Math.log2(i+1));
        let sizeL = Math.pow(2, layer);
        
        let dist = 700/sizeL;
        if(layer == 0){
            dist = 0;
        }
        let pos = (i) - (sizeL - 1);
        coords.push([(windowWidth/2 - 700 + (dist * pos)),
             100 + 50*layer])
        // coords.push([(x*Math.random()-x/2) + (windowWidth/2),
        //                 (y*Math.random()-y/2) + windowHeight/2]);
        
        vertices[i].coords = coords[i];
        layer_count++;
        if(layer_count >= sizeL){ layer_count = 0; }
    }

    //2. draw verts
    vertices.forEach((vert) => {
        if(vert.active){

            fill(255,0,0);
            circle(vert.coords[0], vert.coords[1], 10); 
            fill(255,255,255);
            // second = 1;
        }
        else if(vert.visited){
            fill(0,255,0);
            circle(vert.coords[0], vert.coords[1], 10); 
            fill(255,255,255);
        }
        else{
            circle(vert.coords[0], vert.coords[1], 10); 
        }
    })    

    //3. draw edges

    for(let i = 0; i < n; i++){
        if(vertices[i].pEdge){
            if(vertices[i].parent != null){

                let v1 = vertices[i];
                let v2 = vertices[i].parent;

                line(v1.coords[0], v1.coords[1],
                     v2.coords[0], v2.coords[1]);
            }
        }
    }

    // for(var i = 0; i < n; i++){
    //     for(var j = i+1; j < n; j++){
    //         // console.log(graph[i]);
    //         if(graph[i][j] == 1){
    //             line(coords[i][0],coords[i][1], coords[j][0], coords[j][1]);
    //         }
    //     }  
    // }


}

function stop(){
    paused = !paused;
}

function setIterations(iter){
    tests = iter;
}

function moveVertex(){

    vertices.forEach(vert => vert.updateEdge());

    activeIndex = vertices.indexOf(moveActive(activeIndex));
    // activeIndex2 = moveActive(activeIndex2);
}

function moveActive(index){

    vertices[index].visited = true;
    vertices[index].active = false;

    let curChildren = vertices[index].unvisitedChildren();
    let newActive = null;


    if(curChildren.length > 0){
        for(let i = 0; i < curChildren.length; i++){
            if(curChildren[i].pEdge){
                curChildren[i].active = false;
                newActive = curChildren[i];
                break;
            }
        }
    }
    else if(vertices[index].pEdge){
        newActive = vertices[index].parent;
        newActive.active = true;
    }
    if(newActive == null){
        newActive = vertices[index];
        newActive.active = true;
    }
    else if(newActive.visited){
        remaining--;
    }
    
    
    step++;
    let iterText = document.getElementById("step");
    iterText.innerText = stepText + str(step);

    return newActive;
}

function changeNodes(){
    n = document.getElementById("changeNodes").value    ;
    initTest();
}

function moveActiveRandom(index){
    if(paused){return;}
    if(step > 300){return;}
    let dir = Math.floor(2*Math.random());
    if(dir < 1){
        dir = 0
    }
    else{
        dir = 1;
    }

    vertices[index].active = false;
    
    if(dir == 0 && (index+1)* 2 - 1 < n){
        let leftRight = Math.floor(2*Math.random());
        index = (index+1)*2 - leftRight; 
        // if(vertices[index].visited){
        //     if(!vertices[index-1].visited){
        //         index -= 1;
        //     }
        // }
    }
    else{
        index = Math.max(0, Math.floor((index-1)/2)); 
    }
    vertices[index].active = true;

    step++;
    let iterText = document.getElementById("step");
    iterText.innerText = stepText + str(step);
    return index;
}

