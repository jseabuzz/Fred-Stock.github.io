// import "convexHull.js"

canvasW = 800;
canvasH = 600;
canvasZ = 75;

let rotSpeed = 1; //rotation of render in deg/sec
let pntIndex = 0;

let points = [];
let horizon = [];

const State = {
    Start       : "start",
    Tetra       : "tetra",
    HighPoint   : "HighPoint",
    HighFaces   : "highFaces",
    HighHorizon : "highHor",
    NewFaces    : "newFaces"
}

currState = State.Start;

function ChangeLabel(newString){
    document.getElementById("stage").textContent = newString;
}


function nextState(){
    switch(currState){
        case State.Start: 
            console.log("tetra");
            currState = State.Tetra;
            ChangeLabel("Tetrahedron");
            mCreateTetra();
            // aCreateTetra(points);
            break;
        
        case State.Tetra:
            console.log("Next Point");
            ChangeLabel("Next Point")
            points[pntIndex].setColor(255, 255, 0);
            points[pntIndex].radius = 10;
            currState = State.HighPoint;
            break;
    
        case State.HighPoint:
            console.log("Visible faces")
            ChangeLabel("Visible Faces")
            currState = State.HighFaces;
            for(let [fName, face] of points[pntIndex].conflicts){
                face.setColor(150, 0, 150);
                face.setStroke(0, 255, 0);
            }
            break;

            //highlight horizon edges
        case State.HighFaces:
            console.log("Find Horizon");
            ChangeLabel("Find Horizon")
            highlightHorizon();
            currState = State.HighHorizon;
            break;

        case State.HighHorizon:
            console.log("Add New Faces");
            ChangeLabel("Add New Faces");
            points[pntIndex].setColor(255,255,255);
            points[pntIndex].radius = 3;
            testDC.addPoint(points[pntIndex]);
            pntIndex++;
            for(let [,face] of testDC.faces){
                face.setColor(150, 150, 150);
                face.setStroke(255, 255, 255);
            }
            for(i = 0; i < horizon.length; i++){
                horizon[i].setColor(255, 255, 255);
                horizon[i].twin.setColor(255, 255, 255);
            }
            horizon  = [];
            currState = State.NewFaces;
            break;

        case State.NewFaces:
            if(pntIndex == points.length){
                ChangeLabel("Finished!");
                currState = State.NewFaces;
            }
            else{
                ChangeLabel("Next Point");
                points[pntIndex].setColor(255, 255, 0);
                points[pntIndex].radius = 10;
                currState = State.HighPoint;
            }
            break;
    }

}

function keyPressed(){
    if(keyCode === RIGHT_ARROW){
        nextState();
    }
}
//want to animate this a bit
//maybe bind a key to a next() function
//next would first draw the point, and maybe rotate the drawing to show it
//then it would highlight the conflict edges
//then it would add to ch
//loop


function setup(){
//#region setup code
    createCanvas(canvasW, canvasH, WEBGL);
    // field = new Field(canvasW, canvasH);

    start();
    
    // genPoints(10);
//#endregion
}


//functions for each state
function start(){
    //#region start
    p1 = new Point(-216.5, 0, 0, "TEST1");
    p2 = new Point(216.5, -250, 0, "TEST2");
    p3 = new Point(216.5, 250, 0, "TEST3");
    p4 = new Point(0, 0, 50, "TEST4");
    
    pV = new Point(100, 100, 50, "VisTEST");
    pT = new Point(0, 0, -40, "secondTest");
    pT2 = new Point(10, 0, 10, "thirdTest");
    pT3 = new Point(500, 300, 0, "fourthTest");//This point doesn't work correctly if pre pT
                                               //Not handling coplanar faces correctly
                                               //Specifically the conflict lists

    testPnts = [p1, p2, p3, p4];
    points   = [pT3, pV, pT, pT2];
    
    // points = [pT3, p4, pV, p1, p2, p3, pT]
    //#endregion
}

function mCreateTetra(){
    // #region Manual Tetra Creation
    // console.log("neat");
    formTetra([p1, p2, p3, p4]);
    //#endregion
}

function aCreateTetra(P){
    //#region Automated Tetra Creation

    tetra = [P[0], P[1]];
    lineFound = false;
    vec10 = null;
    vec20 = null;
    vecCross = null;
    tetraFound = false;
    for(i = 2; i < P.length && !tetraFound; i++){
        //find first point which does not lie on the line P1->P2
        if(!lineFound){
            if(!ptOnLine(P[0], P[1], P[i])){
                lineFound = true;
                tetra.push(P[i]);
                vec10 = createVector(P[1].x - P[0].x, 
                            P[1].y - P[0].y, P[1].z - P[0].z);
                vec20 = createVector(P[i].x - P[0].x, 
                            P[i].y - P[0].y, P[i].z - P[0].z);
                vecCross = vec10.cross(vec20);
            }
        }
        //find the first point not on the plane p1, p2, pi
        else{
            if(vecCross.x*(P[i].x - P[0].x) + 
                vecCross.y*(P[i].y - P[0].y) + 
                vecCross.z*(P[i].z - P[0].z) != 0){
                    tetra.push(P[i]);
                    tetraFound = true;
                }
        }       
    }
     
    if(!tetraFound){
        console.log("All points lie on the same plane! This is not a 3D shape!");
        return [];
    }

    P = P.slice(2);
    P.splice(P.indexOf(tetra[2]), 1);
    P.splice(P.indexOf(tetra[3]), 1);


    //random permutation of P, taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    for (var i = P.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = P[i];     
        P[i] = P[j];
        P[j] = temp;
    }
    points = P;
    formTetra(tetra);
    //#endregion
}

