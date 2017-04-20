var game = function(mycanvas, mycontext) {
    var that = {};
    //score
    that.score = 0;
    //state
    that.state = "ready";

    //object1
    that.readystring = {
        x: 0,
        y: 0,
        content: "ready",
        color: "#FF0000",
        state: "show",
    }

    //object2
    that.line = {
            originalpoint: {
                x: mycanvas.width / 4,
                y: 0,
            },

            endpoint: {
                x: mycanvas.width / 4,
                y: mycanvas.height,
            },
            color: "#FF0000",
        }
        //object3(private)
    backgroundcolor_line = {
            originalpoint: {
                x: mycanvas.width / 4,
                y: 0,
            },

            endpoint: {
                x: mycanvas.width / 4,
                y: 0,
            },
            color: "#FFFFFF",
        }
        //object4(private)
    ball = function(x, y) {
            var littleball = {
                position: Vector2d(x, y),
                velocity: Vector2d(-50, -50),
                acceleration: Vector2d(0, 10),
                color: "#FF0000"
            };

            littleball.move = function(dt) {
                littleball.position = littleball.position.add(littleball.velocity.multiply(dt));
                littleball.velocity = littleball.velocity.add(littleball.acceleration.multiply(dt));
            }
            return littleball;
        }
        //game_objects;
    var balls = [];


    //starttime
    that.starttime = -1;

    //render_id
    that.id = null;

    //sign for render
    that.gotorender = false;

    //update
    that.update = function(delta) {
            var random = getRandom(5);
            if (delta > 2) {
                that.gotorender = true;
                that.starttime = (new Date()).getTime();

                backgroundcolor_line.originalpoint.y = (random - 1) * mycanvas.height / 5;
                backgroundcolor_line.endpoint.y = (random - 1) * mycanvas.height / 5 + mycanvas.height / 5;
            }

        }
        //render
    that.render = function() {

        mycontext.clearRect(0, 0, mycanvas.width, mycanvas.height);

        //drawing that.line
        mycontext.beginPath();
        mycontext.strokeStyle = that.line.color;
        mycontext.moveTo(that.line.originalpoint.x, that.line.originalpoint.y);
        mycontext.lineTo(that.line.endpoint.x, that.line.endpoint.y);
        mycontext.stroke();

        //drawing backgroundcolor_line
        if (that.gotorender === true) {
            mycontext.beginPath();
            mycontext.strokeStyle = backgroundcolor_line.color;
            mycontext.moveTo(backgroundcolor_line.originalpoint.x, backgroundcolor_line.originalpoint.y);
            mycontext.lineTo(backgroundcolor_line.endpoint.x, backgroundcolor_line.endpoint.y);
            mycontext.stroke();
        }

        //drawing balls
        for (var i = 0; i < balls.length; i++) {
            var position = balls[i].position;
            mycontext.strokeStyle = balls[i].color;
            mycontext.beginPath();
            mycontext.arc(position.x, position.y, 5, 0, Math.PI * 2, true);
            mycontext.closePath();
            mycontext.stroke();
        }

        that.id = window.requestAnimationFrame(that.render);
    }

    //statemanager
    that.statemanager = function() {
        var manager = {};
        //ready
        manager.ready = function() {
                if (that.state === "ready") {
                    that.readystring.state = "show";
                    //draw"ready"
                    mycontext.beginPath();
                    mycontext.fillStyle = that.readystring.color;
                    mycontext.font = '30px Segoe UI bold';
                    mycontext.fillText(that.readystring.content, 230, 230);

                    function Click_to_start(event) {
                        window.removeEventListener("click", Click_to_start, false);
                        that.readystring.state = "hide";
                        //console.log("test111");
                        manager.run();
                    };

                    window.addEventListener('click', Click_to_start, false);

                } else {
                    if (that.state === "run") {
                        window.cancelAnimationFrame(that.id);
                    }
                    that.state = "ready";
                    that.readystring.state = "show";
                    //draw"ready"
                    mycontext.beginPath();
                    mycontext.fillStyle = that.readystring.color;
                    mycontext.font = '30px Segoe UI bold';
                    mycontext.fillText(that.readystring.content, 230, 230);

                    function Click_to_start(event) {
                        mycanvas.removeEventListener("click", Click_to_start, false);
                        that.readystring.state = "hide";
                        //console.log("test111");
                        manager.run();
                    };

                    mycanvas.addEventListener('click', Click_to_start, false);
                }
            }
            //run
        manager.run = function() {
                if (that.state !== "run") {
                    //update state
                    that.state = "run";
                    //user_in
                    mycanvas.addEventListener("click", function(event) {
                        var pointer = position_of_pointer(event);
                        var xcanvas = pointer.x - mycanvas.offsetLeft;
                        var ycanvas = pointer.y - mycanvas.offsetTop;
                        var ballofthat = ball(xcanvas, ycanvas);
                        balls.push(ballofthat);
                    }, false);

                    //seconds of now;
                    that.starttime = (new Date()).getTime();
                    setInterval(function() {
                        var dt = 0.1;
                        for (var i = 0; i < balls.length; i++) {
                            balls[i].move(dt);
                        }

                        var delta = ((new Date()).getTime() - that.starttime) / 1000.0;
                        //update
                        that.update(delta);
                    }, 0);
                    //render
                    that.id = window.requestAnimationFrame(that.render);
                    //console.log("happen!!!")                       
                }
            }
            //pause
        manager.pause = function() {
            if (that.state === "run") {
                that.state = "pause";
                window.cancelAnimationFrame(that.id);
            } else {
                that.state = "pause";
            }
        }

        return manager;
    };

    return that;
}

// Vector2d _object
Vector2d = function(x, y) {
    var vector = {
        x: x,
        y: y
    };

    vector.copy = function() {
        return Vector2d(vector.x, vector.y);
    }
    vector.length = function() {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }
    vector.sqrLength = function() {
        return vector.x * vector.x + vector.y * vector.y;
    }
    vector.normalize = function() {
        var inv = 1 / vector.length();
        return Vector2d(vector.x * inv, vector.y * inv);
    }
    vector.negate = function() {
        return Vector2d(-vector.x, -vector.y);
    }
    vector.add = function(v) {
        return Vector2d(vector.x + v.x, vector.y + v.y);
    }
    vector.subtract = function(v) {
        return Vector2d(vector.x - v.x, vector.y - v.y);
    }
    vector.multiply = function(f) {
        return Vector2d(vector.x * f, vector.y * f);
    }
    vector.divide = function(f) {
        var invf = 1 / f;
        return Vector2d(vector.x * invf, vector.y * invf);
    }
    vector.dot = function(v) {
        return vector.x * v.x + vector.y * v.y;
    }

    //vector.zero=Vector2d(0,0);

    return vector;
}
