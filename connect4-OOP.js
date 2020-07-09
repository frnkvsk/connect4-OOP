class Player {
  constructor(color) {
      this.color = color;
  }
}
class Game {
    constructor(width, height, color1, color2) {
        this.width = width;
        this.height = height;
        this.player1 = new Player(color1);
        this.player2 = new Player(color2);
        this.currPlayer = this.player1;
        this.board = [];
        this.clickHandler = this.handleClick.bind(this); 
    }
    makeBoard() {
        this.board = [];
        for(let i = 0; i < this.height; i++) {
            this.board.push(Array.from({length: this.width}));
        }
    }
    makeHtmlBoard() {
        const board = document.getElementById('board');
        board.innerHTML = '';
        // make column tops (clickable area for adding a piece to that column)
        const top = document.createElement('tr');
        top.setAttribute('id', 'column-top');
        top.addEventListener('click', this.clickHandler);
        for (let x = 0; x < this.width; x++) {
          const headCell = document.createElement('td');
          headCell.setAttribute('id', x);
          top.append(headCell);
        }
      
        board.append(top);
      
        // make main part of board
        for (let y = 0; y < this.height; y++) {
          const row = document.createElement('tr');
      
          for (let x = 0; x < this.width; x++) {
            const cell = document.createElement('td');
            cell.setAttribute('id', `${y}-${x}`);
            row.append(cell);
          }
      
          board.append(row);
        }
    }
    findSpotForCol(x) {
        for (let y = this.height - 1; y >= 0; y--) {
          if (!this.board[y][x]) {
            return y;
          }
        }
        return null;
    }
    placeInTable(y, x) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.classList.add(`p${y}`)
        
        piece.style.backgroundColor = this.currPlayer.color;
        piece.style.top = -50 * (y + 2);
      
        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
    }
    endGame(msg) {
        const top = document.getElementById('column-top');
        top.removeEventListener('click', this.clickHandler);
        setTimeout(() => alert(msg), 2000);      
    }
    handleClick(evt) {
        // get x from ID of clicked cell
        const x = +evt.target.id;
      
        // get next spot in column (if none, ignore click)
        const y = this.findSpotForCol(x);
        if (y === null) {
          return;
        }
      
        // place piece in board and add to HTML table
        this.board[y][x] = this.currPlayer.color;
        this.placeInTable(y, x);
        
        // check for win
        if (this.checkForWin(y, x)) {
          return this.endGame(`Player ${this.currPlayer.color} won!`);
        }
        
        // check for tie
        if (this.board.every(row => row.every(cell => cell))) {
          return this.endGame('Tie!');
        }
          
        // switch players
        this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
    }
    /** checkForWin: check if last move is a win for current player */
    checkForWin(y, x) {
        for(let [r1,c1, r2,c2] of [[-1,-1,1,1],[-1,0,1,0],[-1,1,1,-1],[0,1,0,-1]]) {  
          let cnt = 1;  
          cnt += this.checkForWinHelper(y + r1, x + c1, r1, c1);
          cnt += this.checkForWinHelper(y + r2, x + c2, r2, c2); 
          if(cnt >= 4) return true;      
        }  
        return false;
    }
    /** checkForWinHelper: counts each match in one direction from [y,x] location */
    checkForWinHelper(r, c, y, x) {
      let cnt = 0;
      while(r >= 0 && c >= 0 && r < 6 && c < 7 && this.board[r][c] == this.currPlayer.color) {
        cnt++;
        r += y;
        c += x;    
      }
      return cnt;
    }
}

const btn = document.querySelector('.btn');
btn.addEventListener('click', e => {
    e.preventDefault();
    const form = document.querySelector('.form');
    if(form[0].value != "" && form[1].value != "") {        
        let color1 = form[0].value;
        let color2 = form[1].value;
        let verifyColor1 = new Option().style;
        verifyColor1.color = color1;
        let verifyColor2 = new Option().style;
        verifyColor2.color = color2;
        if(verifyColor1.cssText != "" && verifyColor2.cssText != "") {
            const game = new Game(7, 6, color1, color2);
            game.makeBoard();
            game.makeHtmlBoard();
        } else {
            alert('Please enter valid colors.')
        }        
    } else {
        alert('Please enter colors for each player.')
    }   
});
