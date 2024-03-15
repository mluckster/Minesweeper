const board = document.getElementById('board')
const generate = document.getElementById('reset')
const timer = document.getElementById('timer')
const score = document.getElementById('score')
const messageElement = document.getElementById('game-over')
const difficultyElements = document.querySelectorAll('.difficulty')

let timerOn = false
let difficulty = 'easy'
let timeInSec = 0
let randomNumbers = []
let numberOfMines = 10
let numberOfFlags = numberOfMines
let numberOfClears = 0
let noOfRow = 8
let noOfCol = 8

// initial event listeners just to reset the game
generate.addEventListener('click', generateBoard)
difficultyElements.forEach((diffEl) => {
    diffEl.addEventListener('click', changeDifficulty)
})
document.documentElement.style.setProperty('--noOfCol', 8);
document.documentElement.style.setProperty('--noOfRow', 8);
document.documentElement.style.setProperty('--squareSize', '50px');

makeSquares(noOfRow, noOfCol)

score.innerHTML = `${numberOfFlags}`

// generates board for the squares to appear
function generateBoard(e) {
    // resetting board from previous game:
    messageElement.innerHTML = ''
    numberOfFlags = numberOfMines
    score.innerHTML = `${numberOfFlags}`
    timer.innerHTML = `0`;
    timerOn = false
    randomNumbers = []
    board.innerHTML = ''
    numberOfClears = 0
    generate.classList.remove('lose')
    generate.classList.remove('win')
    
    // make grid based on difficulty and set number of mines
    
    //random number array only made after first square is clicked!
    makeSquares(noOfRow, noOfCol)
    const squares = document.querySelectorAll('.square')
    squares.forEach((square) => {
        square.add
    })
}

// generates an array of numbers which will correspond to the location of the mines
function generateMines(numMine, row, col, element) {
    
    let numbers = []

    while (numbers.length < numMine){
        let randomNumber =
        [
            Math.floor(Math.random() * row),
            Math.floor(Math.random() * col)
        ]
        
        let found = numbers.some((num) => {
            return num[0] === randomNumber[0] && num[1] === randomNumber[1]
        })
        
        // need to work on this - it's not working
        const initialClickedSquare = [Number(element.id[0]), Number(element.id[1])]

        for (let i = initialClickedSquare[0] - 1; i <= initialClickedSquare[0] + 1; i++){
            for (let j = initialClickedSquare[1] - 1; j <= initialClickedSquare[1] + 1; j++) {
                if (randomNumber[0] === i && randomNumber[1] === j){
                    found = true
                }
            }
        }

        if (!found){
            numbers.push(randomNumber)
        }

    }
    return numbers
}

function checkMine(e) {
    console.log('check mine')
    if (randomNumbers.length == 0) {
        timerOn = true
        startTimer()
        randomNumbers = generateMines(numberOfMines, noOfRow, noOfCol, e.target)
    }

    const found = randomNumbers.some((arr) => {
        return arr[0] === Number(e.target.id[0]) && arr[1] === Number(e.target.id[1])
    })

    if (found){
        loseGame(randomNumbers, e.target)
    }
    else {
        if (!e.target.classList.contains('active')) {
            e.target.classList.add('active')
            numberOfClears += 1
            checkWinCondition()
        }
        e.target.classList.remove('flag')
        const cell = [Number(e.target.id[0]), Number(e.target.id[1])]
        const surrounding = scanSurroundings(cell, randomNumbers)
        if (surrounding == 0){
            uncoverAdjacentSquares(e.target, randomNumbers)
            e.target.innerHTML = ``
        } else {
            e.target.innerHTML = `${surrounding}`
            e.target.classList.add(`text-${surrounding}`)
        }
    }
}

function uncoverAdjacentSquares(square, randomNumbers) {
    // then we can 2d loop through row -1 to row +1 and within col -1 to col + 1
    // finding the element by using: document.getElementById(''${i}${j})

    let row = Number(square.id[0])
    let col = Number(square.id[1])

    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            const element = document.getElementById(`${i}${j}`)
            if (element && (i != row || j != col)) { // cases around the edge of the board -- element would be null
                const surroundingMines = scanSurroundings([i, j], randomNumbers)
                if (!element.classList.contains('active')) {
                    element.classList.add('active')
                    numberOfClears += 1
                    checkWinCondition()
                }
                if (surroundingMines != 0){
                    element.innerHTML = `${surroundingMines}`
                    element.classList.add(`text-${surroundingMines}`)
                } else {
                    element.innerHTML = ``
                }
                if (surroundingMines == 0 && !element.classList.contains('visited')) {
                    element.classList.add('visited')
                    uncoverAdjacentSquares(element, randomNumbers)
                }
            }
        }
    }
}

