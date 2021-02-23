const SCALE = 0.25;

function Canvas2D() {
    this._canvas = document.getElementById("8-ball");
    this._ctx = this._canvas.getContext("2d");
}

Canvas2D.prototype.drawImage = function (
    image,
    position = new Vector(0, 0),
    origin = new Vector(0, 0),
    rotation = new Vector(0, 0),
) {
    let angle = rotation.toAngles();

    this._ctx.save();
    this._ctx.scale(SCALE, SCALE);
    this._ctx.translate(position.x, position.y);
    this._ctx.rotate(angle);
    this._ctx.drawImage(image, -origin.x, -origin.y);
    this._ctx.restore();
}

Canvas2D.prototype.clear = function () {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
}

let Canvas = new Canvas2D();
