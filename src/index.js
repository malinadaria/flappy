import './style.css'; // Подключение CSS, Webpack вставит в <head>

// Импорт изображений
import groundImg from './assets/images/ground.png';
import bgImg from './assets/images/BG.png';
import topPipeImg from './assets/images/toppipe.png';
import botPipeImg from './assets/images/botpipe.png';
import goImg from './assets/images/go.png';
import getReadyImg from './assets/images/getready.png';
import tap0Img from './assets/images/tap/t0.png';
import tap1Img from './assets/images/tap/t1.png';
import bird0Img from './assets/images/bird/b0.png';
import bird1Img from './assets/images/bird/b1.png';
import bird2Img from './assets/images/bird/b2.png';

// Импорт звуков
import startSfx from './assets/audio/start.mp3';
import flapSfx from './assets/audio/flap.mp3';
import scoreSfx from './assets/audio/score.mp3';
import hitSfx from './assets/audio/hit.mp3';
import dieSfx from './assets/audio/die.mp3';

const RAD = Math.PI / 180;
const scrn = document.getElementById("canvas");
const context = scrn.getContext("2d");
scrn.tabIndex = 1;

scrn.addEventListener("click", () => handleInput());
scrn.onkeydown = function (e) {
  if (e.keyCode === 32 || e.keyCode === 87 || e.keyCode === 38) {
    handleInput();
  }
};

function handleInput() {
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

let frames = 0;
let dx = 2;

const state = {
  curr: 0,
  getReady: 0,
  Play: 1,
  gameOver: 2,
};

const SFX = {
  start: new Audio(startSfx),
  flap: new Audio(flapSfx),
  score: new Audio(scoreSfx),
  hit: new Audio(hitSfx),
  die: new Audio(dieSfx),
  played: false,
};

const gnd = {
  sprite: new Image(),
  x: 0,
  y: 0,
  draw() {
    this.y = scrn.height - this.sprite.height;
    context.drawImage(this.sprite, this.x, this.y);
  },
  update() {
    if (state.curr !== state.Play) return;
    this.x = (this.x - dx) % (this.sprite.width / 2);
  },
};

const bg = {
  sprite: new Image(),
  x: 0,
  draw() {
    const y = scrn.height - this.sprite.height;
    context.drawImage(this.sprite, this.x, y);
  },
};

const pipe = {
  top: { sprite: new Image() },
  bot: { sprite: new Image() },
  gap: 85,
  moved: true,
  pipes: [],
  draw() {
    for (const p of this.pipes) {
      context.drawImage(this.top.sprite, p.x, p.y);
      context.drawImage(this.bot.sprite, p.x, p.y + this.top.sprite.height + this.gap);
    }
  },
  update() {
    if (state.curr !== state.Play) return;
    if (frames % 100 === 0) {
      this.pipes.push({
        x: scrn.width,
        y: -210 * Math.min(Math.random() + 1, 1.8),
      });
    }
    this.pipes.forEach(p => p.x -= dx);
    if (this.pipes.length && this.pipes[0].x < -this.top.sprite.width) {
      this.pipes.shift();
      this.moved = true;
    }
  },
};

const bird = {
  animations: [new Image(), new Image(), new Image(), new Image()],
  rotation: 0,
  x: 50,
  y: 100,
  speed: 0,
  gravity: 0.125,
  thrust: 3.6,
  frame: 0,
  draw() {
    const sprite = this.animations[this.frame];
    const h = sprite.height;
    const w = sprite.width;
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation * RAD);
    context.drawImage(sprite, -w / 2, -h / 2);
    context.restore();
  },
  update() {
    const r = this.animations[0].width / 2;
    switch (state.curr) {
      case state.getReady:
        this.rotation = 0;
        if (frames % 10 === 0) {
          this.y += Math.sin(frames * RAD);
          this.frame = (this.frame + 1) % this.animations.length;
        }
        break;
      case state.Play:
        if (frames % 5 === 0) {
          this.frame = (this.frame + 1) % this.animations.length;
        }
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
          this.rotation = 90;
          if (!SFX.played) {
            SFX.die.play();
            SFX.played = true;
          }
        }
        break;
    }
  },
  flap() {
    if (this.y > 0) {
      SFX.flap.play();
      this.speed = -this.thrust;
    }
  },
  setRotation() {
    if (this.speed <= 0) {
      this.rotation = Math.max(-25, (-25 * this.speed) / (-1 * this.thrust));
    } else {
      this.rotation = Math.min(90, (90 * this.speed) / (this.thrust * 2));
    }
  },
  collisioned() {
    if (!pipe.pipes.length) return false;
    const birdImg = this.animations[0];
    const p = pipe.pipes[0];
    const r = birdImg.height / 4 + birdImg.width / 4;
    const roof = p.y + pipe.top.sprite.height;
    const floor = roof + pipe.gap;
    const w = pipe.top.sprite.width;
    if (this.x + r >= p.x && this.x + r < p.x + w) {
      if (this.y - r <= roof || this.y + r >= floor) {
        SFX.hit.play();
        return true;
      }
    } else if (pipe.moved && this.x + r >= p.x + w) {
      UI.score.curr++;
      SFX.score.play();
      pipe.moved = false;
    }
    return false;
  },
};

