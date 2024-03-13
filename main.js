const board = document.getElementById('board')
const generate = document.getElementById('easy')
let randomNumbers = []
let numberOfMines = 10
let numberOfFlags = 0
let numberOfClears = 0
let noOfRow = 8
let noOfCol = 8

// initial event listeners and setup for the game
generate.addEventListener('click', generateBoard)
board.addEventListener('click', checkMine)
board.addEventListener('contextmenu', placeFlag)
makeSquares(8, 8)

// generates board for the squares to appear
function generateBoard(e) {   
    // resetting board from previous game:
    randomNumbers = []
    board.innerHTML = ''
    numberOfClears = 0
    board.removeEventListener('click', checkMine)
    board.removeEventListener('contextmenu', placeFlag)
    
    // make grid based on difficulty and set number of mines
    numberOfMines = 10 // this line isn't needed currently
    
    //random number array only made after first square is clicked!
    board.addEventListener('click', checkMine)
    board.addEventListener('contextmenu', placeFlag)
    makeSquares(8, 8)
}

// generates an array of numbers which will correspond to the location of the mines
function generateMines(numMine, row, col, element) {
    const initialClickedSquare = [Number(element.id[0]), Number(element.id[1])]

    let numbers = []
    console.log('generate mines', element)
    while (numbers.length < numMine){
        let randomNumber =
            [
            Math.floor(Math.random() * row),
            Math.floor(Math.random() * col)
            ]

        let found = numbers.some((arr) => {
            return arr[0] === randomNumber[0] && arr[1] === randomNumber[1]
        })

        for (let i = initialClickedSquare[0] - 1; i <= initialClickedSquare[1] + 1; i++){
            for (let j = initialClickedSquare[1] - 1; j <= initialClickedSquare[1] + 1; j++) {
                console.log('initial', initialClickedSquare)
                console.log(randomNumber[0], i, randomNumber[1], j)
                if (randomNumber[0] === i && randomNumber[1] === j){
                    found = false
                }
            }
        }

        if (!found){
            numbers.push(randomNumber)
        }
        
    }
    return numbers
}

function makeSquares(row, col) {
    for (let i = 0; i < row; i++ ) {
        for (let j = 0; j < col; j++ ) {
            const square = document.createElement('div')
            board.appendChild(square)
            square.classList = 'square'
            square.id = `${j}${i}`
            square.innerHTML = `${j}, ${i}`
        }
    }
}

function checkMine(e) {
    if (randomNumbers.length == 0) {
        randomNumbers = generateMines(numberOfMines, noOfRow, noOfCol, e.target)
    }

    const found = randomNumbers.some((arr) => {
        return arr[0] === Number(e.target.id[0]) && arr[1] === Number(e.target.id[1])
    })

    if (found){
        loseGame(randomNumbers)
        // GAME IF LOST IF THIS HAPPENS!!!!!
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
        }
    }
}

function uncoverAdjacentSquares(square, randomNumbers){
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
    } else if (!e.target.classList.contains('active')) {
        e.target.classList.add('flag')
    }
}

function loseGame(randomNumbers){
    Array.from(board.children).forEach(element => {
        const id = [Number(element.id[0]), Number(element.id[1])];
        if (randomNumbers.some(arr => arr[0] === id[0] && arr[1] === id[1])) {
            element.style.backgroundColor = 'red';
        }
    });

    setTimeout(() => {
        alert('game is lost')
    }, "100");

    board.removeEventListener('click', checkMine)
    board.removeEventListener('contextmenu', placeFlag)

}

function checkWinCondition() {
    //number of total square - number of mines (place vars if setting is added)
    if (numberOfClears == 64 - 10) { 
        Array.from(board.children).forEach(element => {
            if (element.classList.contains('mine')) {
                element.style.backgroundColor = 'red'
            }
        })
        setTimeout(() => {
            alert('game is won')
        }, 10);
    
        board.removeEventListener('click', checkMine)
        board.removeEventListener('contextmenu', placeFlag)
    
    }
}