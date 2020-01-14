//Jarrett Parsons
//Ms Hideg
//ICS4U
//May 23, 2019

function nextGeneration() {
  tube.pos = createVector(w * 2, random(h - 300) + 150); //resets the tube position
  this.gap = random(w / 8) + w / 5; //resets the tube gap

  calculateFitness(); //calls calculateFitness method
  counter++; //counter stores how many generations have passed

  for (let i = 0; i < total; i++) { //when all the birds die it starts the next gerneration
    birds[i] = pickOne(); //each bird is chosen based of the pick one method
  }
  savedBirds = []; //clears the saved birds array
}

//pre: must be called
//post: removes the worst birds and gives the rest a fitness score
function calculateFitness() {
  let sum = 0;
  for (let bird of savedBirds) { //references each bird object in the array birds
    sum += bird.score; //sum stores the total score of all the birds
  }
  let avScore = sum / savedBirds.length; //avScore stores the average bird score
  let j = 0;
  while (j < savedBirds.length) {
    if (savedBirds[j].score < avScore) { //looks through the birds and if they are below average they are removed
      sum += -1 * savedBirds[j].score; //this makes the birds evolve faster while still being semi random
      savedBirds.splice(j, 1); //removes the bird
    } else {
      j++;
    }

  }
  for (let bird of savedBirds) {
    bird.fitness = bird.score / sum; //gives each remaining bird a score based of the total sum of the scores
  }
}

//pre: must be called
//post: chooses a bird for the next generation with a weighted randomness returns the bird
function pickOne() {
  let index = 0;
  let r = random(1); //random number between 0 and 1
  while (r > 0) {
    r = r - savedBirds[index].fitness; //subtracts the fitness scores until and chooses the bird that makes r = 0
    index++; //this is random but also weighted because if a bird has a higher fitness it has a higher chance of subtracting to 0
  }
  index--;
  let bird = savedBirds[index];
  let child = new Bird(bird.brain); //creates a new bird with the previous birds brain
  child.mutate(); //calls the mutate function
  return child;
}
