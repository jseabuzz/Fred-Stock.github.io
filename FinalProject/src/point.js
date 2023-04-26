class Point{

    constructor(x, y, z, name, r=255, g=255, b=255){
        this.x = x;
        this.y = y;
        this.z = z;
        this.name = name;
        this.r = r;
        this.g = g;
        this.b = b;
        this.conflicts = new Map();

        this.radius = 3;
    }

    //#region Getters setters
    set x(newX){
        this._x = newX;
    }
    set y(newY){
        this._y = newY;
    }
    set z(newZ){
        this._z = newZ;
    }
    set name(newName){
        this._name = newName;
    }
    set conflicts(newCfs){
        this._conflicts = newCfs;
    }
    set radius(newRad){
        this._rad = newRad;
    }
    get x(){
        return this._x;
    }
    get y(){
        return this._y;
    }
    get z(){
        return this._z;
    }
    get name(){
        return this._name;
    }
    get conflicts(){
        return this._conflicts;
    }
    get radius(){
        return this._rad;
    }
    //#endregion

    draw(){
        stroke(this.r, this.g, this.b);

        translate(this.x, this.y, this.z);
        sphere(this.radius);
        translate(-this.x, -this.y, -this.z);
        stroke(255);
    }

    addConflict(face){
        this.conflicts.set(face.name, face);
    }

    setColor(dr, dg, db){
        this.r = dr;
        this.g = dg;
        this.b = db;
    }

}