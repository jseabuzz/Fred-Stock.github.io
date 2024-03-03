class edge{

    constructor(v1, v2){
        this.v1 = v1;
        this.v2 = v2;
    }

    set v1(newV1){
        this._v1 = newV1;
    }
    get v1(){
        return this._v1;
    }

    set v2(newV2){
        this._v2 = newV2;
    }
    get v2(){
        return this._v2;
    }
}