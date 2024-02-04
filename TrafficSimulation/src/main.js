// import * as PIXI from "pixi.js";


window.onload = () =>{

    document.body.appendChild(app.view);
    
}


const app = new PIXI.Application({background: '#1099bb', resizeTo:window});

console.log(Object.keys(app.renderer));

// const bunny = PIXI.Sprite.from('https://pixijs.com/assets/bunny.png');
// app.stage.addChild(bunny);

// bunny.anchor.set(0.5);
// bunny.x = 0//app.screen.width/2;
// bunny.y = app.screen.height/2;

// console.log(bunny.x);
// console.log(app.screen.width/2);

var stage = new PIXI.Container();

const midX = app.screen.width/2;
const midY = app.screen.height/2;

scene = new SceneData();



cars = [new Agent(midX+30, 10, scene, "back"), new Agent(midX + 30, 120, scene, "front")];
scene.agents = cars;
//position = lane#*width start at bottom

//populate world
scene.agents.forEach(car =>{
    app.stage.addChild(car.physical.sprite);
    // car.sprite.anchor.set(0.5);
    console.log(car);
    car.physical.sprite.x = car.physical.position[0];
    car.physical.sprite.y = car.physical.position[1];
})

app.ticker.add((delta) =>{
    
    // console.log(scene.agents);  
    scene.agents.forEach(car => {
        car.update(delta);
    });

})