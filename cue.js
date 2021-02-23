const CUE_ORIGIN = new Vector(3600, 290);
const CUE_SHOOT_ORIGIN = new Vector(3560, 290);
const MAX_FORCE = 200;
const MIN_ORIGIN_X = 3600 + 400;
const MAX_ORIGIN_X = 3600 + 500;
const INC_FORCE = 2;
const INC_ORIGIN_X = 5;


function Cue(position, onShoot) {
    this.position = position;
    this.rotation = new Vector(0, 0);
    this.origin = CUE_ORIGIN.clone();
    this.force = 0;
    this.onShoot = onShoot;
    this.validShoot = true;
    this.incOrigin = INC_ORIGIN_X;
}

Cue.prototype = {
    update: function () {
        if (Mouse.left.down) {
            this.increaseFoce();
        } else if (this.force > 0) {
            this.shoot();
        }

        this.updateRotation();
    },

    draw: function () {
        Canvas.drawImage(sprites.cue1, this.position, this.origin, this.rotation);
    },

    updateRotation: function () {
        let opposite = Mouse.position.y - this.position.y;
        let adjacent = Mouse.position.x - this.position.x;
        this.rotation = new Vector(adjacent, opposite).normalize();
    },

    updatePosition: function (vec) {
        this.position = vec.clone();
        this.origin = CUE_ORIGIN.clone();
        this.validShoot = true;
    },

    increaseFoce: function () {
        if (!this.validShoot) return;

        if (this.force < MAX_FORCE) {
            this.force += INC_FORCE;
            this.origin.x += this.incOrigin;
        } else {
            if (this.origin.x <= MIN_ORIGIN_X || this.origin.x >= MAX_ORIGIN_X) {
                this.incOrigin = -this.incOrigin;
            }
            this.origin.x += this.incOrigin;
        }
    },

    shoot: function () {
        this.onShoot(this.force, this.rotation);
        this.force = 0;
        this.origin = CUE_SHOOT_ORIGIN.clone();
        this.validShoot = false;
        this.incOrigin = INC_ORIGIN_X;
    }
}
