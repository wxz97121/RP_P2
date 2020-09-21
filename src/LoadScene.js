class LoadScene extends Phaser.Scene{
    constructor()
    {
        super("LoadScene");
    }
    init()
    {
        console.log("LoadScene Ready")
    }
    preload()
    {
        this.load.image('title_bg','assets/Images/background.png');
        this.load.image('game_bg', 'assets/underwater1.png');
        this.load.image('play_button','assets/Images/playbutton.png');
        this.load.image('option_button','assets/Images/optionbutton.png');
        this.load.audio('title_bgm','assets/Audio/bgm.wav')

        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        this.load.on("progress",function (value){
             progressBar.clear();
             progressBar.fillStyle(0xffffff, 1);
             progressBar.fillRect(250, 280, 300 * value, 30);
             console.log(value);
        });
        this.load.on("complete", function (value){
             progressBar.destroy();
             progressBox.destroy();
             loadingText.destroy();
             console.log("done")
        });
    }
    create()
    {
        this.add.text(20, 20, "Loading game...");
        this.scene.start("MenuScene");
    }
}