class GameOver extends Phaser.Scene {
  constructor() {
    super("gameOver");
    this.button;
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

    this.load.image("playAgainBtn", "./assets/playAgainBtn.png");
    this.load.image("background", "./assets/background.png");
    this.load.image("greet", "./assets/gameovergreet.png");
    this.load.image("greetMob", "./assets/gameovermob.png");
  }

  playGame() {
    this.scene.start("playGame");
  }

  create() {
    const centerX = this.game.config.width / 2;
    const centerY = this.game.config.height / 2;
    if (this.game.config.width > 500) {
      // Greet card
      this.add.image(centerX, centerY, "greet");
      // Score
      const score = `Score: ${!this.game.score ? 0 : this.game.score}`;
      const textConfig = {
        color: "#ffffff",
        fontFamily: 'bobby, Georgia, "Goudy Bookletter 1911", Times, serif',
        fontSize: "30px",
      };
      this.add.text(centerX, 100, score, textConfig).setOrigin(0.5);

      // button
      let button = this.add
        .image(centerX, centerY + 200, "playAgainBtn")
        .setScale(0.3);
      button.setInteractive({ cursor: "pointer" });
      button.on("pointerdown", this.playGame.bind(this));
    } else {
      this.add.image(centerX, centerY, "greetMob");
      // Score
      const score = `Score: ${!this.game.score ? 0 : this.game.score}`;
      const textConfig = {
        color: "#ffffff",
        fontFamily: 'bobby, Georgia, "Goudy Bookletter 1911", Times, serif',
        fontSize: "30px",
      };
      this.add.text(centerX, centerY + 100, score, textConfig).setOrigin(0.5);

      // button
      let button = this.add
        .image(centerX, centerY + 200, "playAgainBtn")
        .setScale(0.3);
      button.setInteractive();
      button.on("pointerdown", this.playGame.bind(this));
    }
  }

  update() {}
}

// const h1 = ["Oh", "DEER!"];
// const centerX = this.game.config.width / 2;
// // Add h1
// this.add
//   .text(centerX, 100, h1, {
//     fontFamily: "Arial",
//     color: "#00ff00",
//   })
//   .setOrigin(0.5);

// this.add
//   .text(
//     this.game.config.width / 2,
//     this.game.config.height / 2 - 100,
//     "It's a pleasure to work with you and a joy to wish you a merry Christmas!",
//     {
//       color: "#000000",
//       fontFamily: 'bobby, Georgia, "Goudy Bookletter 1911", Times, serif',
//       fontSize: "20px",
//       align: "center",
//     }
//   )
//   .setOrigin(0.5);
