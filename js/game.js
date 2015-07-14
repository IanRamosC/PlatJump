var score = 0
  , stars
  , scoreText
  , soundFx = {}
  , w = 300
  , h = 500;

var Jumper = function() {};
Jumper.Play = function() {};

Jumper.Play.prototype = {

  preload: function() {

    //IMAGES
    this.load.image( 'hero', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/836/dude.png' );
    this.load.image( 'pixel', 'http://orig14.deviantart.net/f460/f/2014/268/6/7/minecraft_grass_block_simple_pixel_art_by_flamemakespixelart-d80h4uj.png' );
    this.load.image( 'star', 'http://upload.wikimedia.org/wikipedia/commons/7/73/Farm-Fresh_star.png');
    this.load.image( 'bg', 'assets/img/bg.png');

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

    // scaling
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.maxWidth = this.game.width;
    this.scale.maxHeight = this.game.height;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.setScreenSize( true );

    // physics
    this.physics.startSystem( Phaser.Physics.ARCADE );

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

    //setting pause text
    resume = game.add.text(w/2, h/2, 'Voltar ao Jogo', textStyle);
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
    if (game.paused === false) {
      //pause the game
      game.paused = true;
      resume.visible = true;

      game.input.onDown.add(function(){
        game.paused = false;
        resume.visible = false;
      }, self);


    }else{
      game.paused = false;
      resume.visible = false;
    }

  },

  update: function() {
    // this is where the main magic happens
    // the y offset and the height of the world are adjusted
    // to match the highest point the hero has reached
    this.world.setBounds( 0, -this.hero.yChange, this.world.width, this.game.height + this.hero.yChange );

    // the built in camera follow methods won't work for our needs
    // this is a custom follow style that will not ever move down, it only moves up
    this.cameraYMin = Math.min( this.cameraYMin, this.hero.y - this.game.height + 130 );
    this.camera.y = this.cameraYMin;

    //setting the current score to maximum y hero travelled / 3
    score = parseInt(Math.max( this.hero.yChange, Math.abs( this.hero.y - this.hero.yOrig ) )/3 );
    scoreText.text = 'Score: ' + score;

    // hero collisions and movement
    this.physics.arcade.collide( this.hero, this.platforms );
    this.heroMove();

    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    // for each plat form, find out which is the highest
    // if one goes below the camera view, then create a new one at a distance from the highest one
    // these are pooled so they are very performant
    this.platforms.forEachAlive( function( elem ) {
      this.platformYMin = Math.min( this.platformYMin, elem.y );
      if( elem.y > this.camera.y + this.game.height ) {
        elem.kill();
        this.platformsCreateOne( this.rnd.integerInRange( 0, this.world.width - 50 ), this.platformYMin - 100, 2 );
      }
    }, this );
  },

  shutdown: function() {
    // reset everything, or the world will be messed up
    this.world.setBounds( 0, 0, this.game.width, this.game.height );
    this.cursor = null;
    this.hero.destroy();
    this.hero = null;
    this.platforms.destroy();
    this.platforms = null;
    alert("Você perdeu! Score: " + score);
  },

  platformsCreate: function() {
    // platform basic setup
    this.platforms = this.add.group();
    this.platforms.enableBody = true;
    this.platforms.createMultiple( 10, 'pixel' );

    // create the base platform, with buffer on either side so that the hero doesn't fall through
    this.platformsCreateOne( -16, this.world.height - 16, this.world.width + 16 );
    // create a batch of platforms that start to move up the level
    for( var i = 0; i < 9; i++ ) {
      this.platformsCreateOne( this.rnd.integerInRange( 0, this.world.width - 50 ), this.world.height - 100 - 100 * i, 2 );
    }
  },

  platformsCreateOne: function( x, y, width ) {
    // this is a helper function since writing all of this out can get verbose elsewhere
    var platform = this.platforms.getFirstDead();
    platform.reset( x, y );
    platform.scale.x = width;
    platform.scale.y = 0.5;
    platform.body.immovable = true;
    return platform;
  },

  heroCreate: function() {
    // basic hero setup
    this.hero = game.add.sprite( this.world.centerX, this.world.height - 36, 'hero' );
    this.hero.anchor.set( 0.5 );
    
    // track where the hero started and how much the distance has changed from that point
    this.hero.yOrig = this.hero.y;
    this.hero.yChange = 0;

    // hero collision setup
    // disable all collisions except for down
    this.physics.arcade.enable( this.hero );
    this.hero.body.gravity.y = 500;
    this.hero.body.checkCollision.up = false;
    this.hero.body.checkCollision.left = false;
    this.hero.body.checkCollision.right = false;
  },

  heroMove: function() {
    // handle the left and right movement of the hero
    if( this.cursor.left.isDown ) {
      this.hero.body.velocity.x = -200;
    } else if( this.cursor.right.isDown ) {
      this.hero.body.velocity.x = 200;
    } else {
      this.hero.body.velocity.x = 0;
    }

    // handle hero jumping
    if (this.cursor.up.isDown) {
      this.hero.movingUp = true;
    }
    if( this.hero.movingUp === true && this.hero.body.touching.down ) {
      soundFx.jump.play();
      this.hero.body.velocity.y = -350;
    } 
    
    // wrap world coordinated so that you can warp from left to right and right to left
    this.world.wrap( this.hero, this.hero.width / 8, false );

    // track the maximum amount that the hero has travelled
    this.hero.yChange = Math.max( this.hero.yChange, Math.abs( this.hero.y - this.hero.yOrig ) );
    
    // if the hero falls below the camera view, gameover
    if( this.hero.y > this.cameraYMin + this.game.height && this.hero.alive ) {
      this.state.start( 'Play' );
    }
  }
}

// Jumper.Play.BootLoader.prototype = {
//   create: function() {
//     this.stage.backgroundColor = '#000';
//     this.add.text(150, 250, 'Loading...', { font: '14px Arial', fill: '#FFF' });
    
//   }
// }


var game = new Phaser.Game( w, h, Phaser.CANVAS, '' );
game.state.add( 'Play', Jumper.Play );
game.state.start( 'Play' );