
// global variables for objects' references
const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')
const ballRadius = 10
let deltaBallX = 2
let deltaBallY = -2
const paddleHeight = 10
const paddleWidth = 75
let paddleX = (canvas.width - paddleWidth) / 2
const ballX = paddleX
const ballY = canvas.height - paddleHeight
let rightPressed = false
let leftPressed = false
let ballOnPaddle = true

const brickRowCount = 3
const brickColumnCount = 5
const brickWidth = 75
const brickHeight = 20
const brickPadding = 10
const brickOffsetTop = 30
const brickOffsetLeft = 30

class Game {
  constructor () {
    this.canvas = canvas
    this.ctx = ctx
    this.size = {
      width: this.canvas.width,
      height: this.canvas.height }
    this.paddle = new Paddle(this, paddleHeight, paddleWidth, paddleX)
    this.ball = new Ball(this, deltaBallX, deltaBallY, ballX, ballY, this.paddle)
    this.bricks = []
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop
        this.bricks.push(new Brick(this, brickX, brickY))
      }
    }
    this.ticks = 0
    let tick = () => {
      this.ticks++
      this.draw()
      window.requestAnimationFrame(tick)
    }
    this.tick = tick

    document.addEventListener('keydown', keyDownHandler, false)
    document.addEventListener('keyup', keyUpHandler, false)
  }

  draw () {
    // check for brick collisions
    this.checkBrickCollision()
    // clear frame to remove past drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // draw paddle
    this.paddle.draw()
    // draw ball, updates position after every draw in function
    this.ball.draw()
    for (let brick of this.bricks) {
      brick.draw()
    }
  }

  checkBrickCollision () {
    for (let b of this.bricks) {
      if (this.ball.Pos.x > b.Pos.x &&
          this.ball.Pos.x < b.Pos.x + brickWidth &&
          this.ball.Pos.y > b.Pos.y &&
          this.ball.Pos.y < b.Pos.y + brickHeight) {
        deltaBallY = -deltaBallY
        b.hit = true
      }
    }

    this.bricks = this.bricks.filter(brick => !brick.hit)
  }

  start () {
    this.tick()
  }
}

class Ball {
  constructor (game, deltaBallX, deltaBallY, ballX, ballY, paddle) {
    this.game = game
    this.paddle = paddle
    this.Pos = {x: ballX, y: ballY}
    this.radius = ballRadius
    this.velocity = {x: deltaBallX, y: deltaBallY}
  }
  draw () {
    // actually draws the ball
    ctx.beginPath()
    ctx.arc(this.Pos.x, this.Pos.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = '#17A398'
    ctx.fill()
    ctx.closePath()

    if (ballOnPaddle) {
      this.Pos.x = this.game.paddle.Pos.x + paddleWidth / 2
      this.Pos.y = canvas.height - paddleHeight
      return
    }

    // if next position hits X edges then change deltaBallX
    if (this.Pos.x + deltaBallX > canvas.width - ballRadius ||
        this.Pos.x + deltaBallX < ballRadius) {
      deltaBallX = -deltaBallX
    }
    // if next position hits Y edges then change deltaBallY
    if (this.Pos.y + deltaBallY < ballRadius) {
      deltaBallY = -deltaBallY
    } else if (this.Pos.y + deltaBallY > canvas.height - ballRadius) {
      if (this.Pos.x > this.paddle.Pos.x && this.Pos.x < this.paddle.Pos.x + paddleWidth) {
        deltaBallY = -deltaBallY
      } else {
        // window.alert('game over')
        document.location.reload()
      }
    }
    // add delta to position for next draw frame
    this.Pos.x += deltaBallX
    this.Pos.y += deltaBallY
  }
}

class Paddle {
  constructor (game, paddleHeight, paddleWidth, paddleX) {
    this.Pos = {x: paddleX, y: canvas.height - paddleHeight}
  }
  draw () {
    if (rightPressed && this.Pos.x < canvas.width - paddleWidth) {
      this.Pos.x += 7
    } else if (leftPressed && this.Pos.x > 0) {
      this.Pos.x -= 7
    }

    ctx.beginPath()
    ctx.rect(this.Pos.x, this.Pos.y, paddleWidth, paddleHeight)
    ctx.fillStyle = '#0095DD'
    ctx.fill()
    ctx.closePath()
  }
}

class Brick {
  constructor (game, x, y) {
    this.Pos = {x: x, y: y}
    this.hit = false
  }
  draw () {
    ctx.beginPath()
    ctx.rect(this.Pos.x, this.Pos.y, brickWidth, brickHeight)
    ctx.fillStyle = '#0095DD'
    ctx.fill()
    ctx.closePath()
  }
}

function keyDownHandler (e) {
  if (e.keyCode === 39) {
    rightPressed = true
  } else if (e.keyCode === 37) {
    leftPressed = true
  } else if (e.keyCode === 32) {
    ballOnPaddle = false
  }
}

function keyUpHandler (e) {
  if (e.keyCode === 39) {
    rightPressed = false
  } else if (e.keyCode === 37) {
    leftPressed = false
  }
}

let game = new Game('myCanvas')
game.start()
