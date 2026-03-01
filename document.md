# Star Collection 技術ドキュメント

## 1. プロジェクト概要
「Star Collection」は、CreateJSを使用した2Dアクションゲームです。Vue.jsをUIフレームワークとして採用し、ブラウザ上で動作します。プレイヤーはキャラクターを操作し、ステージ内に配置された星を集めることが目的です。

## 2. フォルダ構造
```text
/
├── index.html          # メインのエントリポイント
├── server.py           # 開発用簡易サーバー（Python）
├── css/
│   ├── style.css       # 全体・ゲーム画面のスタイル
│   ├── top.css         # トップ画面のスタイル
│   └── over.css        # リザルト画面のスタイル
├── js/
│   ├── main.js         # Vue.jsアプリケーション、ゲームループ管理
│   ├── mainChara.js    # プレイヤーキャラクター（oneMainChara）のロジック
│   ├── backStage.js    # ステージ生成・描画・当たり判定管理（stageGeometry）
│   ├── eventChara.js   # ステージデータ（stageGeometryArray）の定義
│   └── colorPlugin.js  # CreateJS用カラープラグイン
├── img/                # 画像資産（キャラクター、背景、アイコン等）
└── audio/              # 音声資産（BGM、SE）
```

## 3. ゲームの流れ
1.  **トップ画面 (viewMode: 0)**: ステージ選択、FPS設定、デバッグモードの切り替えが可能。
2.  **ロード & カウントダウン**: ステージデータを読み込み、3秒のカウントダウンが表示される。
3.  **プレイ画面 (viewMode: 1)**: キャラクターを操作し星を収集。
    *   画面上のUIボタンまたはキーボード（A, D, W）で操作。
    *   クリア条件（全星収集等）を満たすとクリア。
4.  **リザルト画面 (viewMode: 2)**: スコアと詳細を表示。

## 4. 技術的仕様
-   **フレームワーク**: Vue.js 3 (Options API)
-   **描画ライブラリ**: CreateJS (EaselJS, TweenJS, SoundJS, PreloadJS)
-   **解像度**: **1280x800 固定**
    -   `canvas` 属性サイズを1280x800に固定し、CSSの `object-fit: contain` でアスペクト比を維持して表示。
-   **FPS**: デフォルト60FPS（設定により変更可能）。`createjs.Ticker` で制御。
-   **物理演算**: `mainChara.js` 内に独自の簡易物理エンジンを実装。
    -   自由落下: $h = V_0t - \frac{1}{2}gt^2$ の公式に基づいた計算。
    -   当たり判定: チャンクシステム（100px単位）による効率的な衝突判定。

## 5. コードの構造と実行フロー

### A. 初期化フロー (`main.js`)
1.  `Vue.createApp` でアプリケーションを起動。
2.  `start(stageNum)` メソッドが呼ばれると：
    -   `createjs.Stage` のインスタンス化。
    -   `createjs.LoadQueue` による資産のプリロード。
    -   ロード完了後、`stageGeometry`（ステージ）と `oneMainChara`（プレイヤー）を生成。

### B. ステージ管理 (`backStage.js`)
-   `stageGeometry` クラスが担当。
-   `stageGeometryArray`（`eventChara.js`）からデータを取得し、地面、草、星、カスタムエレメントを配置。
-   **チャンクシステム**: 当たり判定を高速化するため、オブジェクトをX座標100pxごとの「チャンク」に分割して保持。

### C. プレイヤー制御 (`mainChara.js`)
-   `oneMainChara` クラスが担当。
-   `movechara()` メソッドが 10ms ごとのインターバルで実行され、以下の処理を行う：
    1.  キー入力/UIボタン入力の確認（`pressKey`）。
    2.  水平移動と摩擦の計算。
    3.  垂直移動（ジャンプ・落下）の計算。
    4.  当たり判定（星の取得、地面との接地判定）。
    5.  カメラ追従（`backStage.x/y` の更新）。

### D. UIボタン操作 (`index.html` & `main.js`)
-   画面左下の `←`, `↑`, `→` ボタンは Vue.js のイベントハンドラ（`@mousedown`, `@touchstart` 等）で制御。
-   `isGameActive` フラグにより、カウントダウン中やゲーム終了後の操作を制限。

## 6. 特筆事項
-   **カメラシステム**: プレイヤーが動くのではなく、背景コンテナ（`backStage`）を逆方向に移動させることでスクロールを実現。
-   **デバッグモード**: 座標表示や当たり判定の可視化が可能。
-   **拡張性**: `eventChara.js` の `stageGeometryArray` にデータを追加するだけで新ステージを作成可能。
