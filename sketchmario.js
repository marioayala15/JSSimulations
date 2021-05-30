function makeSketch(id) {
       
    let sketch = function(s){

        let div;
    
        s.setup =function(){
        div=s.canvas.parentElement;
        s.canvas = s.createCanvas(div.clientWidth, div.clientHeight);
        s.initButtons();
        }
    
        s.initButtons=function(){
        s.startButton = s.createButton("Start");
        //s.startButton.position(610,70);
        s.startButton.size(70,70);
        s.startButton.style('background-color',"green");
        s.startButton.style('color',"white");
        s.finishButton = s.createButton("Terminate");
        //s.finishButton.position(610,170);
        s.finishButton.size(70,70);
        s.finishButton.style('background-color',"red");
        s.finishButton.style('color',"white");
    
        s.headslider = s.createP("Geometry: ");
        //s.headslider.position(610,250);
        s.geombox = s.createInput("Circle");
        //s.geombox.position(750,265);
        s.geombox.size(80);
        s.slider = s.createSlider(1,2,1,1);
        //s.slider.position(610,300);
        s.slider.input(s.sliderChange);
        s.headsliderparti=s.createP("Number of particles: ");
        //s.headsliderparti.position(610,320);
        s.numbpartbox = s.createInput("10");
        //s.numbpartbox.position(750,335);
        s.numbpartbox.size(30);
        s.sliderparti = s.createSlider(1,1000,10,5);
        //s.sliderparti.position(610,370);
        s.sliderparti.input(s.sliderPartiChange);
        s.buttonSubmitNum = s.createButton('Submit');
        //s.buttonSubmitNum.position(s.numbpartbox.x + s.numbpartbox.width+10, s.numbpartbox.y);
        s.buttonSubmitNum.mouseClicked(s.updateSliderPartiValue);
        s.headslideralpha=s.createP("Alpha value: ");
        //s.headslideralpha.position(610,390);
        s.alphabox = s.createInput("1");
        //s.alphabox.position(750,405);
        s.alphabox.size(50);
        s.slideralpha = s.createSlider(0.001,10,1,0.001);
        //s.slideralpha.position(610,440);
        s.slideralpha.input(s.sliderAlphaChange);
        s.buttonSubmitalpha= s.createButton('Submit');
        //s.buttonSubmitalpha.position(s.alphabox.x + s.alphabox.width+10, s.alphabox.y);
        s.buttonSubmitalpha.mouseClicked(s.updateSliderAlphaValue);
        s.timeDisplayer = s.createP("time = 0 ")
        s.timeDisplayer.position(10,0);
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

              // dynamically adjust the canvas to the window
        s.windowResized = function() {
            s.resizeCanvas(div.clientWidth, div.clientHeight);
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

    return new p5(sketch, id);
}
// create three sketches on a single page
let sketch1 = makeSketch('sketch1');
