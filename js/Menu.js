PlatJump.Menu = function (game) {
	this.playButton = null;
};

PlatJump.Menu.prototype = {
	create: function () {
    bg = this.add.image(0, 0, 'bg_start');
    playButton = game.add.button(game.world.width - 15, game.world.height - 80, 'play', this.startGame, this, 'play_pressed', 'play', 'play_pressed');
    playButton.input.useHandCursor = true;
    playButton.anchor.setTo(1);
	},
	startGame: function () {
		this.state.start('Game');
	}
};