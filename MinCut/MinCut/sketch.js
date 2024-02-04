let n = 20;
let p = .33;

function setup(){
    
    createCanvas(windowWidth, windowHeight);
    noLoop();
    
    
    //generate a random graph
    this.graph = [];

    this.edgeList = [];
    this.vertices = [];

    for(var i = 0; i < n; i++){
        var row = []
        this.vertices.push(new vertex(str(i)))
        for(var k = 0; k < n; k++){
            if(k == i){
                row.push(1);
            }
            else{
                row.push(0);
            }
        }
        this.graph.push(row);
    }
    
    
    for(var i = 0; i < n; i++){
        for(var j = 0; j < i; j++){
            var edgeOdds = Math.random();
            if(edgeOdds < p){
                this.edgeList.push(new edge(this.vertices[i],this.vertices[j]))
                this.graph[i][j] = 1;
                this.graph[j][i] = 1;
            }
        }  
    }
    //end generate random graph
    
    console.log("Random Graph:");
    console.log(this.graph);
    
}

function draw(){

    
    //draw graph
    
    const x = windowWidth-100;
    const y = windowHeight-100;
    
    //1. assign corrdinates
    var coords = [];
    for(let i = 0; i < n; i++){
        coords.push([(x*Math.random()-x/2) + (windowWidth/2),
                        (y*Math.random()-y/2) + windowHeight/2]);
        
        this.vertices[i].coords = coords[i];
        
    }
    
    //2. draw verts
    this.vertices.forEach((vert) => {
        circle(vert.coords[0], vert.coords[1], 10); 
    })    

    //3. draw edges
    // for(var i = 0; i < n; i++){
    //     for(var j = 0; j < i; j++){
    //         if(this.graph[i][j] == 1){
    //             line(coords[i][0],coords[i][1], coords[j][0], coords[j][1]);
    //         }
    //     }  
    // }
    this.edgeList.forEach((edge) => {
        line(edge.v1.coords[0], edge.v1.coords[1],
             edge.v2.coords[0], edge.v2.coords[1]);
    })



    let res = RandFindMinCut(this.vertices, this.edgeList);
    
    for(let i = 0; i < n*n*Math.log(n); i++){
        let temp = RandFindMinCut(this.vertices, this.edgeList);

        // print(temp["edges"].length);
        if(temp["edges"].length < res["edges"].length){
            res = temp;
        }
    }

    print(res);
    print("Min cut is: " + res["edges"].length + "!")

    //draw cut edges

    // print(res);
}

function RandFindMinCut(verts, edgeList){
    if(verts.length == 2){
        return {"verts":verts,
                "edges":edgeList};
    }

    let v1I = Math.floor(verts.length*Math.random());
    let v2I = Math.floor(verts.length*Math.random());

    while(v2I == v1I){
        v2I = Math.floor(verts.length*Math.random());
    }

    let v1 = verts[v1I];
    let v2 = verts[v2I];

    var newVert = new vertex(v1.name + "," + v2.name, v1.coords);
    newVert.subverts.push(v1.subverts);
    newVert.subverts.push(v2.subverts);



    let newEdgeList = [];
    edgeList.forEach((e) => {
        if(e.v1.name.trim() == v1.name.trim()){
            if(e.v2.name.trim() != v2.name.trim()){
                newEdgeList.push(new edge(newVert, e.v2));
            }
        }

        else if(e.v2.name.trim() == v1.name.trim()){
            if(e.v1.name.trim() != v2.name.trim()){
                newEdgeList.push(new edge(newVert, e.v1))
            }
        }

        else if(e.v1.name.trim() == v2.name.trim()){
            // if(e.v2.name.trim() != v1.name.trim()){
                newEdgeList.push(new edge(newVert, e.v2));
            // }
        }

        else if(e.v2.name.trim() == v2.name.trim()){
            // if(e.v1.name.trim() != v1.name.trim()){
                newEdgeList.push(new edge(newVert, e.v1))
            // }
        }


        else{
            newEdgeList.push(e);
        }
        
    });

    let newVertexList = [];
    verts.forEach((v) => {
        if(v != v1 && v != v2){
            newVertexList.push(v)
        }
    })
    newVertexList.push(newVert);

    return RandFindMinCut(newVertexList, newEdgeList);

}

// function RandFindMinCut(graph){
//     if(graph.length == 2){
//         return graph;
//     }

//     let v1 = Math.floor(graph.length*Math.random());
//     let v2 = Math.floor(graph.length*Math.random());
//     while(v2 == v1){
//         v2 = Math.floor(graph.length*Math.random());
//     }

//     let newGraph = [];
//     let newRow = [];
//     for(let i = 0; i < n; i++){
//         if(graph[v1][i] == 1 || graph[v2][i] == 1){
//             newRow.push(1);
//         }
//         else{
//             newRow.push(0);
//         }
//     }

//     var condensed = false;
//     for(let i = 0; i < graph.length; i++){
//         if(i == v1 || i == v2){
//             if(!condensed){
//                 condensed = true;
//                 newGraph.push(newRow);
//             }
//         }
//         else{
//             newGraph.push(graph[i]);
//         }
//     }

// }