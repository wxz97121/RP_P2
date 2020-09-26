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
        this.load.image('play_button','assets/Images/playbutton.png');
        this.load.image('option_button','assets/Images/optionbutton.png');  
        this.load.image('UI_Win','assets/Images/UI_Win.png');
        this.load.image('UI_Lose','assets/Images/UI_Lose.png');
        this.load.image('playagain_yes_button','assets/Images/playagain_yes_button.png');
        this.load.image('playagain_no_button','assets/Images/playagain_no_button.png');
        this.load.image('exit_button','assets/Images/exitbutton.png');
        this.load.audio('title_bgm','assets/Audio/bgm.wav');
        this.load.html('InputFieldHTML','assets/HTML/InputField.html');

        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0xffffff, 0.3);
        progressBox.fillRect(240, 270, 320, 50);
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                fontFamily: 'font1',
                fontSize: '24px',
                fill: '#e0e0e0'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        this.load.on("progress",function (value){
             progressBar.clear();
             progressBar.fillStyle(0xff8400, 1);
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
        //this.add.text(20, 20, "Loading game...", { fontFamily: 'font1', fontSize: '48px', fill: '#ffffff' });
        this.scene.start("MenuScene");
    }
}