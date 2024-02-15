// README
/*
<project>
Protect crystal
John Chen
20994511
Kaiyang Sun
21026054


INSTRUCTIONS
This is a game of protection of crystals. Like the Mario game, 
you need to control the villain to jump to step on the monster's head to eliminate the monster. 
Press the S key to start the game. Keyboard key A is to go left, D is to go right and space bar is to jump. 
Each time you eliminate a monster the speed will increase, the maximum limit is one hundred.
When you step on the head of the monster will destroy the monster while making a sound.
The top left corner is your blood level, and you can fail a total of three times. 
But when the monster touches the crystal, the game will end directly. 
The end screen will explain the cause of death.

CODING QUALITY AND VISUAL DESIGN
We use a lot of nested loops and function code to achieve a clean code style.
I think the best point of the design is the impact of gravity and jumping action when the character jumps. 
All the images we used were drawn by ourselves, so the jumping action of the villain in the air is special. 
This makes the character movement more graphic

VIDEO
https://www.youtube.com/watch?v=6bFr0fmSFWY


RELEASE
I <John Chen and Kaiyang Sun> grant permission to CS 105 course staff to use
my Final Project program and video for the purpose of promoting CS 105.
<if you don't grant permission, erase the line above>
*/

// all code goes below here ....

let s;                  //sound
let playerImg = [];         //player image
let monsterImg ;        //monster image
let gameOver = true;       
let gameStart = true;
let imgIndex = 1;          
let score = 0;            
const MONSTER_SPEED_LIMIT = 100; //limit the monster's speed
let monsters=[];              //having multiple monsters
let lastAddTime = 0;         
let health =3 ;               //player's hp
let healthImg;                //picture of hp
let crystalImg;               //crystal picture
const CRYSTAL_X = 800;        //crystal position
let healthLock = true;        
let endReason = 0;            //reason that player lost
let bg;                       //background
function setup() {            
  createCanvas(1000, 600); 
  player = new Player();      
  monster = new Monster();     
}

function preload(){                       //preload image to player array
	s = loadSound("sound.wav");              //sound when hit monster
  for (let i=0; i<3; i++) {              //loop player image to player array
    let a ="player000"+i+".png";      
    playerImg[i]= loadImage(a);          //load the name of picture to array
  }
	monsterImg = loadImage("monster1.jpg"); 
	healthImg = loadImage("health.png");    
	crystalImg = loadImage("C.png");        
	bg = loadImage("bg2.png");              
	
}

function draw() {    
  if(!gameOver){
  background(bg);   
  scoreBoard();               
  monsterInfoBoard();         
	healthBoard();               
	drawCrystal();              
	if(frameCount%7 == 0){     //speed of the player movement
		imgIndex++;
	}
	if(frameCount%60 == 0){
		healthLock = true;
	}
  player.drawPlayer();                      //show player
	player.update();	                       //update player
  player.move();                           //move
  endReason = createMonsters();           //creater monster
  }else if(gameStart){                    //game start
    background(bg);                
    drawStartGame();
  }else{                                 //game end
  background(bg); 
  drawGameOver(endReason);    
  }
}


function createMonsters(){
let interval = random(1000-score*30,6000-score*30);           //The time interval between two monsters is a random number from 1000 to 6000 milliseconds
 if (millis()-lastAddTime > interval) {     //a new monster add when time interval passes
     monsters.push(new Monster(min(score,MONSTER_SPEED_LIMIT)));         //put the new monster to the array
     lastAddTime = millis();              //Sets the last time the monster was added to the current time
  }

   for(let c of monsters){                //Use "for" loop to make each monster in the monster array move & display
     c.drawMonster();                     //show monster
     c.move();                            //monster move
     if(player.kill(c)){                  //if player kill montster
			 s.play();                       //sound
       c.died = true;                     //monster died
       score++;                           //get score
     }
     if(player.hit(c)){                   //if the monster hit the player, hp-1
			 if(healthLock && health>1){
				 health--;
				 c.died = true;
			   healthLock = false;
			 }else{
				 gameOver = true;
				 return 1;
			 }	 
     }
     if(c.x>=CRYSTAL_X){                      //if the monster hit the crystal, gameover
				 gameOver = true;
			   return 2;
     }
  }
}
//scoreBoard
function scoreBoard(){                   
  textSize(35);
  text('Score: '+ score ,350,50)
}
//healthBoard
function healthBoard(){                
  for(let i = 0; i<health; i++){
		image(healthImg,30+60*i,10,healthImg.width,healthImg.height);
  }
}
//drawCrystal
function drawCrystal(){
  image(crystalImg,CRYSTAL_X,height-250,crystalImg.width,crystalImg.height);
}
//monsterInfoBoard
function monsterInfoBoard(){            
  textSize(25);
	text('Monster Speed: '+ int(1+min(score,MONSTER_SPEED_LIMIT)*0.2)+' km/h',650,50)
}
 //draw gameover
