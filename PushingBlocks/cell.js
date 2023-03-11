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

        this.color = 0;
    }

    setNeighbors(left, right, top, bot){
        this.left = left;
        this.right = right;
        this.top = top;
        this.bot = bot;
    }

    set color(val){
        this._color = val;
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

    get color(){
        return this._color;
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
            fill(0, 255, 0);   
            if(this.color === 1){
                fill(0, 255, 0);   
            }
            if(this.color === 2){
                fill(0, 0, 255);
            }
            if(this.color === 3){
                fill(255, 0, 255);
            }
            if(this.color === 4){
                fill(100, 200, 255);
            }
        }
        else{
            fill(255);
        }
        square(this.x*this.size, this.y*this.size, this.size);
    }

    clicked(){
        // this.active = !this.active;
        console.log(this.color);
        this.color = this.color + 1;
        this.color = this.color % 5;
        console.log(this.color);


        console.log(this.active);
        this.active = !(this.color === 0);
        console.log(this.active);
        return this.color;
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
            this.top.color = this.color;
        }
        if(dir === RIGHTK){
            if(this.right == null){return false;}
            this.right.transfer(RIGHTK);
            this.active = false;
            this.right.active = true;
            this.right.color = this.color;
        }
        if(dir === DOWNK){
            if(this.bot == null){return false;}
            this.bot.transfer(DOWNK);
            this.active = false;
            this.bot.active = true;
            this.bot.color = this.color;
        }
        if(dir === LEFTK){
            if(this.left == null){return false;}
            this.left.transfer(LEFTK);
            this.active = false;
            this.left.active = true;
            this.left.color = this.color;
        }
        return true;
    }
}
