//ゲームの初期設定
// グーチョキパーのカード数。
let playerCards = {
  gu: 4,
  choki: 4,
  pa: 4,
};

//CPUの初期カード数
let cpu1Cards = {
  gu: 4,
  choki: 4,
  pa: 4,
};

//プレイヤーの星の数
let starCount = 3;
//CPUの星の数
let cpuStarCount = 3;
//CPU変更、初期表示読み込み用
cpuChange(cpu1Cards);

//ゲームの主要処理
// じゃんけんの勝敗判定。playerHandの引数にボタンで設定したguなどの値を代入
async function playJanken(playerHand) {
  // プレイヤーのカードを消費
  if (playerCards[playerHand] > 0) {
    playerCards[playerHand] -= 1;
    updateCardCount(playerHand);
  } else {
    resultDiv.innerHTML += " (カードがありません)";
    return;
  }
  //一度カード選択、CPU選択をストップ
  visible(true);

  //２回目以降は勝負とリザルトの要素を消す
  document.querySelector("#result").innerHTML = "　";
  document.querySelector("#voice").innerHTML = "　";
  // 掛け声の表示
  displayStrings(strArr);
  //じゃんけんが始まるまでストップ
  await sleep(3500);

  // プレイヤーの手を表示
  var resultDiv = document.querySelector("#result");
  resultDiv.innerHTML = "" + changeText(playerHand);

  // コンピュータの手をランダムに選択
  var computerHand = getRandomHand();

  // コンピュータのカードを消費
  if (cpu1Cards[computerHand] > 0) {
    cpu1Cards[computerHand] -= 1;
  }
  // コンピュータの手を表示
  resultDiv.innerHTML +=
    "<span>VS</span>" + cpuChangeImg(changeText(computerHand));
  updateCpuCards();

  // 勝敗判定
  var result = determineWinner(playerHand, computerHand);

  // 結果を表示
  resultDiv.innerHTML += "<br>" + result;
  //
  let point = document.querySelector("#point");

  //カード選択、CPU選択を再開
  visible(false);

  //プレイヤーとCPuの星の増減関数実行
  starNum();
  cpuStarNum();
  //CPUの星が０枚になったら実行
  cpuStarZero();
  //星の数が０もしくは手札がなくなり星が2以下になったら実行
  starMinus(0, 2);
  //カードを使い切った際に、星の数が3つ以上あったら実行
  star3();

  //相手のカードが無くなったらプレイヤー交換を促すために手を選択不可
  let cpuAllCards = cpu1Cards.gu + cpu1Cards.choki + cpu1Cards.pa;
  if (cpuAllCards === 0) {
    document.getElementById("gu-btn").disabled = true;
    document.getElementById("choki-btn").disabled = true;
    document.getElementById("pa-btn").disabled = true;
  }
}

//ゲームのパーツ
//相手を変えるボタンで実行するコード
function cpuChange(e) {
  //cpu1Cardsのオブジェクト内の値を乱数で書き換える。これってちゃんと値を書き換えられている？
  for (var key in e) {
    e[key] = Math.floor(Math.random() * 5); //0〜４までの乱数
  }
  updateCpuCards(); //CPUのカード数更新
  //CPUの画像をランダムに変更
  rand = Math.floor(Math.random() * 6);
  cpuImg = "<img src='img/cpu" + rand + ".png' alt='' />";
  document.getElementById("cpu-img").innerHTML = cpuImg;
  //cpuの星の数をランダムに変更
  cpuStarCount = Math.floor(Math.random() * 4 + 1);
  cpuStarNum();
  //CPUのカードが０枚になった場合、ボタン押下不可なので押せるようにする
  document.getElementById("gu-btn").disabled = false;
  document.getElementById("choki-btn").disabled = false;
  document.getElementById("pa-btn").disabled = false;
}

