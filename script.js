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

const handleInput = (e) => {

    

    switch (e.key){
        case "ArrowUp":
            moveUp();
            break;
        case "ArrowDown":
            moveDown();
            break;
        case "ArrowRight":
            moveRight();
            break;
        case "ArrowLeft":
            moveLeft();
            break;
        default:
            setupInput();
            return;
    }
    setupInput();
    grid.cells.forEach(cell => cell.mergeTitles());
    if(grid.checkGameOver()){
        alert("Game over!!!");
        window.location.reload();
        return;
    }
    grid.randomEmptyCell().title = new Title(gameBoard);
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
    cells.forEach(group => {
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
                if(lastValidCell.title != null){
                    lastValidCell.mergeTitle = cell.title;
                } else {
                    lastValidCell.title = cell.title;
                }

                cell.title = null;
            }
        }
    })
} 