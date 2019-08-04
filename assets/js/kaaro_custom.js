var c = document.getElementById('c');
var ctx = c.getContext('2d');

var w = 750; var h = 450;
var x = 100; var y = 100;

var boxes = [];
for(i = 0; i < 15; i++) {
  boxes.push(new box);
}

function box() {
  this.x = Math.random() * w;
  this.y = Math.random() * h;

  this.vx = Math.random() * 10;

  this.boxh = 25;
  this.boxw = 25;
}

function draw() {
  ctx.fillStyle = 'rgba(250, 250, 250, 0.75)';
  ctx.fillRect(0, 0, w, h);

  for(t = 0; t < boxes.length; t++) {
    var p = boxes[t];

    ctx.beginPath();
    ctx.fillStyle = '#95a5a6';
    ctx.fillRect(p.x, p.y, p.boxh, p.boxw);

    p.x += p.vx;

    if(p.x > w + 25) {
      p.x = -25;
    };

    //decides size based on velocity to create 3d effect
    if(p.vx < 9) {
    	p.boxh = 22;
    	p.boxw = 22;
  	};
    if(p.vx < 7) {
    	p.boxh = 19;
    	p.boxw = 19;
  	};
    if(p.vx < 4) {
    	p.boxh = 13;
    	p.boxw = 13;
  	};
    if(p.vx < 2) {
    	p.boxh = 9;
    	p.boxw = 9;
  	};
    if(p.vx < 1) {
    	p.boxh = 5;
    	p.boxw = 5;
  	};
  }
}

setInterval(draw, 33);