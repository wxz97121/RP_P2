class MenuScene extends Phaser.Scene{
    constructor()
    {
        super("MenuScene");
    }
    init()
    {
        console.log("MenuScene Ready")
    }
    create()
    {
        this.add.image(0,0,"title_bg").setOrigin(0).setDepth(0);
        let PlayButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 70,"play_button").setDepth(1);
        let OptionButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 150,"option_button").setDepth(1);
        this.sound.pauseOnBlur = false;
        this.sound.play("title_bgm",{
            loop: true
        })
        PlayButton.setInteractive();
        PlayButton.on("pointerup", ()=>{
            this.scene.start("GameScene");
        })
       
    }
}