const UI = {
  getReady: new Image(),
  gameOver: new Image(),
  tap: [new Image(), new Image()],
  score: { curr: 0, best: 0 },
  frame: 0,
  draw() {
    switch (state.curr) {
      case state.getReady:
        this.drawCentered(this.getReady, 0);
        this.drawCentered(this.tap[this.frame], 50);
        break;
      case state.gameOver:
        this.drawCentered(this.gameOver, 0);
        this.drawCentered(this.tap[this.frame], 50);
        break;
    }
    this.drawScore();
  },
  drawCentered(img, offsetY) {
    const x = (scrn.width - img.width) / 2;
    const y = (scrn.height - img.height) / 2 + offsetY;
    context.drawImage(img, x, y);
  },
  drawScore() {
    context.fillStyle = "#FFFFFF";
    context.strokeStyle = "#000000";
    context.lineWidth = "2";
    context.font = "35px Squada One";
    if (state.curr === state.Play) {
      context.fillText(this.score.curr, scrn.width / 2 - 5, 50);
      context.strokeText(this.score.curr, scrn.width / 2 - 5, 50);
    } else if (state.curr === state.gameOver) {
      const sc = `SCORE :     ${this.score.curr}`;
      try {
        this.score.best = Math.max(this.score.curr, +localStorage.getItem("best") || 0);
        localStorage.setItem("best", this.score.best);
        const bs = `BEST  :     ${this.score.best}`;
        context.fillText(sc, scrn.width / 2 - 80, scrn.height / 2 + 0);
        context.strokeText(sc, scrn.width / 2 - 80, scrn.height / 2 + 0);
        context.fillText(bs, scrn.width / 2 - 80, scrn.height / 2 + 30);
        context.strokeText(bs, scrn.width / 2 - 80, scrn.height / 2 + 30);
      } catch {
        context.fillText(sc, scrn.width / 2 - 85, scrn.height / 2 + 15);
        context.strokeText(sc, scrn.width / 2 - 85, scrn.height / 2 + 15);
      }
    }
  },
  update() {
    if (state.curr === state.Play) return;
    if (frames % 10 === 0) {
      this.frame = (this.frame + 1) % this.tap.length;
    }
  },
};

// Загрузка изображений
gnd.sprite.src = groundImg;
bg.sprite.src = bgImg;
pipe.top.sprite.src = topPipeImg;
pipe.bot.sprite.src = botPipeImg;
UI.gameOver.src = goImg;
UI.getReady.src = getReadyImg;
UI.tap[0].src = tap0Img;
UI.tap[1].src = tap1Img;
bird.animations[0].src = bird0Img;
bird.animations[1].src = bird1Img;
bird.animations[2].src = bird2Img;
bird.animations[3].src = bird0Img; // повторы ок

// Основной цикл игры
function gameLoop() {
  update();
  draw();
  frames++;
}

function update() {
  bird.update();
  gnd.update();
  pipe.update();
  UI.update();
}

function draw() {
  context.fillStyle = "#30c0df";
  context.fillRect(0, 0, scrn.width, scrn.height);
  bg.draw();
  pipe.draw();
  bird.draw();
  gnd.draw();
  UI.draw();
}

setInterval(gameLoop, 20);
