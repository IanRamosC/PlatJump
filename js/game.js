var isMobile = false;
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
var score = 0
  , stars
  , scoreText
  , highscore
  , fps
  , soundFx = {}
  , w = 300
  , h = 500;

var Jumper = function() {};
Jumper.Start = function() {};
Jumper.Play = function() {};
Jumper.Gameover = function() {};

Jumper.Start.prototype = {
  preload: function() {
    this.load.image('play', 'assets/img/play.png');
    this.load.image('bg', 'assets/img/bg.png');
    this.load.image('logo', 'assets/img/logo.png');
  },
  create: function() {
    bg = this.add.image(0, 0, 'bg');
    var playButton = game.add.button(game.world.width/2, game.world.height/2, 'play', this.shutdown, this);
    playButton.input.useHandCursor = true;
    playButton.scale.setTo(0.3);
    playButton.anchor.setTo(0.5);
    var logo = this.add.image(game.world.width/2, 100, 'logo');
    logo.scale.setTo(0.5);
    logo.anchor.setTo(0.5);

    // scaling
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    if(isMobile === false) {
      this.scale.maxWidth = this.game.width;
      this.scale.maxHeight = this.game.height;
    }
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.setScreenSize(true);
  },
  shutdown: function() {
    game.state.start('Play');
  }
}

