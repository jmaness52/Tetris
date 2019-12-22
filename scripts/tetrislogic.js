const blocksAcross = 10;
const blocksTall = 20;

//blocks
const i = { shape: "i", blocks: [0x0F00, 0x4444, 0x00F0, 0x2222], color: 'cyan'   };
const j = { shape: "j", blocks: [0x44C0, 0x8E00, 0x6440, 0x0E20], color: 'blue'   };
const l = { shape: "l", blocks: [0x4460, 0x0E80, 0xC440, 0x2E00], color: 'orange' };
const o = { shape: "o", blocks: [0xCC00, 0xCC00, 0xCC00, 0xCC00], color: 'gold'   };
const s = { shape: "s", blocks: [0x06C0, 0x8C40, 0x6C00, 0x4620], color: 'green'  };
const t = { shape: "t", blocks: [0x0E40, 0x4C40, 0x4E00, 0x4640], color: 'purple' };
const z = { shape: "z", blocks: [0x0C60, 0x4C80, 0xC600, 0x2640], color: 'red'    };

let blockSize;
let boardWidth;
let boardHeight;
let rowsCleared = 0;
let scoreElapsed = 0;


let hardDrop = false;

let blocks;

let piecesHolder = []; // bag style randomization,  hold 4 of each type of tetris piece
let currentPiece;
let nextPiece;

function getRandomPiece() {
    
    // start with an array that holds four of each type of piece.  Pull from this array until empty and then reset it
    if (piecesHolder.length == 0)
        piecesHolder = [i,i,i,i,j,j,j,j,l,l,l,l,o,o,o,o,s,s,s,s,t,t,t,t,z,z,z,z];

        var random = Math.floor(Math.random()*(piecesHolder.length - 1));
        return piecesHolder.splice(random,1)[0];
}

function rotatePiece(dir) {
   
  var newRotation;

  //0 = ccw rotation
  if (dir === 0)
  {
    if ((currentPiece.rotation % 4) === 0)
    {
      newRotation = 3;
    }
    else{
      newRotation = currentPiece.rotation;
      newRotation = (--newRotation); 
    }
  }
  else //1 = cw rotation
  {
    newRotation = currentPiece.rotation
    newRotation = (++newRotation) % 4;
  }
  if (!occupied(currentPiece.type, currentPiece.x, currentPiece.y, newRotation))
  {
     currentPiece.rotation = newRotation;
     redraw.grid = true;
  }
}

function dropPiece() {
    
  blockIterator(currentPiece.type, currentPiece.x, currentPiece.y, currentPiece.rotation, function(x,y){
    setBlock(x,y, currentPiece.type);
  });

  currentPiece.type = nextPiece.type;
  currentPiece.x = 4;
  currentPiece.y = 0;
  currentPiece.rotation = 0;
  nextPiece.type = getRandomPiece();
  userInput = [];


}


function drop() {
  if (!move(CONTROL.DROP)) {
    scoreElapsed += 10;
    hardDrop = false;
    dropPiece();
    removeLines();
    redraw.next = true;
    redraw.score = true;
    if (occupied(currentPiece.type, currentPiece.x, currentPiece.y, currentPiece.rotation)) {
      loseGame();
    }

  }
}

function hard_drop () {
  hardDrop = true;
}
 
function move(input) {
  var testX = currentPiece.x, testY = currentPiece.y;
  switch(input) {
    case CONTROL.RIGHT: testX = testX + 1; break;
    case CONTROL.LEFT:  testX = testX - 1; break;
    case CONTROL.DROP:  testY = testY + 1; break;
  }
  if (!occupied(currentPiece.type,testX, testY, currentPiece.rotation)) {
    currentPiece.x = testX;
    currentPiece.y = testY;
    redraw.grid = true;
    return true;
  }
  else {
    return false;
  }
}



function blockIterator(type, x, y, rotation, fn) {
    var bit, result, row = 0, col = 0, blocks = type.blocks[rotation];
    for(bit = 0x8000 ; bit > 0 ; bit = bit >> 1) {
      if (blocks & bit) {
        fn(x + col, y + row);
      }
      if (++col === 4) {
        col = 0;
        ++row;
      }
    }
}

function getBlock(x,y) { 
    return ((blocks && blocks[x]) ? blocks[x][y] : null); 
}
  
function setBlock(x,y,type) { 
    blocks[x] = blocks[x] || []; 
    blocks[x][y] = type; 
    redrawGrid = true; 
}

function occupied(type, x, y, rotation) {
  var result = false
  blockIterator(type, x, y, rotation, function(x, y) {
    if ((x < 0) || (x >= blocksAcross) || (y < 0) || (y >= (blocksTall+rowOffset)) || getBlock(x,y))
      result = true;
  });
  return result;
}

function removeLines() {
  var x, y, complete, n = 0;
  for(y = (blocksTall +rowOffset) ; y > 4 ; --y) {
    complete = true;
    for(x = 0 ; x < blocksAcross ; ++x) {
      if (!getBlock(x, y))
        complete = false;
    }
    if (complete) {
      removeLine(y);
      y = y + 1; // recheck same line
      n++;
    }
  }
  if (n > 0) {
    rowsCleared += n;
    scoreElapsed += (100*Math.pow(2,n-1)); // 1: 100, 2: 200, 3: 400, 4: 800
    checkLevel();
  }
}
function removeLine(n) {
  var x, y;
  for(y = n ; y >= 0 ; --y) {
    for(x = 0 ; x < blocksAcross ; ++x)
      setBlock(x, y, (y == 0) ? null : getBlock(x, y-1));
  }
}