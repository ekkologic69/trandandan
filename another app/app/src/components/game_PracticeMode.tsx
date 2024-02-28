/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game_PracticeMode.tsx                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mounikor <mounikor@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/06 10:58:41 by mel-kora          #+#    #+#             */
/*   Updated: 2023/12/28 17:48:50 by mounikor         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import Sketch from "react-p5";
import p5Types from "p5";
import "p5/lib/addons/p5.sound";
// import { useNavigate } from 'react-router-dom';

class Ball {
  x: number;
  y: number;
  d: number;
  hit: number;
  velox: number;
  veloy: number;
  constructor(cvw: number, cvh: number) {
    this.x = cvw / 2;
    this.y = cvh / 2;
    this.d = cvh / 30;
    this.hit = 0;
    this.velox = 0;
    this.veloy = 1;
  }
}

class Paddle {
  x: number;
  y: number;
  w: number;
  h: number;
  score: number;
  speed: number;
  constructor(x: number, y: number, cvw: number, cvh: number) {
    this.x = x;
    this.y = y;
    this.w = cvw / 50;
    this.h = cvh / 4;
    this.score = 0;
    this.speed = 5;
  }
}

//variables
var lvl = 0.1;
var win = 5;
var cvw = window.innerWidth * 0.8;
var cvh = cvw * 0.7;
while (cvh > window.innerHeight - 55) {
  cvw--;
  cvh = cvw * 0.7;
}
var ball = new Ball(cvw, cvh);
var bot = new Paddle(cvw / 60 / 2, cvh / 2, cvw, cvh);
var user = new Paddle(cvw - cvw / 60 / 2, cvh / 2, cvw, cvh);
// const win_urls = [];
// var bounceSounds:p5Types.SoundFile[], winSounds:p5Types.SoundFile[], loseSounds:p5Types.SoundFile[];
// var bounceSound:p5Types.SoundFile, winSound:p5Types.SoundFile, loseSound:p5Types.SoundFile;

//responsivity
function updateDimensions() {
  user.y /= cvh;
  bot.y /= cvh;
  ball.y /= cvh;
  ball.x /= cvw;
  cvw = window.innerWidth * 0.8;
  cvh = cvw * 0.7;
  while (cvh > window.innerHeight - 55) {
    cvw--;
    cvh = cvw * 0.7;
  }
  ball.y *= cvh;
  ball.x *= cvw;
  ball.d = cvh / 30;
  bot.w = cvw / 50;
  bot.h = cvh / 4;
  bot.x = cvw / 60 / 2;
  user.w = cvw / 50;
  user.h = cvh / 4;
  user.x = cvw - cvw / 60 / 2;
  user.y *= cvh;
  bot.y *= cvh;
}

let PracticeMode = () => {
  const preload = (p5: p5Types) => {
    // bounceSound = p5.loadSound('assets/bounce.mp3')
    // winSound = p5.loadSound('assets/win.mp3');
    // loseSound = p5.loadSound('assets/lose.mp3');
  };

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(cvw, cvh).parent(canvasParentRef);
    p5.rectMode(p5.CENTER);
    p5.textAlign(p5.CENTER);
    window.addEventListener("resize", updateDimensions);
  };

  const draw = (p5: p5Types) => {
    p5.resizeCanvas(cvw, cvh);
    game_drawer(p5);
    if (user.score < win && bot.score < win) {
      user_mover(p5);
      bot_mover();
      ball_mover();
    } else {
      p5.background("#2D097F");
      p5.noFill();
      p5.stroke("#CCD6DD");
      p5.rect(cvw / 2, cvh / 2, cvw, cvh);
      p5.fill("#FF7E03");
      p5.textSize(cvh / 15);
      p5.noStroke();
      if (bot.score === win) {
        p5.text("Game over.. You lost!", cvw / 2, cvh / 2);
        // loseSound.play();
      } else {
        p5.text("Game over.. You won!", cvw / 2, cvh / 2);
        // winSound.play();
      }
      // p5.stroke("#CCD6DD");
      // let back_button = p5.createButton('Go back');
      // let again_button = p5.createButton('Try again');
      // back_button.position(cvw/3, cvh*2/3);
      // again_button.position(cvw*2/3, cvh*2/3);
      // back_button.mousePressed(() => {nav("/home");});
      // again_button.mousePressed(() => {nav("/Bot");});
    }
  };
  return <Sketch preload={preload} setup={setup} draw={draw} />;
};

// const nav = useNavigate();

function game_drawer(p5: p5Types) {
  p5.background("#2D097F");
  p5.noFill();
  p5.stroke("#CCD6DD");
  p5.rect(cvw / 2, cvh / 2, cvw, cvh);
  p5.rect(0, cvh / 2, cvw, cvh);
  //draw ball and players
  p5.fill("#CCD6DD");
  p5.noStroke();
  p5.circle(ball.x, ball.y, ball.d);
  p5.rect(user.x, user.y, user.w, user.h);
  p5.rect(bot.x, bot.y, bot.w, bot.h);
  //draw scores
  p5.textSize((30 * cvh) / 500);
  p5.text(bot.score, cvw / 3, cvh / 10);
  p5.text(user.score, (cvw * 2) / 3, cvh / 10);
}

function user_mover(p5: p5Types) {
  if (
    (p5.key === "w" || p5.keyCode === p5.UP_ARROW) &&
    p5.keyIsPressed &&
    user.y > user.h / 2
  )
    user.y -= user.speed;
  if (user.y < user.h / 2) user.y = user.h / 2;
  if (
    (p5.key === "s" || p5.keyCode === p5.DOWN_ARROW) &&
    p5.keyIsPressed &&
    user.y < cvh - user.h / 2
  )
    user.y += user.speed;
  if (user.y > cvh - user.h / 2) user.y = cvh - user.h / 2;
  //la dar escape ykhroj
}

function bot_mover() {
  if (ball.velox < 0) bot.y += (ball.y - bot.y) * lvl;
  if (bot.y < bot.h / 2) bot.y = bot.h / 2;
  if (bot.y + bot.h / 2 > cvh) bot.y = cvh - bot.h / 2;
}

function ball_mover() {
  serving();
  moving();
  bouncing();
  if (ball.x >= cvw || ball.x <= 0) scoring();
}

function serving() {
  if (!ball.velox) {
    if ((user.score + bot.score) % 2) ball.velox = -1;
    else ball.velox = 1;
  }
}

function moving() {
  ball.x += ball.velox * (ball.hit + 2);
  ball.y += ball.veloy * (ball.hit + 2);
}

function bouncing() {
  // bounceSound.play();
  if (ball.y + ball.d / 2 >= cvh || ball.y <= ball.d / 2) ball.veloy *= -1;
  if (ball.y + ball.d / 2 > cvh) ball.y = cvh - ball.d / 2;
  else if (ball.y < ball.d / 2) ball.y = ball.d / 2;
  let player_paddle = ball.velox > 0 ? user : bot;
  if (collision(player_paddle, ball)) {
    mechanics(player_paddle, ball);
    ball.velox *= -1;
    if (ball.hit < 13) {
      ball.hit++;
      user.speed++;
    }
  }
}

function scoring() {
  if (ball.x >= cvw) bot.score++;
  if (ball.x <= 0) user.score++;
  ball.x = cvw / 2;
  ball.y = cvh / 2;
  ball.hit = 0;
  ball.velox = 0;
  user.speed = 5;
}

function mechanics(p: Paddle, b: Ball) {
  if (b.y > p.y - 1 && b.y < p.y + 1) b.veloy = 0;
  else if (b.y <= p.h / 2 || (!b.veloy && b.y < p.y)) b.veloy = -1;
  else if (b.y >= p.y + p.h / 2 || (!b.veloy && b.y > p.y)) b.veloy = 1;
}

function collision(p: Paddle, b: Ball) {
  let p_top = p.y - p.h / 2;
  let p_bottom = p.y + p.h / 2;
  let p_right = p.x + p.w / 2;
  let p_left = p.x - p.w / 2;
  let b_top = b.y - b.d / 2;
  let b_bottom = b.y + b.d / 2;
  let b_right = b.x + b.d / 2;
  let b_left = b.x - b.d / 2;
  return (
    p_top <= b_bottom &&
    p_bottom >= b_top &&
    p_right >= b_left &&
    p_left <= b_right
  );
}

export default PracticeMode;
