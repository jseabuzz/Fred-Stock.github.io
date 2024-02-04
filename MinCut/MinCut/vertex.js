class vertex{

    constructor(name, coords=[]){
        this.name = name;
        this.subverts = [];
        this.coords = coords;
    }

    set subverts(vertSet){
        this._subverts = vertSet;
    }
    get subverts(){
        return this._subverts;
    }

    set coords(newCoords){
        this._coords = newCoords;
    }
    get coords(){
        return this._coords;
    }

}