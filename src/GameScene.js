/** @type {import("../defs/phaser")} */
/** @type {import("../defs/matter")} */



/*
var sceneConfig = {
  preload: preload,
  create: create,
  update: update,
  key: 'GameScene',
  extend: {
              player: null,
              healthpoints: null,
              reticle: null,
              moveKeys: null,
              playerBullets: null,
              enemyBullets: null,
              enemies:null,
              time: 0,
          }
};*/

class GameScene extends Phaser.Scene{
  constructor()
  {
      super("GameScene");

  }
  preload =preload;
  create = create;
  update= update;   
}

var scene;
var IsBeat = false;
var InputTolerance = 125;
var MSPerBeat = 375;
var HasFireThisBeat = false;
var NowTime;
var Bullet = new Phaser.Class({

  Extends: Phaser.GameObjects.Image,

  initialize:

  // Bullet Constructor
  function Bullet (scene)
  {
      Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
      this.speed = 1;
      this.born = 0;
      this.direction = 0;
      this.xSpeed = 0;
      this.ySpeed = 0;
      this.setSize(10, 10, true);
      this.setDisplaySize(100,100);
  },

  // Fires a bullet from the player to the reticle
  fire: function (shooter, direction,speed,IsPlayer = false)
  {
      this.setPosition(shooter.x, shooter.y); // Initial position
      // console.log(this.speed)
      this.xSpeed = speed*Math.cos(direction);
      this.ySpeed = speed*Math.sin(direction);
      this.rotation = direction; // angle bullet with shooters rotation
      this.born = 0; // Time since new bullet spawned
      if (IsPlayer)
      {
        this.setTexture('bullet_player_1');
        this.setAngle(0);
        //this.setSize(64, 64, true);
      }
  },

  // Updates the position of the bullet each cycle
  update: function (time, delta)
  {
      this.x += this.xSpeed * delta;
      this.y += this.ySpeed * delta;
      var speed = Math.sqrt(this.xSpeed*this.xSpeed + this.ySpeed+this.ySpeed)
      this.born += delta;
      if (this.born*speed > 2500)
      {
          this.setActive(false);
          this.setVisible(false);
      }
  }

});

function PlayerWin()
{
  //TODO: WIN EFFECT
  game.sound.setRate(2)
  scene.time.delayedCall(1000,RestartGame);
}

function PlayerLose(player)
{

  player.body.velocity.x = 0;
  player.body.velocity.y = 0;
  player.alpha = 0;
  game.sound.setRate(0.5);
  scene.time.delayedCall(1000,RestartGame);
  isLose = true;
}
function RestartGame()
{
  game.sound.setRate(1);
  game.sound.stopAll();
  //game.scene.stop("GameScene");
  game.scene.start("GameScene");
  
}

var isLose=false;
function CheckGameOver(player,enemies)
{
  if (player.health==0) PlayerLose(player);

  var enemiesArray = enemies.getChildren();
  var AliveEnemy = 0;
  for (var i = 0; i < enemiesArray.length; i++) 
  {
     if (enemiesArray[i].active) AliveEnemy++;
  }
  if (AliveEnemy == 0) PlayerWin();
}

function preload ()
{
  // Load in images and sprites
  console.log("GameScene Loaded");
  this.load.spritesheet('player_handgun', 'assets/player_handgun.png',
      { frameWidth: 66, frameHeight: 60 }
  ); // Made by tokkatrain: https://tokkatrain.itch.io/top-down-basic-set
  this.load.image('bullet_player_1','assets/Sprites/Projectile1.png');

  this.load.image('bullet', 'assets/Sprites/Projectile4.png');
  this.load.image('target', 'assets/ball.png');
  this.load.image('background', 'assets/underwater1.png');
  //this.load.audio('title_bgm','assets/Audio/bgm.wav');
}

