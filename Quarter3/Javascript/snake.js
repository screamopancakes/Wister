// JavaScript File
//snake in a day.
function makeFood(w,h){
  var x=Math.round(Math.random()*(w-10)/10)
	var y=Math.round(Math.random()*(h-10)/10)
	
	return {x:x,y:y}
}

var snakes = function(canvas){
    this.snakeLength=5;
    this.cells=[]
    this.direction='right'
    this.w=canvas.width
    this.h=canvas.height
    this.food=makeFood(this.w,this.h)
    var cw=10
    this.update= function(ctx){
      //draws food
      this.drawCell(this.food.x,this.food.y,ctx)
      
        var newHeadX=this.cells[0].x
        var newHeadY=this.cells[0].y
        
        if(this.direction=='right')
          newHeadX++
        else if(this.direction=='left')
          newHeadX--
        else if(this.direction=='up')
          newHeadY++
        else if(this.direction=='down')
          newHeadY--
      
      
      if(newHeadX == -1 || newHeadX== this.w/10 || newHeadY == -1 || newHeadY == this.h/10 || this.checkCollision(newHeadX, newHeadY, this.cells)){
  			albox('you died')
  			
  			return false;
  		}
  		
  		if(newHeadX==this.food.x && newHeadY==this.food.y){
  			var tail = {x: newHeadX, y: newHeadY};
  			this.food=makeFood(this.w,this.h)
  			this.snakeLength++
  			var status='score'
  		}else{
        var tail = this.cells.pop();
        tail.x = newHeadX; tail.y = newHeadY;
  		}
        this.cells.unshift(tail);
        for(var i = 0; i < this.snakeLength;i++){
          this.drawCell(this.cells[i].x,this.cells[i].y,ctx)
        }
      return status
    }
    
    this.create = function(){
      this.direction='right'
      this.snakeLength=5
      this.cells=[]
      for(var i = this.snakeLength-1; i>=0; i--)
        this.cells.push({x: i, y:0});
    }
    
    this.drawCell = function(x,y,ctx){
      ctx.fillStyle = "green";
      ctx.fillRect(x*cw, y*cw, cw, cw);
      ctx.strokeStyle = "white";
      ctx.strokeRect(x*cw, y*cw, cw, cw);
    }
    
    this.checkCollision = function(x,y,array){
      //returns true to much
      for(var i = 0; i<array.length;i++){
			  if(array[i].x == x && array[i].y == y)
			    return true;
		    }
	  	return false;
    }
}

var snakeGame = function(name){
    this.name=getCookie('name');
    this.cw=10
    this.canvas=document.getElementById('snakeGame')
    this.score=0
    
    this.ctx=this.canvas.getContext("2d")
    
    var Snake= new snakes(this.canvas)
    
    
    this.start = function(){
      Snake.create()
      var self=this
        this.gameInterval=setInterval(this.draw.bind(this),60)
      $(document).keydown(function(e){
    		var key = e.which;
    		//We will add another clause to prevent reverse gear
    		if(key == "37" && Snake.direction != "right") Snake.direction = "left";
    		else if(key == "40" && Snake.direction != "down") Snake.direction = "up";
    		else if(key == "39" && Snake.direction != "left") Snake.direction = "right";
    		else if(key == "38" && Snake.direction != "up") Snake.direction = "down";
    		//The snake is now keyboard controllable
	})
    }
    
    this.draw = function(){
      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
      var self=this
      var status=Snake.update(this.ctx)
      if(status==false){
        clearInterval(self.gameInterval)
        if(!document.getElementById('startAgainButton')){
          var button=document.createElement('button')
          button.id='startAgainButton'
          button.setAttribute('onclick','snake.startAgain()')
          button.style.position='absolute'
          button.style.left='400px'
          button.style.top='250px'
          button.style.width='125px'
          button.style.height='50px'
          button.innerHTML='Play Again'
          document.getElementById('snakeDiv').appendChild(button)
        } else{
          document.getElementById('startAgainButton').style.visibility='initial'
        }
      }
     else if(status=='score')
        this.score++
      
      this.ctx.fillStyle='red'
      this.ctx.fillText('Score: '+this.score,10,10)
    }
    
    this.startAgain = function(){
      document.getElementById('startAgainButton').style.visibility='hidden'
      this.score=0
      Snake.create()
      var self=this
        this.gameInterval=setInterval(this.draw.bind(this),60)
    }
    
    this.end = function(){
      var self=this
      clearInterval(self.gameInterval)
    }
    
}