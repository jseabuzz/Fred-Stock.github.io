class Cell{

    constructor(x, y, size){
        this.x = x;
        this.y = y;
        this.size = size;
        this.active = false;
        
        this.left = null;
        this.right = null;
        this.top = null;
        this.bot = null;
    }

    setNeighbors(left, right, top, bot){
        this.left = left;
        this.right = right;
        this.top = top;
        this.bot = bot;
    }

    set active(val){
        this._active = val;
    }
    set x(newX){
        this._x = newX;
    }
    set y(newY){
        this._y = newY;
    }

    get active(){
        return this._active;
    }
    get x(){
        return this._x;
    }
    get y(){
        return this._y;
    }

    draw(){
        if(this.active){
            fill(51);    
        }
        else{
            fill(255);
        }
        square(this.x*this.size, this.y*this.size, this.size);
    }

    clicked(){
        this.active = !this.active;
        return this.active;
    }



    transfer(dir){
        if(!this.active){
            return true;
        }
        if(dir === UPK){
            if(this.top == null){return false;}
            this.top.transfer(UPK);
            this.active = false;
            this.top.active = true;
        }
        if(dir === RIGHTK){
            if(this.right == null){return false;}
            this.right.transfer(RIGHTK);
            this.active = false;
            this.right.active = true;
        }
        if(dir === DOWNK){
            if(this.bot == null){return false;}
            this.bot.transfer(DOWNK);
            this.active = false;
            this.bot.active = true;
        }
        if(dir === LEFTK){
            if(this.left == null){return false;}
            this.left.transfer(LEFTK);
            this.active = false;
            this.left.active = true;
        }
        return true;
    }
}