Jumper.Play.prototype = {

  preload: function() {

    //IMAGES
    this.load.image('bg', 'assets/img/bg.png');
    this.load.image('sky_gradient', 'assets/img/sky_gradient.png');
    this.load.image('floor', 'assets/img/floor.png' );
    this.load.image('floor_air', 'assets/img/floor_air.png' );
    this.load.image('libi', 'assets/img/libi.png' );
    //SOUNDEFFECTS
    this.load.audio('jump', 'assets/audio/SoundEffects/jump.wav');
    this.load.audio('die', 'assets/audio/SoundEffects/die.wav');
  },
  create: function() {
    // background color
    bg = this.add.image(0, 0, 'bg');
    bg.fixedToCamera = true;

    soundFx.jump = this.add.audio('jump');
    soundFx.die = this.add.audio('die');

    game.time.advancedTiming = true

    // physics
    this.physics.startSystem(Phaser.Physics.ARCADE);

    // camera and platform tracking vars
    this.cameraYMin = 99999;
    this.platformYMin = 99999;

    // create platforms
    this.platformsCreate();

    // create hero
    this.heroCreate();

    //if player started the game
    this.hero.movingUp = false;

    //setting score text
    var textStyle = { font: '14px Arial', fill: '#FFF', stroke: '#444', strokeThickness: 6 };
    scoreText = game.add.text(10, 10, '', textStyle);
    scoreText.fixedToCamera = true;

    //creating fps debug version
    fps = game.add.text(254, 2, '', { font: '12px Arial', fill: '#0F0' });
    fps.fixedToCamera = true;

    //setting pause text
    resume = game.add.text(w/2, h/2, 'Voltar ao Jogo', { font: '26px Arial', fill: '#FFF', stroke: '#444', strokeThickness: 6 });
    resume.anchor.setTo(0.5);
    resume.fixedToCamera = true;
    resume.inputEnabled = true;
    resume.visible = false;

    //
    escKey = this.input.keyboard.addKey(Phaser.Keyboard.ESC);
    escKey.onDown.add(this.pause, this);

    // cursor controls
    this.cursor = this.input.keyboard.createCursorKeys();
  },
  pause: function() {
    if(game.paused === false) {
      //pause the game
      game.paused = true;
      resume.visible = true;

      game.input.onDown.add(function(){
        game.paused = false;
        resume.visible = false;
      }, self);


    } else {
      game.paused = false;
      resume.visible = false;
    }

  },
  update: function() {
    // this is where the main magic happens
    // the y offset and the height of the world are adjusted
    // to match the highest point the hero has reached
    this.world.setBounds(0, -this.hero.yChange, this.world.width, this.game.height + this.hero.yChange);

    // the built in camera follow methods won't work for our needs
    // this is a custom follow style that will not ever move down, it only moves up
    this.cameraYMin = Math.min(this.cameraYMin, this.hero.y - this.game.height + 130);
    this.camera.y = this.cameraYMin;

    //setting the current score to maximum y hero travelled / 3
    score = this.getScore();
    scoreText.text = 'Score: ' + score;

    // hero collisions and movement
    this.physics.arcade.collide(this.hero, this.platforms);
    this.heroMove();

/*    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;*/

    // for each plat form, find out which is the highest
    // if one goes below the camera view, then create a new one at a distance from the highest one
    // these are pooled so they are very performant
    this.platforms.forEachAlive(function(elem) {
      this.platformYMin = Math.min(this.platformYMin, elem.y);
      if(elem.y > this.camera.y + this.game.height) {
        elem.kill();
        this.platformsCreateOne(this.rnd.integerInRange(0, this.world.width - 50), this.platformYMin - 110, 0.5);
      }
    }, this);

    fps.text = 'FPS: ' + game.time.fps;
  },
  shutdown: function() {
    // reset everything, or the world will be messed up
    this.world.setBounds(0, 0, this.game.width, this.game.height);
    this.cursor = null;
    this.hero.destroy();
    this.hero = null;
    this.platforms.destroy();
    this.platforms = null;
  },
  getScore: function() {
    if (this.hero.movingUp === false) {
      return 0;
    } else {
      return parseInt(Math.max( this.hero.yChange, Math.abs(this.hero.y - this.hero.yOrig) - 50 )/4);
    }
  },
  platformsCreate: function() {
    // platform basic setup
    this.platforms = this.add.group();
    this.platforms.enableBody = true;
    this.platforms.createMultiple(8, 'floor_air');

    // create the base platform, with buffer on either side so that the hero doesn't fall through
    this.platformBaseCreate(0, this.world.height - 45, 'floor');
    // create a batch of platforms that start to move up the level
    for(var i = 0; i < 7; i++) {
      if (i === 0) {
        this.platformsCreateOne(this.rnd.integerInRange(0, this.world.width - 50), this.world.height - 160 - 110 * i, 0.5);
      } else {
        this.platformsCreateOne( his.rnd.integerInRange(0, this.world.width - 50), (this.world.height - 110 - 110 * i) - 60, 0.5);
      }
    }
  },
  platformBaseCreate: function (x, y, key) {
    var base = this.platforms.create(x, y, key);
    base.reset( x, y );
    base.scale.x = 1;
    base.scale.y = 1;
    base.body.immovable = true;
    return base;
  },
  platformsCreateOne: function(x, y, width) {
    // this is a helper function since writing all of this out can get verbose elsewhere
    var platform = this.platforms.getFirstDead();
    platform.reset(x, y);
    platform.scale.x = width;
    platform.scale.y = 0.8;
    platform.body.immovable = true;
    return platform;
  },
  heroCreate: function() {
    // basic hero setup
    this.hero = game.add.sprite(this.world.centerX, this.world.height - 50, 'libi');
    this.hero.anchor.set(0.5, 1);
    this.hero.scale.y = 1.3;

    // track where the hero started and how much the distance has changed from that point
    this.hero.yOrig = this.hero.y;
    this.hero.yChange = 0;

    // hero collision setup
    // disable all collisions except for down
    this.physics.arcade.enable(this.hero);
    this.hero.body.gravity.y = 500;
    this.hero.body.checkCollision.up = false;
    this.hero.body.checkCollision.left = false;
    this.hero.body.checkCollision.right = false;
  },
  heroMove: function() {
    // handle the left and right movement of the hero
    if( this.cursor.left.isDown || (this.input.pointer1.x < 150 && this.input.pointer1.isDown)) {
      this.hero.body.velocity.x = -200;
    } else if( this.cursor.right.isDown || (this.input.pointer1.x > 150 && this.input.pointer1.isDown)) {
      this.hero.body.velocity.x = 200;
    } else {
      this.hero.body.velocity.x = 0;
    }

    // handle hero jumping
    if (this.cursor.up.isDown || this.input.pointer1.isDown) {
      this.hero.movingUp = true;
    }
    if( this.hero.movingUp === true && this.hero.body.touching.down ) {
      soundFx.jump.play();
      this.hero.body.velocity.y = -370;
    }

    // wrap world coordinated so that you can warp from left to right and right to left
    this.world.wrap(this.hero, this.hero.width / 16, false);

    // track the maximum amount that the hero has travelled
    this.hero.yChange = Math.max(this.hero.yChange, Math.abs(this.hero.y - this.hero.yOrig));

    // if the hero falls below the camera view, gameover
    if(this.hero.y > this.cameraYMin + this.game.height && this.hero.alive) {
      this.state.start('Gameover');
    }
  }
}
Jumper.Gameover.prototype = {
  preload: function() {
    this.load.image('playAgain', 'assets/img/restart.png');
  },
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
    game.state.start( 'Play' );
  }
}

var game = new Phaser.Game(w, h, Phaser.CANVAS, 'game');
game.state.add('Start', Jumper.Start)
game.state.add('Play', Jumper.Play);
game.state.add('Gameover', Jumper.Gameover);
game.state.start('Start');
