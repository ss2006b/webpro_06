# 京葉線の駅データ管理アプリの状態遷移図

第10回の課題(2)。18ページの構成に沿って、駅一覧を起点とする画面と処理の遷移を示す。

```mermaid
stateDiagram-v2
    direction LR

    state "一覧<br/>GET /keiyo2" as List
    state "詳細表示<br/>GET /keiyo2/:number" as Detail
    state "編集<br/>GET /keiyo2/edit/:number" as Edit
    state "更新処理<br/>POST /keiyo2/update/:number" as Update
    state "新規登録<br/>GET /keiyo2/create" as Create
    state "新規登録処理<br/>POST /keiyo2" as Register
    state "削除確認<br/>GET /keiyo2/delete_confirm/:number" as Confirm
    state "削除処理<br/>GET /keiyo2/delete/:number" as DeleteStation

    [*] --> List

    List --> Detail : 駅名を選ぶ
    Detail --> Edit : 編集
    Edit --> Update : 登録
    Update --> List : 更新完了
    Detail --> List : 駅一覧に戻る
    Edit --> List : 駅一覧に戻る

    List --> Create : 追加
    Create --> Register : 登録
    Register --> List : 登録完了

    Detail --> Confirm : 削除
    Confirm --> Detail : キャンセル
    Confirm --> DeleteStation : 削除を確定
    DeleteStation --> List : 削除完了
```

- 新規登録画面は `/keiyo2/create` から `/public/keiyo2_new.html` に移動して表示する。
- `:number` は `station2` 配列内の位置を表す。先頭の駅は `0`。
- 詳細画面から削除確認を開く。確定時には確認画面で表示した駅のIDをクエリパラメータ `id` で送り、番号とIDが同じ駅を指すことを確認して削除する。
