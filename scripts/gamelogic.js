let timeElapsed;
let frameCounter = 0;

// speed is number of frames required to drop one gridcell.
const speedTable = [{level:0, speed: 48},
    {level:1, speed: 43},
    {level:2, speed: 38},
    {level:3, speed: 33},
    {level:4, speed: 28},
    {level:5, speed: 23},
    {level:6, speed: 18},
    {level:7, speed: 13},
    {level:8, speed: 8},
    {level:9, speed: 6},
    {level:10, speed: 5},
    {level:11, speed: 4},
    {level:12, speed: 3},
    {level:13, speed: 2},
    {level:14, speed: 1}];
    
const rowOffset = 4;  // canvas has an extra 4 rows of height to allow pieces to not have to drop immediatly into
// the playing grid

const gameStates = {stopped:"STOPPED", running:"RUNNING", paused:"PAUSED"};
let gameState = gameStates.stopped;

let currentLevel = speedTable[0];

function runGame() {
    
    reset();
    resize();
    let startTime = current = timestamp();
    function frame() {
        
        current = timestamp();
        handle(userInput.shift());

        if ((hardDrop) || (++frameCounter === currentLevel.speed))
        {
            drop();
            frameCounter = 0;
        }

        if (gameState === gameStates.paused)
        {
            return;
        }
        else if (gameState === gameStates.stopped)
        {
            return;
        }
        
        draw();
        timeElapsed = current - startTime;
        requestAnimationFrame(frame, playingCanvas);
    }

    frame();

    
}


function newGame() {
    currentPiece = new TetrisPiece(getRandomPiece(),4,0, 0);
    nextPiece = new TetrisPiece(getRandomPiece(), 0, 0, 0);
    redraw.next = true;
    updateStartButton();
    checkMusic();
    runGame();
}

function stopGame() {
    gameState = gameStates.stopped;
    if (music) {
        get('musicSwitch').checked = false;
        toggleMusic();
    }
}

function loseGame() {
    console.log("game over");
    gameState = gameStates.stopped;
}

function pauseGame() {
    updateStartButton();
}

function resumeGame() {
    updateStartButton();
}


function timestamp(){ 
    return new Date().getTime();
}

function reset() {
    timeElapsed = 0;
    rowsCleared = 0;
    currentLevel = speedTable[0];
    blocks = [];
    userInput = [];

}


function handle(action) {
    switch(action) {
      case CONTROL.LEFT:  
        move(CONTROL.LEFT);  
        break;
      case CONTROL.RIGHT: 
        move(CONTROL.RIGHT); 
        break;
      case CONTROL.CCW_ROT:    
        rotatePiece(0);        
        break;
      case CONTROL.CW_ROT:  
        rotatePiece(1);          
        break;
      case CONTROL.DROP:
          drop();
          break;
      case CONTROL.HARD_DROP:
          hard_drop();
          break;
      default:
          break;
    }
  }


  function checkLevel() {
    
    var tempRowsCleared;

    if ((rowsCleared % 10) === 0)
    {
        tempRowsCleared = rowsCleared;
    }
    else
    {
        if (Math.floor(rowsCleared/10) > currentLevel.level)
        {
            tempRowsCleared = (rowsCleared - (rowsCleared % 10));
        }
    }
    
    switch (tempRowsCleared) {
        case 10:
        case 20:
        case 30:
        case 40:
        case 50:
        case 60:
        case 70:
        case 80:
        case 90:
        case 100:
        case 130:
        case 160:
        case 190:
        case 290:
            levelUp();
            break;
        default:
            break;
        
    }      
  }

  function levelUp() {
    currentLevel= speedTable[(currentLevel.level + 1)];
  }