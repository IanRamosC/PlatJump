//Standard settings
var score = 0
  , stars
  , scoreText
  , highscore
  , fps
  , soundFx = {}
  , w = 300
  , h = 500
  , PlatJump = {};

  PlatJump.Boot = function (game) {};

  PlatJump.Boot.prototype = {
  	init: function () {
  		//scaling phaser game
  		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  		if (this.game.device.desktop) {
	      this.scale.maxWidth = this.game.width;
	      this.scale.maxHeight = this.game.height;
  		}
	    this.scale.pageAlignHorizontally = true;
	    this.scale.pageAlignVertically = true;
	    this.scale.setScreenSize(true);
  	},
  	preload: function () {
  		this.load.image('loading_bg', 'assets/img/scene/bg_loading.png');
  		this.load.image('loading_bar', 'assets/img/scene/loading_bar.png')
  	},
  	create: function () {
  		this.state.start('Preloader');
  	}
  };