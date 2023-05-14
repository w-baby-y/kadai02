// canvas要素を作成する。createElementは新たに要素を生成するメソッド
const canvas = document.createElement("canvas");
// canvas要素から2Dコンテキストを取得する。canvasを使うときに2D図形を扱うよと宣言
const ctx = canvas.getContext("2d");
// キャンバス要素の幅と高さを設定する
canvas.width = 400;
canvas.height = 400;
// CSSスタイルを追加して、背景色を設定する
canvas.setAttribute(
  "style",
  "display:block;margin:0 auto;background-color:#aaa"
);

// body要素にキャンバスを追加する
let snakecanvas = document.querySelector(".snakecanvas");
snakecanvas.appendChild(canvas);

const GRID = 20; // ゲームボードのグリッドサイズを定義する変数
const STAGE = canvas.width / GRID; // ステージの大きさを決める変数。キャンバスの幅をグリッドサイズで割って計算される
let itemCount = 0; //アイテムの取得回数を保存
let ScoreCount = 0; //ハイスコアを管理
let intervalTime = 100; //ゲームスピード

//snakeオブジェクトを作成。オブジェクトはプロパティの集合体。プロパティは変数と値がセットになったもの
const snake = {
  x: null, // スネークのx座標
  y: null, // スネークのy座標
  dx: 1, // スネークが進む方向を示すx軸の値
  dy: 0, // スネークが進む方向を示すy軸の値
  tail: null, // スネークのしっぽの長さ
  update: function () {
    // スネークの位置を更新するメソッド
    this.body.push({ x: this.x, y: this.y }); // 新しいスネークの頭の位置のオブジェクトをbody配列に追加する
    this.x += this.dx; // x座標を更新する
    this.y += this.dy; // y座標を更新する
    ctx.fillStyle = "green"; // スネークの色を緑に指定する
    this.body.forEach((obj) => {
      ctx.fillRect(obj.x * GRID, obj.y * GRID, GRID - 2, GRID - 2); //fillRectメソッドはこのメソッドの引数は描く四角の左上頂点の座標とその四角形の幅と高さを指定します。
      if (this.x === obj.x && this.y === obj.y) init(); // スネークが自身に当たった場合にinit()関数を呼び出して初期化する
    });
    if (this.body.length > this.tail) this.body.shift(); // スネークの長さがtailよりも大きい場合、古いスネークの頭を削除する
  },
};

//アイテムオブジェクトの作成
const item = {
  x: null, // アイテムのx座標をnullで初期化する
  y: null, // アイテムのy座標をnullで初期化する
  update: function () {
    // アイテムの位置を更新するメソッド
    ctx.fillStyle = "red"; // アイテムの色を赤に指定する
    ctx.fillRect(this.x * GRID, this.y * GRID, GRID - 2, GRID - 2); // fillRectメソッドはこのメソッドの引数は描く四角の左上頂点の座標とその四角形の幅と高さを指定します。
  },
};

const init = () => {
  // ゲームの初期状態を設定するメソッド
  snake.x = STAGE / 2; // 蛇のx座標をステージの中央に設定する
  snake.y = STAGE / 2; // 蛇のy座標をステージの中央に設定する
  snake.tail = 4; // 蛇の尾の長さを4に設定する
  snake.body = []; // 蛇の体の配列を空にする

  //ハイスコアを記録する条件分岐
  if (itemCount <= ScoreCount) {
    //ハイスコアが現在の点数以下の場合。初期設定もこちら
    highScore = document.querySelector(".highScore"); //class名が「highScore」の要素を取得し、highScore変数に代入
    highScore.innerHTML = "ハイスコア： " + ScoreCount * 10 + "点"; // highScore要素内のHTMLを更新し、ハイスコアを初期化表示
  } else {
    ScoreCount = itemCount; //現在の点数をハイスコアに代入
    highScore.innerHTML = "ハイスコア： " + ScoreCount * 10 + "点"; // highScore要素内のHTMLを更新し、点数を登録
  }

  itemCount = 0; // 点数を初期化
  point = document.querySelector(".point"); //class名が「point」の要素を取得し、point変数に代入
  point.innerHTML = "スコア： " + itemCount * 10 + "点"; // point要素内のHTMLを更新し、点数を初期化表示

  item.x = Math.floor(Math.random() * STAGE); // アイテムの初期位置のx座標をランダムに決定する
  item.y = Math.floor(Math.random() * STAGE); // アイテムの初期位置のy座標をランダムに決定する
};

const loop = () => {
  // ゲームのメインループ処理部分
  ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバスをクリアする。これをしないと前の描画が残り続ける
  snake.update(); // 蛇の位置を更新する
  item.update(); // アイテムの位置を更新する

  if (snake.x < 0) snake.x = STAGE - 1; // ステージ外に出た場合は、反対側からステージに戻る
  if (snake.y < 0) snake.y = STAGE - 1; // ステージ外に出た場合は、反対側からステージに戻る
  if (snake.x > STAGE - 1) snake.x = 0; // ステージ外に出た場合は、反対側からステージに戻る
  if (snake.y > STAGE - 1) snake.y = 0; // ステージ外に出た場合は、反対側からステージに戻る

  if (snake.x == item.x && snake.y == item.y) {
    // アイテムと蛇が同じ位置にある場合
    snake.tail++; // 蛇の尾を伸ばす
    item.x = Math.floor(Math.random() * STAGE); // アイテムのx位置をランダムに変更する
    item.y = Math.floor(Math.random() * STAGE); // アイテムのy位置をランダムに変更する
    itemCount++; //アイテムを取得した回数を加算
    point.innerHTML = "スコア： " + itemCount * 10 + "点"; //point要素内のHTMLを更新し、点数を表示
    clearInterval(intervalrun);
    if (itemCount >= 10) {
      intervalTime = 50;
    } else if (itemCount >= 5) {
      intervalTime = 80;
    }
    intervalrun = setInterval(loop, intervalTime);
  }
};

init(); // ゲームの初期化処理を実行する関数
let intervalrun = setInterval(loop, intervalTime); // 一定時間ごとにloop関数を繰り返し実行する。変数にすることで餌をとった際にスピードが変えられる
//setInterval(loop, intervalTime); // 一定時間ごとにloop関数を繰り返し実行する。

document.addEventListener("keydown", (e) => {
  // 現在の移動方向と逆方向でない場合のみ次の移動方向を設定する。改良点
  if (e.key === "ArrowUp" && snake.dy !== 1) {
    snake.dx = 0;
    snake.dy = -1;
  } else if (e.key === "ArrowDown" && snake.dy !== -1) {
    snake.dx = 0;
    snake.dy = 1;
  } else if (e.key === "ArrowLeft" && snake.dx !== 1) {
    snake.dx = -1;
    snake.dy = 0;
  } else if (e.key === "ArrowRight" && snake.dx !== -1) {
    snake.dx = 1;
    snake.dy = 0;
  }
});
// https://www.youtube.com/watch?v=wuO1NaqOlQ4&t=554s 参考HP
// https://qiita.com/kiwatchi1991/items/75f337628b3cbd9a4e32 ES6記法