// カードの残り枚数を更新する関数。引数にはplayerHandが入る
function updateCardCount(e) {
  var countSpan = document.getElementById(e + "-count");
  countSpan.innerText = playerCards[e];
  //カードが0枚になったらボタンを押せなくする
  if (playerCards[e] === 0) {
    document.getElementById(e + "-btn").disabled = true;
  }
}

//cpuの星の数を増減させる
function cpuStarNum() {
  var cpuStarsContainer = document.getElementById("cpu-stars-container");
  cpuStarsContainer.innerHTML = "";
  for (var i = 0; i < cpuStarCount; i++) {
    var starElement = document.createElement("div");
    starElement.className = "star";
    // starElement.textContent = "☆";
    cpuStarsContainer.appendChild(starElement);
  }
}

//プレイヤーの星の数を増減させる
function starNum() {
  var starsContainer = document.getElementById("stars-container");
  starsContainer.innerHTML = "";
  for (var i = 0; i < starCount; i++) {
    var starElement = document.createElement("div");
    starElement.className = "star";
    // starElement.textContent = "☆";
    starsContainer.appendChild(starElement);
  }
}

// カードの合計数を計算する関数
function calcTotal() {
  let total = 0;
  for (let key in playerCards) {
    total += playerCards[key];
  }
  return total;
}

//cpuの星がなくなったら相手を変えるボタンのみ選択できるように
function cpuStarZero() {
  if (cpuStarCount === 0) {
    document.getElementById("gu-btn").disabled = true;
    document.getElementById("choki-btn").disabled = true;
    document.getElementById("pa-btn").disabled = true;
  }
}
//【ゲーム敗北】星の数が0or手札が0で星が2以下になったら実行する処理
function starMinus(value, value2) {
  if (starCount <= value || (calcTotal() === 0 && starCount <= value2)) {
    var modalContents = document.querySelector(".modalContents");
    $("#modalArea").fadeIn();
    modalContents.innerHTML =
      "<img src='img/lose.png' alt='' /><br>あなたは負けてしまいました…";
    document.getElementById("gu-btn").disabled = true;
    document.getElementById("choki-btn").disabled = true;
    document.getElementById("pa-btn").disabled = true;
    document.getElementById("cpuChange").disabled = true;
  }
}
//【ゲーム勝利】星が３つ以上でカードが無くなった場合の処理
function star3() {
  if (calcTotal() === 0 && starCount >= 3) {
    var modalContents = document.querySelector(".modalContents");
    $("#modalArea").fadeIn();
    modalContents.innerHTML =
      "<img src='img/win.jpg' alt='' /><br>ゲームに勝利しました！<br>次のゲームに向かいましょう<br><a href='snake.html'>次のゲームへ</a>";
    document.getElementById("gu-btn").disabled = true;
    document.getElementById("choki-btn").disabled = true;
    document.getElementById("pa-btn").disabled = true;
    document.getElementById("cpuChange").disabled = true;
  }
}

// コンピュータの手をランダムに選択。
// function getRandomHand() {
//   var hands = ["gu", "choki", "pa"];
//   var randomIndex = Math.floor(Math.random() * 3);
//   return hands[randomIndex];
// }
function getRandomHand() {
  // 1. cpu1Cardsオブジェクト内の利用可能な手を取得する
  var availableHands = Object.keys(cpu1Cards).filter(function (hand) {
    // 現在のループで検討されている手が、0より大きい場合にリストに含める
    return cpu1Cards[hand] > 0;
  });
  // 2. 利用可能な手の中からランダムなインデックスを生成する
  var randomIndex = Math.floor(Math.random() * availableHands.length);
  // 3. ランダムなインデックスを使ってランダムな手を選ぶ
  var randomHand = availableHands[randomIndex];
  // 4. 選択したランダムな手を返す
  return randomHand;
}

function updateCpuCards() {
  var computerCardsDiv = document.getElementById("computer-cards");
  computerCardsDiv.innerHTML = `✕ ${
    cpu1Cards.gu + cpu1Cards.choki + cpu1Cards.pa
  }枚`;
  // //下記はグーチョキパーが何枚あるかわかるようになっている。デバッグ用
  // "グー: " +
  // cpu1Cards.gu +
  // "枚、チョキ: " +
  // cpu1Cards.choki +
  // "枚、パー: " +
  // cpu1Cards.pa +
  // "枚";
}

