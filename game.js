var lineThicknes = 3;

let ring = document.createElement("img");
ring.src = "ring.png";
let kryss = document.createElement("img");
kryss.src = "kryss.png";

var gameIsOver = false;


function localGame() {
	gameArea.start();
	stack4x4.start();
	stack4x4.renderLines();

	stack4x4.renderBoard();
	stack4x4.highlightAccecpableMoves();

	updateTimer();

	console.log(gameArea.canvas.width);
	console.log(gameArea.canvas.height);

	window.addEventListener('mousedown', function(e) {

		if (gameIsOver) {
			return;
		}

		let rect = gameArea.canvas.getBoundingClientRect();
		let x = e.clientX - rect.left;
		let y = e.clientY - rect.top;
		console.log(x + ", " + y)
		let boardCordx = Math.floor(x / (gameArea.canvas.width/8));
		let boardCordy = Math.floor(y / (gameArea.canvas.height/8));

		console.log()
		console.log(boardCordx + ", " + boardCordy)
		if (boardCordx >= 8 || boardCordx < 0 || boardCordy >= 8 || boardCordy < 0) {
			return;
		}
		
		if (stack4x4.board[boardCordx][boardCordy] != 0) {
			return;
		}

		startTimer();
		bufferTime = bufferTimeLimit;

		stack4x4.placePiece(boardCordx,boardCordy);
		stack4x4.renderBoard();
		let wn = stack4x4.hasWon(1);
		if (wn[0]) {
			for (let i = 0; i < wn[1].length; i+=2) {
				let start = stack4x4.getRect(wn[1][i], wn[1][i+1]);
				let startx = start.x + start.w/2;
				let starty = start.y + start.h/2;

				let end = stack4x4.getRect(wn[2][i], wn[2][i+1]);
				let endx = end.x + end.w/2;
				let endy = end.y + end.h/2;
				gameArea.drawLine(startx, starty, endx, endy, "green");
			}
			gameIsOver = true;
		}
		wn = stack4x4.hasWon(2);
		if (wn[0]) {
			for (let i = 0; i < wn[1].length; i+=2) {
				let start = stack4x4.getRect(wn[1][i], wn[1][i+1]);
				let startx = start.x + start.w/2;
				let starty = start.y + start.h/2;

				let end = stack4x4.getRect(wn[2][i], wn[2][i+1]);
				let endx = end.x + end.w/2;
				let endy = end.y + end.h/2;
				gameArea.drawLine(startx, starty, endx, endy, "green");
			}
			gameIsOver = true;
		}

		stack4x4.highlightAccecpableMoves();
		stack4x4.showWhoseTurn();
	});

}

var gameArea = {
	canvas: document.getElementById("game"),
	start: function() {
		this.context = this.canvas.getContext("2d");
	},
	clear: function() {
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	},
	drawLine: function(x1, y1, x2, y2, color) {
		let ctx = this.context;
		ctx.strokeStyle= color;
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.stroke();
	}
}

