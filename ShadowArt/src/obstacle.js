class obstacle{
    //x1 must be to the left of x2 (CCW ordering)
    constructor(_x1, _y1, _x2, _y2, horHeight){
        console.log(_x1 + ", " + _x2 + ", " + _y1 + ", " + _y2);
        if(_x1 < _x2 || _x2 === -1){
            this.x1 = _x1;
            this.x2 = _x2;
            this.y1 = _y1;
            this.y2 = _y2;
        }
        else{
            console.log("jere");
            this.x1 = _x2;
            this.x2 = _x1;
            this.y1 = _y2;
            this.y2 = _y1;
        }
        console.log(this.x1 + ", " + this.x2 + ", " + this.y1 + ", " + this.y2);

        this.horHeight = horHeight

    }

    draw(){
        push();
        fill(211, 211, 211);

        if(this.x2 === -1){
            line(this.x1, this.y1, this.x1, this.horHeight);
        }
        else{
            quad(this.x1, this.y1, 
                this.x2, this.y2, 
                this.x2, this.horHeight,
                this.x1, this.horHeight);
        }

        pop();
    }

    get x1(){
        return this._x1;
    }
    set x1(newX){
        this._x1 = newX;
    }

    get y1(){
        return this._y1;
    }
    set y1(newY){
        this._y1 = newY;
    }
    
    get x2(){
        return this._x2;
    }
    set x2(newX){
        this._x2 = newX;
    }

    get y2(){
        return this._y2;
    }
    set y2(newY){
        this._y2 = newY;
    }

}