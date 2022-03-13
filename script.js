import Grid from "./Grid.js";
import Title from "./Title.js";

const gameBoard = document.getElementById("game-board");

const grid = new Grid(gameBoard);
grid.randomEmptyCell().title = new Title(gameBoard);
grid.randomEmptyCell().title = new Title(gameBoard);
let xDown;                                                      
let yDown;

const setupInput = () => {
    window.addEventListener("keydown", handleInput, {once: true});

    // mobile
    xDown = null;
    yDown = null;
    document.addEventListener('touchstart', handleTouchStart, false);        
    document.addEventListener('touchmove', handleTouchMove, false);
}

const getTouches = (evt) => {
    return evt.touches ||             // browser API
           evt.originalEvent.touches; // jQuery
  }                                                     
                                                                           
const handleTouchStart = (evt) => {
      const firstTouch = getTouches(evt)[0];                                      
      xDown = firstTouch.clientX;                                      
      yDown = firstTouch.clientY;                                      
  };                                                
                                                                           
const handleTouchMove = async (evt) => {
      if ( ! xDown || ! yDown ) {
          return;
      }
  
      var xUp = evt.touches[0].clientX;                                    
      var yUp = evt.touches[0].clientY;
  
      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;
                                                                           
      if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
          if ( xDiff > 0 ) {
            if(!canMoveLeft()){
                setupInput();
                return;
            }
            await moveLeft();
          } else {
            if(!canMoveRight()){
                setupInput();
                return;
            }
            await moveRight();
          }                       
      } else {
          if ( yDiff > 0 ) {
            if(!canMoveUp()){
                setupInput();
                return;
            }
            await moveUp();
          } else { 
            if(!canMoveDown()){
                setupInput();
                return;
            }
            await moveDown();
          }                                                                 
      }
      
    grid.cells.forEach(cell => cell.mergeTitles());
    const title = new Title(gameBoard);
    grid.randomEmptyCell().title = title;
    if(!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()){
        title.waitForTransition(true).then(() => {
            alert("Game over!!!");
            window.location.reload();
        })
    }

    setupInput();
};

const handleInput = async (e) => {
    switch (e.key){
        case "ArrowUp":
            if(!canMoveUp()){
                setupInput();
                return;
            }
            await moveUp();
            break;
        case "ArrowDown":
            if(!canMoveDown()){
                setupInput();
                return;
            }
            await moveDown();
            break;
        case "ArrowRight":
            if(!canMoveRight()){
                setupInput();
                return;
            }
            await moveRight();
            break;
        case "ArrowLeft":
            if(!canMoveLeft()){
                setupInput();
                return;
            }
            await moveLeft();
            break;
        default:
            setupInput();
            return;
    }
    grid.cells.forEach(cell => cell.mergeTitles());
    const title = new Title(gameBoard);
    grid.randomEmptyCell().title = title;
    if(!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()){
        title.waitForTransition(true).then(() => {
            alert("Game over!!!");
            window.location.reload();
        })
    }

    setupInput();
   
}

setupInput();

const moveUp = () => {
    slideTitles(grid.cellsByColumn);
}

const moveDown = () => {
    slideTitles(grid.cellsByColumn.map(col => [...col].reverse()));
}

const moveRight = () => {
    slideTitles(grid.cellsByRow.map(row => [...row].reverse()));
}

const moveLeft = () => {
    slideTitles(grid.cellsByRow);
}

const slideTitles = (cells) =>{
    return Promise.all(
        cells.flatMap(group => {
            const promises = [];
            for(let i = 1;i< group.length; i++){
                const cell = group[i];
                if(cell.title == null){
                    continue;
                }

                let lastValidCell;
                for(let j = i-1; j>=0; j--){
                    const moveCell = group[j];
                    if(!moveCell.canAccept(cell.title)){
                        break;
                    }
                    lastValidCell = moveCell;
                }

                if(lastValidCell != null){
                    promises.push(cell.title.waitForTransition());
                    if(lastValidCell.title != null){
                        lastValidCell.mergeTitle = cell.title;
                    } else {
                        lastValidCell.title = cell.title;
                    }

                    cell.title = null;
                }
            }
            return promises;
    }))
} 

const canMoveUp = () => {
    return canMove(grid.cellsByColumn);
}

const canMoveDown = () => {
    return canMove(grid.cellsByColumn.map(col => [...col].reverse()));
}

const canMoveLeft = () => {
    return canMove(grid.cellsByRow);
}

const canMoveRight = () => {
    return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}

const canMove = (cells) => {
    return cells.some(group => {
        return group.some((cell, index) => {
            if(index == 0 || cell.title == null){
                return false;
            }

            const moveToCell = group[index - 1];
            return moveToCell.canAccept(cell.title);
        })
    })
}