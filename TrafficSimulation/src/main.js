// import * as PIXI from "pixi.js";


window.onload = () =>{

    document.body.appendChild(app.view);
    
}


const app = new PIXI.Application({background: '#1099bb', resizeTo:window});

console.log(Object.keys(app.renderer));

const bunny = PIXI.Sprite.from('https://pixijs.com/assets/bunny.png');
app.stage.addChild(bunny);

bunny.anchor.set(0.5);
bunny.x = 0//app.screen.width/2;
bunny.y = app.screen.height/2;

console.log(bunny.x);
console.log(app.screen.width/2);

var stage = new PIXI.Container();

const midX = app.screen.width/2;
const midY = app.screen.height/2;

cars = [new Agent_Physical(midX, 0)];

//position = lane#*width start at bottom

//populate world function
cars.forEach(car =>{
    app.stage.addChild(car.sprite);
    // car.sprite.anchor.set(0.5);
    car.sprite.x = car.position[0]
    car.sprite.y = car.position[1];
})



app.ticker.add((delta) =>{
    // bunny.x += 1*delta; 

    cars.forEach(car => {
        car.update(delta);
    });

})