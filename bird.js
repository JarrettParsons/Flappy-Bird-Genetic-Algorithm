//Jarrett Parsons
//Ms Hideg
//ICS4U
//May 23, 2019

let brain;

class Bird {
  constructor(brain) {
    this.pos = createVector(w / 3.3, random(h - 300) + 150); //starting x and y pos of the bird. x pos is constant and y is random
    this.width = h / 11; //width and height of the bird
    this.height = h / 11;
    this.vel = createVector(0, 0); //initial x and y velocity
    this.acc = createVector(0, 0.5); //constant x and y acceleration (only a y component)
    this.score = 0; //the score of the bird is how many frames it survived for
    this.fitness = 0; //the fitness of a bird is its score relative to the other birds
    this.pipeCount = 0; //pipeCount is the maximun pipes a bird has traveled through
    this.show(); //calls the show method to show the bird

    if (brain instanceof NeuralNetwork) { //if there is an existing neural network then it is used else a new one is created
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(5, 8, 2); //there are 5 input nodes 8 hidden nodes and 2 output nodes in the neural network
    }
  }

  //pre: must be called
  //post: updates the gui to show the birds movement
  show() {
    push(); //pushes and pops the translation so that it is not permanent
    fill(200, 78, 160, 200); //rgb colour and opacity
    stroke(4); //outline
    rectMode(CENTER);
    translate(this.pos.x, this.pos.y); //moves to its x and y pos then draws the bird (square)
    rect(0, 0, this.width, this.height);
    pop();
  }

  //pre: must be called
  //post: the bird 'jumps'
  up() {
    this.vel = createVector(0, -8);
  }

  //pre: must be called
  //post: bird will jump or not jump based of its neural network
  think() {
    let closest;
    if (this.pos.x < tube.pos.x) { //if the tube is in front of the bird then closest stores how close the tube is to the bird (x distance)
      closest = tube.pos.x - this.pos.x;
    } else { //if the tube is behind the bird it just shows the bird that is is the width of the screen away until it gets closer than that
      closest = w + tube.width;
    }

    let inputs = []; //this list of inputs is what is fed into the predict function to determine whether the bird should jump or not. The inputs change with each frame
    inputs[0] = this.pos.y / h; // % of y position
    inputs[1] = (tube.pos.y - tube.gap) / h; //closest top tube (y)
    inputs[2] = (tube.pos.y + tube.gap) / h; //closest bottom tube (y)
    inputs[3] = closest / w; //closet set of tubes (x)
    inputs[4] = this.vel.y; //y velocity
    let output = this.brain.predict(inputs); //2 outputs are produced output 0 is the probability the bird should jump and output 1 is the probability it shouldnt jump
    if (output[0] > output[1]) {
      this.up(); //if it should jump the it calls the up method
    }
  }

  //pre: must be called
  //post: returns true if the bird hits a pipe or the top or bottom of the screen
  hits() { // if the birds x position is inside the tube and its y is inside the top or bottom then it returns true
    if (this.pos.x + this.width / 2 > tube.pos.x - tube.width / 2 && this.pos.x - this.width / 2 < tube.pos.x + tube.width / 2) {
      if (this.pos.y - this.height / 2 < tube.pos.y - tube.gap / 2 || this.pos.y + this.height / 2 > tube.pos.y + tube.gap / 2) {
        return true;
      }
    } else if (this.pos.y > h - this.height / 2 || this.pos.y < 0 + this.height / 2) { //if the bird hits the top or bottom of the screen it returns true
      return true;
    } else {
      return false;
    }
  }

  //pre: must be called
  //post: has a 0.1 chance to mutate the bird
  mutate() {
    this.brain.mutate(0.1); //has a 0.1 chance to mutate the neural network
  }

  //pre: must be called
  //post: updates the birds score, pipecount, and calls its think method
  update() {
    this.score++;
    if (this.pos.y <= h - this.height / 2) { //if the bird is not on the bottom of the screen it will accelerate down
      this.vel.add(this.acc); //adds the acceleration to the velocity
      this.pos.add(this.vel); //adds the velocity to the position
    } //if the bird passes through the right 8 pixels of the tube its score increases (the tube moves at 8 pixels per frame so this only occurs once)
    if (this.pos.x + this.width / 2 > tube.pos.x - tube.width / 2 && this.pos.x - this.width / 2 < tube.pos.x + tube.width / 2) {
      if (this.pos.x > tube.pos.x + tube.vel.x / 2 + tube.width / 2 && this.pos.x < tube.pos.x - tube.vel.x / 2 + tube.width / 2) { //signs flipped because vel is negative
        this.pipeCount++;
      }
    }
    this.think(); //calls the think method
  }
}
