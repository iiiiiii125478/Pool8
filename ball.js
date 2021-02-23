const RADIUS_BALL = 70.5;
const BALL_ORIGIN = new Vector(RADIUS_BALL, RADIUS_BALL);
const COEFFICIENT_FRICTION = 0.012;
const TABLE = {
    "top": 212,
    "left": 212,
    "right": 4551 - 212,
    "bottom": 2570 - 212,
};
const EDGES = [
    [new Vector(338, 212), new Vector(419, 294), new Vector(2108, 294), new Vector(2142, 212)],
    [new Vector(2360, 212), new Vector(2394, 294), new Vector(4102, 294), new Vector(4185, 212)],
    [new Vector(4339, 364), new Vector(4259, 446), new Vector(4259, 2122), new Vector(4339, 2208)],
    [new Vector(4185, 2358), new Vector(4102, 2278), new Vector(2394, 2278), new Vector(2360, 2358)],
    [new Vector(2142, 2358), new Vector(2108, 2278), new Vector(419, 2278), new Vector(338, 2358)],
    [new Vector(212, 2208), new Vector(294, 2122), new Vector(294, 446), new Vector(212, 364)],
];


function Ball(resource, position) {
    this.resource = resource;
    this.position = position.clone();
    this.velocity = new Vector();
    this.poolColision = new Map();
    this.isMove = false;
    this.inHold = false;
}

Ball.prototype = {
    update: function () {
        this.applyFriction();
        this.colisionWithTable();
        this.setInHold();

        this.position.add(this.velocity);
    },

    draw: function () {
        if (this.inHold) return;

        Canvas.drawImage(this.resource, this.position, BALL_ORIGIN);
    },

    shoot: function (force, rotation) {
        this.applyForce(
            new Vector(force * rotation.x, force * rotation.y)
        );
        this.isMove = true;
    },

    applyForce: function (vec) {
        this.velocity.add(vec);
    },

    applyFriction: function () {
        if (this.velocity.length() < 0.69) {
            this.velocity.multiply(0);
            this.isMove = false;
        }

        let friction = this.velocity.clone().multiply(-COEFFICIENT_FRICTION);
        this.applyForce(friction);
    },

    setInHold: function () {
        this.inHold = (
            this.position.y < TABLE.top ||
            this.position.x < TABLE.left ||
            this.position.x > TABLE.right ||
            this.position.y > TABLE.bottom
        );

        if (this.inHold) {
            this.velocity.multiply(0);
            this.position.multiply(0);
        }
    },

    colisionWithTable: function () {
        for (let j = 0; j < EDGES.length; ++j) {
            const points = EDGES[j];
            for (let i = 1; i < points.length; ++i) {
                if (Utils.colisionLineCircle(points[i - 1], points[i], this.position)) {
                    if (this.poolColision.get(i + " " + j) === true) {
                        continue;
                    }
                    this.poolColision.set(i + " " + j, true);

                    console.log("Colision");
                    let v1 = Utils.getProjection(this.velocity, Vector.subtract(points[i - 1], points[i]));
                    let v2 = Utils.getProjection(this.velocity, new Vector(points[i].y - points[i - 1].y, points[i - 1].x - points[i].x)).negative();
                    this.velocity = v1.add(v2);
                } else {
                    this.poolColision.set(i + " " + j, false);
                }
            }
        };
    },

    colisionWithBall: function (ball) {
        const normal = Vector.subtract(ball.position.clone(), this.position.clone());
        if (normal.length() > 2 * RADIUS_BALL) {
            this.poolColision.set(ball, false);
            ball.poolColision.set(this, false);
            return;
        }

        // Still colision
        if (this.poolColision.get(ball) === true || ball.poolColision.get(this) === true) {
            return;
        } else {
            this.poolColision.set(ball, true);
            ball.poolColision.set(this, true);
        }

        // temporary resolve overlap ball with ball
        const mtd = normal.multiply((RADIUS_BALL * 2 - normal.length()) / normal.length())
        this.position = this.position.add(mtd.multiply(1 / 2));
        ball.position = ball.position.subtract(mtd.multiply(1 / 2));

        // Elastic Colision
        let un = normal.clone().normalize();
        let ut = new Vector(-un.clone().y, un.clone().x);

        const v1n = un.dot(this.velocity.clone());
        const v1t = ut.dot(this.velocity.clone());
        const v2n = un.dot(ball.velocity.clone());
        const v2t = ut.dot(ball.velocity.clone());

        let v1nTag = v2n;
        let v2nTag = v1n;

        v1nTag = un.clone().multiply(v1nTag);
        const v1tTag = ut.clone().multiply(v1t);
        v2nTag = un.clone().multiply(v2nTag);
        const v2tTag = ut.clone().multiply(v2t);

        this.velocity = v1nTag.add(v1tTag);
        ball.velocity = v2nTag.add(v2tTag);

        this.isMove = true;
        ball.isMove = true;
    },
}
