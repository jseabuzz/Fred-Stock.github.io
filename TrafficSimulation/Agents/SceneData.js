class SceneData{

    constructor(agents=[]){
        this.agents = agents
    }

    get agents(){
        return this._agents;
    }

    set agents(newVal){
        this._agents = newVal; 
    }

}
