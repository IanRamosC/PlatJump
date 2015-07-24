PlatJump.Game = function (game) {};

PlatJump.Game.prototype = {

  create: function() {
    // background color
    bg = this.add.image(0, 0, 'bg');
    bg.fixedToCamera = true;

    soundFx.jump = this.add.audio('jump');

    game.time.advancedTiming = true

    // physics
    this.physics.startSystem(Phaser.Physics.ARCADE);

    // camera and platform tracking vars
    this.cameraYMin = 999;
    this.platformYMin = 999;

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
    fps.visible = false;

    //setting pause text
    resume = game.add.text(w/2, h/2, 'Voltar ao Jogo', { font: '26px Arial', fill: '#FFF', stroke: '#444', strokeThickness: 6 });
    resume.anchor.setTo(0.5);
    resume.fixedToCamera = true;
    resume.inputEnabled = true;
    resume.visible = false;

    //adding pause
    this.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.pause, this);

    this.input.keyboard.addKey(Phaser.Keyboard.F).onDown.add(this.showFPS, this);

    // cursor controls
    this.cursor = this.input.keyboard.createCursorKeys();
  },
  pause: function() {
      //pause the game
      game.paused = !game.paused;
      resume.visible = !resume.visible;

  },
  showFPS: function() {
    fps.visible = !fps.visible;

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
        this.platformsCreateOne( this.rnd.integerInRange(0, this.world.width - 50), (this.world.height - 110 - 110 * i) - 60, 0.5);
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
    this.hero = game.add.sprite(this.world.centerX, this.world.height - 50, 'libi_move');
    this.hero.anchor.set(0.5, 1);
    this.hero.scale.y = 1.3;
    this.hero.animations.add('jump');

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
      this.hero.animations.play('jump', 3, false);
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
};
