var sketch_one = function(s){

   s.setup =function(){
     s.canvas = s.createCanvas(500,500);
     s.canvas.parent('sketch-holder');
     s.initButtons();
  }

  s.initButtons=function(){
    s.startButton = s.createButton("Start");
    s.startButton.parent('sketch-holder');
    s.startButton.position(610,70);
    s.startButton.size(70,70);
    s.startButton.style('background-color',"green");
    s.startButton.style('color',"white");
    s.finishButton = s.createButton("Terminate");
    s.finishButton.parent('sketch-holder');
    s.finishButton.position(610,170);
    s.finishButton.size(70,70);
    s.finishButton.style('background-color',"red");
    s.finishButton.style('color',"white");

    s.headslider = s.createP("Geometry: ");
    s.headslider.parent('sketch-holder');
    s.headslider.position(610,250);
    s.geombox = s.createInput("Circle");
    s.geombox.parent('sketch-holder');
    s.geombox.position(750,265);
    s.geombox.size(80);
    s.slider = s.createSlider(1,2,1,1);
    s.slider.parent('sketch-holder');
    s.slider.position(610,300);
    s.slider.input(s.sliderChange);
    s.headsliderparti=s.createP("Number of particles: ");
    s.headsliderparti.parent('sketch-holder');
    s.headsliderparti.position(610,320);
    s.numbpartbox = s.createInput("10");
    s.numbpartbox.parent('sketch-holder');
    s.numbpartbox.position(750,335);
    s.numbpartbox.size(30);
    s.sliderparti = s.createSlider(1,1000,10,5);
    s.sliderparti.parent('sketch-holder');
    s.sliderparti.position(610,370);
    s.sliderparti.input(s.sliderPartiChange);
    s.buttonSubmitNum = s.createButton('Submit');
    s.buttonSubmitNum.parent('sketch-holder');
    s.buttonSubmitNum.position(s.numbpartbox.x + s.numbpartbox.width+10, s.numbpartbox.y);
    s.buttonSubmitNum.mouseClicked(s.updateSliderPartiValue);
    s.headslideralpha=s.createP("Alpha value: ");
    s.headslideralpha.parent('sketch-holder');
    s.headslideralpha.position(610,390);
    s.alphabox = s.createInput("1");
    s.alphabox.parent('sketch-holder');
    s.alphabox.position(750,405);
    s.alphabox.size(50);
    s.slideralpha = s.createSlider(0.001,10,1,0.001);
    s.slideralpha.parent('sketch-holder');
    s.slideralpha.position(610,440);
    s.slideralpha.input(s.sliderAlphaChange);
    s.buttonSubmitalpha= s.createButton('Submit');
    s.buttonSubmitalpha.parent('sketch-holder');
    s.buttonSubmitalpha.position(s.alphabox.x + s.alphabox.width+10, s.alphabox.y);
    s.buttonSubmitalpha.mouseClicked(s.updateSliderAlphaValue);
    s.timeDisplayer = s.createP("time = 0 ")
    s.timeDisplayer.position(10,0);
    s.timeDisplayer.parent('sketch-holder');
    s.timeDisplayer.style("color","white");
    s.timeDisplayer.style("font-size","1.5em");
    s.startButton.mouseClicked(s.comenzar);
    s.finishButton.mouseClicked(s.parar);
  }

    s.sliderChange=function(){
      if(s.slider.value()==1){
        s.geombox.value("Circle");
      }
      if(s.slider.value()==2){
        s.geombox.value("Infinite lattice");
      }
  }

    s.sliderPartiChange=function(){
      s.numbpartbox.value(s.sliderparti.value());
  }

    s.sliderAlphaChange=function(){
      s.alphabox.value(s.slideralpha.value());
  }


  s.updateSliderPartiValue=function(){
    //if the textbox is updated, update the slider
    s.sliderparti.value(s.numbpartbox.value());
  }

   s.updateSliderAlphaValue=function(){
    //if the textbox is updated, update the slider
    s.slideralpha.value(s.alphabox.value());
  }

   s.comenzar=function(){
    s.running= true;
    s.system = new ParticleSystem(10,s.sliderparti.value(),s.slideralpha.value(),s.slider.value());
  }

  s.parar=function(){
    s.running=false;
  }



  s.draw= function() {
      s.background(51);
      if (s.running){
        s.system.run(10,s.sliderparti.value(),s.slideralpha.value(),s.slider.value());
        s.timeDisplayer.html('time = '+s.system.totalTime);
    }
  }

  // A simple Particle class
  let Particle = function(radius,x,y,geom) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.geometry = geom;  // either 1 or 2 , 1 meaning toroidal and 2 infinite lattice
  };

  Particle.prototype.run = function() {
    this.move();
    this.display();
  };

  // Method to move particle
  Particle.prototype.move = function(){
    if(this.geometry ==1){
      this.x += this.radius*s.random([-1,1]);
      if (this.x > s.canvas.width ){
        this.x = this.radius;
      }
      if (this.x < 0){
        this.x = s.canvas.width-this.radius;
      }
    }

    if(this.geometry==2){
        this.x += this.radius*s.random([-1,1]);
    }
  };

  // Method to display
  Particle.prototype.display = function() {
    s.stroke(200);
    s.strokeWeight(2);
    s.fill(127);
    s.ellipse(this.x, this.y, this.radius, this.radius);
  };


  let ParticleSystem = function(r,numbParticles,alpha,geom) {
    this.particles = [];
    this.totalTime = 0;
    this.alpha = alpha;
    for(let i=0; i< numbParticles; i++){
        // var xposition = random([100,i*r]);
        var xposition = 2*r*s.floor((s.canvas.width/(2*r))*s.random());
        // var xposition = canvas.width/2;
        var yposition =s.canvas.height-r;
        p = new Particle(r,xposition,yposition,geom);
        var coincidentalParticles = [];

        for (var j=0; j< i; j++){
          var particlej = this.particles[j];
          if(particlej.x==p.x){
            coincidentalParticles.push(particlej);
          }
        }

        if(coincidentalParticles && coincidentalParticles.length){
          for(var j=0; j<coincidentalParticles.length; j++){
            coincidentalParticles[j].y=s.canvas.height-r-(j)*r;
          }
        }
        this.particles.push(p);
    };
  };

  ParticleSystem.prototype.run = function(r,numbParticles,alpha,geom) {
    var index = s.floor(numbParticles*s.random()); //minimum of exponential distributed r.v. with the same parameter
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
        newHouseMate.y = s.canvas.height-r-j*r;
      }
      p.y = s.canvas.height-r-newHouseMates.length*r;
    }

    if(!Array.isArray(newHouseMates) || !newHouseMates.length){
      p.y = s.canvas.height-r;
    }

    if(oldHouseMates && oldHouseMates.length){
      for(var j=0; j< oldHouseMates.length; j++){
        var oldHouseMate = oldHouseMates[j];
        oldHouseMate.y = s.canvas.height-r-j*r;
      }
    }
   }

   for (let i = this.particles.length-1; i >= 0; i--) {
      let p2 = this.particles[i];
      p2.display();
    }
  };

  function randomExp(lambda) {
    return (-1/lambda)*Math.log(1-Math.random());
  }

};

