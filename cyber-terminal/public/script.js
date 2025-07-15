// === Matrix Rain Effect ===
function createMatrixRain() {
  const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,.<>?';

  setInterval(() => {
    if (Math.random() < 0.1) {
      const char = document.createElement('div');
      char.className = 'matrix-char';
      char.textContent = chars[Math.floor(Math.random() * chars.length)];
      char.style.left = Math.random() * 100 + 'vw';
      char.style.animationDuration = (Math.random() * 3 + 2) + 's';
      document.body.appendChild(char);

      setTimeout(() => {
        if (char.parentNode) {
          char.parentNode.removeChild(char);
        }
      }, 5000);
    }
  }, 200);
}

// === Chat Code ===
const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

// Add typing indicator
let typingTimer;
const typingDelay = 1000;

input.addEventListener('input', () => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    input.classList.remove('terminal-cursor');
  }, typingDelay);
});

// Nickname functionality
let userNickname = null;
const nicknameModal = document.getElementById('nickname-modal');
const nicknameInput = document.getElementById('nickname-input');
const setNicknameBtn = document.getElementById('set-nickname-btn');

// Nickname modal will be shown after cutscene in initializeApp()

function setNickname() {
  const nickname = nicknameInput.value.trim();
  if (nickname && nickname.length >= 2) {
    userNickname = nickname;
    socket.emit('set nickname', nickname);
    nicknameModal.style.display = 'none';

    // Add welcome message
    addSystemMessage(`Welcome, ${nickname}! You are now connected to the cyber terminal.`);
  } else {
    nicknameInput.style.borderColor = '#ff4400';
    setTimeout(() => {
      nicknameInput.style.borderColor = '#00ff41';
    }, 1000);
  }
}

setNicknameBtn.addEventListener('click', setNickname);

nicknameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    setNickname();
  }
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value.trim() && userNickname) {
    const message = input.value.trim();

    // Check for help command
    if (message.toLowerCase() === '/help') {
      showHelpCommands();
      input.value = '';
      return;
    }

    // Check for gaming mode commands
    const gamingCommands = [
      '/enable gaming mode',
      '/gaming',
      '/gamin',
      '/game',
      '/gamer mode',
      '/games enable',
      '/games'
    ];

    if (gamingCommands.includes(message.toLowerCase())) {
      enableGamingMode();
      input.value = '';
      return;
    }

    socket.emit('chat message', message);
    input.value = '';

    // Add visual feedback
    const button = form.querySelector('button');
    button.textContent = 'SENT';
    button.style.background = '#39ff14';
    setTimeout(() => {
      button.textContent = 'TRANSMIT';
      button.style.background = '';
    }, 500);
  }
});

function addSystemMessage(msg) {
  const item = document.createElement('li');
  item.textContent = `[SYSTEM] ${msg}`;
  item.style.color = '#ff8800';
  item.style.borderLeft = '3px solid #ff8800';
  item.style.background = 'rgba(255, 136, 0, 0.1)';
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}

