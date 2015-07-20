PlatJump.Gameover = function (game) {};
PlatJump.Gameover.prototype = {
  create: function() {
    this.stage.backgroundColor = '#0A1F38';
    if (!!localStorage) {
      highscore = localStorage.getItem('highscore');

      if(!highscore || highscore < score) {
        highscore = score;
        localStorage.setItem('highscore', highscore);
      }
    } else {
      highscore = "0";
    }
    var highscoreText = game.add.text(this.world.width/2, 100, 'Highscore: ' + highscore, {font: '20px Arial', fill: '#FFF'});
    highscoreText.anchor.setTo(0.5);
    var lastScore = game.add.text(this.world.width/2, 130, 'Last score: ' + score, {font: '20px Arial', fill: '#FFF'});
    lastScore.anchor.setTo(0.5);
    var playAgain = game.add.button(this.world.width/2, this.world.height/2, 'playAgain', this.shutdown, this);
    playAgain.input.useHandCursor = true;
    playAgain.scale.setTo(0.3);
    playAgain.anchor.setTo(0.5);
  },
  shutdown: function() {
    game.state.start( 'Menu' );
  }
}