//////////////////////////

var sketch_two = function(s){

   s.setup =function(){
     s.canvas = s.createCanvas(500,500);
     s.canvas.parent('sketch-holder-two');
     s.initButtons();
  }

  s.initButtons=function(){
    s.startButton = s.createButton("Start");
    s.startButton.parent('sketch-holder-two');
    s.startButton.position(610,50);
    s.startButton.size(50,50);
    s.startButton.style('background-color',"green");
    s.startButton.style('color',"white");
    s.finishButton = s.createButton("Finish");
    s.finishButton.parent('sketch-holder-two');
    s.finishButton.position(610,120);
    s.finishButton.size(50,50);
    s.finishButton.style('background-color',"red");
    s.finishButton.style('color',"white");

    s.headsliderdist = s.createP("Initial distribution: ");
    s.headsliderdist.parent('sketch-holder-two');
    s.headsliderdist.position(610,200);
    s.distbox = s.createInput("Uniform");
    s.distbox.parent('sketch-holder-two');
    s.distbox.position(750,215);
    s.distbox.size(100);
    s.sliderdist = s.createSlider(1,2,1,1);
    s.sliderdist.parent('sketch-holder-two');
    s.sliderdist.position(610,230);
    s.sliderdist.input(s.sliderdistChange);

    s.headslider = s.createP("Geometry: ");
    s.headslider.parent('sketch-holder-two');
    s.headslider.position(610,250);
    s.geombox = s.createInput("Circle");
    s.geombox.parent('sketch-holder-two');
    s.geombox.position(750,265);
    s.geombox.size(80);
    s.slider = s.createSlider(1,2,1,1);
    s.slider.parent('sketch-holder-two');
    s.slider.position(610,300);
    s.slider.input(s.sliderChange);

    s.headsliderparti=s.createP("Number of particles: ");
    s.headsliderparti.parent('sketch-holder-two');
    s.headsliderparti.position(610,320);
    s.numbpartbox = s.createInput("10");
    s.numbpartbox.parent('sketch-holder-two');
    s.numbpartbox.position(750,335);
    s.numbpartbox.size(30);
    s.sliderparti = s.createSlider(1,1000,10,5);
    s.sliderparti.parent('sketch-holder-two');
    s.sliderparti.position(610,370);
    s.sliderparti.input(s.sliderPartiChange);
    s.buttonSubmitNum = s.createButton('Submit');
    s.buttonSubmitNum.parent('sketch-holder-two');
    s.buttonSubmitNum.position(s.numbpartbox.x + s.numbpartbox.width+10, s.numbpartbox.y);
    s.buttonSubmitNum.mouseClicked(s.updateSliderPartiValue);
    s.headslideralpha=s.createP("Alpha value: ");
    s.headslideralpha.parent('sketch-holder-two');
    s.headslideralpha.position(610,390);
    s.alphabox = s.createInput("1");
    s.alphabox.parent('sketch-holder-two');
    s.alphabox.position(750,405);
    s.alphabox.size(50);
    s.slideralpha = s.createSlider(0.001,10,1,0.001);
    s.slideralpha.parent('sketch-holder-two');
    s.slideralpha.position(610,440);
    s.slideralpha.input(s.sliderAlphaChange);
    s.buttonSubmitalpha= s.createButton('Submit');
    s.buttonSubmitalpha.parent('sketch-holder-two');
    s.buttonSubmitalpha.position(s.alphabox.x + s.alphabox.width+10, s.alphabox.y);
    s.buttonSubmitalpha.mouseClicked(s.updateSliderAlphaValue);
    s.timeDisplayer = s.createP("time = 0 ")
    s.timeDisplayer.position(10,0);
    s.timeDisplayer.parent('sketch-holder-two');
    s.timeDisplayer.style("color","white");
    s.timeDisplayer.style("font-size","1.5em");
    s.startButton.mouseClicked(s.comenzar);
    s.finishButton.mouseClicked(s.parar);
  }

    s.sliderChange=function(){
      if(s.slider.value()==1){
        s.geombox.value("Circle");
      }
      if(s.slider.value()==2){
        s.geombox.value("Infinite lattice");
      }
  }

  s.sliderdistChange=function(){
    if(s.sliderdist.value()==1){
      s.distbox.value("Uniform");
    }
    if(s.sliderdist.value()==2){
      s.distbox.value("Dirac at center");
    }
}

    s.sliderPartiChange=function(){
      s.numbpartbox.value(s.sliderparti.value());
  }

    s.sliderAlphaChange=function(){
      s.alphabox.value(s.slideralpha.value());
  }


  s.updateSliderPartiValue=function(){
    //if the textbox is updated, update the slider
    s.sliderparti.value(s.numbpartbox.value());
  }

   s.updateSliderAlphaValue=function(){
    //if the textbox is updated, update the slider
    s.slideralpha.value(s.alphabox.value());
  }

   s.comenzar=function(){
    s.running= true;
    s.system = new ParticleSystem(10,s.sliderparti.value(),s.slideralpha.value(),s.slider.value(),s.sliderdist.value());
  }

  s.parar=function(){
    s.running=false;
  }



  s.draw= function() {
      s.background(51);
      if (s.running){
        s.system.run(10,s.sliderparti.value(),s.slideralpha.value(),s.slider.value(),s.sliderdist.value());
        s.timeDisplayer.html('time = '+s.system.totalTime);
    }
  }

  // A simple Particle class
  let Particle = function(radius,x,y,geom) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.geometry = geom;  // either 1 or 2 , 1 meaning toroidal and 2 infinite lattice
  };

  Particle.prototype.run = function() {
    this.move();
    this.display();
  };

  // Method to move particle
  Particle.prototype.move = function(){
    if(this.geometry ==1){
      this.x += this.radius*s.random([-1,1]);
      if (this.x > s.canvas.width ){
        this.x = this.radius;
      }
      if (this.x < 0){
        this.x = s.canvas.width-this.radius;
      }
    }

    if(this.geometry==2){
        this.x += this.radius*s.random([-1,1]);
    }
  };

  // Method to display
  Particle.prototype.display = function() {
    s.stroke(200);
    s.strokeWeight(2);
    s.fill(127);
    s.ellipse(this.x, this.y, this.radius, this.radius);
  };


  let ParticleSystem = function(r,numbParticles,alpha,geom,measu) {
    this.particles = [];
    this.totalTime = 0;
    this.alpha = alpha;
    for(let i=0; i< numbParticles; i++){
        // var xposition = random([100,i*r]);
        if(measu==1){
          var xposition = 2*r*s.floor((s.canvas.width/(2*r))*s.random());  //uniformly distributed in visible screen
        }
        if(measu==2){
          var xposition = s.canvas.width/2;  //concentraded at the center of the screen
        }
        var yposition =s.canvas.height-r;
        p = new Particle(r,xposition,yposition,geom);
        var coincidentalParticles = [];

        for (var j=0; j< i; j++){
          var particlej = this.particles[j];
          if(particlej.x==p.x){
            coincidentalParticles.push(particlej);
          }
        }

        if(coincidentalParticles && coincidentalParticles.length){
          for(var j=0; j<coincidentalParticles.length; j++){
            coincidentalParticles[j].y=s.canvas.height-r-(j)*r;
          }
        }
        this.particles.push(p);
    };
  };

  ParticleSystem.prototype.run = function(r,numbParticles,alpha,geom,measu) {
    var index = s.floor(numbParticles*s.random()); //minimum of exponential distributed r.v. with the same parameter
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
        newHouseMate.y = s.canvas.height-r-j*r;
      }
      p.y = s.canvas.height-r-newHouseMates.length*r;
    }

    if(!Array.isArray(newHouseMates) || !newHouseMates.length){
      p.y = s.canvas.height-r;
    }

    if(oldHouseMates && oldHouseMates.length){
      for(var j=0; j< oldHouseMates.length; j++){
        var oldHouseMate = oldHouseMates[j];
        oldHouseMate.y = s.canvas.height-r-j*r;
      }
    }
   }

   for (let i = this.particles.length-1; i >= 0; i--) {
      let p2 = this.particles[i];
      p2.display();
    }
  };

  function randomExp(lambda) {
    return (-1/lambda)*Math.log(1-Math.random());
  }

};
//////////////////////////

