import Grid from "./Grid.js";
import Title from "./Title.js";

const gameBoard = document.getElementById("game-board");

const grid = new Grid(gameBoard);
grid.randomEmptyCell().title = new Title(gameBoard);
grid.randomEmptyCell().title = new Title(gameBoard);
console.log(grid.cellsByColumn);

const setupInput = () => {
    window.addEventListener("keydown", handleInput, {once: true});
}

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