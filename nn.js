class NeuralNetwork {
  constructor(a, b, c, d) {
    if (a instanceof tf.Sequential) { //if there is allready an existing model it is used otherwise a new model is created
      this.model = a;
      this.inputNodes = b;
      this.hiddenNodes = c;
      this.outputNodes = d;
    } else {
      this.inputNodes = a;
      this.hiddenNodes = b;
      this.outputNodes = c;
      this.model = this.createModel();
    }
  }

  //pre: must be called with a model
  //post: copies a given brain model and returns it
  copy() { //copies successful trials.
    const modelCopy = this.createModel();
    const weights = this.model.getWeights(); //weights are stored in the weights variable (the weights are values stored in the connections in the neural network)
    modelCopy.setWeights(weights); //sets the weights of the current model to the new model created
    return new NeuralNetwork(modelCopy, this.inputNodes, this.hiddenNodes, this.outputNodes);
  }

  //pre: must be called with a number in the parameter between 0 and 1
  //post: has a chance to mutate the weights of the network
  mutate(rate) {
    const weights = this.model.getWeights();
    const mutatedWeights = [];
    for (let i = 0; i < weights.length; i++) {
      let tensor = weights[i]; //stores the weights
      let shape = weights[i].shape; //stores the shape of the weighted connection
      let values = tensor.dataSync().slice(); //downloads the values from the tensor
      for (let j = 0; j < values.length; j++) {
        if (random(1) < rate) {
          let w = values[j];
          values[j] = w + randomGaussian(); // if the random number is less than the rate given then the weight is changed slightly
        }
      }
      let newTensor = tf.tensor(values, shape); //creates a new tensor with the new weights
      mutatedWeights[i] = newTensor; //adds the tensor to the mutated weights array
    }
    this.model.setWeights(mutatedWeights); //sets the weights of the model to the mutates weights
  }

  predict(inputs) {
    const xs = tf.tensor2d([inputs]);
    const ys = this.model.predict(xs);
    const outputs = ys.dataSync();
    return outputs;
  }

  createModel() {
    const model = tf.sequential();
    const hidden = tf.layers.dense({ //8 hidden layers
      units: this.hiddenNodes,
      inputShape: [this.inputNodes],
      activation: 'sigmoid' //sqishes all values to between 0,1
    });
    model.add(hidden);
    const output = tf.layers.dense({ //2 output layers (jump or no jump)
      units: this.outputNodes,
      activation: 'softmax' //same as sigmoid but also makes sum of all values between 0,1 so that they can be used as probabilities
    });
    model.add(output);
    return model;
  }
}
