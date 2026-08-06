# Project The Beginning v67

- 背景だけ動き、招待状が固定される原因を修正
- 遷移用の固定コピーを本文表示前に非表示・アニメーション停止・削除
- animationendイベントへの依存を廃止し、決まった時刻で確実に切り替え
- 本文ページ自体をiPhone Safari向けの独立スクロール領域に変更
- overflow-y: scroll、touch-action: pan-y、-webkit-overflow-scrolling: touchを設定
- 本文ページのz-indexを上げ、遷移コピーが前面に残らない構造に変更
