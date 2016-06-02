


var Ball = function(x, y, r){
this.r=r					
this.x=x; this.y=y
this.vx=2; this.vy=2;

this.update=function(){
  var c = document.getElementById("game"),
  height=c.height,
  width=c.width
  if(this.x+r>=c.width){
  	this.vx*=-1.05
  	this.x=c.width-r
  }
  if(this.y+r>=c.height){
   	this.x=x
   	this.y=y
   	this.vx=2; this.vy=2;
  }
  if(this.x-r<=0){
  	this.vx*=-1.05
  	this.x=r
  }
  if(this.y-r<=0){
   	this.x=x
   	this.y=y
   	this.vx=2; this.vy=2;
  }
  this.x += this.vx
  this.y += this.vy
  }        



this.draw = function(ctx){
  // draw game ball in given context at pos (x,y) 
  ctx.beginPath()
  ctx.strokeStyle='white'
  ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
  ctx.stroke();
  ctx.fill()	
  }
  
this.flip = function(axis){
  if(axis=='y'){
    this.vy*=-1
    this.y += this.vy
  }else if(axis=='x'){
    this.vx*=-1
    this.x+=this.vx*2
  }else{
    this.vy*=-1
    this.y += this.vy
    this.xy*=-1
    this.x += this.vx
  }
}
}


/************* Game ******************/
var Game = function(){
// get the canvas and context
var c = document.getElementById("game")
c.tabIndex=1000
this.w=c.width
this.h=c.height
this.colArray={}

this.ctx = c.getContext("2d")
this.ctx.fillStyle='white'


  this.ball=new Ball(this.w/2, this.h/2,10)

this.paddle1 = new Rect(200,25,10,this.w/2,'cpu')
this.paddle2 = new Rect(200,25,this.h-35,this.w/2,'player')
this.paddles=[this.paddle1,this.paddle2]
console.log(this.ball)

this.draw = function(){
  // clear the canvas
    this.ctx.clearRect(0,0,this.w,this.h)
  // draw the ball:
    this.ball.update()
    this.ball.draw(this.ctx)
  for(var g=0;g<this.paddles.length;g++){
    this.paddles[g].draw(this.ctx,this.ball)
  }
    for(var g=0;g<this.paddles.length;g++){
      var paddle=this.paddles[g]
      var collision=checkBallCollision(this.ball,paddle)
      if(collision){
        this.ball.flip(collision)
        if(this.ball.name)
          socket.emit('pongCollision',this.ball.name,this.ball.opponent,this.ball.x,this.ball.y)
        }
    
  }
}

function checkBallCollision(ball, paddle) {
        var distX = Math.abs(ball.x - paddle.x-paddle.w/2);
        var distY = Math.abs(ball.y - paddle.y-paddle.h/2);
    
        if (distX > (paddle.w/2 + ball.r)) { return false; }
        if (distY > (paddle.h/2 + ball.r)) { return false; }
    
        if (distX <= (paddle.w/2)) { return 'y'; } 
        if (distY <= (paddle.h/2)) { return 'x'; }
    
        var dx=distX-paddle.w/2;
        var dy=distY-paddle.h/2;
        return (dx*dx+dy*dy<=(ball.r*ball.r));
}

this.start=function(num){
  // set the draw() function to be called 60x per second:
  if(num==1){
    c.style.zIndex='10'
    self=this
      this.startInterval=setInterval('self.draw()',1000/60)
  } else {
    this.paddle1.type='onPlayer'
    this.paddle2.name=num[0]
    this.paddle2.opponent=num[1]
    this.ball.name=num[0]
    this.ball.opponent=num[1]
    c.style.zIndex='10'
    self=this
      this.startInterval=setInterval('self.draw()',1000/60)
  }
}
  
this.end=function(){
  console.log('test')
  self=this
  clearInterval(this.startInterval)
}
  
this.parse= function(e){
  if(e.which==37){
    this.paddle2.left(this.ctx)
  }
  if(e.which==39){
    this.paddle2.right(this.ctx)
  }
}
}

var Rect = function(w,h,x,y,type){
  this.w=w
  this.h=h
  this.y=x
  this.x=y
  this.type=type
  
  this.draw = function(ctx,ball){
    if(this.type=='cpu'){
      this.x=ball.x-(this.w/2)
    } else if(this.type=='onPlayer'){
    }
    if (this.x<0)
      this.x=0
    if (this.x+this.w>document.getElementById('game').width)
      this.x=document.getElementById('game').width-this.w
    
    ctx.fillRect(this.x,this.y,this.w,this.h)
    ctx.stroke()
  }
  this.left = function(ctx){
    this.x-=5
    if(this.name)
      socket.emit('pongLeft',this.name,this.opponent,this.x) //enemey players name
  }
  this.right = function(ctx){
    this.x+=5
    if(this.name)
      socket.emit('pongRight',this.name,this.opponent,this.x)
  }
}

function killGame(){
  try{
    myGame.end()
  } catch (err){
  }
}

