class light{

    constructor(x, y, horHeight, horWidth){
        this.obs = [];
        this.x = x;
        this.y = y;
        this.horHeight = horHeight;
        this.horWidth = horWidth;

        this.rad = 10;
    }


    addOb(newObst){
        this.obs.push(newObst);
    }
    
    clicked(mouseX, mouseY){
        var xDist = pow(this.x - mouseX,2);
        var yDist = pow(this.y - mouseY,2);

        return (xDist + yDist) < (this.rad * this.rad);
    }

    move(newX, newY){
        this.x = newX;
        this.y = newY;
    }

    draw(){
        push();
        fill(0, 0, 255);
        circle(this.x, this.y, this.rad*2);    
        pop();
        this.obs.forEach(obst => this.drawShadows(obst));
        this.obs.forEach(obst => obst.draw());
    }

    drawShadows(obst){
        push();
        stroke(0, 0, 255);
        strokeWeight(4);

        var ly = abs(obst.y1 - this.y);
        var lx = abs(obst.x1 - this.x);
        var theta = (PI/2) - atan2(ly, lx);

        var projLen = tan(theta)*(horHeight - obst.y1);
        if(obst.x2 === -1)//its a line!
        {  

            if(this.x < obst.x1){
                line(obst.x1, horHeight, obst.x1 + projLen, horHeight);
            }
            else{
                line(obst.x1, horHeight, obst.x1 - projLen, horHeight);
            }

        }
        else{ //its not a line!
            if(this.x < obst.x1){
                line(obst.x2, horHeight, obst.x1 + projLen, horHeight);
            }
            else{
                line(obst.x1, horHeight, obst.x1 - projLen, horHeight);
            }

            ly = abs(obst.y2 - this.y);
            lx = abs(obst.x2 - this.x);
            theta = (PI/2) - atan2(ly, lx);
            projLen = tan(theta)*(horHeight - obst.y2);

            if(this.x < obst.x2){
                line(obst.x2, horHeight, obst.x2 + projLen, horHeight);
            }
            else{
                line(obst.x1, horHeight, obst.x2 - projLen, horHeight);
            }

        }

        pop();

    }

    //Far too lazy to write this myself 
    //http://paulbourke.net/geometry/pointlineplane/
    lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
        //#region Line intersection method

        // Check if none of the lines are of length 0
          if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
              return false
          }
      
          denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
      
        // Lines are parallel
          if (denominator === 0) {
              return false
          }
      
          let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
          let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator
      
        // is the intersection along the segments
          if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
              return false
          }
      
        // Return a object with the x and y coordinates of the intersection
          let x = x1 + ua * (x2 - x1)
          let y = y1 + ua * (y2 - y1)
      
          return {x, y}
          //#endregion
      }
}