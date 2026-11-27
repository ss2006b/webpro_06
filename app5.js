const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

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

let station2 = [
  { id:1, code:"JE01", name:"東京駅", change:"総武本線，中央線，etc", passengers:403831, distance:0 },
  { id:2, code:"JE02", name:"八丁堀駅", change:"日比谷線", passengers:31071, distance:1.2 },
  { id:3, code:"JE05", name:"新木場駅", change:"有楽町線，りんかい線", passengers:67206, distance:7.4 },
  { id:4, code:"JE07", name:"舞浜駅", change:"舞浜リゾートライン", passengers:76156,distance:12.7 },
  { id:5, code:"JE12", name:"新習志野駅", change:"", passengers:11655, distance:28.3 },
  { id:6, code:"JE17", name:"千葉みなと駅", change:"千葉都市モノレール", passengers:16602, distance:39.0 },
  { id:7, code:"JE18", name:"蘇我駅", change:"内房線，外房線", passengers:31328, distance:43.0 },
];

// 古い削除確認画面から別の駅を削除しないよう、駅IDは再利用しない
const usedStation2Ids = new Set(station2.map((station) => station.id));

// 一覧
app.get("/keiyo2", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('keiyo2', {data: station2} );
});

// Create
app.get("/keiyo2/create", (req, res) => {
  res.redirect('/public/keiyo2_new.html');
});

// Read
app.get("/keiyo2/:number", (req, res) => {
  const number = req.params.number;
  const detail = /^\d+$/.test(number) ? station2[Number(number)] : undefined;
  if (!detail) {
    return res.status(404).send("指定された駅が見つかりません。");
  }
  res.render('keiyo2_detail', { id: number, data: detail });
});

// 削除確認
app.get("/keiyo2/delete_confirm/:number", (req, res) => {
  const number = Number(req.params.number);
  const detail = /^\d+$/.test(req.params.number) ? station2[number] : undefined;
  if (!detail) {
    return res.status(404).send("指定された駅が見つかりません。");
  }
  res.set("Cache-Control", "no-store");
  res.render('keiyo2_delete', { number, data: detail });
});

// Delete
app.get("/keiyo2/delete/:number", (req, res) => {
  res.set("Cache-Control", "no-store");
  const number = Number(req.params.number);
  const detail = /^\d+$/.test(req.params.number) ? station2[number] : undefined;
  if (!detail) {
    return res.status(404).send("指定された駅が見つかりません。");
  }

  // 削除によって配列内の位置が変わるため、確認画面で表示した駅のIDも照合する
  if (req.query.id !== String(detail.id)) {
    return res.status(409).send("駅一覧を開き直して、削除する駅を確認してください。");
  }

  station2.splice(number, 1);
  res.redirect('/keiyo2');
});

// Create
app.post("/keiyo2", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  let id = station2.length + 1;
  while (usedStation2Ids.has(id)) {
    id++;
  }
  const code = req.body.code;
  const name = req.body.name;
  const change = req.body.change;
  const passengers = req.body.passengers;
  const distance = req.body.distance;
  station2.push( { id: id, code: code, name: name, change: change, passengers: passengers, distance: distance } );
  usedStation2Ids.add(id);
  console.log( station2 );
  res.render('keiyo2', {data: station2} );
});

// Edit
app.get("/keiyo2/edit/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = /^\d+$/.test(number) ? station2[Number(number)] : undefined;
  if (!detail) {
    return res.status(404).send("指定された駅が見つかりません。");
  }
  res.render('keiyo2_edit', {id: number, data: detail} );
});

// Update
app.post("/keiyo2/update/:number", (req, res) => {
  // 本来は各項目が正しいか厳重にチェックする
  // 本来ならここにDBとのやり取りが入る
  const number = Number(req.params.number);
  if (!/^\d+$/.test(req.params.number) || !station2[number]) {
    return res.status(404).send("指定された駅が見つかりません。");
  }
  station2[number].code = req.body.code;
  station2[number].name = req.body.name;
  station2[number].change = req.body.change;
  station2[number].passengers = req.body.passengers;
  station2[number].distance = req.body.distance;
  console.log( station2 );
  res.redirect('/keiyo2' );
});

app.post("/keiyo2_add", express.urlencoded({ extended: false }), (req, res) => {
  const readField = (name) => {
    const value = req.body[name];
    return typeof value === "string" ? value.trim() : "";
  };

  const id = Number(readField("id"));
  const code = readField("code");
  const name = readField("name");
  const change = readField("change");
  const passengers = Number(readField("passengers") || NaN);
  const distance = Number(readField("distance") || NaN);

  if (!Number.isSafeInteger(id) || id < 1 || !code || !name ||
      !Number.isSafeInteger(passengers) || passengers < 0 ||
      !Number.isFinite(distance) || distance < 0) {
    return res.status(400).send("入力内容を確認してください。IDは1以上の整数、乗車人員と距離は0以上で入力してください。");
  }

  if (usedStation2Ids.has(id)) {
    return res.status(409).send("そのIDは使用済みです。別のIDを入力してください。");
  }

  station2.push({ id, code, name, change, passengers, distance });
  usedStation2Ids.add(id);
  res.redirect(303, "/keiyo2");
});

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
