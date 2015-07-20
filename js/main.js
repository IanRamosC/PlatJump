// Create a new Phaser game
var game = new Phaser.Game(w, h, Phaser.CANVAS, 'game');

//Adding Game States
game.state.add('Boot', PlatJump.Boot);
game.state.add('Preloader', PlatJump.Preloader);
game.state.add('Menu', PlatJump.Menu);
game.state.add('Game', PlatJump.Game);
game.state.add('Gameover', PlatJump.Gameover);

//Initiating Boot State
game.state.start('Boot');