function drawGameOver(num){                
  textSize(32);
  textAlign(CENTER, CENTER);
	if(num === 2){
		text('Game Over! Crystal destroyed! Your score: '+ score,width/2,height/2)
	}else if(num === 1){
		text('Game Over! You dead! Your score: '+ score,width/2,height/2)
	}
  text('Press "Space" to restart game! ',width/2,height/2+50)
}
//draw game start
function drawStartGame(){ 
	textSize(50);
	text('Protect Crystal',width/2,height/2-150)
  textSize(32);
  textAlign(CENTER, CENTER);
  text('Press "s" to start game ',width/2,height/2)
	rect(400,350,200,200)
	rect(450,400,100,100)
	line(400,350,450,400)
	line(600,350,550,400)
	line(400,550,450,500)
	line(600,550,550,500)
	textSize(100);
	text('s',500,450)
}

function keyPressed(){        
   if(key == ' '){                   //jump when spacekey pressed
     if(!gameOver){
           player.jump();           
     }else{
       monsters=[];                 //Remake monster array
       player.x=500;                //remake player position
       score= 0                     //remake game
			 health = 3;
       gameOver = false;           
     }
   }
  
  if(key == 's'){
    gameStart = false;
    gameOver = false;            
  }
}

function Player(){               
     this.img = playerImg[0];          
     this.w =this.img.width;              //width of player
     this.h =this.img.height;              //height of player
     this.x =500;              //Initial horizontal coordinate
     this.y =height-this.h;   //the initial vertical coordinate
     this.vy=0;               //Initial vertical velocity
     this.gravity = 1;        //original gravity
  this.jump = function(){                    
  if(this.y == height-this.h){ 
     this.vy= -18;                              //original jump speed
    }
  }
	
	this.update = function(){
		if(this.y==height-this.h){
			this.img = playerImg[imgIndex%2];
		}else{
			this.img = playerImg[2];
		}
	}	

  this.move = function(){     
  this.y += this.vy;                            //Jumping, the initial velocity is the initial velocity of the jump
  this.vy += this.gravity;                      //fall by gravity
  this.y = constrain(this.y, 0, height-this.h); //won't go beyond the screen 
  this.x -= keyIsDown(65) ? 5:0;                //move right
  this.x += keyIsDown(68) ? 5:0;                //move left
  }
  
  

  this.drawPlayer = function(){                                     
		image(this.img,this.x,this.y,this.w,-this.h);  //Show player images
  } 
  
  this.kill = function(monster){  //Determined whether the play kill the monster or not
    return monster.x+monster.w > player.x && monster.x < player.x+player.w && player.y &&  player.y >= height-monster.h-80 && player.y< monster.y
  }
  
  this.hit = function(monster){  //Determine whether the player collides with the monster (left and right collision)
    return ((monster.x+monster.w >= player.x && monster.x+monster.w<=player.x+player.w) || (monster.x>=player.x &&monster.x<=player.x+player.w)) && monster.y === player.y && !monster.died
  }
}

function Monster(score){               
     this.img = monsterImg           
     this.w = this.img.width;                  //monster width
     this.h = this.img.height;                  //monster height
     this.speed = 1+score*0.2;       //monster speed
     this.x = 0;                    //Monster initial horizontal coordinates
     this.y = height-80;           //Monster initial vertical coordinates
     this.died = false;           //monster died
     

  this.setSpeed=function(a){
    this.speed += a * 0.5
  }
  this.move = function(){
    if(!this.died){
        this.x += this.speed                      //monster moves right
    }
  }

  this.drawMonster =function(){
    if(!this.died){  
			image(this.img,this.x,this.y,this.w,-this.h);  //Show player images
    }else{                                       //if monster died, monster gone
      this.x = -100;
      this.y = -100;
    }
  } 
}