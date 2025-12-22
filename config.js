/**
 * コンテンツ設定ファイル
 * 音声、字幕、アバター画像、背景画像を一元管理
 */

// デフォルト設定
const DEFAULT_CONFIG = {
    // リソースのベースパス
    basePath: 'data/',
    
    // デフォルトのアバター画像（全スライド共通）
    defaultAvatars: {
        man: {
            static: 'man.png',
            animated: 'man.gif'
        },
        woman: {
            static: 'wman.png',
            animated: 'wman.gif'
        }
    },
    
    // デフォルトの背景画像（スライド番号で循環使用）
    defaultBackgrounds: [
        'background_01.png',
        'background_02.png',
        'background_03.png'
    ],
    
    // デフォルトの字幕表示時間（ミリ秒）
    defaultSubtitleDuration: 2000
};

// スライド設定データ
const SLIDE_CONFIG = {
    1: {
        // 背景画像（指定がない場合はデフォルトを使用）
        background: 'background_01.png',
        
        // アバター画像（指定がない場合はデフォルトを使用）
        avatars: {
            man: {
                static: 'man.png',      // オプション：デフォルトと同じなら省略可能
                animated: 'man.gif'     // オプション：デフォルトと同じなら省略可能
            },
            woman: {
                static: 'wman.png',
                animated: 'wman.gif'
            }
        },
        
        // 音声ファイル
        audio: {
            man: 'man-01.wav',
            woman: 'woman-01.wav'
        },
        
        // 字幕データ
        subtitles: {
            man: [
                {text: "先輩お疲れ様です。", duration: 2000},
                {text: "今度海外の販売会社向けに", duration: 3000},
                {text: "研修動画を作るって聞いたんですけど", duration: 2000},
                {text: "このバリューブック、中身が濃すぎて", duration: 3000},
                {text: "どこから手を付ければいいのか⋯⋯", duration: 2000}
            ],
            woman: [
                {text: "確かに情報量は多いわよね。", duration: 3000},
                {text: "でも大丈夫。", duration: 1000},
                {text: "まずはここを見て", duration: 2000},
                {text: "メッセージハウスよ。", duration: 1500}
            ]
        }
    },
    
    2: {
        background: 'background_02.png',
        audio: {
            man: 'man-02.wav',
            woman: 'woman-02.wav'
        },
        subtitles: {
            man: [
                {text: "メッセージハウス⋯⋯？", duration: 2000},
                {text: "家⋯⋯ですか？", duration: 2000}
            ],
            woman: [
                {text: "私たちのビジネスインクジェット（BIJ）の価値を整理した", duration: 4000},
                {text: "設計図みたいなものね。", duration: 2000},
                {text: "屋根にあるビジョンを見て。", duration: 2000},
                {text: "持続可能で心豊かな社会を実現する", duration: 4000},
                {text: "これが私たちのゴールよ。", duration: 2000}
            ]
        }
    },
    
    3: {
        background: 'background_03.png',
        audio: {
            man: 'man-03.wav',
            woman: 'woman-03.wav'
        },
        subtitles: {
            man: [
                {text: "なるほど⋯⋯", duration: 1500},
                {text: "そのために僕達は何を提案すればいいんですか？", duration: 3500}
            ],
            woman: [
                {text: "柱は大きく２つ。", duration: 2000},
                {text: "環境負荷低減と、ストレスフリーな運用", duration: 4000},
                {text: "そして、それを土台として支えているのが", duration: 2500},
                {text: "EPSONの技術なの。", duration: 4000}
            ]
        }
    }
    
    // 新しいスライドを追加する場合は、ここに追加
    // 4: {
    //     background: 'background_01.png',
    //     audio: {
    //         man: 'man-04.wav',
    //         woman: 'woman-04.wav'
    //     },
    //     subtitles: {
    //         man: [
    //             {text: "字幕1", duration: 2000},
    //             {text: "字幕2", duration: 3000}
    //         ],
    //         woman: [
    //             {text: "字幕1", duration: 2000}
    //         ]
    // }
};

