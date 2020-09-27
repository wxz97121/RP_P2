/** @type {import("../defs/phaser")} */
/** @type {import("../defs/matter")} */



var Gameconfig = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 800,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    scene: [LoadScene, MenuScene,GameScene]
  };

var game = new Phaser.Game(Gameconfig);
