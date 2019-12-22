const upcomingStartPoint = {i: [0,1], j: [1,1], l: [0,1], o: [1,1], s: [1,0], t: [1,0], z: [1,0]};

let playingCanvas;
let upcomingCanvas;
let ctx;
let uctx;

let redraw = {grid: false, 
  next: false,
  score: true};

function draw() {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.lineColor = "white";
    drawGrid();
    drawNext();
    drawScore();
    ctx.restore();
}

function drawGrid() {
    
  if (redraw.grid) {
        ctx.clearRect(0, 0, playingCanvas.width, playingCanvas.height);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1.4;
        if (gameState === gameStates.running)
          drawPiece(ctx, currentPiece.type, currentPiece.x, currentPiece.y, currentPiece.rotation);
        
        //fill in grid with existng blocks from blocks array
        var x, y, block;
        for(y = 0 ; y < (blocksTall+rowOffset) ; y++) {
          for (x = 0 ; x < blocksAcross ; x++) {
            if (block = getBlock(x,y))
              drawBlock(ctx, x, y, block.color);
          }
        }
        ctx.strokeRect(0, rowOffset*blockSize, blocksAcross*blockSize - 1, blocksTall*blockSize - 1); // court boundary
        redraw.grid = false;
  }
}

function drawNext() {
  
  if (redraw.next) {
    uctx.save();

    uctx.translate(0.5, 0.5);
    uctx.clearRect(0, 0, 4*blockSize, 4*blockSize);
    uctx.strokeStyle = 'white';
    uctx.lineWidth = 1.4;

    var x = upcomingStartPoint[nextPiece.type.shape][0];
    var y = upcomingStartPoint[nextPiece.type.shape][1];
    
    drawPiece(uctx, nextPiece.type, x, y, nextPiece.rotation);
    redraw.next = false;
  }

  uctx.restore();
}

function drawScore() {
  if (redraw.score)
  {
    get('scoreHolder').innerHTML = scoreElapsed;
    get('levelHolder').innerHTML = currentLevel.level;
    get('rowsHolder').innerHTML = rowsCleared;
    redraw.score = false;
  }
}


function drawPiece(ctx, type, x, y, rotation) {
  blockIterator(type, x, y, rotation, function(x, y) {
    drawBlock(ctx, x, y, type.color);
  });
}

function drawBlock(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x*blockSize, y*blockSize, blockSize, blockSize);
  ctx.strokeRect(x*blockSize, y*blockSize, blockSize, blockSize);
}


function resize(event) {
    
    boardWidth = get('game').clientWidth;
    boardHeight = boardWidth*2;
    blockSize = boardWidth/10;
    playingCanvas.width = boardWidth;
    playingCanvas.height = boardHeight + (4*blockSize);
    upcomingCanvas.width = blockSize*4;
    upcomingCanvas.height = blockSize*4;
    ctx.translate(0, -(4*blockSize));

    if (gameState === gameStates.running)
    {
      redraw.grid = true;
      redraw.next = true;
      redraw.rows = true;
    }

    drawGrid();
    drawNext();
    drawScore();

}