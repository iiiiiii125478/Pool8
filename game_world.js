function GameWorld() {
    this.balls = [
        new Ball(sprites.ball_1, new Vector(1700, 1285)),
        new Ball(sprites.ball_14, new Vector(1565, 1210)),
        new Ball(sprites.ball_2, new Vector(1565, 1360)),
        new Ball(sprites.ball_3, new Vector(1430, 1137)),
        new Ball(sprites.ball_8, new Vector(1430, 1285)),
        new Ball(sprites.ball_9, new Vector(1430, 1433)),
        new Ball(sprites.ball_10, new Vector(1295, 1063)),
        new Ball(sprites.ball_4, new Vector(1295, 1210)),
        new Ball(sprites.ball_5, new Vector(1295, 1360)),
        new Ball(sprites.ball_15, new Vector(1295, 1507)),
        new Ball(sprites.ball_11, new Vector(1160, 992)),
        new Ball(sprites.ball_13, new Vector(1160, 1137)),
        new Ball(sprites.ball_12, new Vector(1160, 1285)),
        new Ball(sprites.ball_7, new Vector(1160, 1433)),
        new Ball(sprites.ball_6, new Vector(1160, 1581)),
        new Ball(sprites.ball_16, new Vector(3440, 1285)),
    ];

    this.whiteBall = this.balls[this.balls.length - 1]
    this.cue = new Cue(
        this.whiteBall.position.clone(),
        this.whiteBall.shoot.bind(this.whiteBall)
    );
}

GameWorld.prototype.drawPredictionDirection = function () {
    const begin = this.whiteBall.position;
    const end = Mouse.position.clone().divide(SCALE);

    const x1 = begin.x;
    const y1 = begin.y;
    const x2 = end.x;
    const y2 = end.y;

    const a = (y1 - y2) / (x1 - x2);
    const b = y1 - a * x1;

    let p_colision = end.clone();
    for (let i = 0; i < 15; ++i) {
        const ball = this.balls[i];
        const x3 = ball.position.x;
        const y3 = ball.position.y;

        const c = a * a + 1;
        const d = -2 * (x3 + a * y3 - a * b);
        const e = x3 * x3 + b * b + y3 * y3 - 2 * b * y3 - 4 * RADIUS_BALL * RADIUS_BALL;

        const delta = d * d - 4 * c * e;
        if (delta < 0) continue;
        const _x1 = (-d + Math.sqrt(delta)) / (2 * c);
        const _x2 = (-d - Math.sqrt(delta)) / (2 * c);
        const _y1 = a * _x1 + b;
        const _y2 = a * _x2 + b;


        const _v1 = new Vector(_x1, _y1);
        const _v2 = new Vector(_x2, _y2);
        if (a !== undefined && Vector.subtract(begin, _v1).length() < Vector.subtract(begin, p_colision).length()) {
            p_colision = _v1;
        }
        if (b !== undefined && Vector.subtract(begin, _v2).length() < Vector.subtract(begin, p_colision).length()) {
            p_colision = _v2;
        }
    };

    if (p_colision) {
        Canvas.drawLine(begin, p_colision);
    } else {
        Canvas.drawLine(begin, end);
    }
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

    let isMove = this.balls.some(ball => ball.isMove === true);
    if (!isMove) {
        this.drawPredictionDirection();
    }

    this.balls.forEach(ball => {
        ball.draw();
    });
    this.cue.draw();
}
