const canvas = document.querySelector('#canvas'),
    c = canvas.getContext('2d'),
    delayInput = document.querySelector('#delayer'),
    numberInput = document.querySelector('#quantifier'),
    startButton = document.querySelector('#start');
radius = 40;

let h = canvas.height = innerHeight - 45,
    w = canvas.width = innerWidth - 25,
    circleArr,
    mouse = {
        x: undefined,
        y: undefined
    },
    isClicked = false,
    areFound = [];

//Specifies how many seconds need to pass before the circles are hidden
function delay(arr, delay = 1) {
    setTimeout(() => {
        let i = 0
        for (; i < arr.length; i++) {
            arr[i].hide();
        }
    }, delay * 1000);
}

//Starts the game
startButton.addEventListener('click', () => {
    areFound = [];
    init();
    delay(circleArr, delayInput.value);
});

//Calculates the distance between two points
function distance(x1, y1, x2, y2) {
    let xDistance = x2 - x1,
        yDistance = y2 - y1;

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

//Adds an Event to the canvas that marks a circle if it was clicked
canvas.addEventListener('click', (e) => {
    let canvasCoor = canvas.getBoundingClientRect();
    isClicked = true;
    mouse.x = e.x - canvasCoor.left;
    mouse.y = e.y - canvasCoor.top;
})

//Creates a circle, has the method to hide it if it's clicked
function makeCircle(x, y, n) {
    this.x = x,
        this.y = y,
        this.circleColor = '#000000',
        this.numberColor = '#FFFFFF',
        this.n = n;

    this.draw = () => {
        c.beginPath();
        c.arc(this.x, this.y, radius, 0, Math.PI * 2, false);
        c.fillStyle = this.circleColor;
        c.fill();
        c.fillStyle = this.numberColor
        c.font = '30px Arial',
            c.fillText(n, this.x - 10, this.y + 10);
    }

    this.hide = () => {
        this.circleColor = '#FFFFFF';
    }

    this.update = () => {
        if (distance(mouse.x, mouse.y, this.x, this.y) <= radius && isClicked === true) {
            areFound[n - 1] = true;
            this.circleColor = '#000000';
        }
        this.draw();
    }
}

//Creates an array of circles and makes sure that they're not overlapping 
function init() {
    circleArr = [];

    for (let i = 0; i < numberInput.value; i++) {
        let x = Math.floor(Math.random() * (w - radius * 2) + radius),
            y = Math.floor(Math.random() * (h - radius * 2) + radius),
            n = i + 1;

        if (i !== 0) {
            for (let j = 0; j < circleArr.length; j++) {
                if (distance(x, y, circleArr[j].x, circleArr[j].y) - radius * 2 < 0) {
                    x = Math.floor(Math.random() * (w - radius * 2) + radius),
                        y = Math.floor(Math.random() * (h - radius * 2) + radius);

                    j = -1;
                }
            }
        }
        circleArr.push(new makeCircle(x, y, n))
    }
}

//animates the canvas
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, w, h);

    //Resets the game if the circle was a clicked out of order
    if (areFound.length > 0) {
        let i = 0;
        for (; i < areFound.length; i++) {
            if (areFound[i] !== true) {
                areFound = [];
                init();
                delay(circleArr, delayInput.value);
            }
        }
    }

    for (let i = 0; i < circleArr.length; i++) {
        circleArr[i].update();
    }

    isClicked = false;
}
init();
delay(circleArr, delayInput.value);
animate();