function showHelpCommands() {
  const helpCommands = [
    '⚡ CYBERNET TERMINAL COMMAND DATABASE ⚡',
    '',
    '🎮 GAMING PROTOCOLS:',
    '  /gaming, /games, /game, /gamin - Enable gaming station',
    '  /gamer mode, /games enable - Alternative gaming activation',
    '  /enable gaming mode - Full gaming mode command',
    '',
    '💬 CHAT PROTOCOLS:',
    '  /help - Display this command database',
    '',
    '🎯 GAME CONTROLS:',
    '  Arrow Keys (←/→) - Move player/paddle in all games',
    '  SPACE - Fire machine gun in Breakout (when available)',
    '  Mouse - Control paddle in Breakout',
    '',
    '🎲 AVAILABLE GAMES:',
    '  • TIC-TAC-TOE MATRIX - Classic 3x3 grid strategy',
    '  • BREAKOUT PROTOCOL - Ball & paddle block destruction',
    '  • BLOCK DROP - Infinite survival challenge',
    '',
    '🛡️  SECURITY STATUS: [ENCRYPTED] • [ONLINE] • [SECURE]'
  ];

  helpCommands.forEach((command, index) => {
    setTimeout(() => {
      const item = document.createElement('li');
      item.style.color = command.startsWith('⚡') ? '#00ff41' : 
                        command.startsWith('🎮') || command.startsWith('💬') || 
                        command.startsWith('🎯') || command.startsWith('🎲') ? '#00aaff' :
                        command.startsWith('🛡️') ? '#ff8800' :
                        command.startsWith('  ') ? '#cccccc' : '#ffffff';
      item.style.fontFamily = "'Fira Code', monospace";
      item.style.fontSize = command.startsWith('⚡') ? '16px' : '14px';
      item.style.fontWeight = command.startsWith('⚡') || command.includes('PROTOCOLS:') || 
                             command.includes('CONTROLS:') || command.includes('GAMES:') || 
                             command.includes('STATUS:') ? 'bold' : 'normal';
      item.style.background = command.startsWith('⚡') ? 'rgba(0, 255, 65, 0.1)' : 
                             command === '' ? 'transparent' : 'rgba(0, 50, 50, 0.3)';
      item.style.borderLeft = command.startsWith('⚡') ? '3px solid #00ff41' :
                             command.startsWith('🛡️') ? '3px solid #ff8800' :
                             command.startsWith('🎮') || command.startsWith('💬') || 
                             command.startsWith('🎯') || command.startsWith('🎲') ? '3px solid #00aaff' : 'none';
      item.style.padding = '8px 12px';
      item.style.margin = '2px 0';
      item.textContent = command;
      messages.appendChild(item);
      messages.scrollTop = messages.scrollHeight;
    }, index * 100);
  });

  console.log('💻 HELP DATABASE ACCESSED');
}

socket.on('chat message', function (msg) {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;

  // Sound effect simulation
  console.log('📡 MESSAGE RECEIVED');
});

socket.on('user joined', function (msg) {
  addSystemMessage(msg);
  console.log('👤 USER JOINED');
});

socket.on('user left', function (msg) {
  addSystemMessage(msg);
  console.log('👤 USER LEFT');
});

// === Enhanced Tic-Tac-Toe Game ===
const board = document.getElementById('board');
const currentPlayerDisplay = document.getElementById('current-player');
let cells = [];
let currentPlayer = 'X';
let gameActive = true;

function createBoard() {
  cells = [];
  board.innerHTML = '';
  gameActive = true;
  currentPlayer = 'X';
  updateCurrentPlayer();

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.addEventListener('click', onCellClick);
    board.appendChild(cell);
    cells.push(cell);
  }

  console.log('🎮 NEURAL NET INITIALIZED - NEW GAME STARTED');
}

