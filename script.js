document.addEventListener('DOMContentLoaded', () => {
    const setupDiv = document.getElementById('setup');
    const gameDiv = document.getElementById('game');
    const boardDiv = document.getElementById('board');
    const turnDiv = document.getElementById('turn');
    const scoreboard = document.getElementById('scoreboard');
    const score1Span = document.getElementById('score1');
    const score2Span = document.getElementById('score2');
    const restartBtn = document.getElementById('restartBtn');

    // Step 1: Mode selection
    setupDiv.innerHTML = `
        <form id="modeForm">
            <label>
                <input type="radio" name="mode" value="local" checked>
                Play with Local Player
            </label>
            <label>
                <input type="radio" name="mode" value="computer">
                Play with Computer
            </label>
            <button type="submit">Next</button>
        </form>
        <form id="playerForm" style="display:none;">
            <div id="playerInputs"></div>
            <button type="submit">Start Game</button>
        </form>
    `;

    let mode = "local";
    let players, scores, currentPlayer, board, gameActive;

    const modeForm = document.getElementById('modeForm');
    const playerForm = document.getElementById('playerForm');
    const playerInputsDiv = document.getElementById('playerInputs');

    modeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        mode = modeForm.mode.value;
        // Show appropriate player input fields
        if (mode === "local") {
            playerInputsDiv.innerHTML = `
                <label>
                    Player 1 Name:
                    <input type="text" id="player1" required>
                </label>
                <label>
                    Player 2 Name:
                    <input type="text" id="player2" required>
                </label>
            `;
        } else {
            playerInputsDiv.innerHTML = `
                <label>
                    Player Name:
                    <input type="text" id="player1" required>
                </label>
            `;
        }
        modeForm.style.display = "none";
        playerForm.style.display = "";
    });

    function initBoard() {
        board = Array(9).fill('');
        boardDiv.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            cell.addEventListener('click', handleCellClick);
            boardDiv.appendChild(cell);
        }
        gameActive = true;
    }

    function handleCellClick(e) {
        const idx = e.target.dataset.index;
        if (!gameActive || board[idx]) return;
        board[idx] = currentPlayer.symbol;
        e.target.textContent = currentPlayer.symbol;
        e.target.classList.add(currentPlayer.symbol);
        if (checkWin(currentPlayer.symbol)) {
            turnDiv.textContent = `${currentPlayer.name} wins!`;
            scores[currentPlayer.index]++;
            updateScores();
            gameActive = false;
        } else if (board.every(cell => cell)) {
            turnDiv.textContent = "It's a draw!";
            gameActive = false;
        } else {
            switchPlayer();
            if (mode === 'computer' && currentPlayer.index === 1) {
                setTimeout(computerMove, 500);
            }
        }
    }

    function computerMove() {
        let empty = board.map((v, i) => v === '' ? i : null).filter(i => i !== null);
        if (empty.length === 0) return;
        let move = empty[Math.floor(Math.random() * empty.length)];
        boardDiv.children[move].click();
    }

    function switchPlayer() {
        currentPlayer = players[1 - currentPlayer.index];
        turnDiv.textContent = `Turn: ${currentPlayer.name} (${currentPlayer.symbol})`;
    }

    function checkWin(symbol) {
        const wins = [
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6]
        ];
        return wins.some(line => line.every(i => board[i] === symbol));
    }

    function updateScores() {
        score1Span.textContent = scores[0];
        score2Span.textContent = scores[1];
    }

    playerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const p1 = document.getElementById('player1').value.trim() || 'Player 1';
        let p2 = mode === 'local'
            ? (document.getElementById('player2').value.trim() || 'Player 2')
            : 'Computer';
        players = [
            {name: p1, symbol: 'X', index: 0},
            {name: p2, symbol: 'O', index: 1}
        ];
        scores = [0, 0];
        updateScores();
        setupDiv.style.display = 'none';
        scoreboard.style.display = '';
        gameDiv.style.display = '';
        currentPlayer = players[0];
        turnDiv.textContent = `Turn: ${currentPlayer.name} (${currentPlayer.symbol})`;
        initBoard();
    });

    restartBtn.addEventListener('click', () => {
        currentPlayer = players[0];
        turnDiv.textContent = `Turn: ${currentPlayer.name} (${currentPlayer.symbol})`;
        initBoard();
    });
});