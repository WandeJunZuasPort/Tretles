const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const ROWS = 20;
    const COLS = 10;
    const BLOCK_SIZE = 30;
    const COLORS = ["#FF5733", "#33FF57", "#3357FF", "#F0F033", "#FF33A1", "#33F0FF", "#F033F0"];
    let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    let score = 0;
    let currentPiece;
    let gameOver = false;

    const shapes = [
        [[1, 1, 1, 1]], // I shape
        [[1, 1], [1, 1]], // O shape
        [[0, 1, 0], [1, 1, 1]], // T shape
        [[1, 1, 0], [0, 1, 1]], // S shape
        [[0, 1, 1], [1, 1, 0]], // Z shape
        [[1, 0, 0], [1, 1, 1]], // L shape
        [[0, 0, 1], [1, 1, 1]], // J shape
    ];

    // Função para desenhar a grade
    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (board[row][col]) {
                    ctx.fillStyle = COLORS[board[row][col] - 1];
                    ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    ctx.strokeStyle = "#fff";
                    ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }
    }

    // Função para desenhar a peça
    function drawPiece() {
        if (!currentPiece) return;

        for (let row = 0; row < currentPiece.shape.length; row++) {
            for (let col = 0; col < currentPiece.shape[row].length; col++) {
                if (currentPiece.shape[row][col]) {
                    ctx.fillStyle = currentPiece.color;
                    ctx.fillRect((currentPiece.x + col) * BLOCK_SIZE, (currentPiece.y + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    ctx.strokeStyle = "#fff";
                    ctx.strokeRect((currentPiece.x + col) * BLOCK_SIZE, (currentPiece.y + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }
    }

    // Função para verificar se a peça pode se mover
    function canMove(dx, dy, shape) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = currentPiece.x + col + dx;
                    const newY = currentPiece.y + row + dy;

                    if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    // Função para fixar a peça no tabuleiro
    function fixPiece() {
        for (let row = 0; row < currentPiece.shape.length; row++) {
            for (let col = 0; col < currentPiece.shape[row].length; col++) {
                if (currentPiece.shape[row][col]) {
                    board[currentPiece.y + row][currentPiece.x + col] = currentPiece.colorIndex + 1;
                }
            }
        }
        checkLines();
        newPiece();
    }

    // Função para criar uma nova peça
    function newPiece() {
        const index = Math.floor(Math.random() * shapes.length);
        currentPiece = {
            shape: shapes[index],
            x: Math.floor(COLS / 2) - Math.floor(shapes[index][0].length / 2),
            y: -2,
            color: COLORS[index],
            colorIndex: index
        };

        if (!canMove(0, 0, currentPiece.shape)) {
            gameOver = true;
            alert("Game Over! Pontuação: " + score);
        }
    }

    // Função para remover linhas completas
    function checkLines() {
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row].every(cell => cell !== 0)) {
                board.splice(row, 1);
                board.unshift(Array(COLS).fill(0));
                score += 100;
                document.getElementById("score").textContent = "Pontos: " + score;
            }
        }
    }

    // Função de movimento da peça
    function movePiece() {
        if (!gameOver) {
            if (canMove(0, 1, currentPiece.shape)) {
                currentPiece.y++;
            } else {
                fixPiece();
            }
            drawBoard();
            drawPiece();
        }
    }

    // Função para girar a peça
    function rotatePiece() {
        const newShape = currentPiece.shape[0].map((_, index) =>
            currentPiece.shape.map(row => row[index])
        ).reverse();
        if (canMove(0, 0, newShape)) {
            currentPiece.shape = newShape;
        }
    }

    // Função de controle via teclado
    function keyDown(event) {
        if (event.key === "ArrowLeft" && canMove(-1, 0, currentPiece.shape)) {
            currentPiece.x--;
        } else if (event.key === "ArrowRight" && canMove(1, 0, currentPiece.shape)) {
            currentPiece.x++;
        } else if (event.key === "ArrowDown") {
            movePiece();
        } else if (event.key === "ArrowUp") {
            rotatePiece();
        }
    }

    // Função de loop do jogo
    function gameLoop() {
        movePiece();
        if (!gameOver) {
            setTimeout(gameLoop, 500);
        }
    }

    // Iniciar o jogo
    function startGame() {
        document.addEventListener("keydown", keyDown);
        newPiece();
        gameLoop();
    }

    startGame();