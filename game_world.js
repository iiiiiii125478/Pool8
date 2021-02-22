function GameWorld() {
    this.balls = [
        new Ball(sprites.ball_1, new Vector(1700, 1285)),
        new Ball(sprites.ball_2, new Vector(1565, 1210)),
        new Ball(sprites.ball_3, new Vector(1565, 1360)),
        new Ball(sprites.ball_4, new Vector(1430, 1137)),
        new Ball(sprites.ball_8, new Vector(1430, 1285)),
        new Ball(sprites.ball_6, new Vector(1430, 1433)),
        new Ball(sprites.ball_7, new Vector(1295, 1063)),
        new Ball(sprites.ball_5, new Vector(1295, 1210)),
        new Ball(sprites.ball_9, new Vector(1295, 1360)),
        new Ball(sprites.ball_10, new Vector(1295, 1507)),
        new Ball(sprites.ball_11, new Vector(1160, 992)),
        new Ball(sprites.ball_12, new Vector(1160, 1137)),
        new Ball(sprites.ball_13, new Vector(1160, 1285)),
        new Ball(sprites.ball_14, new Vector(1160, 1433)),
        new Ball(sprites.ball_15, new Vector(1160, 1581)),
        new Ball(sprites.ball_16, new Vector(3440, 1285)),
    ];

    this.whiteBall = this.balls[this.balls.length - 1]
    this.cue = new Cue(
        this.whiteBall.position.clone(),
        this.whiteBall.shoot.bind(this.whiteBall)
    );
}

GameWorld.prototype.handleColisions = function () {
    for (let i = 0; i < this.balls.length; ++i) {
        if (!this.balls[i].isMove) continue;
        for (let j = 0; j < this.balls.length; ++j) {
            if (i == j) continue;
            const ball_1 = this.balls[i];
            const ball_2 = this.balls[j];
            ball_1.colisionWithBall(ball_2);
        }
    }
}

GameWorld.prototype.update = function () {
    this.handleColisions();

    this.balls.forEach(ball => {
        ball.update();
    });

    let isMove = this.balls.some(ball => ball.isMove === true);
    if (!Mouse.left.down && !isMove) {
        this.cue.updatePosition(this.whiteBall.position);
    }

    this.cue.update();
}

GameWorld.prototype.draw = function () {
    Canvas.drawImage(sprites.table, { x: 0, y: 0 });

    this.balls.forEach(ball => {
        ball.draw();
    });
    this.cue.draw();
}
