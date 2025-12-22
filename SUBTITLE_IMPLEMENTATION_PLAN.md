# 全字幕表示＋マーカー方式の実装案

## 概要
1つの音声の字幕をすべて表示し、音声の再生位置に基づいてマーカーで現在話している部分を追う方式に変更します。

## メリット
1. **同期の正確性**: 音声の`currentTime`に基づいてマーカーを移動させるため、一時停止/再開でもずれない
2. **視認性**: 全字幕が見えるため、前後の文脈が分かりやすい
3. **実装の簡潔性**: 複雑なタイマー管理が不要

## 実装方針

### 1. UIの変更
- 字幕エリアをスクロール可能なコンテナに変更
- 全字幕を縦に並べて表示
- 現在の字幕をハイライト（背景色、太字、下線など）
- 自動スクロールで現在の字幕が見えるようにする

### 2. データ構造
字幕データから累積開始時間を計算：
```javascript
// 例：字幕データ
[
  {text: "先輩お疲れ様です。", duration: 2000},      // 0ms ～ 2000ms
  {text: "今度海外の販売会社向けに", duration: 3000}, // 2000ms ～ 5000ms
  {text: "研修動画を作るって聞いたんですけど", duration: 2000} // 5000ms ～ 7000ms
]

// 累積時間を計算
[
  {text: "...", duration: 2000, startTime: 0, endTime: 2000},
  {text: "...", duration: 3000, startTime: 2000, endTime: 5000},
  {text: "...", duration: 2000, startTime: 5000, endTime: 7000}
]
```

### 3. 音声同期
- `currentAudio.currentTime`を監視（`requestAnimationFrame`または`setInterval`）
- 現在の再生位置に該当する字幕を判定
- 該当する字幕をハイライト
- 自動スクロールで現在の字幕が見えるようにする

### 4. 一時停止/再開
- 一時停止時も`currentTime`は保持される
- 再開時はその`currentTime`から継続
- マーカーもその位置から継続するため、同期が保たれる

## 実装例

### HTML構造
```html
<div id="subtitle-container" class="subtitle-container">
  <div class="subtitle-item" data-start="0" data-end="2000">
    <span class="subtitle-text">先輩お疲れ様です。</span>
  </div>
  <div class="subtitle-item" data-start="2000" data-end="5000">
    <span class="subtitle-text">今度海外の販売会社向けに</span>
  </div>
  <!-- ... -->
</div>
```

### CSS
```css
.subtitle-container {
  max-height: 200px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.subtitle-item {
  padding: 8px 12px;
  margin: 4px 0;
  border-radius: 4px;
  transition: all 0.3s;
}

.subtitle-item.active {
  background-color: rgba(59, 130, 246, 0.2); /* ハイライト */
  font-weight: bold;
  border-left: 3px solid #3b82f6;
}
```

### JavaScript
```javascript
// 字幕データから累積時間を計算
function prepareSubtitles(subtitleArray) {
  let currentTime = 0;
  return subtitleArray.map(item => {
    const duration = typeof item === 'string' ? 2000 : (item.duration || 2000);
    const startTime = currentTime;
    const endTime = currentTime + duration;
    currentTime = endTime;
    return {
      text: typeof item === 'string' ? item : item.text,
      duration: duration,
      startTime: startTime,
      endTime: endTime
    };
  });
}

// 音声の再生位置を監視してマーカーを更新
function updateSubtitleMarker() {
  if (!currentAudio || !subtitleState) return;
  
  const currentTime = currentAudio.currentTime * 1000; // ミリ秒に変換
  const activeIndex = subtitleState.preparedSubtitles.findIndex(
    sub => currentTime >= sub.startTime && currentTime < sub.endTime
  );
  
  // ハイライトを更新
  updateSubtitleHighlight(activeIndex);
  
  // 自動スクロール
  if (activeIndex >= 0) {
    scrollToSubtitle(activeIndex);
  }
  
  // 再生中は継続して監視
  if (!currentAudio.paused) {
    requestAnimationFrame(updateSubtitleMarker);
  }
}
```

## 実装手順

1. **字幕エリアのHTML/CSS変更**
   - スクロール可能なコンテナに変更
   - 全字幕を表示する構造に変更

2. **字幕データの前処理**
   - `prepareSubtitles()`関数で累積時間を計算
   - 各字幕に`startTime`と`endTime`を追加

3. **音声同期ロジック**
   - `requestAnimationFrame`で`currentTime`を監視
   - 該当する字幕をハイライト
   - 自動スクロール

4. **一時停止/再開の対応**
   - 一時停止時は監視を停止
   - 再開時は監視を再開（`currentTime`は保持されている）

## 注意点

- 音声ファイルの長さと字幕の合計時間が一致しない場合の処理
- スクロールのパフォーマンス（大量の字幕がある場合）
- モバイルデバイスでの表示最適化

