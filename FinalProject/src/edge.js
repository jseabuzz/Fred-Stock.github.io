class Edge{

    constructor(origin, end, twin = null, incidentFace = null, next = null, prev = null){
        this.origin = origin;
        this.end = end;

        this.twin = twin; //Edge
        this.incidentFace = incidentFace; //Face
    
        //there are setters for next and prev
        //they can be set after edge created if 
        //next and prev aren't available at creation
        this.next = next;
        this.prev = prev;
        
        this.r = 255;
        this.g = 255;
        this.b = 255;
    }

    setColor(dr, dg, db){
        this.r = dr;
        this.g = dg;
        this.b = db;
    }

    draw(){
        // this.origin.draw();
        // this.end.draw();

        
        // translate(this.origin.x, this.origin.y, this.origin.z);

        push()
        stroke(this.r, this.g, this.b);
        strokeWeight = 5;
        line(this.origin.x, this.origin.y, this.origin.z,
            this.end.x, this.end.y, this.end.z);
        strokeWeight = 1;//default value
        pop();
        // translate(-this.origin.x, -this.origin.y, - this.origin.z);

        
    }
    
    //#region getters and setters
    set origin(val){
        this._origin = val;
    }
    set end(val){
        this._end = val;
    }
    set next(val){
        this._next = val;
    }
    set prev(val){
        this._prev = val;
    }
    set twin(val){
        this._twin = val;
    }
    set incidentFace(val){
        this._incidentFace = val;
    }

    get origin(){
        return this._origin;
    }
    get end(){
        return this._end;
    }
    get next(){
        return this._next;
    }
    get prev(){
        return this._prev;
    }
    get twin(){
        return this._twin;
    }
    get incidentFace(){
        return this._incidentFace;
    }
    //#endregion

}