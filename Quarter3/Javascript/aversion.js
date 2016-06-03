/*
THINGS TO DO
- fix the game? .-. Ehh, don't know what broke, but unplayable at the moment
- keep user scores
*/

var enemies = []

function startGame(button) {
    button.innerHTML='pause'
    button.setAttribute('onclick','pauseGame(this)')
    gameArea.start();
}

function pauseGame(button){
    gameArea.pause()
    button.innerHTML='resume'
    button.setAttribute('onclick','resumeGame(this)')
}

function resumeGame(button){
    gameArea.resume()
    button.innerHTML='pause'
    button.setAttribute('onclick','pauseGame(this)')
}

var parseKey = function(event){
  if (gameArea.canvas.stat == 'ended')
    return
  var ekey = event.keyCode
  if (ekey=='37'){
    gameArea.playerTriangle.rotation -= 0.26
  } else if (ekey=='39'){
    gameArea.playerTriangle.rotation += 0.26
  }
}

var gameArea = {
    canvas : document.getElementById('aversionCanvas'),
    load : function(){
      this.canvas.width = 400;
      this.canvas.height = 400;
      this.canvas.style.backgroundColor = '#FFFEC9'
      this.canvas.style.border = '5px solid #FFC963'
      this.canvas.style.borderRadius = '3px'
      this.canvas.style.margin = '25px'
      this.canvas.style.float = 'left'
    },
    start : function() {
        enemies = []
        this.canvas.stat = 'progressing'
        this.context = this.canvas.getContext('2d')
        this.playerTriangle = new player(this.canvas.width/2,this.canvas.height-20,12)
        window.addEventListener('keydown', parseKey)
        this.frameNum = 0
        this.interval = setInterval(updateGameArea,20)
    },
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    pause : function(){
        clearInterval(this.interval)
        this.canvas.stat = 'ended'
    },
    resume : function(){
        this.interval = setInterval(updateGameArea, 20)
        this.canvas.stat = 'progressing'
    },
    stop : function(){
        gameArea.pause()
        console.log('stopped')
        this.context.font="30px Arial"
        this.context.fillStyle = '#A83B0C'
        this.context.fillText('g a m e   o v e r',50,200)
        window.removeEventListener('keydown',parseKey)
        var gButton = document.getElementsByTagName('button')[0]
        gButton.setAttribute('onclick','startGame(this)')
        gButton.innerHTML = 'play again'
    }
}

var ctx=gameArea.canvas.getContext("2d");

function enemy(x, y, vx, vy, radius){
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    ctx.fillStyle = '#EB672F';
    ctx.beginPath();
    ctx.arc(this.x,this.y,radius,0,2*Math.PI);
    ctx.fill()
    ctx.lineWidth = '2'
    ctx.strokeStyle = '#A83B0C'
    ctx.stroke();
    this.update = function(){
      if(this.x+vx>=gameArea.canvas.width-12){
      	this.vx = -this.vx
      	this.x=gameArea.canvas.width-(radius+1)
      }
      if(this.y+vy>=gameArea.canvas.height-12){
       	this.y=gameArea.canvas.height-(radius+1)
       	this.vy = -this.vy
      }
      if(this.x+vx<=12){
      	this.x=radius+1
        this.vx = -this.vx
      }
      if(this.y+vy<=12){
       	this.y=radius+1
       	this.vy = -this.vy
      }
      
      this.x += this.vx
      this.y += this.vy
      ctx.fillStyle = '#EB672F';
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
      ctx.fill()
      ctx.lineWidth = '2'
      ctx.strokeStyle = '#A83B0C'
      ctx.stroke();
    }
}

