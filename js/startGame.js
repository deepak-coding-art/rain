class StartGame extends Phaser.Scene {
  constructor() {
    super("startGame");
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

    this.load.image("playBtn", "./assets/playBtn.png");
    this.load.image("background", "./assets/background.png");
  }

  playGame() {
    this.scene.start("playGame");
  }

  create() {
    const centerX = this.game.config.width / 2;
    const centerY = this.game.config.height / 2;
    this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "background"
    );
    // Help
    let objectives = ["Objective:", "Avoid the rain drops to save your lives!"];
    let lines = [
      "Controls:",
      "Press left, right arrow key to go left and right",
      "up key for jump",
    ];
    let textConfig = {
      color: "#000000",
      fontFamily: 'bobby, Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "30px",
    };
    if (this.game.config.width < 500) {
      objectives = [
        "Objective:",
        "Avoid the rain drops",
        "to save your lives!",
      ];
      lines = [
        "Controls:",
        "touch Left to go left and",
        "right to go right on screen",
        "double tap for jump",
      ];
    }

    objectives.forEach((objective, index) => {
      this.add
        .text(centerX, centerY - 330 + index * 30, objective, textConfig)
        .setOrigin(0.5);
    });

    lines.forEach((line, index) => {
      this.add
        .text(centerX, centerY - 200 + index * 30, line, textConfig)
        .setOrigin(0.5);
    });

    let button = this.add
      .image(this.game.config.width / 2, this.game.config.height / 2, "playBtn")
      .setScale(0.5);
    button.setInteractive({ cursor: "pointer" });
    button.on("pointerdown", this.playGame.bind(this));
  }

  update() {}
}
