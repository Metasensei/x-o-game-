"use strict";
const board = document.getElementById("board");
const resetButton = document.getElementById("reset");
let currentPlayer = "X";
let gameActive = true;
let boardState = ["", "", "", "", "", "", "", "", ""];
for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i.toString();
    board.appendChild(cell);
    cell.addEventListener("click", () => {
        if (cell.textContent !== "" || !gameActive || currentPlayer !== "X")
            return;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());
        boardState[parseInt(cell.dataset.index)] = currentPlayer;
        const winningCombo = checkWin(currentPlayer);
        if (winningCombo) {
            drawLine(winningCombo);
            alert(`${currentPlayer} g'olib bo'ldi!`);
            gameActive = false;
            return;
        }
        if (!boardState.includes("")) {
            alert("Durang!");
            gameActive = false;
            return;
        }
        currentPlayer = "O";
        setTimeout(robotMove, 500); // Robot harakati uchun kechikish qo'shamiz
    });
}
function checkWin(player) {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    return winningCombos.find(combo => {
        return combo.every(index => boardState[index] === player);
    });
}
function drawLine(combo) {
    const line = document.createElement("div");
    line.classList.add("line");
    if (combo[0] === 0 && combo[1] === 1 && combo[2] === 2) {
        line.classList.add("horizontal", "line-0");
    }
    else if (combo[0] === 3 && combo[1] === 4 && combo[2] === 5) {
        line.classList.add("horizontal", "line-1");
    }
    else if (combo[0] === 6 && combo[1] === 7 && combo[2] === 8) {
        line.classList.add("horizontal", "line-2");
    }
    else if (combo[0] === 0 && combo[1] === 3 && combo[2] === 6) {
        line.classList.add("vertical", "line-3");
    }
    else if (combo[0] === 1 && combo[1] === 4 && combo[2] === 7) {
        line.classList.add("vertical", "line-4");
    }
    else if (combo[0] === 2 && combo[1] === 5 && combo[2] === 8) {
        line.classList.add("vertical", "line-5");
    }
    else if (combo[0] === 0 && combo[1] === 4 && combo[2] === 8) {
        line.classList.add("diagonal", "line-6");
    }
    else if (combo[0] === 2 && combo[1] === 4 && combo[2] === 6) {
        line.classList.add("diagonal", "line-7");
    }
    board.appendChild(line);
}
function robotMove() {
    if (!gameActive)
        return;
    const bestMove = findBestMove();
    boardState[bestMove] = "O";
    const cell = document.querySelector(`.cell[data-index='${bestMove}']`);
    cell.textContent = "O";
    cell.classList.add("o");
    const winningCombo = checkWin("O");
    if (winningCombo) {
        drawLine(winningCombo);
        alert("O g'olib bo'ldi!");
        gameActive = false;
        return;
    }
    if (!boardState.includes("")) {
        alert("Durang!");
        gameActive = false;
        return;
    }
    currentPlayer = "X";
}
function findBestMove() {
    let bestScore = -Infinity;
    let move = -1;
    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === "") {
            boardState[i] = "O";
            const score = minimax(boardState, 0, false);
            boardState[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}
function minimax(state, depth, isMaximizing) {
    const winner = checkWinner(state);
    if (winner === "X")
        return -10 + depth;
    if (winner === "O")
        return 10 - depth;
    if (!state.includes(""))
        return 0;
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < state.length; i++) {
            if (state[i] === "") {
                state[i] = "O";
                const score = minimax(state, depth + 1, false);
                state[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    }
    else {
        let bestScore = Infinity;
        for (let i = 0; i < state.length; i++) {
            if (state[i] === "") {
                state[i] = "X";
                const score = minimax(state, depth + 1, true);
                state[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}
function checkWinner(state) {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (state[a] && state[a] === state[b] && state[a] === state[c]) {
            return state[a];
        }
    }
    return null;
}
resetButton.addEventListener("click", () => {
    currentPlayer = "X";
    gameActive = true;
    boardState = ["", "", "", "", "", "", "", "", ""];
    document.querySelectorAll(".cell").forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("x", "o");
    });
    const line = document.querySelector(".line");
    if (line)
        line.remove();
});