function player(x, y, radius){
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.v = 3;
    this.rotation = Math.PI*3/2
    this.drawSelf = function(){
        ctx.moveTo(radius+this.x,this.y)
        ctx.beginPath();
        for (var a=1;a<4;a++){
            var angle = (a/3)*2*Math.PI
            ctx.lineTo(radius*Math.cos(angle+this.rotation) + this.x,radius*Math.sin(angle+this.rotation)+this.y)
        }
        ctx.closePath()
        ctx.fillStyle = '#8FD8F7';
        ctx.fill()
        ctx.lineWidth = '2'
        ctx.strokeStyle = '#2FB3EB'
    }
    this.update = function(){
      this.x += this.v*Math.cos(this.rotation)
      this.y += this.v*Math.sin(this.rotation)
      // thanks for making my life easier
      var maxWidth = gameArea.canvas.width,
          maxHeight = gameArea.canvas.height,
          cornerPoints = [[0,0],[maxWidth,0],[maxWidth,maxHeight],[0,maxHeight]]
      
      if (this.x <= 0)
        this.x = maxWidth-1
      if (this.x >= maxWidth)
        this.x = 1
      if (this.y <= 0)
        this.y = maxHeight-1
      if (this.y >= maxHeight)
        this.y = 1
      this.drawSelf()
      ctx.stroke();
    }

    this.collision = function(circle){
        //player triangle, enemy object
        var ptx1 = radius*Math.cos(1+this.rotation) + this.x,
            ptx2 = radius*Math.cos(2+this.rotation) + this.x,
            ptx3 = radius*Math.cos(3+this.rotation) + this.x,
            pty1 = radius*Math.sin(1+this.rotation) + this.y,
            pty2 = radius*Math.sin(2+this.rotation) + this.y,
            pty3 = radius*Math.sin(3+this.rotation) + this.y,
            lineSegments = [[ptx1,pty1,ptx2,pty2],[ptx2,pty2,ptx3,pty3],[ptx3,pty3,ptx1,pty1]],
            distanceFromAllSegments = []
        
        function sortNumber(a,b) {
            return a - b;
        }
        
        function distToSegment(point, lineStart, lineEnd) { 
          var a = Math.pow(Math.pow((point.x-lineStart.x),2)+Math.pow((point.y-lineStart.y),2),0.5),
              b = Math.pow(Math.pow((point.x-lineEnd.x),2)+Math.pow((point.y-lineEnd.y),2),0.5),
              c = Math.pow(Math.pow((lineStart.x-lineEnd.x),2)+Math.pow((lineStart.y-lineEnd.y),2),0.5),
              angleC = Math.acos((a/(b*b+c*c-2*b*c)/(2*Math.PI))),
              height = Math.sin(angleC)*b
          return height
        }
        for (var c=0;c<3;c++){
            var point = {x: circle.x, y: circle.y },
                lineStart = {x: lineSegments[c][0], y: lineSegments[c][1]},
                lineEnd = {x: lineSegments[c][2], y: lineSegments[c][3]},
                d = distToSegment(point, lineStart, lineEnd);
            distanceFromAllSegments.push(d)
        }
       
        distanceFromAllSegments.sort(sortNumber);
        var collision = true
        
        if (distanceFromAllSegments[0]>12){
            collision=false
        }
        return collision
    }
    this.drawSelf()
    ctx.stroke()
}


function updateGameArea(){
    for (var i = 0; i < enemies.length; i += 1) {
      if (gameArea.playerTriangle.collision(enemies[i])){
        gameArea.stop()
        console.log('Hass.')
      }
    }
    gameArea.clear()
    gameArea.frameNum += 1;
    ctx.font = '12px Arial'
    if (gameArea.frameNum/(25)%1==0){
      ctx.fillText(gameArea.frameNum/(25),(gameArea.canvas.width-20),20)
    } else {
      ctx.fillText(Math.floor(gameArea.frameNum/(25)),(gameArea.canvas.width-20),20)
    }
    if (gameArea.frameNum == 1 || gameArea.frameNum/(250)%1==0) {
      var randxory = Math.floor(Math.random()),
          x = Math.floor(Math.random() * (gameArea.canvas.width)),
          y = 0
      enemies.push(new enemy(x, y, 5, 5, 12));
    }
    for (var i = 0; i < enemies.length; i += 1) {
        enemies[i].x += -1;
        enemies[i].update();
    }
    gameArea.playerTriangle.update()
}

gameArea.load()


