class Agent_Physical{
    //this implements basic "boid-esque" functionality
    //maybe a different model of movement is better?
    constructor( x, y, sceneData, sizex = 10, sizey=50, mass=10){

        
        this.accel = new Victor(0,0);
        this.velocity = new Victor(0,0);
        this.position = new Victor(x,y);
        console.log(this.position.toString());
        this.currentLane = 0;
        this.sizex = sizex;
        this.sizey = sizey;
        this.sceneData = sceneData;

        this.mass = new Victor(mass,mass);

        //victor doesnt have scalar multiplication for some reason
        //could just use scalar division I guess?
        this.seekWeight = new Victor(2,2);
        this.avoidWeight = new Victor(5,5);
        this.cFric = new Victor(-.8, -.8);

        this.sprite =   PIXI.Sprite.from("../assets/car.svg");
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;

        this.tempSeek = this.position.x;
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
        this.position.x += this.velocity.x*delta;
        this.position.y += this.velocity.y*delta;
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;        
        this.accel = new Victor(0,0);

        // console.log(this.position.toString())
    }

    force(force){
        return force.norm();
    }

    addForce(force, weight){
        this.accel.add((force.divide(this.mass))
                .multiply(new Victor(weight,weight)));
    }

    sqrnorm(vec){
        return (vec.x*vec.x) + (vec.y*vec.y);
    }

    seek(x,y){
        // console.log((new Victor(x,y)).subtract(this.position))
        return this.force((new Victor(x,y)).subtract(this.position));
            // [x - this.position.x, (y - this.position.y)]);
    }

    avoid(x,y){
        var res = this.seek(x,y).norm();
        res.invert();
        return res;
    }

    //should make this more adanvanced
    seesCar(other){
        return other.position.y >= this.position.y;
    }

    sqrAgentDistance(other){
        return Math.pow(other.position.x - this.position.x,2) +
            Math.pow(other.position.y - this.position.y,2);
    }

    mightCollide(otherCar, collisionRad, delta){
        
        var deltaVic   = new Victor(delta, delta)

        var otherPos   = otherCar.physical.position.clone();
        var otherDist  = otherCar.physical.velocity.clone().multiply(deltaVic);

        var thisDist   = this.velocity.clone().multiply(deltaVic);
        
        var thisFinal  = this.position.clone().add(thisDist);
        var otherFinal = otherPos.add(otherDist);
        
        return thisFinal.subtract(otherFinal).lengthSq() < 10000;

        // //compute if they intersect

        // if(velCross != 0){
 
        //     return true;
        // }
        // else if(posCross == 0){
        //     //making assumption due to cars are always moving in same direction currently
        //     var temp = this.position.clone().add(thisDist);
        //     return (temp.x >= otherPos.x && temp.y >= otherPos.x)
        //     return true;    
        // }
        // else{
        //     return false;
        // }

        // // var ccw1 = (otherPos2.y - this.position.y)*(otherPos.x - this.position.x) 
        // //         > (otherPos.y - this.position.y)*(otherPos2.x - this.position.x);
        
        // // var ccw2 = (otherPos2.y - thisPos2.y)*(otherPos.x - thisPos2.x) 
        // //         > (otherPos.y - thisPos2.y)*(otherPos2.x - thisPos2.x);


        // // var ccw3 = (otherPos.y - this.position.y)*(thisPos2.x - this.position.x) 
        // //         > (thisPos2.y - this.position.y)*(otherPos.x - this.position.x);

        // // var ccw4 = (otherPos2.y - this.position.y)*(thisPos2.x - this.position.x) 
        // //         > (thisPos2.y - this.position.y)*(otherPos2.x - this.position.x);

        // return (ccw1 != ccw2) && (ccw3 != ccw4);
    }

    update(deltaTime){
        //Add Forces


        // this.sceneData.agents.forEach(agent =>{
        //     // if(){}
        //     if(agent != this && this.seesCar(agent) && this.sqrAgentDistance(agent) < 2500){
        //         var avoidVec = this.avoid(agent.position.x, agent.position.y);
        //         this.addForce(avoidVec);
        //     }
        // });

        
        // var seekForce = this.seek(this.tempSeek, 300);


        // this.addForce(seekForce);

        this.addForce(this.velocity.clone().multiply(this.cFric),1);
        this.velocity.x += this.accel.x*deltaTime;
        this.velocity.y += this.accel.y*deltaTime;
        
        this.accel = new Victor(0,0);

        //friction

        this.move(deltaTime);
    }
}