// board
let board;
let boardWidth = 1000;
let boardHeight = 563;
let context;

//dog
let dogWidth = 90;
let dogHeight = 75;
let dogX = boardWidth / 14;
let dogY = boardHeight / 2   ;
let dogImg;

let dog = {
    x: dogX,
    y: dogY,
    width: dogWidth,
    height: dogHeight
}

//clouds
let topCloudImg;

let cloudArray = [];
let cloudWidth = 300;
let cloudHeight = 114;
let cloudX = boardWidth / 1;
let cloudY = boardHeight / 5;

//buildings
let bottomBuildingImg;

let buildingArray = [];
let buildingWidth = 219;
let buildingHeight = 300;
let buildingX = boardWidth / 1;
let buildingY = boardHeight / 8;

//physics
let velocityX = -4; //cloud moving left speed
let velocityY = 0; //jump up
let gravity = .4    ; //jump down

let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //load image
    dogImg = new Image();
    dogImg.src = "dog.png";
    dogImg.onload = function () {
        context.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);
    }

    topCloudImg = new Image();
    topCloudImg.src = "top-cloud.png";

    bottomBuildingImg = new Image();
    bottomBuildingImg.src = "bottom-cloud.png";

    requestAnimationFrame(update);
    setInterval(placeClouds, 1500);//every 1.5 seconds
    document.addEventListener('keydown', moveDog);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //dog
    velocityY += gravity;
    dog.y = Math.max(dog.y + velocityY, 0); //limit the dog.y to top of canvas
    context.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);

    if (dog.y > board.height) {
        gameOver = true;
    }

    //clouds
    for (let i = 0; i < cloudArray.length; i++) {
        let cloud = cloudArray[i];
        cloud.x += velocityX;
        context.drawImage(cloud.img, cloud.x, cloud.y, cloud.width, cloud.height);

        if (!cloud.passed && dog.x > cloud.x + cloud.width) {
            score += 1;
            cloud.passed = true;
        }

        if(detectCollision(dog, cloud)) {
            gameOver = true;
        }
    }

    //buildings
    for (let i = 0; i < buildingArray.length; i++) {
        let building = buildingArray[i];
        building.x += velocityX;
        context.drawImage(building.img, building.x, building.y, building.width, building.height);

        if(detectCollision(dog, building)) {
            gameOver = true;
        }
    }

    //clear clouds & buildings
    while (cloudArray.length > 0 && cloudArray[0].x < -cloudWidth) {
        cloudArray.shift(); //removes first element from the array
    }

    while (buildingArray.length > 0 && buildingArray[0].x < -buildingWidth) {
        buildingArray.shift(); //removes first element from the array
    }

    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.font = "80px sans-serif";
        context.fillText("GAME OVER", 270, 300);
        context.font = "30px sans-serif";
        context.fillText("Press 'SPACE' to start again", 340, 350);
    }
}

function placeClouds() {
    if (gameOver) {
        return;
    }

    let randomCloudY = cloudY - cloudHeight / 8 - Math.random() * cloudHeight / 2;
    let openingSpace = board.height/3;

    let randomBuildingY = buildingY - buildingHeight / 6 - Math.random() * buildingHeight / 2;
    let openingSpace1 = board.height/3;


    let topCloud = {
        img: topCloudImg,
        x: cloudX,
        y: randomCloudY,
        width: cloudWidth,
        height: cloudHeight,
        passed: false
    }
    cloudArray.push(topCloud);

    let bottomBuilding = {
        img: bottomBuildingImg,
        x: buildingX,
        y: randomBuildingY + buildingHeight + openingSpace1,
        width: buildingWidth,
        height: buildingHeight,
        passed: false
    }
    buildingArray.push(bottomBuilding);
}

function moveDog(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "keyX") {
        //jump
        velocityY = -6;

        //reset game
        if (gameOver) {
            dog.y = dogY;
            cloudArray = [];
            buildingArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision (a, b) {
    return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}