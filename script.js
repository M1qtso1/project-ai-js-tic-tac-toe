let cells = [];
let boardSize = 3;
let cellValues = [];
let currentPlayer = 'X';
let gameOver = false;
let gameMode = 'player';

let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

const board = document.getElementById('board');
const status = document.getElementById('status');
const modeSelect = document.getElementById('mode');
const sizeSelect = document.getElementById('size');
const gameContainer = document.getElementById('game');
const modeContainer = document.getElementById('mode-select');

function startGame() {
    gameMode = modeSelect.value;
    boardSize = parseInt(sizeSelect.value);
    modeContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    createBoard();
}

function changeMode() {
    gameContainer.style.display = 'none';
    modeContainer.style.display = 'block';
    clearBoard();
}

function createBoard() {
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${boardSize}, 80px)`;
    cells = [];
    cellValues = Array(boardSize * boardSize).fill(null);
    currentPlayer = 'X';
    gameOver = false;
    status.textContent = "Tura gracza: X";

    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleClick);
        board.appendChild(cell);
        cells.push(cell);
    }
}

function handleClick(e) {
    const index = parseInt(e.target.dataset.index);
    if (cellValues[index] || gameOver || (gameMode === 'ai' && currentPlayer === 'O')) return;

    makeMove(index, currentPlayer);

    if (!gameOver && gameMode === 'ai' && currentPlayer === 'O') {
        setTimeout(computerMove, 400);
    }
}

function makeMove(index, player) {
    cellValues[index] = player;
    cells[index].textContent = player;

    const result = checkWinner();
    if (result) {
        status.textContent = `Wygrał: ${result.symbol}`;
        highlight(result.line);
        gameOver = true;
        updateScore(result.symbol);
    } else if (cellValues.every(val => val !== null)) {
        status.textContent = "Remis!";
        gameOver = true;
        updateScore('draw');
    } else {
        currentPlayer = player === 'X' ? 'O' : 'X';
        status.textContent = (gameMode === 'ai' && currentPlayer === 'O') ? "Tura komputera..." : `Tura gracza: ${currentPlayer}`;
    }
}

function computerMove() {
    const empty = cellValues.map((v, i) => v === null ? i : null).filter(v => v !== null);
    const index = empty[Math.floor(Math.random() * empty.length)];
    makeMove(index, 'O');
}

function checkWinner() {
    const lines = [];

    // Wiersze
    for (let r = 0; r < boardSize; r++) {
        const row = [];
        for (let c = 0; c < boardSize; c++) row.push(r * boardSize + c);
        lines.push(row);
    }

    // Kolumny
    for (let c = 0; c < boardSize; c++) {
        const col = [];
        for (let r = 0; r < boardSize; r++) col.push(r * boardSize + c);
        lines.push(col);
    }

    // Przekątna
    lines.push(Array.from({ length: boardSize }, (_, i) => i * (boardSize + 1)));

    // Druga przekątna
    lines.push(Array.from({ length: boardSize }, (_, i) => (i + 1) * (boardSize - 1)));

    for (const line of lines) {
        const [first, ...rest] = line;
        if (cellValues[first] && rest.every(i => cellValues[i] === cellValues[first])) {
            return { symbol: cellValues[first], line };
        }
    }

    return null;
}

function highlight(line) {
    line.forEach(i => cells[i].classList.add('winner'));
}

function resetGame() {
    createBoard();
}

function clearBoard() {
    board.innerHTML = '';
    status.textContent = '';
    cells = [];
    cellValues = [];
    gameOver = false;
}

function updateScore(winner) {
    if (winner === 'X') {
        scoreX++;
        document.getElementById('scoreX').textContent = scoreX;
    } else if (winner === 'O') {
        scoreO++;
        document.getElementById('scoreO').textContent = scoreO;
    } else if (winner === 'draw') {
        scoreDraw++;
        document.getElementById('scoreDraw').textContent = scoreDraw;
    }
}
