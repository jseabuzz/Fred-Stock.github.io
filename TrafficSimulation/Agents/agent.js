const states ={
    driving  : Symbol("driving"),
    breaking : Symbol("breaking"),
    stopped  : Symbol("stopped"),
    arriving  : Symbol("arriving"),
    dodge    : Symbol("dodge")
}

const DRIVING  = states.driving;
const BREAKING = states.breaking;
const STOPPED  = states.stopped;
const ARRIVING  = states.arriving;


//should move weights for forces into a parameter for addForce
class Agent{

    constructor(x,y,scene, name){
        this.state    = states.driving;
        this.scene    = scene;
        this.physical = new Agent_Physical(x,y,this.scene); 

        this.name = name;

        this.breakingDist = 11000;
        this.arrivingDist = 10000;
        this.stoppingDist = 400;
        this.destination  = new Victor(x, 650);

        this.goalVel      = 600;
    }

    get physical(){
        return this._physical;
    }
    set physical(newVal){
        this._physical = newVal;
    }

    addScene(scene){
        this.scene = scene;
        this.physical.sceneData = scene;
    }

    updateState(delta){
        if(this.state == DRIVING){
            this.scene.agents.forEach(agent => {
                if(this.physical.seesCar(agent.physical) && this != agent){
                    if(this.physical.mightCollide(agent, this.breakingDist, delta)){
                        this.state = BREAKING;
                    }
                    // if(this.physical.sqrAgentDistance(agent.physical) < this.arrivingDist){
                    //     this.state = BREAKING;
                    // }
                }  
            });
            // var temp = this.physical.position.clone().subtract(this.destination).lengthSq();
            // console.log(temp < this.arrivingDist);
            if(this.physical.position.clone().subtract(this.destination).lengthSq() < this.arrivingDist){
                this.state = ARRIVING;
            }
        }

        else if(this.state == BREAKING){

            //check if we should start driving again
            this.state = DRIVING;
            this.scene.agents.forEach(agent=>{
                if(this.physical.seesCar(agent.physical) && this != agent){
                    if(this.physical.sqrAgentDistance(agent.physical) < this.breakingDist * 2){
                        console.log("break");
                        this.state = BREAKING;
                    }
                }
            });

            if(this.state != DRIVING){
                console.log("here");
                if(this.physical.velocity.lengthSq() < 1){
                    this.state = STOPPED;
                }
            }
        }

        else if(this.state == ARRIVING){
            
            if(this.name == "back"){
                console.log("ariving");
            }

            var sqDist = this.physical.position.clone().subtract(this.destination).lengthSq();
            if(sqDist < this.stoppingDist){
                this.state == STOPPED;
            }
            if(sqDist > this.arrivingDist){
                this.state == DRIVING;
            }
            
        }

        else if(this.state == STOPPED){
            //check if we should start driving again
            this.state = DRIVING;
            this.scene.agents.forEach(agent=>{
                if(this.physical.seesCar(agent.physical) && this != agent){
                    if(this.physical.sqrAgentDistance(agent.physical) < this.breakingDist){
                        this.state = STOPPED;
                    }
                }
            });
            if(this.state == DRIVING){
                if(this.physical.position.clone().
                        subtract(this.destination).lengthSq < 1){
                    this.state == STOPPED;
                }
            }

        }
    }

    updateForces(delta){
        if(this.state == DRIVING){
            var driveForce = this.physical.seek(this.destination.x,
                this.destination.y);
            
            this.physical.addForce(driveForce, 2);
        }
        if(this.state == ARRIVING){
            var arriveForce = this.physical.seek(this.destination.x,
                this.destination.y);

            var dist = this.physical.position.clone().subtract(this.destination).lengthSq();
            this.physical.addForce(arriveForce, (dist)/this.arrivingDist);
        }

        if(this.state == BREAKING){
            var breakVec = this.physical.velocity.
                        clone().multiply(new Victor(1,1));
            
            // console.log(this.physical.velocity);
            // breakVec.add(this.physical.position)
            // var breakForce = this.physical.seek(breakVec);
            // console.log(this.physical.position);
            // console.log(breakVec);
            // console.log("breaking");
            // console.log(breakForce);
            this.physical.addForce(breakVec.invert().norm(), 50)
            // this.physical.velocity.multiply()
        }

        if(this.state == STOPPED){
            this.velocity = new Victor(0,0);
        }
        this.physical.update(delta);
        // this.physical.friction();
    }

    update(delta){
        this.updateState(delta);
        this.updateForces(delta);
        this.physical.move(delta);
    }

    // move(delta){
    //     this.physical
    // }



}