var sketch_three = function(s){

   s.setup =function(){
     s.canvas = s.createCanvas(500,500);
     s.canvas.parent('sketch-holder-three');
     s.initButtons();
  }

  s.initButtons=function(){
    s.startButton = s.createButton("Start");
    s.startButton.parent('sketch-holder-three');
    s.startButton.position(610,50);
    s.startButton.size(50,50);
    s.startButton.style('background-color',"green");
    s.startButton.style('color',"white");
    s.finishButton = s.createButton("Finish");
    s.finishButton.parent('sketch-holder-three');
    s.finishButton.position(610,120);
    s.finishButton.size(50,50);
    s.finishButton.style('background-color',"red");
    s.finishButton.style('color',"white");

    s.headsliderAssym = s.createP("Assymetry: ");
    s.headsliderAssym.parent('sketch-holder-three');
    s.headsliderAssym.position(610,200);
    s.assymbox = s.createInput("0.5");
    s.assymbox.parent('sketch-holder-three');
    s.assymbox.position(750,215);
    s.assymbox.size(50);
    s.sliderAssym = s.createSlider(0,1,0.5,0.1);
    s.sliderAssym.parent('sketch-holder-three');
    s.sliderAssym.position(610,230);
    s.sliderAssym.input(s.sliderAssymChange);

    s.headslider = s.createP("Geometry: ");
    s.headslider.parent('sketch-holder-three');
    s.headslider.position(610,250);
    s.geombox = s.createInput("Circle");
    s.geombox.parent('sketch-holder-three');
    s.geombox.position(750,265);
    s.geombox.size(80);
    s.slider = s.createSlider(1,2,1,1);
    s.slider.parent('sketch-holder-three');
    s.slider.position(610,300);
    s.slider.input(s.sliderChange);

    s.headsliderparti=s.createP("Number of particles: ");
    s.headsliderparti.parent('sketch-holder-three');
    s.headsliderparti.position(610,320);
    s.numbpartbox = s.createInput("10");
    s.numbpartbox.parent('sketch-holder-three');
    s.numbpartbox.position(750,335);
    s.numbpartbox.size(30);
    s.sliderparti = s.createSlider(1,1000,10,5);
    s.sliderparti.parent('sketch-holder-three');
    s.sliderparti.position(610,370);
    s.sliderparti.input(s.sliderPartiChange);
    s.buttonSubmitNum = s.createButton('Submit');
    s.buttonSubmitNum.parent('sketch-holder-three');
    s.buttonSubmitNum.position(s.numbpartbox.x + s.numbpartbox.width+10, s.numbpartbox.y);
    s.buttonSubmitNum.mouseClicked(s.updateSliderPartiValue);
    s.headslideralpha=s.createP("Alpha value: ");
    s.headslideralpha.parent('sketch-holder-three');
    s.headslideralpha.position(610,390);
    s.alphabox = s.createInput("1");
    s.alphabox.parent('sketch-holder-three');
    s.alphabox.position(750,405);
    s.alphabox.size(50);
    s.slideralpha = s.createSlider(0.001,10,1,0.001);
    s.slideralpha.parent('sketch-holder-three');
    s.slideralpha.position(610,440);
    s.slideralpha.input(s.sliderAlphaChange);
    s.buttonSubmitalpha= s.createButton('Submit');
    s.buttonSubmitalpha.parent('sketch-holder-three');
    s.buttonSubmitalpha.position(s.alphabox.x + s.alphabox.width+10, s.alphabox.y);
    s.buttonSubmitalpha.mouseClicked(s.updateSliderAlphaValue);
    s.timeDisplayer = s.createP("time = 0 ")
    s.timeDisplayer.position(10,0);
    s.timeDisplayer.parent('sketch-holder-three');
    s.timeDisplayer.style("color","white");
    s.timeDisplayer.style("font-size","1.5em");
    s.startButton.mouseClicked(s.comenzar);
    s.finishButton.mouseClicked(s.parar);
  }

    s.sliderChange=function(){
      if(s.slider.value()==1){
        s.geombox.value("Circle");
      }
      if(s.slider.value()==2){
        s.geombox.value("Infinite lattice");
      }
  }

  s.sliderAssymChange=function(){
    s.assymbox.value(s.sliderAssym.value());
}

    s.sliderPartiChange=function(){
      s.numbpartbox.value(s.sliderparti.value());
  }

    s.sliderAlphaChange=function(){
      s.alphabox.value(s.slideralpha.value());
  }


  s.updateSliderPartiValue=function(){
    //if the textbox is updated, update the slider
    s.sliderparti.value(s.numbpartbox.value());
  }

   s.updateSliderAlphaValue=function(){
    //if the textbox is updated, update the slider
    s.slideralpha.value(s.alphabox.value());
  }

   s.comenzar=function(){
    s.running= true;
    s.system = new ParticleSystem(10,s.sliderparti.value(),s.slideralpha.value(),s.slider.value(),s.sliderAssym.value());
  }

  s.parar=function(){
    s.running=false;
  }



  s.draw= function() {
      s.background(51);
      if (s.running){
        s.system.run(10,s.sliderparti.value(),s.slideralpha.value(),s.slider.value(),s.sliderAssym.value());
        s.timeDisplayer.html('time = '+s.system.totalTime);
    }
  }

  // A simple Particle class
  let Particle = function(radius,x,y,geom,assym) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.geometry = geom;  // either 1 or 2 , 1 meaning toroidal and 2 infinite lattice
    this.assym = assym;   // assymetry
  };

  Particle.prototype.run = function() {
    this.move();
    this.display();
  };

  // Method to move particle
  Particle.prototype.move = function(){
    let q=s.random();
    if(q<=this.assym){
      var choice =1;
    }
    if(q>this.assym){
      var choice=-1;
    }
    if(this.geometry ==1){
      this.x += this.radius*choice;
      if (this.x > s.canvas.width ){
        this.x = this.radius;
      }
      if (this.x < 0){
        this.x = s.canvas.width-this.radius;
      }
    }

    if(this.geometry==2){
        this.x += this.radius*choice;
    }
  };

  // Method to display
  Particle.prototype.display = function() {
    s.stroke(200);
    s.strokeWeight(2);
    s.fill(127);
    s.ellipse(this.x, this.y, this.radius, this.radius);
  };


  let ParticleSystem = function(r,numbParticles,alpha,geom,assym) {
    this.particles = [];
    this.totalTime = 0;
    this.alpha = alpha;
    for(let i=0; i< numbParticles; i++){
        // var xposition = random([100,i*r]);

        var xposition = 2*r*s.floor((s.canvas.width/(2*r))*s.random());  //uniformly distributed in visible screen
        var yposition =s.canvas.height-r;
        p = new Particle(r,xposition,yposition,geom,assym);
        var coincidentalParticles = [];

        for (var j=0; j< i; j++){
          var particlej = this.particles[j];
          if(particlej.x==p.x){
            coincidentalParticles.push(particlej);
          }
        }

        if(coincidentalParticles && coincidentalParticles.length){
          for(var j=0; j<coincidentalParticles.length; j++){
            coincidentalParticles[j].y=s.canvas.height-r-(j)*r;
          }
        }
        this.particles.push(p);
    };
  };

  ParticleSystem.prototype.run = function(r,numbParticles,alpha,geom,assym) {
    var index = s.floor(numbParticles*s.random()); //minimum of exponential distributed r.v. with the same parameter
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
        newHouseMate.y = s.canvas.height-r-j*r;
      }
      p.y = s.canvas.height-r-newHouseMates.length*r;
    }

    if(!Array.isArray(newHouseMates) || !newHouseMates.length){
      p.y = s.canvas.height-r;
    }

    if(oldHouseMates && oldHouseMates.length){
      for(var j=0; j< oldHouseMates.length; j++){
        var oldHouseMate = oldHouseMates[j];
        oldHouseMate.y = s.canvas.height-r-j*r;
      }
    }
   }

   for (let i = this.particles.length-1; i >= 0; i--) {
      let p2 = this.particles[i];
      p2.display();
    }
  };

  function randomExp(lambda) {
    return (-1/lambda)*Math.log(1-Math.random());
  }

};
//////////////////////

