document.addEventListener("DOMContentLoaded",function() {

    playingCanvas =  get('tetris');
    upcomingCanvas = get('upcomingPiece');
    ctx = playingCanvas.getContext("2d");
    uctx = upcomingCanvas.getContext("2d");
    addEvents();
    
});

function addEvents() {
    window.addEventListener('resize', resize, false);
    document.addEventListener('keydown', keydown, false);
    
    startButton.addEventListener('click', startPressed);
    stopButton.addEventListener('click', endPressed);
    musicButton.addEventListener('change', toggleMusic);
    stopButton.style.display = "none";
}
