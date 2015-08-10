PlatJump.Menu = function (game) {
	this.playButton = null;
};

PlatJump.Menu.prototype = {
	create: function () {
    bg = this.add.image(0, 0, 'bg_start');
    playButton = game.add.button(game.world.width - 15, game.world.height - 80, 'play_button', this.startGame, this, 1, 0, 1);
    playButton.input.useHandCursor = true;
    playButton.anchor.setTo(1);

    soundButton = game.add.button(15, game.world.height - 80, 'sound_button', this.toggleSound, this, 1, 0, 1);
    soundButton.input.useHandCursor = true;
    soundButton.anchor.setTo(0, 1);
	},
	startGame: function () {
		this.state.start('Game');
	},
	toggleSound: function () {
		soundFx.jump.play();
		game.sound.mute = !game.sound.mute;
	}
};