const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;  // プレイヤーの手
  let win = Number(req.query.win)|| 0;  // 勝利回数
  let total = Number(req.query.total)|| 0;  // 総試合数
  console.log({ hand, win, total });

  // CPUの手をランダムに決定
  const num = Math.floor(Math.random() * 3 + 1);
  let cpu = '';
  if (num === 1) cpu = 'グー';
  else if (num === 2) cpu = 'チョキ';
  else cpu = 'パー';

  // 勝敗判定
  let judgement = '';
  if (
    (hand === 'グー' && cpu === 'チョキ') ||
    (hand === 'チョキ' && cpu === 'パー') ||
    (hand === 'パー' && cpu === 'グー')
  ) {
    judgement = '勝ち';
    win += 1;
  } else if (hand === cpu) {
    judgement = '引き分け';
  } else {
    judgement = '負け';
  }
  
  total += 1;  // 総試合数を増やす

  // レスポンスデータを作成
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  };
  
  // レンダリング
  res.render('janken', display);
});

app.get("/janken2", (req, res) => {
  const hand = req.query.hand;
  let win = Number(req.query.win) || 0;
  let total = Number(req.query.total) || 0;

  let cpu = "";
  let judgement = "";

  // ラジオボタンで手が送信された場合だけ対戦する
  if (["グー", "チョキ", "パー"].includes(hand)) {
    const hands = ["グー", "チョキ", "パー"];
    cpu = hands[Math.floor(Math.random() * hands.length)];

    if (
      (hand === "グー" && cpu === "チョキ") ||
      (hand === "チョキ" && cpu === "パー") ||
      (hand === "パー" && cpu === "グー")
    ) {
      judgement = "勝ち";
      win++;
    } else if (hand === cpu) {
      judgement = "引き分け";
    } else {
      judgement = "負け";
    }

    total++;
  }

  res.render("janken2", {
    your: hand || "",
    cpu,
    judgement,
    win,
    total
  });
});

app.get("/choose", (req, res) => {
  let you  = req.query.you;
  let maru = Number(req.query.maru);  // 正解回数
  let tota = Number(req.query.tota);  // 総試合数  
  console.log({ you,maru,tota });


  const num = Math.floor(Math.random() * 2 + 1);
  let correct = '';
  if (num === 1) correct = '右';
  else  correct = '左';
  
  let judgement = '';
  if (you === correct) {
    judgement = '正解';
    maru += 1;
  } else  {
    judgement = '不正解';
  }
  tota += 1;

  const display = {
    yu: you,
    cp: correct,
    da: judgement,
    maru: maru,
    tota: tota
  };
  
  // レンダリング
  res.render('choose', display);
});

let station = [
  { id:1, code:"JE01", name:"東京駅"},
  { id:2, code:"JE07", name:"舞浜駅"},
  { id:3, code:"JE12", name:"新習志野駅"},
  { id:4, code:"JE13", name:"幕張豊砂駅"},
  { id:5, code:"JE14", name:"海浜幕張駅"},
  { id:6, code:"JE05", name:"新浦安駅"},
];

app.get("/keiyo", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('db1', { data: station });
});

app.get("/keiyo_table", (req, res) => {
  res.render('db2', { data: station });
});

app.get("/keiyo_add", (req, res) => {
  const id = Number(req.query.id);
  const code = req.query.code;
  const name = req.query.name;
  const newdata = { id: id, code: code, name: name };
  station.push(newdata);
  res.render('db1', { data: station });
});

let languages = [
  { id: 1, name: "JavaScript", year: 1995, creator: "Brendan Eich" },
  { id: 2, name: "Python", year: 1991, creator: "Guido van Rossum" },
  { id: 3, name: "Ruby", year: 1995, creator: "まつもとゆきひろ" },
  { id: 4, name: "Java", year: 1995, creator: "James Gosling" },
];

app.get("/languages", (req, res) => {
  res.render('languages', { data: languages });
});

app.get("/language_add", (req, res) => {
  const id = Number(req.query.id);
  const name = req.query.name;
  const year = Number(req.query.year);
  const creator = req.query.creator;
  const newdata = { id: id, name: name, year: year, creator: creator };
  languages.push(newdata);
  res.render('languages', { data: languages });
});

app.get("/number", (req, res) => {
  let you  = req.query.you;
  let maru = Number(req.query.maru);  // 正解回数
  let total = Number(req.query.total);  // 総試合数  
  console.log({ you,maru,total });

  
  const num = Math.floor(Math.random() * 5 + 1);
  let correct = '';
  if (num == 1) correct = '1';
  else if (num == 2) correct = '2';
  else if (num == 3) correct = '3';
  else if (num == 4) correct = '4';
  else correct = '5';
  
  let judgement = '';
  if (you === correct) {
    judgement = '正解';
    maru += 1;
  } else  {
    judgement = '不正解';
  }
  total += 1;

  const display = {
    yu: you,
    cp: correct,
    da: judgement,
    maru: maru,
    total: total
  };
  
  // レンダリング
  res.render('number', display);
});

app.get("/")

app.listen(8080, () => console.log("Example app listening on port 8080!"));
