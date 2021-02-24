const SCALE = 0.25;
const LINE_WEIGHT = 5;

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

Canvas2D.prototype.drawLine = function(begin, end) {
    this._ctx.save();
    this._ctx.beginPath();
    this._ctx.lineWidth = LINE_WEIGHT;
    this._ctx.scale(SCALE, SCALE);
    this._ctx.moveTo(begin.x, begin.y);
    this._ctx.lineTo(end.x, end.y);
    this._ctx.stroke();
    this._ctx.restore();
}

Canvas2D.prototype.clear = function () {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
}

let Canvas = new Canvas2D();
