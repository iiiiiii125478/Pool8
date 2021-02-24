function Player(name) {
    this.name = name;
    this.ball_type = undefined;
    this.balls = [];
}


function Match() {
    this.player_1 = new Player("Player 1");
    this.player_2 = new Player("Player 2");

    this.ball_buffer = [];
    this.turn = this.player_1;
    this.pre_turn = this.player_2;
}

Match.prototype = {
    nextTurn: function () {
        let tmp = this.turn;
        this.turn = this.pre_turn;
        this.pre_turn = tmp;
    },

    ballInHold: function (ball) {
        this.ball_buffer.push(ball);
    },

    setScore: function () {
        console.log(this.turn.name);
        let hasStraight = this.ball_buffer.some(ball => Number(ball.type) < 8);
        let hasCross = this.ball_buffer.some(ball => Number(ball.type) > 8 && Number(ball.type) !== 16);
        let hasBall8 = this.ball_buffer.some(ball => Number(ball.type) === 8);

        if (!hasStraight && !hasCross && !hasBall8) {
            this.nextTurn();
        } else {
            if (this.turn.ball_type === undefined) {
                if (hasBall8) {
                    this.checkBall8();
                } else {
                    if (hasStraight && hasCross) {
                        return;
                    }

                    this.turn.ball_type = hasStraight ? "straight" : "cross";
                    this.pre_turn.ball_type = hasStraight ? "cross" : "straight";
                    let straight = hasStraight ? this.turn : this.pre_turn;
                    let cross = hasStraight ? this.pre_turn : this.turn;

                    while (this.ball_buffer.length > 0) {
                        ball = this.ball_buffer.pop();
                        let type = Number(ball.type);

                        if (type < 8) {
                            straight.balls.push(ball);
                        } else if (type > 8 && type != 15) {
                            cross.balls.push(ball);
                        }
                    }
                }
            } else {
                if (hasBall8) {
                    this.checkBall8();
                } else {
                    let straight = this.turn.ball_type === "straight" ? this.turn : this.pre_turn;
                    let cross = this.turn.ball_type === "cross" ? this.turn : this.pre_turn;

                    while (this.ball_buffer.length > 0) {
                        ball = this.ball_buffer.pop();
                        let type = Number(ball.type);

                        if (type < 8) {
                            straight.balls.push(ball);
                        } else if (type > 8) {
                            cross.balls.push(ball);
                        } else {
                            console.log("OPS");
                        }
                    }

                    if (
                        this.turn.ball_type === "straight" && !hasStraight ||
                        this.turn.ball_type === "cross" && !hasCross
                    ) {
                        this.nextTurn();
                    }
                }
            }

            console.log(this.player_1.balls);
            console.log(this.player_2.balls);
            console.log("---")
            this.checkWinMatch();
        }
    },

    checkWinMatch: function () {
        if (this.player_1.balls.length === 8) return this.player_1;
        if (this.player_2.balls.length === 8) return this.player_2;
        return false;
    },

    checkBall8: function () {
        if (this.turn.balls.length < 7) {
            console.log(this.turn.name + " LOSE");
        } else {
            console.log(this.turn.name + " WIN");
        }
    },
}
