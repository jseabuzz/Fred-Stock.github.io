class vertex{

    constructor(name, coords=[],  children=[], parent=null, active=false, root=false){
        this.name = name;
        this.subverts = [];
        this.coords = coords;

        this.active = active;
        this.visited = active;

        this.children = children;

        this.parent = parent;
        this.pEdge = !root;
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

    set pEdge(edge){
        this._pEdge = edge;
    }
    get pEdge(){
        return this._pEdge;
    }

    set parent(newParent){
        this._parent = newParent;
    }
    get parent(){
        return this._parent;
    }

    set children(newChildren){
        this._children = newChildren;
    }
    get children(){
        return this._children;
    }

    set active(newActive){
        this._active = newActive;
        if(newActive){
            this.visited = true;
        }
    }
    get active(){
        return this._active;
    }


    set visited(newVisit){
        this._visited = newVisit;
    }
    get visited(){
        return this._visited;
    }

    unvisitedChildren(){
        let res = [];
        for(let i = 0; i < this.children.length; i++){
            if(!this.children[i].visited){
                res.push(this.children[i]);
            }
        }
        return res;
    }

    updateEdge(){
        let p = .5;
        if(Math.random() > p){
            this.pEdge = false;
        }
        else{
            this.pEdge = true;
        }
    }
}