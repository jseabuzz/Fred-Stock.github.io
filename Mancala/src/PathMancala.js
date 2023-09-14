//brute force solutions to path mancala
//create a graph of possible states via a dfs
let states = {};
function calcSolution(){
    let stones = getInput();

    let solved = false;


    let initalState = new state(null, stones);
    states[initalState.key] = initalState;
    let curState = initalState;

    let sol = recursiveSolv(curState, -1);

    // if(sol !== false){
    //     console.log("final state", sol);
    // }

    presentSolution(sol);

}

function recursiveSolv(curState, index){

    if(curState === false){
        //our last recursion reached an invalid state
        return false;
    }
    
    if(curState.stoneArr.every(amt => amt === 0)){
        //we have solved it
        return curState;
    }

    if(index !== -1){
        // console.log("in if with state:", curState);
        // console.log("and ind:",index)
        curState.solIndex = index;

        let [tempStateR, newIndR] = nextState(curState, index,  1);
        let [tempStateL, newIndL] = nextState(curState, index, -1);

        if(states[tempStateR.key] === undefined && tempStateR !== false){
            states[tempStateR.key] = tempStateR;
            let result = recursiveSolv(tempStateR, newIndR);

            //cant immediately return recursive solve as if it returns false
            //we would still want to call recursive solve on the result to the
            //other direction, only return if we solved it
            if(result){ return result;} 
        }


        if(states[tempStateL.key] === undefined && tempStateL !== false){
            states[tempStateL.key] = tempStateL;
            return recursiveSolv(tempStateL, newIndL);
        }
        else{
            //both were already visted, go back
            return false;
        }
    }

    else{
        // console.log("In else with state", curState);
        for(let i = 0; i < curState.stoneArr.length; i++){

            curState.solIndex = i;
            // console.log("Looped to: " + i + "with stone arr: " + curState.stoneArr + " with state: ", curState );
            let [tempStateR, newIndR] = nextState(curState, i,  1);
            let [tempStateL, newIndL] = nextState(curState, i, -1);
            
            if(states[tempStateR.key] === undefined && tempStateR !== false){
                states[tempStateR.key] = tempStateR;
                let result = recursiveSolv(tempStateR, newIndR);
    
                //cant immediately return recursive solve as if it returns false
                //we would still want to call recursive solve on the result to the
                //other direction, only return if we solved it
                if(result){ return result;} 
            }
    
    
            if(states[tempStateL.key] === undefined && tempStateL !== false){
                states[tempStateL.key] = tempStateL;
                let result = recursiveSolv(tempStateL, newIndL);
                if(result){return result;}
            }

        }
        //if we got here no solution was found, recurse back
        return false;
        
    }
}

//dir is 1 to go right, and -1 to go left
function nextState(curState, i=-1, dir=1){
    if(i === -1){return [false, false];}
    if(dir !== 1 && dir !== -1){return [false, false];}

    let stones = curState.stoneArr[i];

    if(stones === 0){return [false, false];}

    let tempState = new state(curState, curState.stoneArr.slice(0));
    
    if( i + (dir*stones) < 0 ||
    i + (dir*stones) > curState.stoneArr.length){
        
        return [false, false];
        //this move will result in an invalid state
    }

    tempState.stoneArr[i] = 0;
    for(; stones>0; stones--){
        i = (i + dir);
        if(i !== tempState.stoneArr.length){
            tempState.stoneArr[i] += 1;
        }
    }

    tempState.key = tempState.stoneArr.toString();
    if(i === tempState.stoneArr.length){
        //we ended on the exit
        return [tempState, -1];
    }
    if(tempState.stoneArr[i] === 1){
        //we must have ended by placing a 1 in a zero
        return [false, false];
    }
    return [tempState, i];
}

function state(parent, stoneArr){
    
    this.parent = parent;
    this.stoneArr = stoneArr;
    this.key = stoneArr.toString();
    this.children = [];
    this.solIndex = -1;

}

function getInput(){
    let stoneText = document.getElementById("stoneInput").value;

    let stoneNums = stoneText.split(",").map(str => parseInt(str)); 

    return stoneNums;
}

function presentSolution(finalState){
    console.log(finalState);
    let resultText = "";
    if(finalState === false){
        resultText = "No solution! :(";
    }
    else{
        let tempState = finalState.parent;
        let stateKeys = [];
        stateKeys.push([finalState.key, finalState.solIndex]);
        while(tempState !== null){
            stateKeys.push([tempState.key, tempState.solIndex]);
            tempState = tempState.parent;
        }
        stateKeys = stateKeys.reverse();

        console.log(stateKeys);
        stateKeys.forEach( ([key, index]) => {
            let stones = key.split(",");
            stones[index] = "<b>" + stones[index] + "</b>";
            resultText = resultText + stones.toString() + "<br>"
        });


        // stateKeys.map(keyVal => resultText = resultText + keyVal + "<br>");
    }

    document.getElementById("results").innerHTML = resultText;
}