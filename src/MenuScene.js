class MenuScene extends Phaser.Scene{
    constructor()
    {
        super("MenuScene");
    }
    Playername;
    init(data)
    {
        console.log(data);
        if (data.Playername != null) this.Playername = data.Playername;
        else this.Playername = ''; 
        console.log("MenuScene Ready")
    }
    create()
    {
        this.add.image(0,0,"title_bg").setOrigin(0).setDepth(0);
        let PlayButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 120,"play_button").setDepth(1);
        let OptionButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 230,"option_button").setDepth(1);
        //let Back_Button = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 150,"back_button").setDepth(1).setVisible(0);

        
        this.sound.pauseOnBlur = false;
        this.sound.play("title_bgm",{
            loop: true
        });
        game.sound.setVolume(0.5);
        
        PlayButton.on("pointerup", ()=>{
            this.sound.stopAll();
            this.scene.start("GameScene",{Playername: this.Playername});
        })
        
        OptionButton.on("pointerup",()=>{
            console.log("WORK IN PROGRESS")
        })
        if (this.Playername === '')
        {
            PlayButton.setVisible(false);
            OptionButton.setVisible(false);
            var element = this.add.dom(400, 450).createFromCache('InputFieldHTML');
            element.addListener('click');
            element.on('click', function (event) {
                if (event.target.name === 'playButton')
                {
                    var inputText = this.getChildByName('nameField');
                    //  Have they entered anything?
                    if (inputText.value !== '')
                    {
                        //  Turn off the click events
                        this.removeListener('click');
                        //  Hide the login element
                        this.setVisible(false);
                        PlayButton.setVisible(true);
                        OptionButton.setVisible(true);
                        PlayButton.setInteractive();
                        OptionButton.setInteractive();
                        //  Populate the text with whatever they typed in
                        this.scene.Playername = inputText.value;
                        if (this.scene.Playername.length > 15)
                            this.scene.Playername = this.scene.Playername.slice(0,15);
                    }
                    else
                    {
                        //  Flash the prompt
                        /*
                        this.scene.tweens.add({
                            targets: text,
                            alpha: 0.2,
                            duration: 250,
                            ease: 'Power3',
                            yoyo: true
                        });
                        */
                    }
                }
            });
        }
        else
        {
            PlayButton.setInteractive();
            OptionButton.setInteractive();
        }
        
    }
}