var stack4x4 = {
	renderLines: function() {
		ctx = gameArea.context;
		ctx.fillStyle = "black";

		for (let i = 0; i < 8; ++i) {
			ctx.fillRect(0, i*(gameArea.canvas.height/8), gameArea.canvas.width, lineThicknes);
		}
		for (let i = 0; i < 8; ++i) {
			ctx.fillRect(i*(gameArea.canvas.width/8), 0, lineThicknes, gameArea.canvas.height);
		}
		ctx.fillRect(gameArea.canvas.width-lineThicknes,0,lineThicknes,gameArea.canvas.height);
		ctx.fillRect(0,gameArea.canvas.height-lineThicknes,gameArea.canvas.width,lineThicknes);

	},
	start: function() {
		this.board = [];
		this.whoseTurn = 2;
		for (let i = 0; i < 8; ++i) {
			this.board.push([])
			for (let j = 0; j < 8; ++j) {
				this.board[i].push(0);
			}
		}
	},
	renderBoard: function() {
		for (let xCord = 0; xCord < 8; ++xCord) {
			for (let yCord = 0; yCord < 8; ++yCord) {
				let img;
				if (this.board[xCord][yCord] === 1) {
					img = ring;
				} else if (this.board[xCord][yCord] === 2) {
					img = kryss;
				}
				if (img == undefined) {
					continue;
				} 
				let rect = this.getRect(xCord, yCord);
				gameArea.context.drawImage(img, rect.x, rect.y, rect.w, rect.h);
			}
		}
	},
	isAcceptableMove: function(x, y) {
		if (this.board[x][y] !== 0) {
			return false;
		}
		return isArrayEqual(this.dropResult(0,y,1,0),[x,y]) || 
			   isArrayEqual(this.dropResult(7,y,-1,0),[x,y]) || 
			   isArrayEqual(this.dropResult(x,0,0,1),[x,y]) || 
			   isArrayEqual(this.dropResult(x,7,0,-1),[x,y]);
	},
	dropResult: function(x, y, deltax, deltay) {
		for (let i = 0; i < 8; ++i) {
			if (this.board[x+deltax*i][y+deltay*i] === 0) {
				return [x+deltax*i, y+deltay*i];
			}
		}
		return null;
	},
	getRect: function(xCord, yCord) {
		let width = gameArea.canvas.width/8-lineThicknes;
		let height = gameArea.canvas.height/8-lineThicknes;
		if (xCord === 7) {
			width -= lineThicknes;
		}
		if (yCord === 7) {
			height -= lineThicknes;
		}
		return { x: xCord*(gameArea.canvas.width/8)+lineThicknes, 
				 y: yCord*(gameArea.canvas.height/8)+lineThicknes,
				 w: width,
				 h: height };
	},

	highlightAccecpableMoves: function() {
		for (let xCord = 0; xCord < 8; ++xCord) {
			for (let yCord = 0; yCord < 8; ++yCord) {
				if (this.isAcceptableMove(xCord, yCord)) {
					let width = gameArea.canvas.width/8-lineThicknes;
					if (xCord == 7) {
						width -= lineThicknes;
					}
					let height = gameArea.canvas.height/8-lineThicknes;
					if (yCord == 7) {
						height -= lineThicknes;
					}
					let ctx = gameArea.context;
					ctx.fillStyle = "rgb(220,220,220)";
					ctx.fillRect(xCord*(gameArea.canvas.width/8)+lineThicknes,
								 yCord*(gameArea.canvas.height/8)+lineThicknes,
								 width,
								 height);
					}
			}
		}
	},
	placePiece: function(x, y) {
		if (this.isAcceptableMove(x,y)) {
			this.board[x][y] = this.whoseTurn;
			this.whoseTurn = !(this.whoseTurn-1)+1;
		}
	},
	showWhoseTurn: function() {
		let img;
		if (this.whoseTurn == 1) {
			img = ring;
		} else {
			img = kryss;
		}
		let wind = document.body.getElementsByTagName("img")[0];
		wind.setAttribute("src", img.src);
	},
	hasWon: function(player) {
		let directions = [[0,1], [1,1], [1,0], [-1,1]];
		let winningLines = [[],[]]
		for (let x = 0; x < 8; ++x) {
			for (let y = 0; y < 8; ++y) {
				for (let dir = 0; dir < 4; ++dir) {
					let isBroken = false;
					for (var c = 0; c < 4; ++c) {
						if (!(x+c*directions[dir][0]>=0 && x+c*directions[dir][0]<8 && y+c*directions[dir][1]>=0 && y+c*directions[dir][1]<8)) {
							isBroken = true;
							continue;
						}
						if (this.board[x+c*directions[dir][0]][y+c*directions[dir][1]] !== player) {
							isBroken = true;
						}
					}
					if (isBroken === false) {
						winningLines[0].push(x);
						winningLines[0].push(y);
						winningLines[1].push(x+(c-1)*directions[dir][0]);
						winningLines[1].push(y+(c-1)*directions[dir][1]);
					}
				}
			}
		}
		return [winningLines[0].length!=0, winningLines[0], winningLines[1]];
	},
	reset: function() {
		for (let i = 0; i < 8; ++i) {
			for (let j = 0; j < 8; ++j) {
				this.board[i][j] = 0;
			}
		}
		gameArea.context.clearRect(0, 0, gameArea.canvas.width, gameArea.canvas.height);
		this.whoseTurn = 2;
		this.showWhoseTurn();
		this.renderLines();
		this.renderBoard();
		this.highlightAccecpableMoves();
		gameIsOver = false;

	}
}

let isArrayEqual = function (a, b) {
	if (a.length !== b.length) {
		return false;
	}
	for (let i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) {
			return false;
		}
	}
	return true;
}