function formTetra(tPnts){
    //#region takes four intial points and starts the convex hull algo with a tetrahedron
    e1          = new Edge(tPnts[0], tPnts[1]);
    e1Twin      = new Edge(tPnts[1], tPnts[0], e1); 
    e1.twin     = e1Twin;

    e2          = new Edge(tPnts[1], tPnts[2]);
    e2Twin      = new Edge(tPnts[2], tPnts[1], e2);
    e2.twin     = e2Twin;

    e3          = new Edge(tPnts[2], tPnts[0]);
    e3Twin      = new Edge(tPnts[0], tPnts[2], e3);
    e3.twin     = e3Twin;

    e4          = new Edge(tPnts[3], tPnts[0]); 
    e4Twin      = new Edge(tPnts[0], tPnts[3], e4)
    e4.twin     = e4Twin;

    e5          = new Edge(tPnts[3], tPnts[1]); 
    e5Twin      = new Edge(tPnts[1], tPnts[3], e5);
    e5.twin     = e5Twin;

    e6          = new Edge(tPnts[3], tPnts[2]);
    e6Twin      = new Edge(tPnts[2], tPnts[3], e6);
    e6.twin     = e6Twin;

    //face 1
    e1.next     = e5Twin;
    e5Twin.prev = e1;

    e5Twin.next = e4;
    e4.prev     = e5Twin;
    
    e4.next     = e1;
    e1.prev     = e4;

    //outerface
    e1Twin.next = e3Twin;
    e3Twin.prev = e1Twin;
    
    e3Twin.next = e2Twin;
    e2Twin.prev = e3Twin;
    
    e2Twin.next = e1Twin;
    e1Twin.prev = e2Twin;
    
    //face 2
    e2.next     = e6Twin;
    e6Twin.prev = e2;

    e6Twin.next = e5;
    e5.prev     = e6Twin;

    e5.next     = e2; 
    e2.prev     = e5;

    //face 3
    e3.next     = e4Twin;
    e4Twin.prev = e3;

    e4Twin.next = e6;
    e6.prev     = e4Twin;
    
    e6.next     = e3;
    e3.prev     = e6;

    testEdges = [e1, e2, e3, e4, e5, e6]

    f1       = new Face(e1, "f1");
    
    f2       = new Face(e2, "f2");

    f3       = new Face(e3, "f3");

    f4       = new Face(e1Twin, "bottom");

    e1.incidentFace     = f1;
    e5Twin.incidentFace = f1;
    e4.incidentFace     = f1; 

    e2.incidentFace     = f2
    e6Twin.incidentFace = f2;
    e5.incidentFace     = f2;

    e3.incidentFace     = f3;
    e4Twin.incidentFace = f3;
    e6.incidentFace     = f3;

    e1Twin.incidentFace = f4;
    e2Twin.incidentFace = f4;
    e3Twin.incidentFace = f4;

    testDC  = new DCEL(tPnts, [f1, f2, f3, f4], testEdges);
    testDC.initConflicts(points); 
    //#endregion
}

function highlightHorizon(){
    //1. find the horizon edges of the visible region
        //I believe this is any edge e where twin.incidentFace \notin conflicts   

    let point = points[pntIndex];

        // if(point.name == "fourthTest"){
        //     console.log(testDC.edges);
        // }
    for(let [fName, face] of point.conflicts){
        let iter = face.outerBound;
        let term = iter;
        //add any edge of a face who's twin has an incident face not 
        //conflicting with P
        if(!point.conflicts.has(iter.twin.incidentFace.name)){
            // && iter.twin.incidentFace.name != "outer"){
            horizon.push(iter);
        }

        iter = iter.next;
        while(iter.origin != term.origin){
            if(!point.conflicts.has(iter.twin.incidentFace.name)){
                horizon.push(iter);
            }
            iter = iter.next;        
        }
    }
    for(i = 0; i < horizon.length; i++){
        horizon[i].setColor(0,255,0);
        horizon[i].twin.setColor(0,255,0);  
    }
}


function draw(){
    background(205, 102, 94);
    // console.log("rotSpeed = " + );
    // rotateY( (millis() / 1000)*rotSpeed.value());
    orbitControl();
    stroke(211, 211, 211);
    fill(150, 150, 150);

    switch(currState){
        case State.Start:
            for(i = 0; i < testPnts.length; i++){
                testPnts[i].draw();
            }
            for(i = 0; i < points.length; i++){
                points[i].draw();
            }
            break;

        default:
            drawDCEL();
            for(i = pntIndex; i < points.length; i++){
                points[i].draw();
            }
    }

}

function drawDCEL(){

    this.testDC.draw()

    stroke(211, 211, 211);
    fill(0, 255, 0);
}

function drawPoints(){
    for(i = 0; i < points.length; i++){
        points[i].draw();
    }
}

//MAYBE SOME LOGIC SO NO DEGENERATE POINTS?
function genPoints(nPnts){

    for(i = 0; i < nPnts; i++){
        x = random(-canvasW/2, canvasW/2);
        y = random(-canvasH/2, canvasH/2);
        z = random(-canvasZ/2, canvasZ/2);

        points.push(new Point(Math.floor(x),
                        Math.floor(y),
                        Math.floor(z)),
                        i.toString());
    }

}