
// global variables for objects' references
const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')
const ballX = canvas.width / 2
const ballY = canvas.height / 2
const ballRadius = 10
let deltaBallX = 1
let deltaBallY = -1
const paddleHeight = 10
const paddleWidth = 75
let paddleX = (canvas.width - paddleWidth) / 2

class Game {
  constructor () {
    this.canvas = canvas
    this.ctx = ctx
    this.size = {
      width: this.canvas.width,
      height: this.canvas.height }
    this.paddle = new Paddle(this, paddleHeight, paddleWidth, paddleX)
    this.ball = new Ball(this, deltaBallX, deltaBallY, ballX, ballY)
    this.ticks = 0
    let tick = () => {
      this.ticks++
      this.update()
      this.draw()

      window.requestAnimationFrame(tick)
    }
    this.tick = tick
  }
  update () {
    console.log('update')
  }
  draw () {
    // clear frame to remove past drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // draw ball, updates position after every draw in function
    this.ball.draw()
    // draw paddle
    this.paddle.draw()
  }
  start () {
    this.tick()
  }
}

class Ball {
  constructor (game, deltaBallX, deltaBallY, ballX, ballY) {
    this.game = game
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
    // if next position hits X edges then change deltaBallX
    if (this.Pos.x + deltaBallX > canvas.width - ballRadius ||
        this.Pos.x + deltaBallX < ballRadius) {
      deltaBallX = -deltaBallX
    }
    // if next position hits Y edges then change deltaBallY
    if (this.Pos.y + deltaBallY > canvas.height - ballRadius ||
        this.Pos.y + deltaBallY < ballRadius) {
      deltaBallY = -deltaBallY
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
    ctx.beginPath()
    ctx.rect(this.Pos.x, this.Pos.y, paddleWidth, paddleHeight)
    ctx.fillStyle = '#0095DD'
    ctx.fill()
    ctx.closePath()
  }
}

let game = new Game('myCanvas')
game.start()
