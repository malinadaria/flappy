import './style.css'; // подтянет и вставит в <head>

const RAD = Math.PI / 180;
const scrn = document.getElementById("canvas");
const context = scrn.getContext("2d");
scrn.tabIndex = 1;

scrn.addEventListener("click", () => {
  switch (state.curr) {
    case state.getReady:
      state.curr = state.Play;
      SFX.start.play();
      break;
    case state.Play:
      bird.flap();
      break;
    case state.gameOver:
      state.curr = state.getReady;
      bird.speed = 0;
      bird.y = 100;
      pipe.pipes = [];
      UI.score.curr = 0;
      SFX.played = false;
      break;
  }
});

scrn.onkeydown = function keyDown(e) {
  if (e.keyCode == 32 || e.keyCode == 87 || e.keyCode == 38) {
    // Space Key or W key or arrow up
    switch (state.curr) {
      case state.getReady:
        state.curr = state.Play;
        SFX.start.play();
        break;
      case state.Play:
        bird.flap();
        break;
      case state.gameOver:
        state.curr = state.getReady;
        bird.speed = 0;
        bird.y = 100;
        pipe.pipes = [];
        UI.score.curr = 0;
        SFX.played = false;
        break;
    }
  }
};

let frames = 0;
let dx = 2;
const state = {
  curr: 0,
  getReady: 0,
  Play: 1,
  gameOver: 2,
};
const SFX = {
  start: new Audio(),
  flap: new Audio(),
  score: new Audio(),
  hit: new Audio(),
  die: new Audio(),
  played: false,
};
const gnd = {
  sprite: new Image(),
  x: 0,
  y: 0,
  draw: function () {
    this.y = parseFloat(scrn.height - this.sprite.height);
    context.drawImage(this.sprite, this.x, this.y);
  },
  update: function () {
    if (state.curr != state.Play) return;
    this.x -= dx;
    this.x = this.x % (this.sprite.width / 2);
  },
};
const bg = {
  sprite: new Image(),
  x: 0,
  y: 0,
  draw: function () {
    this.y = parseFloat(scrn.height - this.sprite.height);
    context.drawImage(this.sprite, this.x, this.y);
  },
};
const pipe = {
  top: { sprite: new Image() },
  bot: { sprite: new Image() },
  gap: 85,
  moved: true,
  pipes: [],
  draw: function () {
    for (let i = 0; i < this.pipes.length; i++) {
      let p = this.pipes[i];
      context.drawImage(this.top.sprite, p.x, p.y);
      context.drawImage(
        this.bot.sprite,
        p.x,
        p.y + parseFloat(this.top.sprite.height) + this.gap
      );
    }
  },
  update: function () {
    if (state.curr != state.Play) return;
    if (frames % 100 == 0) {
      this.pipes.push({
        x: parseFloat(scrn.width),
        y: -210 * Math.min(Math.random() + 1, 1.8),
      });
    }
    this.pipes.forEach((pipe) => {
      pipe.x -= dx;
    });

    if (this.pipes.length && this.pipes[0].x < -this.top.sprite.width) {
      this.pipes.shift();
      this.moved = true;
    }
  },
};
const bird = {
  animations: [
    { sprite: new Image() },
    { sprite: new Image() },
    { sprite: new Image() },
    { sprite: new Image() },
  ],
  rotatation: 0,
  x: 50,
  y: 100,
  speed: 0,
  gravity: 0.125,
  thrust: 3.6,
  frame: 0,
  draw: function () {
    let h = this.animations[this.frame].sprite.height;
    let w = this.animations[this.frame].sprite.width;
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotatation * RAD);
    context.drawImage(this.animations[this.frame].sprite, -w / 2, -h / 2);
    context.restore();
  },
  update: function () {
    let r = this.animations[0].sprite.width / 2;
    switch (state.curr) {
      case state.getReady:
        this.rotatation = 0;
        this.y += frames % 10 == 0 ? Math.sin(frames * RAD) : 0;
        this.frame += frames % 10 == 0 ? 1 : 0;
        break;
      case state.Play:
        this.frame += frames % 5 == 0 ? 1 : 0;
        this.y += this.speed;
        this.setRotation();
        this.speed += this.gravity;
        if (this.y + r >= gnd.y || this.collisioned()) {
          state.curr = state.gameOver;
        }

        break;
      case state.gameOver:
        this.frame = 1;
        if (this.y + r < gnd.y) {
          this.y += this.speed;
          this.setRotation();
          this.speed += this.gravity * 2;
        } else {
          this.speed = 0;
          this.y = gnd.y - r;
          this.rotatation = 90;
          if (!SFX.played) {
            SFX.die.play();
            SFX.played = true;
          }
        }

        break;
    }
    this.frame = this.frame % this.animations.length;
  },
  flap: function () {
    if (this.y > 0) {
      SFX.flap.play();
      this.speed = -this.thrust;
    }
  },
  setRotation: function () {
    if (this.speed <= 0) {
      this.rotatation = Math.max(-25, (-25 * this.speed) / (-1 * this.thrust));
    } else if (this.speed > 0) {
      this.rotatation = Math.min(90, (90 * this.speed) / (this.thrust * 2));
    }
  },
  collisioned: function () {
    if (!pipe.pipes.length) return;
    let bird = this.animations[0].sprite;
    let x = pipe.pipes[0].x;
    let y = pipe.pipes[0].y;
    let r = bird.height / 4 + bird.width / 4;
    let roof = y + parseFloat(pipe.top.sprite.height);
    let floor = roof + pipe.gap;
    let w = parseFloat(pipe.top.sprite.width);
    if (this.x + r >= x) {
      if (this.x + r < x + w) {
        if (this.y - r <= roof || this.y + r >= floor) {
          SFX.hit.play();
          return true;
        }
      } else if (pipe.moved) {
        UI.score.curr++;
        SFX.score.play();
        pipe.moved = false;
      }
    }
  },
};
const UI = {
  getReady: { sprite: new Image() },
  gameOver: { sprite: new Image() },
  tap: [{ sprite: new Image() }, { sprite: new Image() }],
  score: {
    curr: 0,
    best: 0,
  },
  x: 0,
  y: 0,
  tx: 0,
  ty: 0,
  frame: 0,
  draw: function () {
    switch (state.curr) {
      case state.getReady:
        this.y = parseFloat(scrn.height - this.getReady.sprite.height) / 2;
        this.x = parseFloat(scrn.width - this.getReady.sprite.width) / 2;
        this.tx = parseFloat(scrn.width - this.tap[0].sprite.width) / 2;
        this.ty =
          this.y + this.getReady.sprite.height - this.tap[0].sprite.height;
        context.drawImage(this.getReady.sprite, this.x, this.y);
        context.drawImage(this.tap[this.frame].sprite, this.tx, this.ty);
        break;
      case state.gameOver:
        this.y = parseFloat(scrn.height - this.gameOver.sprite.height) / 2;
        this.x = parseFloat(scrn.width - this.gameOver.sprite.width) / 2;
        this.tx = parseFloat(scrn.width - this.tap[0].sprite.width) / 2;
        this.ty =
          this.y + this.gameOver.sprite.height - this.tap[0].sprite.height;
        context.drawImage(this.gameOver.sprite, this.x, this.y);
        context.drawImage(this.tap[this.frame].sprite, this.tx, this.ty);
        break;
    }
    this.drawScore();
  },
  drawScore: function () {
    context.fillStyle = "#FFFFFF";
    context.strokeStyle = "#000000";
    switch (state.curr) {
      case state.Play:
        context.lineWidth = "2";
        context.font = "35px Squada One";
        context.fillText(this.score.curr, scrn.width / 2 - 5, 50);
        context.strokeText(this.score.curr, scrn.width / 2 - 5, 50);
        break;
      case state.gameOver:
        context.lineWidth = "2";
        context.font = "40px Squada One";
        let sc = `SCORE :     ${this.score.curr}`;
        try {
          this.score.best = Math.max(
            this.score.curr,
            localStorage.getItem("best")
          );
          localStorage.setItem("best", this.score.best);
          let bs = `BEST  :     ${this.score.best}`;
          context.fillText(sc, scrn.width / 2 - 80, scrn.height / 2 + 0);
          context.strokeText(sc, scrn.width / 2 - 80, scrn.height / 2 + 0);
          context.fillText(bs, scrn.width / 2 - 80, scrn.height / 2 + 45);
          context.strokeText(bs, scrn.width / 2 - 80, scrn.height / 2 + 45);
        } catch (e) {}
        break;
    }
  },
  update: function () {
    this.frame += frames % 10 == 0 ? 1 : 0;
    this.frame = this.frame % 2;
  },
};

const images = [
  bird.animations[0],
  bird.animations[1],
  bird.animations[2],
  bird.animations[3],
  pipe.top,
  pipe.bot,
  gnd.sprite,
  bg.sprite,
  UI.getReady,
  UI.gameOver,
  UI.tap[0],
  UI.tap[1],
];

function loadImages(callback) {
  let loadedImages = 0;
  images.forEach((image, index) => {
    image.src = `assets/${index}.png`;
    image.onload = () => {
      loadedImages++;
      if (loadedImages === images.length) callback();
    };
  });
}

function gameLoop() {
  frames++;
  context.clearRect(0, 0, scrn.width, scrn.height);

  bg.draw();
  gnd.draw();
  pipe.update();
  pipe.draw();
  bird.update();
  bird.draw();
  UI.update();
  UI.draw();

  requestAnimationFrame(gameLoop);
}

loadImages(() => {
  SFX.start.src = "assets/start.mp3";
  SFX.flap.src = "assets/flap.mp3";
  SFX.score.src = "assets/score.mp3";
  SFX.hit.src = "assets/hit.mp3";
  SFX.die.src = "assets/die.mp3";
  state.curr = state.getReady;
  gameLoop();
});