// 手の表示を画像に変換する関数
function changeText(hand) {
  switch (hand) {
    case "gu":
      return "<img src='img/gu.png'>";
    case "choki":
      return "<img src='img/ch.png'>";
    case "pa":
      return "<img src='img/pa.png'>";
    default:
      return hand;
  }
}
//CPUのカードの画像を書き換え
function cpuChangeImg(a) {
  if (a === "<img src='img/gu.png'>") {
    a = "<img src='img/gu_cpu.png'>";
    return a;
  } else if (a === "<img src='img/ch.png'>") {
    a = "<img src='img/ch_cpu.png'>";
    return a;
  } else {
    a = "<img src='img/pa_cpu.png'>";
    return a;
  }
}

// 勝敗判定
function determineWinner(playerHand, computerHand) {
  if (playerHand === computerHand) {
    return "引き分け";
  } else if (
    (playerHand === "gu" && computerHand === "choki") ||
    (playerHand === "choki" && computerHand === "pa") ||
    (playerHand === "pa" && computerHand === "gu")
  ) {
    starCount++; //星の増加
    cpuStarCount--;
    return "あなたの勝ち";
  } else {
    starCount--; //星の減少
    cpuStarCount++;
    return "相手の勝ち";
  }
}

// 文字列配列を定義
const strArr = [
  "<span>チェック</span>",
  "<span>セット</span>",
  "<span>オープン……！</span>",
];
// 配列内の文字列を順番に表示する関数
function displayStrings(arr) {
  let i = 0;

  // 1秒ごとに次の文字列を表示
  const intervalId = setInterval(function () {
    // console.log(arr[i]);
    document.getElementById("voice").innerHTML = arr[i];
    // 配列の最後まで行った場合、処理を終了する
    if (i === arr.length - 1) {
      clearInterval(intervalId);
    } else {
      i++;
    }
  }, 1000);
}
//ボタンの押下をコントロール
function visible(a) {
  document.getElementById("gu-btn").disabled = a;
  document.getElementById("choki-btn").disabled = a;
  document.getElementById("pa-btn").disabled = a;
  document.getElementById("cpuChange").disabled = a;
}

//処理を一時停止する関数
const sleep = (waitTime) =>
  new Promise((resolve) => setTimeout(resolve, waitTime));

//モーダル実装。実際にはフェードアウト部分しか使用しない
// $(function () {
//   $("#openModal").click(function () {
//     $("#modalArea").fadeIn();
//   });
//   $("#closeModal , #modalBg").click(function () {
//     $("#modalArea").fadeOut();
//   });
// });
//修正必要箇所

//最終結果でモーダル＋ぐにゃあなどの画像出したい
//手を使い終わった元々選択不可になっている手も表示できるようになってしまっているので、状態を復活させるような
//visble関数にしないといけない。

//修正箇所
//相手のカード数の表示をさせたい
//自分の各手を使い終わったら、使わないようにしたい
//cpuがカードが無くなるごとに別人になるようにしたい。自分の手はボタン押せないようにしたので相手を変えるボタンへの誘導必要
//cpuの星が０になると別の人にする実装
//ウェイトをかけているとことで一度ボタンを選択できないようにして、ウェイト終了後に選択可能にしている。

//参考資料
//限定ジャンケンルール　https://www.info.kindai.ac.jp/~takasi-i/thesis/2016_12-1-037-0083_T_Satoh_thesis.pdf
//flexbox https://www.webcreatorbox.com/tech/css-flexbox-cheat-sheet
//動作停止 https://note.affi-sapo-sv.com/js-sleep.php
//モーダルウィンドウ
//パブリックドメイン画像　https://publicdomainq.net/woman-girl-cook-0016150/
