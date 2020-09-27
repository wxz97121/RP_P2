/** @type {import("../defs/phaser")} */
/** @type {import("../defs/matter")} */

//const { debug } = require("webpack");

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
var IfPulsing = false;
var IfExpand = true;
var IfShrink = false;
var Pulsingfactor = 0;
var score = 0.0;
var scoreText;
var healthText;
var volume = 0.5;
var Bullet = new Phaser.Class({

  Extends: Phaser.GameObjects.Image,

  initialize:

  // Bullet Constructor
  function Bullet (scene)
  {
      Phaser.GameObjects.Image.call(this, scene, 0, 0, 'projectile1');
      this.speed = 1;
      this.born = 0;
      this.direction = 0;
      this.xSpeed = 0;
      this.ySpeed = 0;
      this.setSize(4, 4, true);
      this.setDisplaySize(30,48);
  },

  // Fires a bullet from the player to the reticle
  fire: function (shooter, direction,speed,IsPlayer = false)
  {
      this.setPosition(shooter.x, shooter.y); // Initial position
      // console.log(this.speed)
      this.xSpeed = speed*Math.sin(direction);
      this.ySpeed = -speed*Math.cos(direction);
      this.rotation = direction; // angle bullet with shooters rotation
      this.born = 0; // Time since new bullet spawned
      if (IsPlayer)
      {
        if (Math.random() > 0.5) this.setTexture('projectile1');
        else this.setTexture('projectile2');
        this.setAngle(0);
        //this.setSize(64, 64, true);
      }
      else
      {
        if (Math.random() > 0.5) this.setTexture('projectile3');
        else this.setTexture('projectile4');
        this.ySpeed *= -1;
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

function IndicatorCreate(BeamL, BeamR, Speed, AlphaFactor)
{
  BeamL.alpha += AlphaFactor;
  BeamR.alpha += AlphaFactor;

  BeamL.x += Speed;
  //console.log(BeamL.x)
  BeamR.x -= Speed;
  //console.log(BeamR.x)
  //if(Math.abs(BeamL.x - BeamR.x) < 1.0)
  if(BeamR.x <= 800 || BeamL >= 800 )
  {
    //console.log("Reset")
    resetBeamL(BeamL);
    resetBeamR(BeamR);
  }
}
function resetBeamL(Beam)
{
  Beam.x = 0
  Beam.alpha = 0;
}
function resetBeamR(Beam)
{
  Beam.x = 1600
  Beam.alpha = 0;
}
function DiscPulsing(DiscObject)
{
  if(IfExpand)
  {
    scale = Phaser.Math.Interpolation.SmoothStep(Pulsingfactor, 1.0, 1.2);//[1.0, 1.2]
    Pulsingfactor += 0.16;
    DiscObject.setScale(scale);
    if(scale >= 1.2)
    {
      IfExpand = false;
      IfShrink = true;
      Pulsingfactor = 0;
    }
  }
  if(IfShrink)
  {
    scale = Phaser.Math.Interpolation.SmoothStep(Pulsingfactor, 1.2, 1.0);//[1.2, 1.0]
    Pulsingfactor += 0.16;
    DiscObject.setScale(scale);
    if(scale <= 1.0)
    {
      IfExpand = true;
      IfShrink = false;
      IfPulsing = false;
      Pulsingfactor = 0;
      //console.log("Stop Pulse")
    }
  }
  //console.log(scale)
}
function PlayerWin()
{
  //TODO: WIN EFFECT
  player.body.velocity.x = 0;
  player.body.velocity.y = 0;
  player.alpha = 0;
  game.sound.setRate(2)
  isWin = true;
  UI_Win.setVisible(1);
  TimeScore_Text.setVisible(1);
  TimeScore_Text.setText(score);
  Exit_Button.setVisible(1);
  Exit_Button.setInteractive();
  Exit_Button.on("pointerup", ()=>{
      ExitGame();
  })
  //scene.time.delayedCall(4000,RestartGame);
}
function PlayerLose(player)
{
  player.body.velocity.x = 0;
  player.body.velocity.y = 0;
  player.alpha = 0;
  game.sound.setRate(0.5);
  isLose = true;
  // Activate the button
  UI_Lose.setVisible(1);
  PlayAgain_Yes_Button.setVisible(1);
  PlayAgain_No_Button.setVisible(1);
  PlayAgain_Yes_Button.setInteractive();
  PlayAgain_Yes_Button.on("pointerup", ()=>{
      RestartGame();
  })
  PlayAgain_No_Button.setInteractive();
  PlayAgain_No_Button.on("pointerup", ()=>{
      ExitGame();
  })
}
function ScoreSetting (NowTime)
{
    score = NowTime;
    scoreText.setText('Time: < ' + score +' >');
}
function RestartGame()
{
  game.sound.setRate(1);
  game.sound.stopAll();
  game.scene.start("GameScene");
}
function ExitGame()
{
  game.sound.setRate(1);
  game.sound.stopAll();
  game.scene.stop("GameScene");
  game.scene.start("LoadScene");
}

isMoveByForce = true;
function SwitchInputMode()
{
  if (isMoveByForce)
  {
    console.log("Move mode: Move By Velocity");
    isMoveByForce = false;
    player.setDrag(0);
  }
  else
  {
    console.log("Move mode: Move By Force");
    isMoveByForce = true;
    player.setDrag(800);
  }
}

isBarrierExist = true;
function SwitchBarrier(barriers)
{
  var barriesArray = barriers.getChildren();
  if (isBarrierExist)
  {
    for (var i = 0; i < barriesArray.length; i++) 
    {
      barriesArray[i].setActive(false).setVisible(false);
      barriesArray[i].alpha = 0;
    }
  }
  else
  {
    for (var i = 0; i < barriesArray.length; i++) 
    {
      barriesArray[i].setActive(true).setVisible(true);
      barriesArray[i].alpha = 1;
    }
  }
  isBarrierExist = !isBarrierExist;
}

var isLose = false, isWin = false;
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
  /*
  this.load.spritesheet('player_handgun', 'assets/player_handgun.png',
      { frameWidth: 66, frameHeight: 60 }
  ); // Made by tokkatrain: https://tokkatrain.itch.io/top-down-basic-set
  */

  this.load.image('Player','assets/Sprites/Character_back1.png');
  this.load.image('Player2','assets/Sprites/Character_back2.png');

  this.load.image('Enemy1_1','assets/Sprites/enemy_a1.png');
  this.load.image('Enemy2_1','assets/Sprites/enemy_b1.png');
  this.load.image('Enemy3_1','assets/Sprites/enemy_c1.png');

  this.load.image('Enemy1_2','assets/Sprites/enemy_a2.png');
  this.load.image('Enemy2_2','assets/Sprites/enemy_b2.png');
  this.load.image('Enemy3_2','assets/Sprites/enemy_c2.png');

  this.load.image('projectile1','assets/Sprites/projectile1.png');
  this.load.image('projectile2','assets/Sprites/projectile2.png');
  this.load.image('projectile3','assets/Sprites/projectile3.png');
  this.load.image('projectile4','assets/Sprites/projectile4.png');

  this.load.image('background', 'assets/Sprites/background_v2.png');
  this.load.image('Barrier','assets/Sprites/barrier.png');
}

function BulletHitCallback(playerBullet, enemyBullet)
{
  if(playerBullet.active===true && enemyBullet.active===true)
  { 
    playerBullet.setActive(false).setVisible(false);
    enemyBullet.setActive(false).setVisible(false);
  }
}

function BarrierHitCallback(Bullet, Barrier)
{
  if(Bullet.active===true && Barrier.active===true)
  {  
    Bullet.setActive(false).setVisible(false);
    Barrier.alpha -= 0.1;
    if (Barrier.alpha<=0.4) Barrier.setActive(false).setVisible(false);
  }
}

function create ()
{
  // Set score tracking bar
  scoreText = this.add.text(8, -68, 'Time: < 0 >', { fontFamily: 'font1', fontSize: '48px', fill: '#e0e0e0' }).setDepth(1);

  // Set Indicator
  Disc = this.add.image(this.game.renderer.width, this.game.renderer.height * 2 - 250, "disc").setDepth(1);
  Disc.setAlpha(0.6);
  BeamL1 = this.add.image(0, this.game.renderer.height * 2 - 250, "beam").setDepth(0).setAlpha(0);
  BeamR1 = this.add.image(1600, this.game.renderer.height * 2 - 250, "beam").setDepth(0).setAlpha(0);
  BeamL2 = this.add.image(0, this.game.renderer.height * 2 - 250, "beam").setDepth(0).setAlpha(0);
  BeamR2 = this.add.image(1600, this.game.renderer.height * 2 - 250, "beam").setDepth(0).setAlpha(0);
  BeamL3 = this.add.image(0, this.game.renderer.height * 2 - 250, "beam").setDepth(0).setAlpha(0);
  BeamR3 = this.add.image(1600, this.game.renderer.height * 2 - 250, "beam").setDepth(0).setAlpha(0);

  // Set world bounds
  this.physics.world.setBounds(100, 1000, 1400, 1200);

  // Add 2 groups for Bullet objects
  playerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
  enemyBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
  enemies = this.physics.add.group();
  barriers = this.physics.add.group();
  
  // Play Music
  this.sound.play("title_bgm",{
      loop: true
  })
  game.sound.setVolume(volume);
  scene = game.scene.getScene("GameScene");
  isLose = false;
  isWin = false;
  NowTime = 0;
  isMoveByForce = true;

  // Add background, player, enemy, UI Elements
  background = this.add.image(800, 600, 'background');
  volumeText = this.add.text(this.game.renderer.width * 2 - 300, -68, 'Volume: ', { fontFamily: 'font1', fontSize: '48px', fill: '#e0e0e0' }).setDepth(1);
  Volume_Plus_Button = this.add.image(this.game.renderer.width * 2 - 37, -44, "volume_plus_button").setDepth(1);
  Volume_Minus_Button = this.add.image(this.game.renderer.width * 2 - 90, -44, "volume_minus_button").setDepth(1);
  Volume_Plus_Button.setInteractive();
  Volume_Plus_Button.on("pointerup", ()=>{
      if(volume <= 1.0)
      {
        console.log("+")
        volume += 0.1;
      }
      game.sound.setVolume(volume);
  }) 
  Volume_Minus_Button.setInteractive();
  Volume_Minus_Button.on("pointerup", ()=>{
      if(volume >= 0.0)
      {
        console.log("-")
        volume -= 0.1;
      }
      game.sound.setVolume(volume);
  })   

  UI_Win = this.add.image(800,600,'UI_Win').setDepth(1).setVisible(0);
  TimeScore_Text = this.add.text(this.game.renderer.width + 152, this.game.renderer.height + 167, '0', { fontFamily: 'font1', fontSize: '48px', fill: '#a32c10' }).setDepth(1).setVisible(0);  
  Exit_Button = this.add.image(this.game.renderer.width, this.game.renderer.height + 250,"exit_button").setDepth(1).setVisible(0);
  Exit_Button.setScale(1.3);
  
  UI_Lose = this.add.image(800,600,'UI_Lose').setDepth(1).setVisible(0);
  PlayAgain_Yes_Button = this.add.image(this.game.renderer.width - 50, this.game.renderer.height + 250,"playagain_yes_button").setDepth(1).setVisible(0);
  PlayAgain_No_Button = this.add.image(this.game.renderer.width + 50, this.game.renderer.height + 250,"playagain_no_button").setDepth(1).setVisible(0);
  PlayAgain_Yes_Button.setScale(1.3);
  PlayAgain_No_Button.setScale(1.3);
  
  //player = this.physics.add.sprite(800, 1000, 'player_handgun');
  player = this.physics.add.image(800,1000,'Player');
  player.rotation = 0;
  
  //Add Collision Event
  this.physics.add.collider(enemies,playerBullets,enemyHitCallback);
  this.physics.add.collider(player,enemyBullets,playerHitCallback);
  this.physics.add.collider(playerBullets,enemyBullets,BulletHitCallback);
  this.physics.add.collider(playerBullets,barriers,BarrierHitCallback);
  this.physics.add.collider(enemyBullets,barriers,BarrierHitCallback);

  // Add Enemies 
  for (var i = 0; i < 9; i++)
      for(var j = 0; j < 4; j++)
      {
          enemy = this.physics.add.image(200+150*i, 100+150*j, 'Enemy1_1');
          enemy.angle = 0;
          enemy.health = 1;
          enemy.lastFired = 0;
          enemy.setOrigin(0.5, 0.5).setDisplaySize(66, 90).setCollideWorldBounds(true);
          let t = Math.random();
          if (t<0.35)
          {
            enemy.setTexture('Enemy1_1');
            enemy.TextureArray = ['Enemy1_1','Enemy1_2'];
          }
          else if (t<0.7)
          {
            enemy.setTexture('Enemy2_1');
            enemy.TextureArray = ['Enemy2_1','Enemy2_2'];
          }
          else
          {
            enemy.setTexture('Enemy3_2');
            enemy.TextureArray = ['Enemy3_1','Enemy3_2'];
          }
          enemies.add(enemy);
      }

  // Add Barriers
  for (var i = 0; i < 4; i++)
  {
    barrier = this.physics.add.image(200+400*i, 850, 'Barrier');
    barrier.setOrigin(0.5, 0.5).setDisplaySize(153.6, 76.8).setCollideWorldBounds(true);
    barriers.add(barrier);
  }
  isBarrierExist = true;
  SwitchBarrier(barriers);

  // Set image/sprite properties
  UI_Win.setScale(1.5,1.5);
  UI_Lose.setScale(1.5,1.5);
  background.setOrigin(0.5, 0.5).setDisplaySize(1600, 1200);
  player.setOrigin(0.5, 0.5).setDisplaySize(120, 120).setCollideWorldBounds(true).setDrag(800);
  UI_Win.setOrigin(0.5,0.5);
  UI_Win.alpha = 0;
  UI_Lose.setOrigin(0.5,0.5);
  UI_Lose.alpha = 0;
  
  //scene.time.addEvent({ delay: 6.25, callback: function(event), loop: true });
  //scene.time.delayedCall(MSPerBeat-InputTolerance,)

  // Set sprite variables
  player.health = 1;

  // Set camera properties
  this.cameras.main.zoom = 0.5;
  this.cameras.main.setScroll(400,300);

  // Creates object for input with WASD kets
  moveKeys = this.input.keyboard.addKeys({
      'up': Phaser.Input.Keyboard.KeyCodes.UP,
      'down': Phaser.Input.Keyboard.KeyCodes.DOWN,
      'left': Phaser.Input.Keyboard.KeyCodes.LEFT,
      'right': Phaser.Input.Keyboard.KeyCodes.RIGHT,
      'space': Phaser.Input.Keyboard.KeyCodes.SPACE,
      'F': Phaser.Input.Keyboard.KeyCodes.F,
      'H': Phaser.Input.Keyboard.KeyCodes.H
  });
  this.input.keyboard.on('keydown_F', function (event) 
  {
    SwitchInputMode();
  });

  this.input.keyboard.on('keydown_H',function(event)
  {
    SwitchBarrier(barriers);
  } )

  this.input.keyboard.on('keydown_LEFT', function (event) 
  {
    if (!isLose)
    {
      if (isMoveByForce) player.setAccelerationX(-1200);
      else player.setVelocityX(-400);
    }
  });
  this.input.keyboard.on('keydown_RIGHT', function (event) {
    if (!isLose)
    {
      if (isMoveByForce) player.setAccelerationX(1200);
      else player.setVelocityX(400);
    }
  });

  this.input.keyboard.on('keyup_LEFT', function (event) {
      if (moveKeys['right'].isUp)
      {
        if (isMoveByForce) player.setAccelerationX(0);
        else player.setVelocityX(0);
      }
  });
  this.input.keyboard.on('keyup_RIGHT', function (event) {
      if (moveKeys['left'].isUp)
      {
        if (isMoveByForce) player.setAccelerationX(0);
        else player.setVelocityX(0);
      }
  });


  //Fire bullets from player on SPACE button pressed
  this.input.keyboard.on('keydown_SPACE', function(event)
  {
      if (player.active === false || isLose)
      return;
      if(IsBeat)
      {
        IfPulsing = true;
      }
      if (!IsBeat)
      {
        this.cameras.main.shake(500);
        NowTime += 5000 // Time Punishment
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
  if (bulletHit.active === true)
  {
    playerHit.health--;
    bulletHit.setActive(false).setVisible(false);
  }
}

function enemiesAnim(index)
{
  if (!enemies) return;
  var enemiesArray = enemies.getChildren();
  for (var i = 0; i < enemiesArray.length; i++) 
  {
    enemiesArray[i].setTexture(enemiesArray[i].TextureArray[index]);
  }
}

function enemiesFire(enemies, time, gameObject)
{
  if (!enemies) return;
  var enemiesArray = enemies.getChildren();
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
  //player.rotation = Math.PI * -0.5;
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
  // Set Beat boolean according time
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
  // Set Indicator Work
  if(NowTime >= 375)
  {
    IndicatorCreate(BeamL1, BeamR1, (800.0/MSPerBeat)*delta/3.0,  0.003*delta);
  }
  if(NowTime >= 750)
  {
    IndicatorCreate(BeamL2, BeamR2, (800.0/MSPerBeat)*delta/3.0,  0.003*delta);
  }
  if(NowTime >= 1125)
  {
    IndicatorCreate(BeamL3, BeamR3, (800.0/MSPerBeat)*delta/3.0, 0.003*delta);
  }
  // Set Onbeat Visual Cue
  if(IfPulsing)
  {
    DiscPulsing(Disc);
  }
  // Set Score/Time Accounting
  if(!isWin && !isLose)
  {
    ScoreSetting((Math.round(NowTime/1000)));
  }
  // Set Player Image according time
  if (NowTime % (MSPerBeat*2) < MSPerBeat)
  {
    player.setTexture('Player');
    enemiesAnim(0);
  }
  else
  {
    player.setTexture('Player2');
    enemiesAnim(1);
  }

  if (isWin) UI_Win.alpha += 0.005*delta;
  if (isLose) UI_Lose.alpha += 0.005*delta;

  // Constrain velocity of player
  constrainVelocity(player, 350);

  //TODO: Change Enemies Behaviour, to adpat Music
  enemiesFire(enemies, time, this);

  if (!isWin && !isLose) CheckGameOver(player,enemies);

  // Debug for Win
  this.input.keyboard.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, (event) => {
    switch(event.code) {
        case 'Digit1':
           PlayerWin();
        break;
    }
  });
}