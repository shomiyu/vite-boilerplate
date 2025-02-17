import fs from 'fs';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import globule from 'globule';
import viteImagemin from 'vite-plugin-imagemin';
import inject from '@rollup/plugin-inject';
import handlebars from 'vite-plugin-handlebars';

// ディレクトリ
const dir = {
  src: 'src',
  publicDir: '../public',
  outDir: '../dist',
};

// 設定ファイル
const configs = {
  global: {},
  meta: {},
};

// JSONファイルを読み込む関数
const readConfigJSONFile = (filePath) => {
  return new Promise(async (resolve) => {
    const file = fs.readFileSync(filePath);
    resolve(JSON.parse(file));
  });
};

// マルチページ
const inputs = {};
const documents = globule.find([`./${dir.src}/**/*.html`], {
  ignore: [`./${dir.src}/**/_*.html`],
});
documents.forEach((document) => {
  const fileName = document.replace(`./${dir.src}/`, '');
  const key = fileName.replace('index.html', 'main').replace('/main', '');

  inputs[key] = resolve(__dirname, dir.src, fileName);
});

// ----------------------------------------------
// 設定
// - https://vitejs.dev/config/
// ----------------------------------------------
export default defineConfig({
  root: dir.src,

  publicDir: dir.publicDir,

  plugins: [
    inject({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    handlebars({
      partialDirectory: [resolve(__dirname, 'src/includes')],
      context: async (pagePath) => {
        configs.global = await readConfigJSONFile('./src/configs/global.json');
        configs.meta = await readConfigJSONFile('./src/configs/meta.json');

        return {
          ...configs.global,
          page:
            typeof configs.meta[pagePath] !== 'undefined' &&
            configs.meta[pagePath],
          pagePath: pagePath,
        };
      },
    }),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 20,
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@js': resolve(__dirname, 'src/assets/js'),
      '@scss': resolve(__dirname, 'src/assets/scss'),
      '@img': resolve(__dirname, 'src/assets/images'),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
  },

  build: {
    outDir: dir.outDir,
    emptyOutDir: true,
    minify: true,
    rollupOptions: {
      input: { ...inputs },
      output: {
        entryFileNames: `assets/js/[name].js`,
        chunkFileNames: `assets/js/[name].js`,
        assetFileNames: (assetInfo) => {
          if (/\.( gif|jpeg|jpg|png|svg|webp| )$/.test(assetInfo.name)) {
            return 'assets/images/[name].[ext]';
          }
          if (/\.css$/.test(assetInfo.name)) {
            return 'assets/css/[name].[ext]';
          }
          return 'assets/[name].[ext]';
        },
      },
    },
  },
});
