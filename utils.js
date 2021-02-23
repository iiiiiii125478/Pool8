const EPS = 1;

function Utils() {

}

Utils.colisionLinePoint = function (line_start, line_end, point) {
    let dist1 = Vector.subtract(point, line_start).length();
    let dist2 = Vector.subtract(point, line_end).length();
    let dist = Vector.subtract(line_start, line_end).length();

    return (Math.abs(dist - (dist1 + dist2)) <= EPS);
}

Utils.colisionLineCircle = function (line_start, line_end, center) {
    let v1 = Vector.subtract(line_end, line_start);
    let v2 = Vector.subtract(center, line_start);
    let dot = v1.dot(v2) / (v1.length() * v1.length());

    let x = line_start.x + (dot * v1.x);
    let y = line_start.y + (dot * v1.y);
    let closest = new Vector(x, y);

    if (!Utils.colisionLinePoint(line_start, line_end, closest)) {
        return;
    }

    let distance = Vector.subtract(center, closest).length();
    return distance <= RADIUS_BALL + EPS;
}

Utils.getProjection = function(v1, v2) {
    //  Projection v1 on v2
    v1 = v1.clone()
    v2 = v2.clone()

    const length = v1.dot(v2) / v2.length();
    v2.normalize();
    return new Vector(length * v2.x, length * v2.y);
}
