//Jarrett Parsons
//Ms Hideg
//ICS4U
//May 23, 2019

class Tube {
  constructor(_x) {
    this.width = w / 4;
    this.height = 2 * h;
    this.gap = random(w / 8) + w / 5; //the gap between the 2 tubes
    this.vel = createVector(-w / 95, 0);
    this.pos = createVector(_x, random(h - 300) + 150);
    this.show();
  }

  //pre: must be called
  //post: draws the top and bottom tube with the a gap inbetween
  show() {
    push(); //push and pop to translate 0,0 to the object
    fill(0, 120, 0);
    stroke(4);
    rectMode(CENTER);
    translate(this.pos.x, this.pos.y);
    rect(0, this.gap / 2 + this.height / 2, this.width, this.height); // creates the bottom tube
    rect(0, -this.gap / 2 - this.height / 2, this.width, this.height); //creates the top tube
    pop();
  }

  //pre: must be called
  //post: updates the position of the tube
  update() {
    this.pos.add(this.vel);
    if (this.pos.x < 0 - this.width / 2) { //if it leaves the screen on the left it 'loops' back from the right with a new gap and gap position
      this.pos = createVector(w + this.width / 2, random(h - 300) + 150);
      this.gap = random(w / 8) + w / 5;
    }
  }
}
