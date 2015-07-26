PlatJump.Preloader = function (game) {
	this.loadingBG = null;
	this.loadingBar = null;
	this.ready = false;
};

PlatJump.Preloader.prototype = {
	preload: function () {
		//Loading start assets
		this.loadingBG = this.add.sprite(0, 0, 'loading_bg');
		this.loadingBar = this.add.sprite(30, h/2, 'loading_bar');
		this.loadingBar.anchor.setTo(0, 0.5);
		//Defining loading bar
		this.load.setPreloadSprite(this.loadingBar);
		//Loading other assets
		//Images
    this.load.image('bg_start', 'assets/img/scene/bg_start.png');
    this.load.spritesheet('play_button', 'assets/img/buttons/play_sprite.png', 59, 52);
    //still needs changes in width/height
    this.load.image('sound_button', 'assets/img/buttons/sound.png', 59, 52);
    this.load.image('bg', 'assets/img/scene/bg.png');
    this.load.image('floor', 'assets/img/scene/floor.png' );
    this.load.image('floor_air', 'assets/img/scene/floor_air.png' );
    this.load.spritesheet('libi_move', 'assets/img/char/libi_sprite.png', 35, 40, 3);
    this.load.image('playAgain', 'assets/img/buttons/restart.png');
    //SoundFX
    this.load.audio('jump', 'assets/audio/SoundEffects/jump.wav');
    //this.load.audio('die', 'assets/audio/SoundEffects/die.wav');
	},
	create: function () {
		this.loadingBar.cropEnabled = false;
		this.ready = true;
		this.state.start('Menu');
	}
};