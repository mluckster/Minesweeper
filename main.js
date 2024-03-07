const board = document.getElementById('board')
const generate = document.getElementById('easy')

generate.addEventListener('click', generateBoard)

// generates board for the squares to appear
function generateBoard(e) {
    var randomNumbers = generateMines(10, 8, 8) // calls to randomly generate location of mines (2d array)
    makeSquares(randomNumbers, 8, 8)
    board.addEventListener('click', checkMine)
}

// generates an array of numbers which will correspond to the location of the mines
function generateMines(numMine, row, col) {
    let numbers = []
    while (numbers.length < numMine){
        let randomNumber = 
            [
            Math.floor(Math.random() * row), 
            Math.floor(Math.random() * col)
            ]
        const found = numbers.some((arr) => {
            return arr[0] === randomNumber[0] && arr[1] === randomNumber[1]
        })
        if (!found){
            numbers.push(randomNumber)
        }
    }
    return numbers
}

function makeSquares(randomNumbers, row, col) {
    for (let i = 0; i < row; i++ ) {
        for (let j = 0; j < col; j++ ) {
            const square = document.createElement('div')
            board.appendChild(square)
            square.classList = 'square'
            square.id = `${j}${i}`
            square.innerHTML = `${j}, ${i}`

            const found = randomNumbers.some((arr) => {
                return arr[0] === i && arr[1] === j
            })

            if (found){
                square.classList.add('mine')
                const mine = document.createElement('div')
                square.appendChild(mine)
                mine.classList = 'mine-css'
            }
        }
    }
}

function checkMine(e) {
    if (e.target.classList.contains('mine')){
        e.target.style.backgroundColor = 'red'
    }
    else {
        e.target.style.backgroundColor = 'green'
        const cell = [Number(e.target.id[0]), Number(e.target.id[1])]
        const surrounding = scanSurroundings(cell)
        console.log(surrounding)
        e.target.innerHTML = `${surrounding}`
    }
}


// this is slightly broken right now //
function scanSurroundings(cell){
    let minesAroundCell = 0
    console.log(minesAroundCell)
    Array.from(board.children).forEach(element => {
        console.log(Number(element.id[0]) - 1 === cell[0], Number(element.id[0]), cell[0])
        if ( 
            Number(element.id[0]) === cell[0] - 1 &&
            (
                Number(element.id[1]) === cell[1] - 1 ||
                Number(element.id[1]) === cell[1] ||
                Number(element.id[1]) === cell[1] + 1 
            ) &&
            element.classList.contains('mine')
        ) {
            minesAroundCell += 1
        }
        else if (
            Number(element.id[0]) === cell[0] && 
            ( 
                Number(element.id[1]) === cell[1] - 1 ||
                Number(element.id[1]) === cell[1] + 1 
            ) &&
            element.classList.contains('mine')
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
            element.classList.contains('mine')
            ) {
                minesAroundCell += 1
            }
    });
    console.log(minesAroundCell)
    return minesAroundCell
}