class PlayGame extends Phaser.Scene {
  constructor() {
    super("playGame");
    this.ground;
    this.player;
    this.touch;
    this.cursors;
    this.rain;
    this.drops = [];
    this.splashes = [];
    this.lives = [];
    this.liveBar;
    this.live;
    this.liveChance;
    this.gameOver;
    this.score = 0;
    this.tileW = 2048;
    this.tileH = 256;
    this.maxLives = 3;
    this.minLifeGenIterations = 100;
    this.maxLifeGenIterations = 200;
    this.startY = 30;
    this.lifeBarY;
    this.IterationCount = 10;
    this.timer = 0;
    this.interval;
    this.dTouchTimer;
  }

  preload() {
    // Loading Screen
    let width = this.game.config.width;
    let height = this.game.config.height;

    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 150, height / 2 - 25, 320, 50);

    let loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: "Loading...",
      style: {
        font: "20px monospace",
        fill: "#ffffff",
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    let percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: "0%",
      style: {
        font: "18px monospace",
        fill: "#ffffff",
      },
    });
    percentText.setOrigin(0.5, 0.5);

    let assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: "",
      style: {
        font: "18px monospace",
        fill: "#ffffff",
      },
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on("progress", function (value) {
      percentText.setText(parseInt(value * 100) + "%");
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(
        width / 2 + 10 - 150,
        height / 2 + 10 - 25,
        300 * value,
        30
      );
    });

    this.load.on("fileprogress", function (file) {
      assetText.setText("Loading asset: " + file.key);
    });
    this.load.on("complete", function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    this.load.image("background", "./assets/background.png");
    this.load.image("ground", "./assets/floor.png");
    this.load.spritesheet("dude", "./assets/left-right.png", {
      frameWidth: 291,
      frameHeight: 363,
    });
    this.load.spritesheet("drop", "./assets/drops.png", {
      frameWidth: 16,
      frameHeight: 44,
    });
    this.load.spritesheet("splash", "./assets/splash.png", {
      frameWidth: 84,
      frameHeight: 31,
    });
    this.load.image("life", "./assets/life.png");
    this.load.image("logo", "./assets/rain_logo__white.png");
  }

  create() {
    this.ground = undefined;
    this.player = undefined;
    this.touch = undefined;
    this.cursors = undefined;
    this.rain = undefined;
    this.drops = [];
    this.splashes = [];
    this.lives = [];
    this.liveBar = undefined;
    this.live = undefined;
    this.liveChance = undefined;
    this.gameOver = undefined;
    this.score = 0;
    this.tileW = 2048;
    this.tileH = 256;
    this.maxLives = 3;
    this.minLifeGenIterations = 100;
    this.maxLifeGenIterations = 200;
    this.startY = 30;
    this.IterationCount = 10;
    this.timer = 0;
    this.interval = undefined;
    this.lifeBarY = this.game.config.height - 50;
    this.dTouchTimer = this.time.now;

    this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "background"
    );

    this.add
      .image(this.game.config.width - 150, 100, "logo")
      .setScale(0.05)
      .setOrigin(0.5);

    this.ground = this.physics.add.staticGroup();
    this.ground.create(
      this.game.config.width / 2,
      this.game.config.height - this.tileH / 4,
      "ground"
    );

    this.player = this.physics.add
      .sprite(100, this.game.config.height / 2, "dude")
      .setScale(0.3);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.liveBar = this.physics.add.staticGroup();
    for (let i = 0; i < this.maxLives; i++) {
      this.lives.push(
        this.liveBar
          .create(this.game.config.width - 100 - i * 50, this.lifeBarY, "life")
          .setScale(0.8)
      );
    }

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 1, end: 6 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 0 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 7, end: 13 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "fell",
      frames: this.anims.generateFrameNumbers("drop", { start: 0, end: 4 }),
      frameRate: 2,
      repeat: 0,
    });

    this.anims.create({
      key: "spl",
      frames: this.anims.generateFrameNumbers("splash", { start: 0, end: 4 }),
      framerate: 10,
      repeat: 0,
    });

    this.physics.add.collider(this.player, this.ground);

    this.rain = this.physics.add.group();
    this.live = this.physics.add.group();

    this.physics.add.overlap(this.player, this.rain, this.hitRain, null, this);
    this.physics.add.overlap(this.rain, this.ground, this.dropRain, null, this);
    this.physics.add.collider(this.rain, this.ground);
    this.physics.add.collider(this.live, this.ground);
    this.physics.add.overlap(this.player, this.live, this.getLife, null, this);

    this.touch = this.input.activePointer;
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    // Debug
    // console.log({
    //   d: this.drops.length,
    //   s: this.splashes.length,
    //   l: this.lives.length,
    //   itr: this.IterationCount,
    //   score: this.score,
    //   int: this.interval,
    // });
    if (this.gameOver) return;
    if (this.IterationCount <= 0) {
      this.dropLife();
    }
    this.touch = this.input.activePointer;
    const side = this.checkTouch();
    const jump = this.checkDoubleTouch();
    if (side === "left" || this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    } else if (side === "right" || this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    } else if (
      (jump && this.player.body.touching.down) ||
      (this.cursors.up.isDown && this.player.body.touching.down)
    ) {
      this.player.setVelocityY(-330);
      // this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    this.IterationCount--;
    this.timer++;
    if (this.timer % 100 === 0) {
      this.score++;
      if (this.interval) {
        clearInterval(this.interval);
      }
      if (this.score < 100) {
        this.interval = setInterval(() => {
          this.createEnemy(true);
        }, 1000 - this.score * 10);
      } else {
        this.interval = setInterval(() => {
          this.createEnemy(true);
        }, 0.01);
      }
    }
  }

  checkTouch() {
    if (this.touch.isDown) {
      let touchX = this.touch.x;
      if (touchX > this.game.config.width / 2) {
        return "right";
      } else {
        return "left";
      }
    } else {
      return "stand";
    }
  }

  checkDoubleTouch() {
    if (this.touch.isDown) {
      console.log(this.touch);
      // const clickDelay = this.time.now - this.dTouchTimer;
      // this.dTouchTimer = this.time.now;
      // console.log(clickDelay, this.dTouchTimer);
      // if (clickDelay < 350) {
      //   return true;
      // } else {
      //   return false;
      // }
    }
  }

  hitRain(player, drop) {
    drop.destroy();
    if (this.lives.length <= 0) {
      this.physics.pause();
      this.gameOver = true;
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.scene.start("gameOver");
      this.game.score = this.score;
      return;
    }
    this.lives.at(-1).destroy();
    this.lives.splice(-1);
  }

  createEnemy(top) {
    if (!this.rain) return;
    this.drops.push(
      this.rain
        .create(this.getDropStartPlaceX(), this.startY, "drop")
        .setBounce(0.01)
        .setCollideWorldBounds(true)
        .setScale(1)
        .refreshBody()
    );
    this.drops.at(-1).anims.play("fell");
    this.drops
      .at(-1)
      .setSize(this.drops.at(-1).width, this.drops.at(-1).height, true);
    this.drops.at(-1)._id = this.drops.length - 1;

    if (top) {
      this.drops.push(
        this.rain
          .create(this.player.x, 0, "drop")
          .setBounce(0.01)
          .setCollideWorldBounds(true)
          .setScale(1)
          .refreshBody()
      );
      this.drops.at(-1).anims.play("fell");
      this.drops
        .at(-1)
        .setSize(this.drops.at(-1).width, this.drops.at(-1).height, true);
      this.drops.at(-1)._id = this.drops.length - 1;
    }
  }

  dropRain(drop, ground) {
    drop.destroy();
    this.drops.splice(drop._id, 1);
    this.splashes.push(
      this.physics.add.sprite(drop.x + 10, drop.y + 8, "splash")
    );
    this.splashes.at(-1).anims.play("spl");
    this.splashes.at(-1)._id = this.splashes.length - 1;
    this.splashes.at(-1).on("animationcomplete", (splash) => {
      this.splashes.at(-1).destroy();
      this.splashes.splice(-1);
    });
  }

  getLife(player, live) {
    live.destroy();
    this.liveChance = undefined;
    this.IterationCount = Phaser.Math.Between(
      this.minLifeGenIterations,
      this.maxLifeGenIterations
    );
    if (this.lives.length < 3) {
      this.lives.push(
        this.liveBar
          .create(
            this.game.config.width - 100 - this.lives.length * 50,
            this.lifeBarY,
            "life"
          )
          .setScale(0.8)
      );
    }
  }

  getDropStartPlaceX() {
    return Phaser.Math.Between(5, this.game.config.width - 5);
  }

  dropLife() {
    if (this.lives.length < 3) {
      if (!this.liveChance) {
        this.liveChance = this.live
          .create(this.getDropStartPlaceX(), this.startY, "life")
          .setScale(0.7);
      }
    }
    this.IterationCount = Phaser.Math.Between(
      this.minLifeGenIterations,
      this.maxLifeGenIterations
    );
  }
}
