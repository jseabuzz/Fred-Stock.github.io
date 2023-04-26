//This DCEL is purpose built for CH3D.js
//The constructor expects a tetrahedron
//The insert function is built specifically for a 3D ch insertion
//Faces are expected to be simple


//should probably do something to delete edges when a new face is added
//but might not be necessary as I am not drawing the edges
//could just draw the edges in face.draw() then I think we'd be good  


//the planar face edges seem to be correct, so something seems off with the other edges
class DCEL{

    /// initVerts is an array of Points (Points.js)
    /// initFaces is an array of Faces (DCEL.js)
    /// initEdges is an array of Edges (Edge.js)
    constructor(initVerts, initFaces, initEdges){

        this.verts = new Map();
        this.faces = new Map();
        this.edges = initEdges;

        for(i = 0; i < initVerts.length; i++){
            this.verts.set(initVerts[i].name, initVerts[i]);
        }
        for(i = 0; i < initFaces.length; i++){
            this.faces.set(initFaces[i].name, initFaces[i]);
        }
    }

    draw(){
        
        for(let [vName, vert] of this.verts){
            vert.draw();
        }

        for(let [fName, face] of this.faces){
            face.draw();
        }

        //faces basically draw the edges already
        let drawnEdges = [];
        for(let edge of this.edges){
            if(!drawnEdges.indexOf(edge.twin) > -1){
                drawnEdges.push(edge);
                edge.draw();
            }
        }
    }

    initConflicts(points){
        for(let [fName, face] of this.faces){
            if(fName == "outer"){continue;}
            for(i = 0; i < points.length; i++){
                if(face.visibleToPoint(points[i])){
                    face.conflicts.set(points[i].name, points[i]);
                    points[i].conflicts.set(fName, face);
                } 
            }
        }
    }

    addPoint(point){

        if(point.conflicts.size == 0){
            //no visible faces
            return;
        }
        this.verts.set(point.name, point);

        let uhorizon = []; //unordered horizon list
        //1. find the horizon edges of the visible region
            //I believe this is any edge e where twin.incidentFace \notin conflicts   


        for(let [fName, face] of point.conflicts){
            let iter = face.outerBound;
            let term = iter;

            //add any edge of a face who's twin has an incident face not 
            //conflicting with P
            if(!point.conflicts.has(iter.twin.incidentFace.name)){
                // && iter.twin.incidentFace.name != "outer"){
                uhorizon.push(iter);
            }

            iter = iter.next;
            while(iter.origin != term.origin){
                if(!point.conflicts.has(iter.twin.incidentFace.name)){
                    uhorizon.push(iter);
                }
                iter = iter.next;        
            }

            this.faces.delete(face.name);
        }

        let ohorizon = []; //ordered horizon list
        ohorizon.push(uhorizon[0]);
        for(i = 0; i < uhorizon.length; i++){
            for(var j = 1; j < uhorizon.length; j++){
                if(uhorizon[j].origin == ohorizon[i].end){
                    ohorizon.push(uhorizon[j]);
                }
            }
        }


        //going to assume that we are not creating coplanar facets
        //Just for now at least

        // return;

        let prevPlanar = false;
        for(i = 0; i < ohorizon.length; i++){
            let e = ohorizon[i];
            
            
            e1          = new Edge(point, e.origin);
            e1Twin      = new Edge(e.origin, point, e1);
            e1.twin     = e1Twin;
            
            e.prev      = e1;
            e1.next     = e;
            


            var pIndex  = (i-1) % ohorizon.length;
            pIndex      = ((pIndex < 0) ? ohorizon.length - 1 : pIndex);

            ohorizon[pIndex].next = e1Twin; 
            if(i > 0){
                if(prevPlanar){
                    e1Twin.prev = ohorizon[pIndex].twin.prev;
                    ohorizon[pIndex].twin.prev.next = e1Twin;
                    e1Twin.incidentFace = ohorizon[pIndex].twin.incidentFace;
                }
                else{
                    e1Twin.prev = ohorizon[pIndex];
                    e1Twin.incidentFace = ohorizon[pIndex].incidentFace;
                    ohorizon[pIndex]
                }
                e1Twin.next = ohorizon[pIndex].prev;
            }
            
            if(i == ohorizon.length - 1){     //maybe I don't need this?          
                if(prevPlanar){
                    // console.log("prev planar"); 
                    //     e1Twin.prev = ohorizon[0].twin.prev;
                //     ohorizon[0].twin.prev.next = e1Twin;
                }
                // else{
                    ohorizon[0].prev.twin.next = e1;
                    e1.prev = ohorizon[0].prev.twin;
                // }
            }
            prevPlanar = false;
            
            let cnftUnion = new Map ([...e.incidentFace.conflicts, 
                                 ...e.twin.incidentFace.conflicts]);                 
                                 
            if(e.twin.incidentFace.pntOnFace(point)){ //faces are coplanar
                // console.log("Planar");
                prevPlanar = true;
                e1.next = e.twin.next;
                e.twin.next.prev = e1;
                if(i == ohorizon.length - 1){
                    e.twin.prev.next = ohorizon[0].prev.twin;
                    ohorizon[0].prev.twin.prev = e.twin.prev;
                    e.next.incidentFace = e.twin.incidentFace;
                }

                // e.twin.incidentFace.conflicts = cnftUnion;
                e1.incidentFace = e.twin.incidentFace;
                for(let [,pnt] of e.incidentFace.conflicts){

                    // if(e.twin.incidentFace.visibleToPoint(pnt)){
                    //     pnt.conflicts.set(e.twin.incidentFace.name, e.twin.incidentFace);
                    //     e.twin.incidentFace.conflicts.set(pnt.name, pnt);
                    // }
                    pnt.conflicts.delete(e.incidentFace.name);
                }
                this.edges.splice(this.edges.indexOf(e), 1);
            }
            else{
                // console.log("Non Planar");
                var newFace         = new Face(e, "face" + math.floor(random(5, 100)));
                
                
                if(i != 0){
                    e1Twin.incidentFace = ohorizon[pIndex].incidentFace;
                }
                if(i == ohorizon.length - 1){
                    ohorizon[0].prev.twin.incidentFace = newFace;
                }
                
                
                this.faces.set(newFace.name, newFace);
                
                for(let [pName, pnt] of cnftUnion){
                    if(newFace.visibleToPoint(pnt)){
                        pnt.conflicts.set(newFace.name, newFace);
                        newFace.conflicts.set(pnt.name, pnt);
                    }
                } 
                for(let [,pnt] of e.incidentFace.conflicts){
                    pnt.conflicts.delete(e.incidentFace.name);
                }
                e.incidentFace      = newFace;
                e1.incidentFace     = newFace;
                
            }
            
            
            this.edges.push(e1);
            // console.log("HERE1");
        }
    }
}