class Agent_Physical{

    constructor( x, y, sizex = 10, sizey=50){
        
        this.accel = [0,0];
        this.velocity = [0,1];
        this.position = [x, y];
        console.log(this.position);
        this.currentLane = 0;
        this.sizex = sizex;
        this.sizey = sizey;

        // var graphx = new PIXI.Graphics();

        // graphx.beginFill(0xFFFF00);

    // set the line style to have a width of 5 and set the color to red
        // graphx.lineStyle(5, 0xFF0000);
        // graphx.drawRect(this.position[0], this.position[1], 
                                // this.sizex, this.sizey);

        // var texture = new PIXI.RenderTexture(renderer, 16,16);
        // texture.render(graphx);

        this.sprite =   PIXI.Sprite.from("../Rectangle_(plain).svg");
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.position[0];
        this.sprite.y = this.position[1];
        // this.sprite = PIXI.Sprite.from('https://pixijs.com/assets/bunny.png');
    }

    get sprite(){
        return this._sprite;
    }
    set sprite(sprite){
        this._sprite = sprite;
    }

    update(delta){
    //update acceleration
    //calculate current velocity
    //update current posistion
    this.position[0] += this.velocity[0]*delta;
    this.position[1] += this.velocity[1]*delta;
    this.sprite.x = this.position[0];
    this.sprite.y = this.position[1];

        
    }

    move(){

    }
}