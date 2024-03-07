const board = document.getElementById('board')
const generate = document.getElementById('easy')

generate.addEventListener('click', generateBoard)

// generates board for the squares to appear
function generateBoard(e) {
    if (e.target.id == 'easy') {
        var randomNumbers = generateMines(10, 8, 8) // calls to randomly generate location of mines (2d array)
        makeSquares(randomNumbers, 8, 8)
    }
    else if (e.target.id == 'intermediate') {
        var randomNumbers = generateMines(40, 256)
    }
    else {
        var randomNumbers = generateMines(99, 480)
    }
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
        if(numbers.includes(randomNumber) == false) {
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
            square.innerHTML = `${j}, ${i}`

            const found = randomNumbers.some((arr) => {
                return arr[0] === i && arr[1] === j
            })
            console.log(randomNumbers.length)

            if (found){
                console.log('mine')
                square.classList.add('mine')
            }
        }
    }
}