# コンテンツ設定ガイド

## 概要

`config.js`ファイルで、音声、字幕、アバター画像、背景画像を一元管理できます。

## 設定ファイルの構造

### デフォルト設定 (`DEFAULT_CONFIG`)

全スライドで共通の設定を定義します。

```javascript
const DEFAULT_CONFIG = {
    basePath: 'data/',              // リソースファイルのベースパス
    defaultAvatars: {               // デフォルトのアバター画像
        man: {
            static: 'man.png',       // 静止画
            animated: 'man.gif'      // アニメーション（GIF）
        },
        woman: {
            static: 'wman.png',
            animated: 'wman.gif'
        }
    },
    defaultBackgrounds: [           // デフォルトの背景画像リスト
        'background_01.png',
        'background_02.png',
        'background_03.png'
    ],
    defaultSubtitleDuration: 2000   // デフォルトの字幕表示時間（ミリ秒）
};
```

### スライド設定 (`SLIDE_CONFIG`)

各スライドごとの設定を定義します。

```javascript
const SLIDE_CONFIG = {
    1: {
        // 背景画像（省略可能：省略時はデフォルトから循環使用）
        background: 'background_01.png',
        
        // アバター画像（省略可能：省略時はデフォルトを使用）
        avatars: {
            man: {
                static: 'man.png',
                animated: 'man.gif'
            },
            woman: {
                static: 'wman.png',
                animated: 'wman.gif'
            }
        },
        
        // 音声ファイル（必須）
        audio: {
            man: 'man-01.wav',
            woman: 'woman-01.wav'
        },
        
        // 字幕データ（必須）
        subtitles: {
            man: [
                {text: "字幕テキスト1", duration: 2000},  // durationはミリ秒
                {text: "字幕テキスト2", duration: 3000}
            ],
            woman: [
                {text: "字幕テキスト1", duration: 2000}
            ]
        }
    }
};
```

## 新しいスライドの追加方法

1. `SLIDE_CONFIG`オブジェクトに新しいスライド番号を追加
2. 必要なリソースファイルを`data/`フォルダに配置
3. 設定を記述

例：
```javascript
4: {
    background: 'background_01.png',
    audio: {
        man: 'man-04.wav',
        woman: 'woman-04.wav'
    },
    subtitles: {
        man: [
            {text: "新しいセリフ1", duration: 2000},
            {text: "新しいセリフ2", duration: 3000}
        ],
        woman: [
            {text: "新しいセリフ1", duration: 2500}
        ]
    }
}
```

## リソースファイルの配置

```
data/
├── man.png              # 男性アバター静止画
├── man.gif              # 男性アバターアニメーション
├── wman.png             # 女性アバター静止画
├── wman.gif             # 女性アバターアニメーション
├── background_01.png    # 背景画像1
├── background_02.png    # 背景画像2
├── background_03.png    # 背景画像3
├── man-01.wav           # 男性音声（スライド1）
├── woman-01.wav          # 女性音声（スライド1）
├── man-02.wav           # 男性音声（スライド2）
├── woman-02.wav          # 女性音声（スライド2）
└── ...
```

## 省略可能な設定

- **背景画像**: 省略時は`defaultBackgrounds`からスライド番号に応じて循環使用
- **アバター画像**: 省略時は`defaultAvatars`を使用
- **字幕のduration**: 省略時は`defaultSubtitleDuration`を使用（文字列形式の場合）

## 字幕データの形式

### オブジェクト形式（推奨）
```javascript
{text: "字幕テキスト", duration: 2000}
```

### 文字列形式（簡易）
```javascript
"字幕テキスト"  // durationはデフォルト値を使用
```

## 注意事項

- 音声ファイル名は`basePath`からの相対パスで指定
- 画像ファイル名も`basePath`からの相対パスで指定
- スライド番号は連番である必要はありませんが、`totalSlides`の値を更新してください