var sketch_four= function(s){

   s.setup =function(){
     s.canvas = s.createCanvas(500,500);
     s.canvas.parent('sketch-holder-four');
     s.initButtons();
  }

  s.initButtons=function(){
    s.startButton = s.createButton("Start");
    s.startButton.parent('sketch-holder-four');
    s.startButton.position(610,70);
    s.startButton.size(70,70);
    s.startButton.style('background-color',"green");
    s.startButton.style('color',"white");
    s.finishButton = s.createButton("Terminate");
    s.finishButton.parent('sketch-holder-four');
    s.finishButton.position(610,170);
    s.finishButton.size(70,70);
    s.finishButton.style('background-color',"red");
    s.finishButton.style('color',"white");
    s.headslider = s.createP("Geometry: ");
    s.headslider.parent('sketch-holder-four');
    s.headslider.position(610,250);
    s.geombox = s.createInput("Circle");
    s.geombox.parent('sketch-holder-four');
    s.geombox.position(750,265);
    s.geombox.size(80);
    s.slider = s.createSlider(1,2,1,1);
    s.slider.parent('sketch-holder-four');
    s.slider.position(610,300);
    s.slider.input(s.sliderChange);
    s.headsliderparti=s.createP("Number of particles: ");
    s.headsliderparti.parent('sketch-holder-four');
    s.headsliderparti.position(610,320);
    s.numbpartbox = s.createInput("10");
    s.numbpartbox.parent('sketch-holder-four');
    s.numbpartbox.position(750,335);
    s.numbpartbox.size(30);
    s.sliderparti = s.createSlider(1,1000,10,5);
    s.sliderparti.parent('sketch-holder-four');
    s.sliderparti.position(610,370);
    s.sliderparti.input(s.sliderPartiChange);
    s.buttonSubmitNum = s.createButton('Submit');
    s.buttonSubmitNum.parent('sketch-holder-four');
    s.buttonSubmitNum.position(s.numbpartbox.x + s.numbpartbox.width+10, s.numbpartbox.y);
    s.buttonSubmitNum.mouseClicked(s.updateSliderPartiValue);
    s.headslideralpha=s.createP("Alpha value: ");
    s.headslideralpha.parent('sketch-holder-four');
    s.headslideralpha.position(610,390);
    s.alphabox = s.createInput("1");
    s.alphabox.parent('sketch-holder-four');
    s.alphabox.position(750,405);
    s.alphabox.size(50);
    s.slideralpha = s.createSlider(0.001,10,1,0.001);
    s.slideralpha.parent('sketch-holder-four');
    s.slideralpha.position(610,440);
    s.slideralpha.input(s.sliderAlphaChange);
    s.buttonSubmitalpha= s.createButton('Submit');
    s.buttonSubmitalpha.parent('sketch-holder-four');
    s.buttonSubmitalpha.position(s.alphabox.x + s.alphabox.width+10, s.alphabox.y);
    s.buttonSubmitalpha.mouseClicked(s.updateSliderAlphaValue);
    s.timeDisplayer = s.createP("time = 0 ")
    s.timeDisplayer.position(10,0);
    s.timeDisplayer.parent('sketch-holder-four');
    s.timeDisplayer.style("color","white");
    s.timeDisplayer.style("font-size","1.5em");
    s.startButton.mouseClicked(s.comenzar);
    s.finishButton.mouseClicked(s.parar);
  }

    s.sliderChange=function(){
      if(s.slider.value()==1){
        s.geombox.value("Circle");
      }
      if(s.slider.value()==2){
        s.geombox.value("Infinite lattice");
      }
  }

    s.sliderPartiChange=function(){
      s.numbpartbox.value(s.sliderparti.value());
  }

    s.sliderAlphaChange=function(){
      s.alphabox.value(s.slideralpha.value());
  }


  s.updateSliderPartiValue=function(){
    //if the textbox is updated, update the slider
    s.sliderparti.value(s.numbpartbox.value());
  }

   s.updateSliderAlphaValue=function(){
    //if the textbox is updated, update the slider
    s.slideralpha.value(s.alphabox.value());
  }

   s.comenzar=function(){
    s.running= true;
    s.system = new ParticleSystem(10,s.sliderparti.value(),s.slideralpha.value(),s.slider.value());
  }

  s.parar=function(){
    s.running=false;
  }



  s.draw= function() {
      s.background(51);
      if (s.running){
        s.system.run(10,s.sliderparti.value(),s.slideralpha.value(),s.slider.value());
        s.timeDisplayer.html('time = '+s.system.totalTime);
    }
  }

  // A simple Particle class
  let Particle = function(radius,x,y,geom) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.geometry = geom;  // either 1 or 2 , 1 meaning toroidal and 2 infinite lattice
  };

  Particle.prototype.run = function() {
    this.move();
    this.display();
  };

  // Method to move particle
  Particle.prototype.move = function(){
    if(this.geometry ==1){
      this.x += this.radius*s.random([-1,1]);
      if (this.x > s.canvas.width ){
        this.x = this.radius;
      }
      if (this.x < 0){
        this.x = s.canvas.width-this.radius;
      }
    }

    if(this.geometry==2){
        this.x += this.radius*s.random([-1,1]);
    }
  };

  // Method to display
  Particle.prototype.display = function() {
    s.stroke(200);
    s.strokeWeight(2);
    s.fill(127);
    s.ellipse(this.x, this.y, this.radius, this.radius);
  };


  let ParticleSystem = function(r,numbParticles,alpha,geom) {
    this.particles = [];
    this.totalTime = 0;
    this.alpha = alpha;
    for(let i=0; i< numbParticles; i++){
        // var xposition = random([100,i*r]);
        var xposition = 2*r*s.floor((s.canvas.width/(2*r))*s.random());
        // var xposition = canvas.width/2;
        var yposition =s.canvas.height-r;
        p = new Particle(r,xposition,yposition,geom);
        var coincidentalParticles = [];

        for (var j=0; j< i; j++){
          var particlej = this.particles[j];
          if(particlej.x==p.x){
            coincidentalParticles.push(particlej);
          }
        }

        if(coincidentalParticles && coincidentalParticles.length){
          for(var j=0; j<coincidentalParticles.length; j++){
            coincidentalParticles[j].y=s.canvas.height-r-(j)*r;
          }
        }
        this.particles.push(p);
    };
  };

  ParticleSystem.prototype.run = function(r,numbParticles,alpha,geom) {
    var index = s.floor(numbParticles*s.random()); //minimum of exponential distributed r.v. with the same parameter
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
        newHouseMate.y = s.canvas.height-r-j*r;
      }
      p.y = s.canvas.height-r-newHouseMates.length*r;
    }

    if(!Array.isArray(newHouseMates) || !newHouseMates.length){
      p.y = s.canvas.height-r;
    }

    if(oldHouseMates && oldHouseMates.length){
      for(var j=0; j< oldHouseMates.length; j++){
        var oldHouseMate = oldHouseMates[j];
        oldHouseMate.y = s.canvas.height-r-j*r;
      }
    }
   }

   for (let i = this.particles.length-1; i >= 0; i--) {
      let p2 = this.particles[i];
      p2.display();
    }
  };

  function randomExp(lambda) {
    return (-1/lambda)*Math.log(1-Math.random());
  }

};

var myp5_one = new p5(sketch_one);
var myp5_two = new p5(sketch_two);
var myp5_three = new p5(sketch_three);
// var myp5_four = new p5(sketch_four);