function onCellClick(e) {
  const cell = e.target;
  const index = parseInt(cell.dataset.index);

  if (cell.textContent !== '' || !gameActive) return;

  // Add visual effect
  cell.style.transform = 'scale(0.8)';
  setTimeout(() => {
    cell.style.transform = 'scale(1)';
  }, 100);

  cell.textContent = currentPlayer;
  cell.style.color = currentPlayer === 'X' ? '#00ff41' : '#ff4400';

  if (checkWinner(currentPlayer)) {
    gameActive = false;
    highlightWinningCells(currentPlayer);
    setTimeout(() => {
      showAlert(`🏆 PLAYER ${currentPlayer} WINS! 🏆\n[VICTORY ACHIEVED]`);
      setTimeout(createBoard, 1500);
    }, 300);
    return;
  }

  if (isBoardFull()) {
    gameActive = false;
    setTimeout(() => {
      showAlert('⚡ NEURAL DEADLOCK ⚡\n[RESULT: TIE GAME]');
      setTimeout(createBoard, 1500);
    }, 300);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateCurrentPlayer();
}

function updateCurrentPlayer() {
  if (currentPlayerDisplay) {
    currentPlayerDisplay.textContent = currentPlayer;
    currentPlayerDisplay.style.color = currentPlayer === 'X' ? '#00ff41' : '#ff4400';
  }
}

function checkWinner(player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  return winPatterns.some(pattern => {
    const isWinner = pattern.every(index => cells[index].textContent === player);
    if (isWinner) {
      highlightWinningCells(player, pattern);
    }
    return isWinner;
  });
}

function highlightWinningCells(player, pattern) {
  if (pattern) {
    pattern.forEach(index => {
      cells[index].style.background = 'rgba(0, 255, 65, 0.3)';
      cells[index].style.boxShadow = '0 0 30px #00ff41';
    });
  }
}

function isBoardFull() {
  return cells.every(cell => cell.textContent !== '');
}

function showAlert(message) {
  // Custom alert styling
  const alertDiv = document.createElement('div');
  alertDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.95);
    color: #00ff41;
    padding: 30px;
    border: 2px solid #00ff41;
    border-radius: 10px;
    font-family: 'Fira Code', monospace;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    z-index: 1000;
    box-shadow: 0 0 50px rgba(0, 255, 65, 0.5);
    backdrop-filter: blur(10px);
  `;
  alertDiv.textContent = message;

  document.body.appendChild(alertDiv);

  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.parentNode.removeChild(alertDiv);
    }
  }, 1200);

  console.log(`🎮 ${message}`);
}

// === Gaming Mode Toggle ===
let gamingModeEnabled = false;

function enableGamingMode() {
  if (!gamingModeEnabled) {
    gamingModeEnabled = true;
    document.getElementById('gaming-station').style.display = 'block';
    addSystemMessage('🎮 GAMING MODE ENABLED - Neural net gaming station is now online!');
    console.log('🎮 GAMING MODE ACTIVATED');

    // Show first game by default
    switchToTicTacToe();
  } else {
    addSystemMessage('🎮 Gaming mode is already enabled!');
  }
}

// === Game Switching Logic ===
const ticTacToeBtn = document.getElementById('tic-tac-toe-btn');
const breakoutBtn = document.getElementById('breakout-btn');
const blockDropBtn = document.getElementById('block-drop-btn');
const ticTacToeGame = document.getElementById('tic-tac-toe-game');
const breakoutGame = document.getElementById('breakout-game');
const blockDropGame = document.getElementById('block-drop-game');

function switchToTicTacToe() {
  ticTacToeBtn.classList.add('active');
  breakoutBtn.classList.remove('active');
  blockDropBtn.classList.remove('active');
  ticTacToeGame.style.display = 'block';
  breakoutGame.style.display = 'none';
  blockDropGame.style.display = 'none';
  console.log('🎮 SWITCHED TO TIC-TAC-TOE');
}

function switchToBreakout() {
  breakoutBtn.classList.add('active');
  ticTacToeBtn.classList.remove('active');
  blockDropBtn.classList.remove('active');
  ticTacToeGame.style.display = 'none';
  breakoutGame.style.display = 'block';
  blockDropGame.style.display = 'none';
  console.log('🎮 SWITCHED TO BREAKOUT');
}

function switchToBlockDrop() {
  blockDropBtn.classList.add('active');
  ticTacToeBtn.classList.remove('active');
  breakoutBtn.classList.remove('active');
  ticTacToeGame.style.display = 'none';
  breakoutGame.style.display = 'none';
  blockDropGame.style.display = 'block';
  console.log('🔥 SWITCHED TO BLOCK DROP');
}

ticTacToeBtn.addEventListener('click', switchToTicTacToe);
breakoutBtn.addEventListener('click', switchToBreakout);
blockDropBtn.addEventListener('click', switchToBlockDrop);

// === Breakout Game ===
class Breakout {
  constructor() {
    this.canvas = document.getElementById('breakout-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 800;
    this.canvas.height = 600;

    this.paddle = {
      x: 350,
      y: 550,
      width: 100,
      height: 15,
      speed: 8
    };

    this.ball = {
      x: 400,
      y: 500,
      radius: 8,
      dx: 5,
      dy: -5,
      speed: 5
    };

    this.blocks = [];
    this.powerUps = [];
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.gameRunning = false;
    this.mouseX = 0;
    this.blockRows = 6;
    this.blockCols = 10;
    this.blockWidth = 76;
    this.blockHeight = 20;
    this.blockPadding = 4;

    this.keys = {
      left: false,
      right: false,
      space: false
    };

    this.machineGunMode = false;
    this.machineGunBullets = [];
    this.lastBulletTime = 0;

    this.setupControls();
    this.createBlocks();
  }

  setupControls() {
    document.addEventListener('keydown', (e) => {
      if (this.gameRunning && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === ' ')) {
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft') this.keys.left = true;
      if (e.key === 'ArrowRight') this.keys.right = true;
      if (e.key === ' ') this.keys.space = true;
    });

    document.addEventListener('keyup', (e) => {
      if (this.gameRunning && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === ' ')) {
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft') this.keys.left = false;
      if (e.key === 'ArrowRight') this.keys.right = false;
      if (e.key === ' ') this.keys.space = false;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.gameRunning) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
      }
    });
  }

  createBlocks() {
    this.blocks = [];
    const colors = ['#ff4400', '#ff8800', '#ffaa00', '#ffff00', '#88ff00', '#00ff88'];

    for (let row = 0; row < this.blockRows; row++) {
      for (let col = 0; col < this.blockCols; col++) {
        const x = col * (this.blockWidth + this.blockPadding) + this.blockPadding;
        const y = row * (this.blockHeight + this.blockPadding) + 50;

        // Determine if block has power-up (10% chance)
        const hasPowerUp = Math.random() < 0.1;
        const powerUpType = hasPowerUp ? ['multiball', 'bigpaddle', 'slowball'][Math.floor(Math.random() * 3)] : null;

        this.blocks.push({
          x: x,
          y: y,
          width: this.blockWidth,
          height: this.blockHeight,
          color: colors[row],
          destroyed: false,
          powerUp: powerUpType,
          points: (this.blockRows - row) * 10
        });
      }
    }
  }

  start() {
    this.gameRunning = true;
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.paddle.x = 350;
    this.paddle.width = 100;
    this.ball.x = 400;
    this.ball.y = 500;
    this.ball.dx = 5;
    this.ball.dy = -5;
    this.ball.speed = 5;
    this.powerUps = [];
    this.createBlocks();

    console.log('🎮 BREAKOUT INITIATED');
    this.gameLoop();
  }

  stop() {
    this.gameRunning = false;
    console.log(`💥 BREAKOUT COMPLETE - FINAL SCORE: ${this.score}`);

    setTimeout(() => {
      const message = `🎮 BREAKOUT COMPLETE 🎮\nSCORE: ${this.score}\nLEVEL: ${this.level}\nLIVES: ${this.lives}`;
      showAlert(message);
    }, 100);
  }

  update() {
    if (!this.gameRunning) return;

    // Update paddle position
    if (this.keys.left && this.paddle.x > 0) {
      this.paddle.x -= this.paddle.speed;
    }
    if (this.keys.right && this.paddle.x < this.canvas.width - this.paddle.width) {
      this.paddle.x += this.paddle.speed;
    }

    // Mouse control
    if (this.mouseX > 0) {
      this.paddle.x = Math.max(0, Math.min(this.canvas.width - this.paddle.width, this.mouseX - this.paddle.width / 2));
    }

    // Update ball position
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;

    // Ball collision with walls
    if (this.ball.x <= this.ball.radius || this.ball.x >= this.canvas.width - this.ball.radius) {
      this.ball.dx = -this.ball.dx;
    }
    if (this.ball.y <= this.ball.radius) {
      this.ball.dy = -this.ball.dy;
    }

    // Ball collision with paddle
    if (this.ball.y + this.ball.radius >= this.paddle.y &&
        this.ball.x >= this.paddle.x &&
        this.ball.x <= this.paddle.x + this.paddle.width &&
        this.ball.dy > 0) {

      // Calculate angle based on where ball hits paddle
      const hitPos = (this.ball.x - this.paddle.x) / this.paddle.width;
      const angle = (hitPos - 0.5) * Math.PI / 3; // -60 to 60 degrees

      this.ball.dx = Math.sin(angle) * this.ball.speed;
      this.ball.dy = -Math.cos(angle) * this.ball.speed;
    }

    // Ball falls off bottom
    if (this.ball.y > this.canvas.height) {
      this.lives--;
      if (this.lives <= 0) {
        this.stop();
        return;
      }

      // Reset ball position
      this.ball.x = 400;
      this.ball.y = 500;
      this.ball.dx = 5;
      this.ball.dy = -5;
    }

    // Ball collision with blocks
    this.blocks.forEach(block => {
      if (!block.destroyed &&
          this.ball.x + this.ball.radius >= block.x &&
          this.ball.x - this.ball.radius <= block.x + block.width &&
          this.ball.y + this.ball.radius >= block.y &&
          this.ball.y - this.ball.radius <= block.y + block.height) {

        block.destroyed = true;
        this.score += block.points;

        // Reverse ball direction
        this.ball.dy = -this.ball.dy;

        // Check for power-up
        if (block.powerUp) {
          this.powerUps.push({
            x: block.x + block.width / 2,
            y: block.y + block.height,
            type: block.powerUp,
            speed: 3
          });
        }
      }
    });

     // Machine gun
    if (this.keys.space && Date.now() - this.lastBulletTime > 200) {
        this.fireBullet();
        this.lastBulletTime = Date.now();
    }

    // Update bullets
    this.machineGunBullets.forEach(bullet => {
        bullet.y -= 10;
    });

    // Remove off-screen bullets
    this.machineGunBullets = this.machineGunBullets.filter(bullet => bullet.y > 0);

    // Bullet collision with blocks
    this.machineGunBullets.forEach(bullet => {
        this.blocks.forEach(block => {
            if (!block.destroyed &&
                bullet.x >= block.x &&
                bullet.x <= block.x + block.width &&
                bullet.y >= block.y &&
                bullet.y <= block.y + block.height) {

                block.destroyed = true;
                this.score += block.points;
                bullet.y = -100; // Move bullet off-screen

                // Check for power-up
                if (block.powerUp) {
                    this.powerUps.push({
                        x: block.x + block.width / 2,
                        y: block.y + block.height,
                        type: block.powerUp,
                        speed: 3
                    });
                }
            }
        });
    });


    // Update power-ups
    this.powerUps = this.powerUps.filter(powerUp => {
      powerUp.y += powerUp.speed;

      // Check collision with paddle
      if (powerUp.y + 10 >= this.paddle.y &&
          powerUp.x >= this.paddle.x &&
          powerUp.x <= this.paddle.x + this.paddle.width) {

        this.activatePowerUp(powerUp.type);
        return false; // Remove power-up
      }

      return powerUp.y < this.canvas.height;
    });

    // Check if all blocks destroyed
    if (this.blocks.every(block => block.destroyed)) {
      this.level++;
      this.ball.speed += 0.5;
      this.createBlocks();

      // Reset ball position
      this.ball.x = 400;
      this.ball.y = 500;
      this.ball.dx = this.ball.speed;
      this.ball.dy = -this.ball.speed;

      console.log(`🎮 LEVEL ${this.level} - SPEED: ${this.ball.speed.toFixed(1)}`);
    }

    // Update UI
    document.getElementById('lives-display').textContent = this.lives;
    document.getElementById('breakout-score-display').textContent = this.score;
    document.getElementById('breakout-level-display').textContent = this.level;
  }

  fireBullet() {
    this.machineGunBullets.push({
        x: this.paddle.x + this.paddle.width / 2,
        y: this.paddle.y
    });
  }

  activatePowerUp(type) {
    switch (type) {
      case 'multiball':
        console.log('🎁 MULTIBALL ACTIVATED');
        break;
      case 'bigpaddle':
        this.paddle.width = Math.min(150, this.paddle.width + 30);
        console.log('🎁 BIG PADDLE ACTIVATED');
        setTimeout(() => {
          this.paddle.width = 100;
        }, 10000);
        break;
      case 'slowball':
        this.ball.speed = Math.max(2, this.ball.speed - 2);
        console.log('🎁 SLOW BALL ACTIVATED');
        break;
    }
  }

  draw() {
    if (!this.gameRunning) return;

    // Clear canvas
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw blocks
    this.blocks.forEach(block => {
      if (!block.destroyed) {
        this.ctx.fillStyle = block.color;
        this.ctx.shadowColor = block.color;
        this.ctx.shadowBlur = 10;
        this.ctx.fillRect(block.x, block.y, block.width, block.height);

        // Draw power-up indicator
        if (block.powerUp) {
          this.ctx.fillStyle = '#ffffff';
          this.ctx.fillRect(block.x + block.width - 10, block.y + 2, 8, 8);
        }

        this.ctx.shadowBlur = 0;
      }
    });

        // Draw bullets
    this.machineGunBullets.forEach(bullet => {
        this.ctx.fillStyle = '#ffff00';
        this.ctx.shadowColor = '#ffff00';
        this.ctx.shadowBlur = 5;
        this.ctx.fillRect(bullet.x - 2, bullet.y - 10, 4, 10);
        this.ctx.shadowBlur = 0;
    });

    // Draw power-ups
    this.powerUps.forEach(powerUp => {
      this.ctx.fillStyle = '#ffff00';
      this.ctx.shadowColor = '#ffff00';
      this.ctx.shadowBlur = 15;
      this.ctx.fillRect(powerUp.x - 5, powerUp.y - 5, 10, 10);
      this.ctx.shadowBlur = 0;
    });

    // Draw paddle
    this.ctx.fillStyle = '#00ff41';
    this.ctx.shadowColor = '#00ff41';
    this.ctx.shadowBlur = 15;
    this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
    this.ctx.shadowBlur = 0;

    // Draw ball
    this.ctx.fillStyle = '#ffffff';
    this.ctx.shadowColor = '#ffffff';
    this.ctx.shadowBlur = 20;
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.shadowBlur = 0;

    // Draw score and lives
    this.ctx.fillStyle = '#00ff41';
    this.ctx.font = '20px Fira Code';
    this.ctx.fillText(`SCORE: ${this.score}`, 20, 30);
    this.ctx.fillText(`LIVES: ${this.lives}`, 20, 580);
    this.ctx.fillText(`LEVEL: ${this.level}`, 680, 30);
  }

  gameLoop() {
    if (!this.gameRunning) return;

    this.update();
    this.draw();

    requestAnimationFrame(() => this.gameLoop());
  }
}

// Initialize Breakout
const breakout = new Breakout();
const startBreakoutBtn = document.getElementById('start-breakout-btn');

startBreakoutBtn.addEventListener('click', () => {
  if (!breakout.gameRunning) {
    breakout.start();
    startBreakoutBtn.textContent = 'GAME RUNNING...';
    startBreakoutBtn.disabled = true;

    setTimeout(() => {
      startBreakoutBtn.textContent = 'START BREAKOUT';
      startBreakoutBtn.disabled = false;
    }, 1000);
  }
});

// === Block Drop Game ===
class BlockDrop {
  constructor() {
    this.canvas = document.getElementById('block-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 600;
    this.canvas.height = 700;

    this.player = {
      x: 275,
      y: 600,
      size: 30,
      speed: 8
    };

    this.blocks = [];
    this.level = 1;
    this.score = 0;
    this.speed = 2;
    this.gameRunning = false;
    this.blockSpacing = 200;
    this.gapSize = 120;
    this.blockWidth = 50;
    this.lastBlockTime = 0;
    this.blockInterval = 1500;

    this.keys = {
      left: false,
      right: false
    };

    this.setupControls();
  }

  setupControls() {
    document.addEventListener('keydown', (e) => {
      if (this.gameRunning && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault(); // Prevent default browser behavior
      }
      if (e.key === 'ArrowLeft') this.keys.left = true;
      if (e.key === 'ArrowRight') this.keys.right = true;
    });

    document.addEventListener('keyup', (e) => {
      if (this.gameRunning && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault(); // Prevent default browser behavior
      }
      if (e.key === 'ArrowLeft') this.keys.left = false;
      if (e.key === 'ArrowRight') this.keys.right = false;
    });
  }

  start() {
    this.gameRunning = true;
    this.score = 0;
    this.level = 1;
    this.speed = 2;
    this.blocks = [];
    this.player.x = 275;
    this.player.y = 600;
    this.lastBlockTime = 0;
    this.blockInterval = 1500;
    this.blockSpacing = 200;
    this.gapSize = 120;

    console.log('🔥 BLOCK DROP INITIATED');
    this.gameLoop();
  }

  stop() {
    this.gameRunning = false;
    console.log(`💥 BLOCK BREACH - LEVEL: ${this.level} - SCORE: ${this.score}`);

    setTimeout(() => {
      const message = `🔥 BLOCK DROP COMPLETE 🔥\nLEVEL: ${this.level}\nSCORE: ${this.score}\nSPEED: ${this.speed.toFixed(1)}`;
      showAlert(message);
    }, 100);
  }

  spawnBlock() {
    const now = Date.now();
    if (now - this.lastBlockTime > this.blockInterval) {
      const gapStart = Math.random() * (this.canvas.width - this.gapSize - 100) + 50;

      // Left block
      if (gapStart > 0) {
        this.blocks.push({
          x: 0,
          y: -this.blockWidth,
          width: gapStart,
          height: this.blockWidth,
          speed: this.speed,
          color: `hsl(${Math.random() * 360}, 80%, 60%)`
        });
      }

      // Right block
      if (gapStart + this.gapSize < this.canvas.width) {
        this.blocks.push({
          x: gapStart + this.gapSize,
          y: -this.blockWidth,
          width: this.canvas.width - (gapStart + this.gapSize),
          height: this.blockWidth,
          speed: this.speed,
          color: `hsl(${Math.random() * 360}, 80%, 60%)`
        });
      }

      this.lastBlockTime = now;
    }
  }

  update() {
    if (!this.gameRunning) return;

    // Update player position
    if (this.keys.left && this.player.x > 0) {
      this.player.x -= this.player.speed;
    }
    if (this.keys.right && this.player.x < this.canvas.width - this.player.size) {
      this.player.x += this.player.speed;
    }

    // Spawn blocks
    this.spawnBlock();

    // Update blocks
    this.blocks = this.blocks.filter(block => {
      block.y += block.speed;
      return block.y < this.canvas.height + 100;
    });

    // Check collisions
    this.blocks.forEach(block => {
      if (this.player.x < block.x + block.width &&
          this.player.x + this.player.size > block.x &&
          this.player.y < block.y + block.height &&
          this.player.y + this.player.size > block.y) {
        this.stop();
      }
    });

    // Increase difficulty
    this.score += 1;
    if (this.score % 1000 === 0) {
      this.level++;
      this.speed += 0.3;
      this.blockInterval = Math.max(800, this.blockInterval - 50);
      this.gapSize = Math.max(80, this.gapSize - 3);

      console.log(`🔥 LEVEL ${this.level} - SPEED: ${this.speed.toFixed(1)}`);
    }

    // Update UI
    document.getElementById('level-display').textContent = this.level;
    document.getElementById('block-score-display').textContent = this.score;
    document.getElementById('block-speed-display').textContent = this.speed.toFixed(1);
  }

  draw() {
    if (!this.gameRunning) return;

    // Clear canvas
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw blocks with bright colors and glow
    this.blocks.forEach(block => {
      this.ctx.fillStyle = block.color;
      this.ctx.shadowColor = block.color;
      this.ctx.shadowBlur = 15;
      this.ctx.fillRect(block.x, block.y, block.width, block.height);

      // Add sparkle effect
      this.ctx.shadowBlur = 0;
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      this.ctx.fillRect(block.x + 5, block.y + 5, block.width - 10, 3);
    });

    // Draw player
    this.ctx.fillStyle = '#00ff41';
    this.ctx.shadowColor = '#00ff41';
    this.ctx.shadowBlur = 20;
    this.ctx.fillRect(this.player.x, this.player.y, this.player.size, this.player.size);

    // Draw player inner core
    this.ctx.fillStyle = '#39ff14';
    this.ctx.shadowBlur = 10;
    this.ctx.fillRect(this.player.x + 5, this.player.y + 5, this.player.size - 10, this.player.size - 10);

    this.ctx.shadowBlur = 0;

    // Draw level indicator
    this.ctx.fillStyle = '#00ff41';
    this.ctx.font = '20px Fira Code';
    this.ctx.fillText(`LEVEL ${this.level}`, 20, 40);

    // Draw speed indicator
    this.ctx.fillStyle = '#ff4400';
    this.ctx.fillText(`SPEED: ${this.speed.toFixed(1)}`, 20, 70);
  }

  gameLoop() {
    if (!this.gameRunning) return;

    this.update();
    this.draw();

    requestAnimationFrame(() => this.gameLoop());
  }
}

// Initialize Block Drop
const blockDrop = new BlockDrop();
const startBlockBtn = document.getElementById('start-block-btn');

startBlockBtn.addEventListener('click', () => {
  if (!blockDrop.gameRunning) {
    blockDrop.start();
    startBlockBtn.textContent = 'GAME RUNNING...';
    startBlockBtn.disabled = true;

    setTimeout(() => {
      startBlockBtn.textContent = 'START BLOCK DROP';
      startBlockBtn.disabled = false;
    }, 1000);
  }
});

// === Intro Cutscene ===
function startCutscene() {
  const cutscene = document.getElementById('intro-cutscene');
  if (cutscene) {
    // Auto-hide after 6 seconds or on Enter key
    const hideCutscene = () => {
      cutscene.style.animation = 'cutsceneAppear 0.8s ease-out reverse';
      setTimeout(() => {
        cutscene.style.display = 'none';
        initializeApp();
      }, 800);
    };

    // Hide on Enter key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && cutscene.style.display !== 'none') {
        hideCutscene();
      }
    });

    // Auto-hide after 7 seconds
    setTimeout(hideCutscene, 7000);
  } else {
    initializeApp();
  }
}

function initializeApp() {
  createBoard();
  createMatrixRain();

  // Add terminal startup effect
  console.log('🔥 CYBERNET TERMINAL INITIALIZED');
  console.log('🛡️  SECURITY PROTOCOLS ACTIVE');
  console.log('⚡ NEURAL NETWORKS ONLINE');
  console.log('🎮 GAME SYSTEMS READY');
  console.log('🎮 BREAKOUT PROTOCOL LOADED');
  console.log('🔥 BLOCK DROP PROTOCOL LOADED');
  console.log('💬 Type "/gaming" or "/games" to activate games');
  console.log('💻 Type "/help" for command database');

  // Show nickname modal after cutscene
  setTimeout(() => {
    const nicknameModal = document.getElementById('nickname-modal');
    if (nicknameModal) {
      nicknameModal.style.display = 'flex';
      nicknameInput.focus();
    }
  }, 500);
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
  startCutscene();

  });

// Add some hacker-style console messages
socket.on('connect', () => {
  console.log('🔗 SECURE CONNECTION ESTABLISHED');
});

socket.on('disconnect', () => {
  console.log('❌ CONNECTION TERMINATED');
});