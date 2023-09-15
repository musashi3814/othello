const socket = io.connect('http://192.168.11.15:3000'); // サーバーのIPアドレスとポート番号を指定
let myID = null;
let isYourTurn = 1; 

// サーバーへの接続が確立されたときの処理
socket.on('connect', () => {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const ptext = document.querySelector(".txt");
    const newgame = document.querySelector(".newgame-btn");
    const joingame = document.querySelector(".join-btn");
    const createroom = document.getElementById('create-room');

    console.log('サーバーに接続しました');
    
    // サーバーに 'ready' イベントを送信
    socket.emit('ready');

    // サーバーからの応答を受け取る
    socket.on('user:ready', (data) => {
        console.log('サーバーからの応答:', data.message);
        myID = data.id;
    });

    newgame.addEventListener("click", () => {
        socket.emit("new_game");
        socket.on('game:pending',(data) => {
            ptext.textContent = data.message;
            createroom.textContent = data.code;
        });
    });

    joingame.addEventListener("click",() => {
        const roomID = document.getElementById("roomID").value;
        socket.emit("join_game",{
            code: roomID
        });

        socket.on('game:error',(data) => {
            ptext.textContent = data.message;
        });
        socket.on('game:not_found',(data) => {
            ptext.textContent = data.message;
        });
    });
    
    socket.on('game:start',(data) => {
        const stage = document.getElementById("stage");
        const squareTemplate = document.getElementById("square-template");
        const yourColor = document.getElementById("yourColor");
        const currentTurnText = document.getElementById("current-turn");
        const passButton = document.getElementById("pass");

        const index = data.order.findIndex((obj) => obj.id === myID);
        if (index===0){
            yourColor.textContent = "黒";
        }
        else{
            yourColor.textContent = "白";
        }

        const createSquares = (data) => {
            for (let i = 0; i < 64; i++) {
            const square = squareTemplate.cloneNode(true); //テンプレートから要素をクローン
            square.removeAttribute("id"); //テンプレート用のid属性を削除（同じidが生成されてしまうため）
            stage.appendChild(square); //マス目のHTML要素を盤に追加
        
            const stone = square.querySelector('.stone');
        
            stone.setAttribute("data-state", data.board[i]);
            stone.setAttribute("data-index", i);   //配列のインデックス番号と、配列要素に対応するHTML要素をひもづけるため

            square.addEventListener('click', () => {
                socket.emit("place_disc",i);
            })
            }
        };

        socket.emit('ready_game');

        socket.on('game:opponent_turn', (data) => {
            isYourTurn = 0;
            currentTurnText.textContent = "相手のターンです";
            for (let i = 0; i < 64; i++) {
                document
                .querySelector(`[data-index='${i}']`)   // data-index=indexの要素を取得
                .setAttribute("data-state",data.board[i]);  // 取得した要素をcorrentColorに
            }
        });
        
        socket.on('game:your_turn', (data) => {
            isYourTurn = 1;
            currentTurnText.textContent = "あなたのターンです";
            for (let i = 0; i < 64; i++) {
                document
                .querySelector(`[data-index='${i}']`)   // data-index=indexの要素を取得
                .setAttribute("data-state",data.board[i]);  // 取得した要素をcorrentColorに
            }

        });
        
        socket.on('game:ended', (data) => {
            for (let i = 0; i < 64; i++) {
                document
                .querySelector(`[data-index='${i}']`)   // data-index=indexの要素を取得
                .setAttribute("data-state",data.board[i]);  // 取得した要素をcorrentColorに
            }
            isYourTurn = 2
            passButton.textContent = "TOPに戻る";
        });
        
        socket.on('game:result', (data) => {
            currentTurnText.textContent=data.result;
            data.hasWon;
        });

        createSquares(data);

        socket.on('game:error',(data) => {
            alert(data.message);
        });
    
        passButton.addEventListener('click', () => {
            if (isYourTurn===1) {
                socket.emit('game:turn_skipped');
            } 
            else if (isYourTurn===2){
                window.open('index.html','_self');
            }
        });

        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
    });
});

// サーバーから切断されたときの処理
socket.on('disconnect', () => {
    console.log('サーバーから切断されました');
});