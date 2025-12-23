# 全字幕表示＋マーカー方式の実装案

## 概要
1つの音声の字幕をすべて1行で結合して表示し、音声の再生位置に基づいてマーカーで現在話している部分をハイライトする方式です。

## メリット
1. **同期の正確性**: 音声の`currentTime`に基づいてマーカーを移動させるため、一時停止/再開でもずれない
2. **視認性**: 全字幕が1行で見えるため、前後の文脈が分かりやすい
3. **実装の簡潔性**: 複雑なタイマー管理が不要
4. **UIのシンプルさ**: スクロール不要で、固定高さのコンテナで表示

## 実装方針

### 1. UIの変更
- 字幕エリアを固定高さ（64px）のコンテナに設定
- 全字幕を1行で結合して表示
- 現在話している部分を`subtitle-marker`クラスでハイライト（背景色、角丸）
- スクロールは不要（1行表示のため）

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
<div id="subtitle-container" class="w-full max-w-4xl h-16 flex items-center justify-center bg-white/50 dark:bg-black/30 rounded-lg px-4 border border-gray-200 dark:border-gray-700 overflow-hidden">
  <div id="subtitle-text" class="text-lg sm:text-xl text-gray-800 dark:text-gray-100 font-medium text-center w-full">
    <span>先輩お疲れ様です。</span>
    <span class="subtitle-marker">今度海外の販売会社向けに</span>
    <span>研修動画を作るって聞いたんですけど</span>
  </div>
</div>
```

### CSS
```css
/* 字幕コンテナ（1行表示、高さ固定） */
#subtitle-container {
  min-height: 64px;
  max-height: 64px;
}

/* 字幕テキスト内のマーカー */
.subtitle-marker {
  background-color: rgba(59, 130, 246, 0.3);
  padding: 2px 4px;
  border-radius: 3px;
  transition: all 0.2s ease;
}

.dark .subtitle-marker {
  background-color: rgba(59, 130, 246, 0.4);
}
```

### JavaScript
```javascript
// 字幕データから累積時間を計算
function prepareSubtitles(subtitleArray) {
  if (!subtitleArray || subtitleArray.length === 0) {
    return [];
  }

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

// 字幕を1行で表示する関数（マーカー方式）
function renderSubtitleWithMarker(preparedSubtitles) {
  if (!els.subtitleText) return;
  
  if (!preparedSubtitles || preparedSubtitles.length === 0) {
    els.subtitleText.innerHTML = '<span class="opacity-60">字幕データがありません</span>';
    return;
  }

  // 全字幕を結合して1行のテキストとして表示
  const fullText = preparedSubtitles.map(sub => sub.text).join('');
  els.subtitleText.innerHTML = fullText;
}

// 字幕のマーカーを更新（1行表示内で現在話している部分をハイライト）
function updateSubtitleMarker() {
  if (!currentAudio || !subtitleState) {
    subtitleAnimationFrame = null;
    return;
  }
  
  // 一時停止中はマーカー更新を停止（再開時に自動的に同期される）
  if (isPaused || !isPlaying) {
    subtitleAnimationFrame = null;
    return;
  }
  
  const currentTime = currentAudio.currentTime * 1000; // ミリ秒に変換
  const activeIndex = subtitleState.preparedSubtitles.findIndex(
    sub => currentTime >= sub.startTime && currentTime < sub.endTime
  );
  
  // マーカーを更新（activeIndexが-1の場合も処理）
  if (activeIndex !== subtitleState.activeIndex) {
    subtitleState.activeIndex = activeIndex;
    if (activeIndex >= 0) {
      updateSubtitleHighlight(activeIndex);
    } else {
      // どの字幕にも該当しない場合は、全字幕を通常表示
      const preparedSubtitles = subtitleState.preparedSubtitles;
      const fullText = preparedSubtitles.map(sub => sub.text).join('');
      if (els.subtitleText) {
        els.subtitleText.innerHTML = fullText;
      }
    }
  }
  
  // 再生中は継続して監視（一時停止中でない限り）
  if (isPlaying && !isPaused) {
    subtitleAnimationFrame = requestAnimationFrame(updateSubtitleMarker);
  } else {
    subtitleAnimationFrame = null;
  }
}

// 字幕のハイライトを更新（1行表示内でマーカーを表示）
function updateSubtitleHighlight(activeIndex) {
  if (!els.subtitleText || !subtitleState || activeIndex < 0) return;
  
  const preparedSubtitles = subtitleState.preparedSubtitles;
  let html = '';
  
  preparedSubtitles.forEach((sub, index) => {
    const text = sub.text;
    if (index === activeIndex) {
      // 現在話している部分をマーカーで囲む
      html += `<span class="subtitle-marker">${text}</span>`;
    } else {
      // それ以外は通常表示
      html += `<span>${text}</span>`;
    }
  });
  
  els.subtitleText.innerHTML = html;
}
```

## 実装手順

1. **字幕エリアのHTML/CSS変更**
   - 固定高さ（64px）のコンテナに設定
   - 全字幕を1行で結合して表示する構造に変更
   - `.subtitle-marker`クラスでマーカーを表示

2. **字幕データの前処理**
   - `prepareSubtitles()`関数で累積時間を計算
   - 各字幕に`startTime`と`endTime`を追加

3. **字幕表示関数**
   - `renderSubtitleWithMarker()`で全字幕を1行で表示
   - `updateSubtitleHighlight()`で現在の部分にマーカーを適用

4. **音声同期ロジック**
   - `requestAnimationFrame`で`currentTime`を監視
   - 該当する字幕を判定してマーカーを更新
   - 一時停止中は監視を停止、再開時に自動的に同期

5. **一時停止/再開の対応**
   - 一時停止時は監視を停止（`subtitleAnimationFrame`をキャンセル）
   - 再開時は監視を再開（`currentTime`は保持されているため自動的に同期）

## 注意点

- 音声ファイルの長さと字幕の合計時間が一致しない場合の処理
- 1行表示のため、長い字幕の場合はテキストがはみ出す可能性がある（`overflow-hidden`で対応）
- モバイルデバイスでの表示最適化（`text-lg sm:text-xl`でレスポンシブ対応）
- 一時停止/再開時の同期が正しく動作することを確認（`currentTime`ベースのため自動的に同期される）

## 実装済みの機能

✅ 全字幕を1行で結合して表示  
✅ 音声の`currentTime`に基づくマーカー更新  
✅ 一時停止/再開時の自動同期  
✅ `requestAnimationFrame`による効率的な更新  
✅ ダークモード対応のマーカースタイル

