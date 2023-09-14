const Board = require('./board');

class Game {
    currentPlayer = null;
    correntColor = null;

    constructor(code, player1) {
        this.board = new Board();
        this.code = code;
        this.players = [player1];
    }

    start() {
        this.board.setInitialValues();
        this.currentPlayer = this.players[0];
        this.currentColor = 1;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    getCurrentPlayerId() {
        return this.currentPlayer.id;
    }

    getOpponentPlayerId() {
        return this.players.find(player => player.id !== this.getCurrentPlayerId()).id;
    }

    switchCurrentPlayer() {
        this.currentPlayer = this.currentPlayer === this.players[0] ?
            this.players[1] : this.players[0];
        this.currentColor = this.currentColor === 1 ? 2 : 1;
    }

    getCurrentColor() {
        return this.currentColor;
    }
    
    getOpponentColor() {
        return (3 - this.currentColor);
    }   


    placeDisc(newPosition) {
        const result=this.board.onClickSquare(newPosition,this.currentColor);
        return result;
    }

    // not use
    getPossibleSquares() {
        const emptySquares = this.board.getEmptySquares();
        return emptySquares.reduce((result, square) => {
            const coordinate = {
                row: square.row,
                col: square.col,
            };
            const opponent = this.currentPlayer === this.players[0] ? this.players[1] : this.players[0];
            const possibleFlippers = this.board.getFlippers(opponent, coordinate);
            if (possibleFlippers.length > 0) {
                result.push(square);
            }
            return result;
        }, []);
    }

    isEnded() {
        return this.board.values.every((state) => state !== 0);
    }

    getGameResult() {
        const [{id: player1}, {id: player2}] = this.players;
        const blackStonesNum = this.board.values.filter(state => state === 1).length;  // filter...state===1を満たす要素の配列を返す
        const whiteStonesNum = 64 - blackStonesNum;

        if (blackStonesNum === whiteStonesNum) {
            return {
                win: null,
                lose: null,
            }
        }

        return {
            win: blackStonesNum > whiteStonesNum ? player1 : player2,
            lose: blackStonesNum > whiteStonesNum ? player2 : player1,
        };
    }
}

module.exports = Game;