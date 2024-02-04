class Node{

    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
        this.postOrder = -1;
        this.neighbors = [];
        this.visited = false;
    }


    draw(size){
        push();
        fill(255, 255, 255);
        // fill(this.postOrder, this.postOrder, this.postOrder);
        translate(this.x + size/2, this.y + size/2, this.z + size/2);
        box(size);

        fill(0,0,0);
        translate(-size/2, 0, size);  
        if(this.postOrder !== -1){
            text(this.postOrder, 0, 0);
        }
        pop();
    }

    set visited(val){
        this._visited = val;
    }
    get visited(){
        return this._visited;
    }

    set neighbors(val){
        this._neighbors = val;
    }
    get neighbors(){
        return this._neighbors;
    }

    set postOrder(val){
        this._postOrder = val;
    }
    get postOrder(){
        return this._postOrder;
    }

    set x(val){
        this._x = val;
    }
    get x(){
        return this._x;
    }

    set y(val){
        this._y = val;
    }
    get y(){
        return this._y;
    }

    set z(val){
        this._z = val;
    }
    get z(){
        return this._z;
    }

}