//Jarrett Parsons
//Ms Hideg
//ICS4U
//May 23, 2019

const w = 761 * 1.3;
const h = 565 * 1.3;
let dude;
let tube;
let counter = 1;
let total = 200; //total number of birds in each generation if it is running slowly then decrease
let birds = [];
let savedBirds = [];
let slider;
let maxTubes = 0;

function setup() {
  var canvas = createCanvas(w, h); //creates the canvas with the given width and height
  canvas.parent('sketch-div');
  slider = createSlider(1, 50, 1); //creats the slider that controls the speed of the program
  slider.parent('slider-div');
  tf.setBackend('cpu'); //sets the backend of the computing to the cpu instead of the GPU or integrated GPU (this makes the program run much faster for me)
  for (let i = 0; i < total; i++) { //appends birds to fill the birds array
    birds[i] = new Bird();
  }
  tube = new Tube(w * 1.2); //creates the tube
}

function draw() { //all of the drawing codes out of the for loop below so it doesnt repeat
  background(127);
  for (let bird of birds) { //calls the show method for each bird
    bird.show();
    if (bird.pipeCount > maxTubes) { //max tubes stores the highest pipe count out of all of the birds
      maxTubes = bird.pipeCount;
    }
  }
  tube.show(); //calls the show method for the tube
  for (let n = 0; n < slider.value(); n++) { //the logic runs multiple times per draw frame based on the slider (this is how the game is sped up)
    for (let bird of birds) { //calls the update function for each bird
      bird.update();
    }
    tube.update(); //calls the update function for the tube

    for (let j = birds.length - 1; j >= 0; j--) { //for each bird if it hits a tube it is removed and put in the saved birds array
      if (birds[j].hits()) {
        savedBirds.push(birds.splice(j, 1)[0]); //sets value at j to null (deletes bird) but adds the bird to the saved birds
      }
    }

    if (birds.length == 0) { //if all the birds die then the next generation runs
      nextGeneration();
    }
  }
  text("Generation = " + counter, w - 110, 50); //displays the generation number
  text("High score = " + maxTubes, 30, 50); //displays the maximum tube number
}
