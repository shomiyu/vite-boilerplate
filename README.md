# Vite Boilerplate

![img_vite](https://github.com/user-attachments/assets/38e38be9-3a45-4558-affc-c15db5b16551)

静的サイト向け Vite 開発環境です。  
セットアップ後すぐにコーディングを開始できます。

## 機能

- SCSS
- jQuery
- ホットリロード
- HTMLの共通パーツ化 （ [Handlebars](https://handlebarsjs.com/) ）
- サイトのグローバル設定
- コードフォーマット （ [Prettier](https://prettier.io/) ）
- CSSチェック ( [Stylelint](https://stylelint.io/) )
- 画像圧縮 [build]
- CSSとJSの圧縮 [build]

## 推奨環境

以下の環境での動作を想定しています。

| 環境 | バージョン |
| :----: | :----: |
| Node.js | v20.11.1 |
| yarn | 1.22.22 |

## セットアップ・スクリプト

### 開発開始

```bash
// インストール （ 初回のみ ）
$ yarn install

// 開発開始
$ yarn dev
```
`http://localhost:3000/` でローカルサーバが立ち上がります。

### ビルド・納品時

```bash
// ビルド
$ yarn build
```

`/dist` ファイルが作成されるため、フォルダ名を変更して納品します。

### その他

```bash
// 文法チェック （ Style ）
$ yarn lint
```

## 開発方法

### サイト設定

サイトの全体設定を以下のページで行います。
- `/src/configs/global.json`
- `/src/configs/meta.json`

### HTML共通パーツ

1. `/src/includes/` 配下に共通パーツとなるHTMLを作成します。
2. Handlebarsを使用して `{{>XXX}}` のように共通パーツを挿入します。

例: `_header.html` を挿入する場合は `{{>_header}}` と入力します。  
注意: 共通パーツのファイル名を `_` から始めることで、ビルド時に共通パーツのHTML生成を避けることができます。

### ページ作成

1. `/src/` 直下に `/{slug}/index.html` を作成します。
2. `/{slug}/` でリンクに設定することでページ遷移します。
3. `/src/configs/meta.json` にページ情報を追加します。

例： `/src/about/index.html` を作成したら `<a href="/about/">about</a>` でページ遷移します。  
注意: 各ページには必ず `{{>head}}` を挿入してください。開発環境の動作に必要なJSファイルの読込みが含まれています。

### JS

標準でjQueryが利用できます。

1. `/src/assets/js/modules/` に機能ごとにファイルを作成します。
2. ファイルをimportして好きなタイミングで発火してください。

**modules/[xxx].js**
```js
export const sampleFunction = () => {
  $(function () {
    console.log('jQuery is ready!');
  });
};
```
※ `main.js` で `import` するために `export` する必要があります。  

**main.js**
```
import { sampleFunction } from '@js/modules/[xxx]';

sampleFunction();
```
※エイリアスの設定で `/src/assets/js` までのパスを `@js` で書き換えることができます。

### SCSS

`/src/assets/scss/` で読込み、FLOCSSをベースにディレクトリを分けています。  
ファイルを新規で作成する場合には以下の手順で利用します。

1. 該当のディレクトリ内にアンダーバーから始まるファイルを作成します。  `例: /src/assets/scss/object/project/_hero.scss`
2. 1行目に `@use "@scss/global" as *;` を挿入します。
3. 同じディレクトリ内の `_index.scss` に作成したファイルを `@use "ファイル名";` と挿入して読み込みます。

**/src/assets/scss/object/project/_hero.scss**
```scss
@use "@scss/global" as *;

.sample {
  // スタイル
}
```
※エイリアスの設定で `/src/assets/scss` までのパスを `@scss` で書き換えることができます。  

**/src/assets/scss/object/project/_index.scss**
```scss
@use "hero";
```
※ ファイル名のアンダーバーは不要です。

### 画像

圧縮などの対象になるため、基本的にはアセットのほうに格納することを推奨します。

アセット内に格納  
1. `/src/assets/images` に画像を格納します。
2. `/assets/images/{FILE_NAME}` で出力します。

パブリックフォルダに格納  
1. `/public/images` に画像を格納します。
2. `/images/{FILE_NAME}` で出力します。
