class Face{
    //Note: face edges are CCW as viewed from __outside__ the CH
    
    //no innercomponent list faces are simple
    constructor(outerBound, name){
        this.outerBound = outerBound; //Edge
        this.name = name;             //String
        this.conflicts = new Map();   //Point[]
        this.r  = 150; 
        this.g  = 150;
        this.b  = 150;
        this.sr = 255;
        this.sb = 255;
        this.sg = 255;
    }

    addConflict(point){
        this.conflicts.push(point);
    }

    //Dont have a test for a point lieing on the plane of a face
    //But may just assume it doesn't happen
    visibleToPoint(pt){
        //1. construct plane for the face
        p1 = this.outerBound.origin;
        p2 = this.outerBound.end;
        p3 = this.outerBound.next.end;

        const pointMat = [
            [(pt.x - p1.x), (pt.y - p1.y), (pt.z - p1.z)],
            [(p2.x - p1.x), (p2.y - p1.y), (p2.z - p1.z)],
            [(p3.x - p1.x), (p3.y - p1.y), (p3.z - p1.z)]
        ];

        let pCh = this.outerBound.twin.next.end; //the end point of the next edge
                                                 //should not be a point on the same face
                                                 //it is used to determine which side 
                                                 //the ch lies in regard to the face
                                                     
                                                    
        const chPointMat = [
            [(pCh.x - p1.x), (pCh.y - p1.y), (pCh.z - p1.z)],
            [(p2.x - pCh.x), (p2.y - pCh.y), (p2.z - pCh.z)],
            [(p3.x - pCh.x), (p3.y - pCh.y), (p3.z - pCh.z)]
        ];

        //2. determine which side of the plane the point lies on
            //2a. The CH will lie entirely on one side
        let pntDet = math.det(pointMat);
        let chDet  = math.det(chPointMat);


            //2b. If the point is on the other side from the CH then the face is visible
        return (chDet > 0 && pntDet < 0) || (chDet < 0 && pntDet > 0);

    }

    pntOnFace(pt){
        p1 = this.outerBound.origin;
        p2 = this.outerBound.end;
        p3 = this.outerBound.next.end;

        const pointMat = [
            [(pt.x - p1.x), (pt.y - p1.y), (pt.z - p1.z)],
            [(p2.x - p1.x), (p2.y - p1.y), (p2.z - p1.z)],
            [(p3.x - p1.x), (p3.y - p1.y), (p3.z - p1.z)]
        ];

        return math.det(pointMat) == 0;
    }

    draw(){
        // translate(this.outerBound.origin.x, 
        //             this.outerBound.origin.y,
        //             this.outerBound.origin.z);
        this.createFace();
        // translate(-this.outerBound.origin.x, 
        //             -this.outerBound.origin.y,
        //             -this.outerBound.origin.z);
    }

    createFace(){
        push();
        noStroke;
        
        let fillColor = color(this.r, this.g, this.b);       
        fill(fillColor);
        
        beginShape();
        let iter = this.outerBound;
        let term = this.outerBound;

        vertex(iter.origin.x,
            iter.origin.y,
            iter.origin.z); 

        iter = iter.next;
        // console.log("ITERING\n");
        // console.log(iter);
        // console.log(term);
        
        while(iter.origin != term.origin){
            // console.log(iter);
            vertex(iter.origin.x,
                iter.origin.y,
                iter.origin.z); 
                iter = iter.next;         
        }
        // console.log("HERE");
        // let a = error;
        endShape();
        pop();
    }

    //#region getters and setters
    set outerBound(edge){
        this._outerBound = edge;
    }
    set name(newName){
        this._name = newName;
    }
    set conflicts(newCfs){
        this._conflicts = newCfs;
    }
    get outerBound(){
        return this._outerBound;
    }
    get conflicts(){
        return this._conflicts;
    }
    get name(){
        return this._name;
    }

    setColor(dr, dg, db){
        this.r = dr;
        this.g = dg;
        this.b = db;
    }

    setStroke(dr, dg, db){
        this.sr = dr;
        this.sg = dg;
        this.sb = db;
    }
    //#endregion
}