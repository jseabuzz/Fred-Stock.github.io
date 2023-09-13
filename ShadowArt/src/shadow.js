class shadow{

    constructor(x1, x2, r, g, b, horHeight){
        this.x1 = x1;
        this.x2 = x2;
        this.r = r;
        this.g = g;
        this.b = b;
        this.horHeight = horHeight;
    }

    draw(){
        push();
        stroke(this.r, this.g, this.b);
        line(this.x1, this.horHeight, this.x2, this.horHeight);
        pop();
    }

}