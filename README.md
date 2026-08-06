# Project The Beginning v66

- v65で本文へ切り替わらなかった原因を修正
- 子要素のanimationendイベントを誤って拾わないよう、event.targetを判定
- 親のカード展開アニメーション終了時だけ本文ページへ切り替え
- iOS Safariがanimationendを取りこぼした場合に備えてフォールバックタイマーを追加
- 本文は通常の文書フローのため、切り替え後はページ全体を縦スクロール可能
