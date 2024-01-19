// app/javascript/controllers/pong_game_controller.js
import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["paddle1", "paddle2", "board", "ball", "player1Score", "player2Score", "message"];

  connect() {
    this.gameState = 'start';
    this.dx = Math.floor(Math.random() * 4) + 3;
    this.dy = Math.floor(Math.random() * 4) + 3;
    this.dxd = Math.floor(Math.random() * 2);
    this.dyd = Math.floor(Math.random() * 2);

    this.paddle1Coord = this.paddle1Target.getBoundingClientRect();
    this.paddle2Coord = this.paddle2Target.getBoundingClientRect();
    this.initialBallCoord = this.ballTarget.getBoundingClientRect();
    this.ballCoord = this.initialBallCoord;
    this.boardCoord = this.boardTarget.getBoundingClientRect();
    this.paddleCommon = this.element.querySelector('.paddle').getBoundingClientRect();

    document.addEventListener('keydown', (e) => this.handleKeyDown(e));

    this.updateMessage('Press Enter to Play Pong');
  }

  handleKeyDown(event) {
    if (event.key === 'Enter') {
      this.gameState = this.gameState === 'start' ? 'play' : 'start';
      if (this.gameState === 'play') {
        this.updateMessage('Game Started');
        this.animateGame();
      }
    }

    if (this.gameState === 'play') {
      this.handlePaddleMovement(event);
    }
  }

  handlePaddleMovement(event) {
    if (event.key === 'w') {
      this.movePaddle(this.paddle1Target, 'top', -0.06);
    }

    if (event.key === 's') {
      this.movePaddle(this.paddle1Target, 'bottom', 0.06);
    }

    if (event.key === 'ArrowUp') {
      this.movePaddle(this.paddle2Target, 'top', -0.1);
    }

    if (event.key === 'ArrowDown') {
      this.movePaddle(this.paddle2Target, 'bottom', 0.1);
    }
  }

  movePaddle(paddle, edge, factor) {
    const topValue = Math.max(
      this.boardCoord.top,
      paddle.getBoundingClientRect().top + window.innerHeight * factor
    );
    const bottomValue = Math.min(
      this.boardCoord.bottom - this.paddleCommon.height,
      paddle.getBoundingClientRect().bottom + window.innerHeight * factor
    );

    paddle.style[edge] = topValue + 'px';
    this.updatePaddleCoordinates();
  }

  animateGame() {
    requestAnimationFrame(() => this.moveBall());
  }

  moveBall() {
    if (this.ballCoord.top <= this.boardCoord.top) {
      this.dyd = 1;
    }

    if (this.ballCoord.bottom >= this.boardCoord.bottom) {
      this.dyd = 0;
    }

    if (
      this.ballCoord.left <= this.paddle1Coord.right &&
      this.ballCoord.top >= this.paddle1Coord.top &&
      this.ballCoord.bottom <= this.paddle1Coord.bottom
    ) {
      this.dxd = 1;
      this.randomizeBallDirection();
    }

    if (
      this.ballCoord.right >= this.paddle2Coord.left &&
      this.ballCoord.top >= this.paddle2Coord.top &&
      this.ballCoord.bottom <= this.paddle2Coord.bottom
    ) {
      this.dxd = 0;
      this.randomizeBallDirection();
    }

    if (this.ballCoord.left <= this.boardCoord.left || this.ballCoord.right >= this.boardCoord.right) {
      this.handleScore();
      this.resetGame();
      return;
    }

    this.updateBallPosition();
    this.ballCoord = this.ballTarget.getBoundingClientRect();
    this.animateGame();
  }

  randomizeBallDirection() {
    this.dx = Math.floor(Math.random() * 4) + 3;
    this.dy = Math.floor(Math.random() * 4) + 3;
  }

  updateBallPosition() {
    this.ballTarget.style.top = this.ballCoord.top + this.dy * (this.dyd === 0 ? -1 : 1) + 'px';
    this.ballTarget.style.left = this.ballCoord.left + this.dx * (this.dxd === 0 ? -1 : 1) + 'px';
  }

  handleScore() {
    if (this.ballCoord.left <= this.boardCoord.left) {
      this.player2ScoreTarget.innerHTML = +this.player2ScoreTarget.innerHTML + 1;
    } else {
      this.player1ScoreTarget.innerHTML = +this.player1ScoreTarget.innerHTML + 1;
    }
  }

  resetGame() {
    this.gameState = 'start';
    this.ballCoord = this.initialBallCoord;
    this.ballTarget.style = this.initialBall.style;
    this.updateMessage('Press Enter to Play Pong');
  }

  updateMessage(text) {
    this.messageTarget.innerHTML = text;
    this.messageTarget.style.left = 38 + 'vw';
  }

  updatePaddleCoordinates() {
    this.paddle1Coord = this.paddle1Target.getBoundingClientRect();
    this.paddle2Coord = this.paddle2Target.getBoundingClientRect();
  }
}
