class Board {

    NUMROWS = 8;
    NUMCOLS = 8;

    constructor(){
        // すべての要素が0の配列を作成
        const board = Array.from({ length: this.NUMROWS*this.NUMCOLS }, () => 0 );
        this.values=board;
    }

    setInitialValues() {
        // Black begin with D4, E5
        this.values[27] = 1;
        this.values[36] = 1;
        // White begin with E4, D5
        this.values[28] = 2;
        this.values[35] = 2;
    }

    getReversibleStones (idx,color){
        //クリックしたマスから見て、各方向にマスがいくつあるかをあらかじめ計算する
        const squareNums = [
          7 - (idx % 8),
          Math.min(7 - (idx % 8), (56 + (idx % 8) - idx) / 8),
          (56 + (idx % 8) - idx) / 8,
          Math.min(idx % 8, (56 + (idx % 8) - idx) / 8),
          idx % 8,
          Math.min(idx % 8, (idx - (idx % 8)) / 8),
          (idx - (idx % 8)) / 8,
          Math.min(7 - (idx % 8), (idx - (idx % 8)) / 8),
        ];
        //for文ループの規則を定めるためのパラメータ定義
        const parameters = [1, 9, 8, 7, -1, -9, -8, -7];
      
        //ここから下のロジックはやや入念に読み込みましょう
        //ひっくり返せることが確定した石の情報を入れる配列
        let results = [];
      
        //8方向への走査のためのfor文
        for (let i = 0; i < 8; i++) {
          //ひっくり返せる可能性のある石の情報を入れる配列
          const box = [];
          //現在調べている方向にいくつマスがあるか
          const squareNum = squareNums[i];
          const param = parameters[i];
          //ひとつ隣の石の状態
          const nextStoneState = this.values[idx + param];
      
          //フロー図の[2][3]：隣に石があるか 及び 隣の石が相手の色か -> どちらでもない場合は次のループへ
          if (nextStoneState === 0 || nextStoneState === color) continue;
          //隣の石の番号を仮ボックスに格納
          box.push(idx + param);
      
          //フロー図[4][5]のループを実装
          for (let j = 0; j < squareNum - 1; j++) {
            const targetIdx = idx + param * 2 + param * j;
            const targetColor = this.values[targetIdx];
            //フロー図の[4]：さらに隣に石があるか -> なければ次のループへ
            if (targetColor === 0) continue;
            //フロー図の[5]：さらに隣にある石が相手の色か
            if (targetColor === color) {
              //自分の色なら仮ボックスの石がひっくり返せることが確定
              results = results.concat(box);
              break;
            } else {
              //相手の色なら仮ボックスにその石の番号を格納
              box.push(targetIdx);
            }
          }
        }
        //ひっくり返せると確定した石の番号を戻り値にする
        return results;
    }


    onClickSquare (index,color){

        const reversibleStones = this.getReversibleStones(index,color);
        if(this.values[index]!==0 || reversibleStones.length===0){
            return 1;
        }
        else{
          //自分の石を置く 
          this.values[index] = color;    
          reversibleStones.forEach((key) => {    // forEach...配列の各要素に対して処理を行う (keyは各要素)
            this.values[key] = color;
          });
          return 0;
        }
      }

}

module.exports = Board;