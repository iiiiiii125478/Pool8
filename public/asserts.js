const ASSERTS = [
    "ball_1", "ball_2", "ball_3", "ball_4", "ball_5", "ball_6", "ball_7", "ball_8",
    "ball_9", "ball_10", "ball_11", "ball_12", "ball_13", "ball_14", "ball_15", "ball_16",
    "cue", "table", "triangle", "cue1"
];


let sprites = {};
let assertsLoading = 0;

function loadAssets(callback) {
    function loadSprite(filename) {
        assertsLoading += 1;

        let sprite = new Image();
        sprite.src = "./assets/" + filename + ".png";
        sprite.onload = function () {
            assertsLoading -= 1;
        }
        return sprite;
    }

    ASSERTS.forEach(element => {
        sprites[element] = loadSprite(element);
    });

    assertsLoadingLoop(callback);
}

function assertsLoadingLoop(callback) {
    if (assertsLoading) {
        requestAnimationFrame(assertsLoadingLoop.bind(this, callback));
    } else {
        callback();
    }
}
