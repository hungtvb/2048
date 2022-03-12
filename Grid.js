const GRID_SIZE = 4;
const CELL_SIZE = 20;
const CELL_GAP = 2;

export default class Grid{
    
    #cells

    constructor(gameBoard){   
        gameBoard.style.setProperty("--grid-size", GRID_SIZE);
        gameBoard.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
        gameBoard.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);
        this.#cells = createCellElement(gameBoard).map((cell, index) => {
            return new Cell(cell, index % GRID_SIZE, Math.floor(index / GRID_SIZE));
        });
    }

    get #emptyCell() {
        return this.#cells.filter(cell => cell.title == null);
    }

    get cells(){
        return this.#cells;
    }
    

    randomEmptyCell(){
       const randomIndex = Math.floor(Math.random() * this.#emptyCell.length);
       return this.#emptyCell[randomIndex]; 
    }

    checkGameOver(){
        return this.#emptyCell.length == 0;
    }

    get cellsByColumn(){
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.x] = cellGrid[cell.x] || [];
            cellGrid[cell.x][cell.y] = cell;

            return cellGrid;
        }, []);
    }

    get cellsByRow(){
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.y] = cellGrid[cell.y] || [];
            cellGrid[cell.y][cell.x] = cell;

            return cellGrid;
        }, []);
    }
}

class Cell {
    #cellElement
    #x
    #y
    #title
    #mergeTitle

    constructor(cellElement, x, y){
        this.#cellElement = cellElement;
        this.#x = x;
        this.#y = y;
    }

    get title() {
        return this.#title;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get mergeTitle(){
        return this.#mergeTitle;
    }

    set mergeTitle(value){
        this.#mergeTitle = value;
        if(value == null) return;
        this.#mergeTitle.x = this.#x;
        this.#mergeTitle.y = this.#y;
    }
    
    set title(value) {
        this.#title = value;
        if(value == null) return;
        this.#title.x = this.#x;
        this.#title.y = this.#y;
    }

    canAccept(title) {
        return (this.title == null) || (this.mergeTitle == null && this.title.value == title.value);
    }

    mergeTitles(){
        if(this.title == null || this.mergeTitle == null){
            return;
        }

        this.title.value = this.title.value + this.mergeTitle.value;
        this.mergeTitle.remove();
        this.mergeTitle = null;
    }
}

const createCellElement = (gameBoard) => {
    const cells = [];
    for(let i = 0; i < GRID_SIZE * GRID_SIZE; i++){
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cells.push(cell);
        gameBoard.append(cell);
    }

    return cells;
}