class GameScene extends Phaser.Scene{
  constructor()
  {
    super("GameScene");
  }
  init()
  {
    console.log("GameScene Ready")
  }
  create()
  {
    this.add.image(0,0,"game_bg").setOrigin(0).setDepth(0);
  }
}

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: 0x000000,
  parent: 'phaser-example',
  scene: [ LoadScene, MenuScene, GameScene ]
}
let game = new Phaser.Game(config);