// if statements check each cell surrounding the one that was clicked to see if there's a mine
function scanSurroundings(cell, randomNumbers){
    let minesAroundCell = 0
    Array.from(board.children).forEach(element => {
        if ( 
            Number(element.id[0]) === cell[0] - 1 &&
            (
                Number(element.id[1]) === cell[1] - 1 ||
                Number(element.id[1]) === cell[1] ||
                Number(element.id[1]) === cell[1] + 1 
            ) &&
            randomNumbers.some(arr => arr[0] === Number(element.id[0]) && arr[1] === Number(element.id[1]))
        ) {
            minesAroundCell += 1
        }
        else if (
            Number(element.id[0]) === cell[0] && 
            ( 
                Number(element.id[1]) === cell[1] - 1 ||
                Number(element.id[1]) === cell[1] + 1 
            ) &&
            randomNumbers.some(arr => arr[0] === Number(element.id[0]) && arr[1] === Number(element.id[1]))
            ) {
                minesAroundCell += 1
            }
        else if (
            Number(element.id[0]) === cell[0] + 1  && 
            ( 
                Number(element.id[1]) === cell[1] - 1 ||
                Number(element.id[1]) === cell[1] ||
                Number(element.id[1]) === cell[1] + 1  
            ) &&
            randomNumbers.some(arr => arr[0] === Number(element.id[0]) && arr[1] === Number(element.id[1]))
            ) {
                minesAroundCell += 1
            }
    });
    return minesAroundCell
}

function placeFlag(e){
    e.preventDefault()
    if (e.target.classList.contains('flag')){
        e.target.classList.remove('flag')
        numberOfFlags += 1
        score.innerHTML = `${numberOfFlags}`
        e.target.addEventListener('click', checkMine)
    } else if (!e.target.classList.contains('active')) {
        e.target.classList.add('flag')
        numberOfFlags -= 1
        score.innerHTML = `${numberOfFlags}`
        e.target.removeEventListener('click', checkMine)
    }
}

function loseGame(randomNumbers, element){
    messageElement.innerHTML = 'You exploded!'
    Array.from(board.children).forEach(element => {

        const id = [Number(element.id[0]), Number(element.id[1])];
        if (randomNumbers.some(arr => arr[0] === id[0] && arr[1] === id[1])) {
            element.classList.add('bomb')
        }
        element.removeEventListener('click', checkMine)
        element.removeEventListener('contextmenu', placeFlag)
    });
    
    element.style.backgroundColor = 'red'
    generate.classList.add('lose')
    timerOn = false
}

function checkWinCondition() {
    //number of total square - number of mines (place vars if setting is added)
    if (numberOfClears == 64 - numberOfMines) { 
        timerOn = false
        messageElement.innerHTML = `Congrats you've cleared the ${difficulty} board in ${timeInSec} seconds`
        Array.from(board.children).forEach(element => {
            if (!element.classList.contains('active') && !element.classList.contains('flag')) {
                element.classList.add('flag')
                numberOfFlags -= 1
                score.innerHTML = `${numberOfFlags}`
            }
            element.removeEventListener('click', checkMine)
            element.removeEventListener('contextmenu', placeFlag)
            element.classList.add('flash')
        })
        generate.classList.add('win')
    }
}

function makeSquares(row, col) {
    for (let i = 0; i < row; i++ ) {
        for (let j = 0; j < col; j++ ) {
            const square = document.createElement('div')
            board.appendChild(square)
            square.classList = 'square'
            square.id = `${j}${i}`
            square.addEventListener('click', checkMine)
            square.addEventListener('contextmenu', placeFlag)
            square.addEventListener('mousedown', changeFaceO)
            square.addEventListener('mouseup', changeFaceS)
        }
    }
}

function changeFaceO () {
    reset.classList.add('face')
}

function changeFaceS () {
    reset.classList.remove('face')
}

function changeDifficulty(e) {
    if (e.target.id == 'intermediate'){
        noOfRow = 16
        noOfCol = 16
        document.documentElement.style.setProperty('--noOfCol', 16);
        document.documentElement.style.setProperty('--noOfRow', 16);
        document.documentElement.style.setProperty('--squareSize', '30px');
        numberOfMines = 40;
        generateBoard();
    } else if (e.target.id == 'expert') {
        noOfRow = 30
        noOfCol = 16
        document.documentElement.style.setProperty('--noOfCol', 16);
        document.documentElement.style.setProperty('--noOfRow', 30);
        document.documentElement.style.setProperty('--squareSize', '20px');
        numberOfMines = 99;
        generateBoard();
    } else {
        noOfRow = 8
        noOfCol = 8
        document.documentElement.style.setProperty('--noOfCol', 8);
        document.documentElement.style.setProperty('--noOfRow', 8);
        document.documentElement.style.setProperty('--squareSize', '50px');
        numberOfMines = 10;
        generateBoard();
    }
}

function startTimer(){
    timeInSec = 0;
    let id = setInterval(() => {
        if (timerOn){
            timeInSec += 1;
            if (timeInSec < 60) {
                timer.innerHTML = `${timeInSec}`;
            }
        } else clearInterval(id)
    }, 1000);
}

