const startButton = get("Start");
const stopButton = get ("End");
const musicButton = get("musicSwitch");
const CONTROL = {LEFT: 0, RIGHT: 1, CW_ROT:2, CCW_ROT: 3, DROP: 4, HARD_DROP:5, PAUSE: 6};

let music = false;

let userInput = [];

let KEY = { SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, ESC: 27, S: 83, D: 68 };  
let KEYBIND = {LEFT: KEY.LEFT, RIGHT: KEY.RIGHT, CW_ROT: KEY.DOWN, 
    CCW_ROT: KEY.UP, DROP: KEY.S, HARD_DROP: KEY.D, PAUSE: KEY.ESC };



function startPressed() {
    // start a new game, pause or resume an existing session
    switch (gameState) {
        case gameStates.stopped:
            newGame();
            break;
        case gameStates.running:
            pauseGame();
            break;
        case gameStates.paused:
            resumeGame();
            break;
        default:
            break;
    }
    
    
}

function endPressed() {
    stopGame();
    stopButton.style.display = "none";
    startButton.textContent = "Start";
    startButton.style.backgroundColor = "green";  
}


function updateStartButton() {
    switch (gameState) {
        case gameStates.stopped:
            gameState = gameStates.running;
            startButton.textContent = "Pause";
            startButton.style.backgroundColor = "yellow";
            stopButton.style.display = "block";
            break;
        case gameStates.running:
            gameState = gameStates.paused;
            startButton.textContent = "Resume"
            startButton.style.backgroundColor = "green";
            break;
        case gameStates.paused:
            gameState = gameStates.running;
            startButton.textContent = "Pause";
            startButton.style.backgroundColor = "yellow";
            break;
        default:
            break;
    }
}

function keydown(e) {
    var handled = false;
    if (gameState === gameStates.running) {
        switch(e.keyCode) {
            case KEYBIND.LEFT:
                userInput.push(CONTROL.LEFT);
                handled = true;
                break;
            case KEYBIND.RIGHT:
                userInput.push(CONTROL.RIGHT);
                handled = true;
                break;
            case KEYBIND.CCW_ROT:
                userInput.push(CONTROL.CCW_ROT);
                handled = true;
                break;
            case KEYBIND.CW_ROT:
                userInput.push(CONTROL.CW_ROT);
                handled = true;
                break;
            case KEYBIND.DROP:
                userInput.push(CONTROL.DROP);
                handled = true;
                break;
            case KEYBIND.HARD_DROP:
                userInput.push(CONTROL.HARD_DROP);
                handled = true;
                break;
            case KEYBIND.PAUSE:
                pauseGame();
                handled = true;
                break;
        }

        if (handled)
        {
            e.preventDefault();
        }
    }
}


function toggleMusic() {
    
    var src = get('musicSource');
    
    if (gameState !== gameStates.stopped)
    {
        if (!music)
        {
            src.volume = 0.15;
            src.play();
            music = true;
            return;
        }
    }
    
    if (music)
    {
        src.pause();
        music = false;
    }


}

function checkMusic() {
    if (gameState === gameStates.running)
    {
        if (get('musicSwitch').checked && !music)
        {
            toggleMusic();
        }
    }
}