function create ()
{
  // Set world bounds
  this.physics.world.setBounds(0, 0, 1600, 1200);
  // Add 2 groups for Bullet objects
  playerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
  enemyBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
  enemies = this.physics.add.group();
  this.physics.add.collider(enemies,playerBullets,enemyHitCallback)

    //Play Music
    this.sound.play("title_bgm",{
      loop: true
  })
  scene = game.scene.getScene("GameScene");
  isLose = false;
  NowTime=0;

  // Add background player, enemy,
  var background = this.add.image(800, 600, 'background');
  player = this.physics.add.sprite(800, 1000, 'player_handgun');
  player.rotation = Math.PI * -0.5;
  this.physics.add.collider(player,enemyBullets,playerHitCallback)
  
  for (var i = 0; i < 9; i++)
      for(var j = 0; j < 4; j++)
      {
          enemy = this.physics.add.sprite(200+150*i, 100+150*j, 'player_handgun');
          enemy.angle = 90;
          enemy.health = 1;
          enemy.lastFired = 0;
          enemy.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true);
          enemies.add(enemy);
      }


  // Set image/sprite properties
  background.setOrigin(0.5, 0.5).setDisplaySize(1600, 1200);
  player.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true).setDrag(500, 500);

  
  //scene.time.addEvent({ delay: 6.25, callback: function(event), loop: true });
  //scene.time.delayedCall(MSPerBeat-InputTolerance,)

  // Set sprite variables
  player.health = 3;


  // Set camera properties
  this.cameras.main.zoom = 0.3;
  this.cameras.main.startFollow(player);

  // Creates object for input with WASD kets
  moveKeys = this.input.keyboard.addKeys({
      'up': Phaser.Input.Keyboard.KeyCodes.UP,
      'down': Phaser.Input.Keyboard.KeyCodes.DOWN,
      'left': Phaser.Input.Keyboard.KeyCodes.LEFT,
      'right': Phaser.Input.Keyboard.KeyCodes.RIGHT,
      'space': Phaser.Input.Keyboard.KeyCodes.SPACE
  });

  // Enables movement of player with Arrow keys
  this.input.keyboard.on('keydown_UP', function (event) {
      if (!isLose)
      player.setAccelerationY(-800);
  });
  this.input.keyboard.on('keydown_DOWN', function (event) {
    if (!isLose)
      player.setAccelerationY(800);
  });
  this.input.keyboard.on('keydown_LEFT', function (event) {
    if (!isLose)
      player.setAccelerationX(-800);
  });
  this.input.keyboard.on('keydown_RIGHT', function (event) {
    if (!isLose)
      player.setAccelerationX(800);
  });

  // Stops player acceleration on uppress of Arrow keys
  this.input.keyboard.on('keyup_UP', function (event) {
      if (moveKeys['down'].isUp)
          player.setAccelerationY(0);
  });
  this.input.keyboard.on('keyup_DOWN', function (event) {
      if (moveKeys['up'].isUp)
          player.setAccelerationY(0);
  });
  this.input.keyboard.on('keyup_LEFT', function (event) {
      if (moveKeys['right'].isUp)
          player.setAccelerationX(0);
  });
  this.input.keyboard.on('keyup_RIGHT', function (event) {
      if (moveKeys['left'].isUp)
          player.setAccelerationX(0);
  });


  //Fire bullets from player on SPACE button pressed
  this.input.keyboard.on('keydown_SPACE', function(event)
  {
      if (player.active === false || isLose)
      return;
      if (!IsBeat)
      {
        this.cameras.main.shake(500);
        return;
      }
      if (HasFireThisBeat) return;
      
      // Get bullet from bullets group
      var bullet = playerBullets.get().setActive(true).setVisible(true);
      
      if (bullet)
      {
          HasFireThisBeat = true;
          bullet.fire(player,player.rotation,1,true);
          //this.physics.add.collider(enemy, bullet, enemyHitCallback);
      }
      
  },this);

  

}
/*
function StartEvent

function InputBeatBegin()
{
  IsBeat = true;
}

function InputBeatEnd()
{
  IsBeat = false;
}*/


function enemyHitCallback(enemyHit, bulletHit)
{
  // Reduce health of enemy
  if (bulletHit.active === true && enemyHit.active === true)
  {
      enemyHit.health = enemyHit.health - 1;
      console.log("Enemy hp: ", enemyHit.health);

      // Kill enemy if health <= 0
      if (enemyHit.health <= 0)
      {
         enemyHit.setActive(false).setVisible(false);
      }

      // Destroy bullet
      bulletHit.setActive(false).setVisible(false);
  }
}

function playerHitCallback(playerHit, bulletHit)
{
  playerHit.health--;
  // Reduce health of player
  //player.alpha = 0;
  /*
  if (bulletHit.active === true && playerHit.active === true)
  {
      playerHit.health = playerHit.health - 1;
      console.log("Player hp: ", playerHit.health);

      // Kill hp sprites and kill player if health <= 0
      if (playerHit.health == 2)
      {
          hp3.destroy();
      }
      else if (playerHit.health == 1)
      {
          hp2.destroy();
      }
      else
      {
          hp1.destroy();
          // Game over state should execute here
      }

      // Destroy bullet
      bulletHit.setActive(false).setVisible(false);
  }
  */
}

function enemiesFire(enemies, time, gameObject)
{
  if (!enemies) return;
  var enemiesArray = enemies.getChildren();
  /*
  for (var enemy in enemiesArray)
  {
      enemyFire(enemy,time,gameObject);
  }
  */

  //console.log(Math.random());
  for (var i = 0; i < enemiesArray.length; i++) 
  {
      
          enemyFire(enemiesArray[i],time,gameObject);
  }
  
}

function enemyFire(enemy, time, gameObject)
{
  if (enemy.active === false)
  {
      return;
  }

  if ((time - enemy.lastFired) > 1000)
  {
      enemy.lastFired = time;
      if (Math.random()<0.05)
      {
          // Get bullet from bullets group
          var bullet = enemyBullets.get().setActive(true).setVisible(true);

          if (bullet)
          {
              bullet.fire(enemy,enemy.rotation,0.5);
          }
      }
  }
}

// Ensures sprite speed doesnt exceed maxVelocity while update is called
function constrainVelocity(sprite, maxVelocity)
{
  if (!sprite || !sprite.body)
    return;
  if (isLose)
  {
    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;
    return;
  }
  var angle, currVelocitySqr, vx, vy;
  vx = sprite.body.velocity.x;
  vy = sprite.body.velocity.y;
  currVelocitySqr = vx * vx + vy * vy;
  player.rotation = Math.PI * -0.5;
  if (currVelocitySqr > maxVelocity * maxVelocity)
  {
      angle = Math.atan2(vy, vx);
      vx = Math.cos(angle) * maxVelocity;
      vy = Math.sin(angle) * maxVelocity;
      sprite.body.velocity.x = vx;
      sprite.body.velocity.y = vy;
  }
}

function update (time, delta)
{
  //console.log(time);
  NowTime += delta;
  if (NowTime%MSPerBeat > MSPerBeat-InputTolerance || NowTime%MSPerBeat < InputTolerance)
  {
    IsBeat=true;
  }
  else
  {
    HasFireThisBeat=false;
    IsBeat=false;
  }

  // Constrain velocity of player
  constrainVelocity(player, 500);

  //TODO: Change Enemies Behaviour, to adpat Music
  enemiesFire(enemies, time, this);

  CheckGameOver(player,enemies);

}