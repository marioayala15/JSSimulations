
let system;
let canvas;
let startButton;
let finishButton;
let resetButton;
let slider;
let input;
let running;


function setup() {
  canvas = createCanvas(500,500);
  canvas.parent('sketch-holder');
  frameRate(120);
  initButtons();
}


function initButtons(){
  startButton = createButton("Start");
  startButton.parent('sketch-holder');
  startButton.position(610,70);
  startButton.size(70,70);
  startButton.style('background-color',"green");
  startButton.style('color',"white");
  finishButton = createButton("Terminate");
  finishButton.parent('sketch-holder');
  finishButton.position(610,170);
  finishButton.size(70,70);
  finishButton.style('background-color',"red");
  finishButton.style('color',"white");
  headslider = createP("Size of particles: ");
  headslider.parent('sketch-holder');
  headslider.position(610,250);
  sizepartbox = createInput("10");
  sizepartbox.parent('sketch-holder');
  sizepartbox.position(750,265);
  sizepartbox.size(30);
  slider = createSlider(1,30,10,1);
  slider.parent('sketch-holder');
  slider.position(610,300);
  slider.input(sliderChange);
  buttonSubmitSize = createButton('Submit');
  buttonSubmitSize.parent('sketch-holder');
  buttonSubmitSize.position(sizepartbox.x + sizepartbox.width+10, sizepartbox.y);
  buttonSubmitSize.mouseClicked(updateSliderValue);
  headsliderparti=createP("Number of particles: ");
  headsliderparti.parent('sketch-holder');
  headsliderparti.position(610,320);
  numbpartbox = createInput("10");
  numbpartbox.parent('sketch-holder');
  numbpartbox.position(750,335);
  numbpartbox.size(30);
  sliderparti = createSlider(1,1000,10,5);
  sliderparti.parent('sketch-holder');
  sliderparti.position(610,370);
  sliderparti.input(sliderPartiChange);
  buttonSubmitNum = createButton('Submit');
  buttonSubmitNum.parent('sketch-holder');
  buttonSubmitNum.position(numbpartbox.x + numbpartbox.width+10, numbpartbox.y);
  buttonSubmitNum.mouseClicked(updateSliderPartiValue);

  headslideralpha=createP("Alpha value: ");
  headslideralpha.parent('sketch-holder');
  headslideralpha.position(610,390);
  alphabox = createInput("1");
  alphabox.parent('sketch-holder');
  alphabox.position(750,405);
  alphabox.size(30);
  slideralpha = createSlider(1,50,1,1);
  slideralpha.parent('sketch-holder');
  slideralpha.position(610,440);
  slideralpha.input(sliderAlphaChange);
  buttonSubmitalpha= createButton('Submit');
  buttonSubmitalpha.parent('sketch-holder');
  buttonSubmitalpha.position(alphabox.x + alphabox.width+10, alphabox.y);
  buttonSubmitalpha.mouseClicked(updateSliderAlphaValue);

  timeDisplayer = createP("time = 0 ")
  timeDisplayer.position(10,0);
  timeDisplayer.parent("sketch-holder");
  timeDisplayer.style("color","white");
  timeDisplayer.style("font-size","1.5em");
  startButton.mouseClicked(comenzar);
  finishButton.mouseClicked(parar);
}

function sliderChange(){
  sizepartbox.value(slider.value());
}

function sliderPartiChange(){
  numbpartbox.value(sliderparti.value());
}

function sliderAlphaChange(){
  alphabox.value(slideralpha.value());
}

function updateSliderValue(){
  //if the textbox is updated, update the slider
  slider.value(sizepartbox.value());
}

function updateSliderPartiValue(){
  //if the textbox is updated, update the slider
  sliderparti.value(numbpartbox.value());
}

function updateSliderAlphaValue(){
  //if the textbox is updated, update the slider
  slideralpha.value(alphabox.value());
}

function comenzar(){
  running= true;
  system = new ParticleSystem(slider.value(),sliderparti.value(),slideralpha.value());
}

function parar(){
  running=false;
}




function draw() {
  background(51);
  if (running){
    system.run(slider.value(),sliderparti.value(),slideralpha.value());
    timeDisplayer.html('time = '+system.totalTime);
  }
}


function mousePressed() {
  noLoop();
}

function mouseReleased() {
  loop();
}



// A simple Particle class
let Particle = function(radius,x,y) {
  this.x = x;
  this.y = y;
  this.radius = radius;
};

Particle.prototype.run = function() {
  this.move();
  this.display();
};

// Method to move particle
Particle.prototype.move = function(){
  this.x += this.radius*random([-1,1]);
  if (this.x > canvas.width ){
    this.x = this.radius;
  }
  if (this.x < 0){
    this.x = canvas.width-this.radius;
  }
};

// Method to display
Particle.prototype.display = function() {
  stroke(200);
  strokeWeight(2);
  fill(127);
  ellipse(this.x, this.y, this.radius, this.radius);
};


let ParticleSystem = function(r,numbParticles,alpha) {
  this.particles = [];
  this.totalTime = 0;
  this.alpha = alpha;
  for(let i=0; i< numbParticles; i++){
      // var xposition = random([100,i*r]);
      var xposition = 2*r*floor((canvas.width/(2*r))*random());
      // var xposition = canvas.width/2;
      var yposition =canvas.height-r;
      p = new Particle(r,xposition,yposition);
      var coincidentalParticles = [];

      for (var j=0; j< i; j++){
        var particlej = this.particles[j];
        if(particlej.x==p.x){
          coincidentalParticles.push(particlej);
        }
      }

      if(coincidentalParticles && coincidentalParticles.length){
        for(var j=0; j<coincidentalParticles.length; j++){
          coincidentalParticles[j].y=canvas.height-r-(j)*r;
        }
      }
      this.particles.push(p);
  };
};

ParticleSystem.prototype.run = function(r,numbParticles,alpha) {
  var index = floor(numbParticles*random()); //minimum of exponential distributed r.v. with the same parameter
	var p = this.particles[index];
	var oldxposition = p.x;
	var oldyposition = p.y;
  p.move();
  this.totalTime += randomExp(this.alpha);

  var oldHouseMates = [];
  var newHouseMates = [];

  for (var i=0; i< numbParticles; i++){
    if(i!=index){
      var potentialHousemate = this.particles[i];
      if(potentialHousemate.x === p.x){
          newHouseMates.push(potentialHousemate);
      }

      if(potentialHousemate.x == oldxposition){
         oldHouseMates.push(potentialHousemate);
      }
  }

  if(newHouseMates && newHouseMates.length){
    for(j=0; j< newHouseMates.length; j++){
      var newHouseMate = newHouseMates[j];
      newHouseMate.y = canvas.height-r-j*r;
    }
    p.y = canvas.height-r-newHouseMates.length*r;
  }

  if(!Array.isArray(newHouseMates) || !newHouseMates.length){
    p.y = canvas.height-r;
  }

  if(oldHouseMates && oldHouseMates.length){
    for(var j=0; j< oldHouseMates.length; j++){
      var oldHouseMate = oldHouseMates[j];
      oldHouseMate.y = canvas.height-r-j*r;
    }
  }
 }

 for (let i = this.particles.length-1; i >= 0; i--) {
    let p2 = this.particles[i];
    p2.display();
  }
};
