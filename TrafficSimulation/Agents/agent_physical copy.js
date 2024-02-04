class Agent_Physical{

    //this implements basic "boid-esque" functionality
    //maybe a different model of movement is better?
    constructor( x, y, sceneData, sizex = 10, sizey=50, mass=10){
        
        this.accel = [0,0];
        this.velocity = [0,0];
        this.position = [x, y];
        console.log(this.position);
        this.currentLane = 0;
        this.sizex = sizex;
        this.sizey = sizey;
        this.sceneData = sceneData;

        this.mass = mass;

        this.seekWeight = 2;
        this.avoidWeight = 5;
        this.cFric = .8;

        this.sprite =   PIXI.Sprite.from("../assets/car.svg");
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.position[0];
        this.sprite.y = this.position[1];

        this.tempSeek = this.position[0];
        // this.sprite = PIXI.Sprite.from('https://pixijs.com/assets/bunny.png');
    }

    get sprite(){
        return this._sprite;
    }
    set sprite(sprite){
        this._sprite = sprite;
    }

    move(delta){

        //calculate current velocity
        // this.update(delta);

        //update current posistion
        this.position[0] += this.velocity[0]*delta;
        this.position[1] += this.velocity[1]*delta;
        this.sprite.x = this.position[0];
        this.sprite.y = this.position[1];        
    }

    force(force){
        var norm  = Math.sqrt(this.sqrnorm(force));
        // console.log("Norm", norm);
        var normForce    = [0,0];
        normForce[0] = force[0]/norm;
        normForce[1] = force[1]/norm;

        return normForce;
    }

    addForce(force){
        this.accel[0] += force[0]/this.mass;
        this.accel[1] += force[1]/this.mass;
    }

    sqrnorm(vec){
        return (vec[0]*vec[0]) + (vec[1]*vec[1]);
    }

    seek(x,y){
        return this.force([x - this.position[0], (y - this.position[1])]);
    }

    avoid(x,y){
        var res = this.seek(x,y);
        // console.log(res);
        return [-res[0], -res[1]];
    }

    //should make this more adanvanced
    //would be nice if I had a vector math package for this
    seesCar(other){
        return other.position[1] >= this.position[1];
    }

    sqrAgentDistance(other){
        return Math.pow(other.position[0] - this.position[0],2) +
            Math.pow(other.position[1] - this.position[1],2);
    }

    update(deltaTime){
        //Add Forces
        this.sceneData.agents.forEach(agent =>{
            // if(){}
            if(agent != this && this.seesCar(agent) && this.sqrAgentDistance(agent) < 2500){
                var avoid = this.avoid(agent.position[0], agent.position[1]);
                this.addForce([this.avoidWeight*avoid[0],
                        this.avoidWeight*avoid[1]]);
            }
        });
        
        var seekForce = this.seek(this.tempSeek, 300);
        this.addForce([this.seekWeight * seekForce[0], this.seekWeight * seekForce[1]]);
       
        this.velocity[0] += this.accel[0]*deltaTime;
        this.velocity[1] += this.accel[1]*deltaTime;

        this.accel = [0,0];
        
        //friction

        this.addForce([-this.velocity[0]*this.cFric, -this.velocity[1]*this.cFric])
        // this.velocity[0] *= .5;
        // this.velocity[1] *= .5;

        this.move(deltaTime)
    }
}