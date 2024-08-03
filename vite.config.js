import { defineConfig } from "vite";
import { resolve } from "path";
import globule from "globule";
import viteImagemin from "vite-plugin-imagemin";
import inject from "@rollup/plugin-inject";

// ディレクトリ
const dir = {
  src: "src",
  publicDir: "../public",
  outDir: "../dist",
};

// マルチページ
const inputs = {};
const documents = globule.find([`./${dir.src}/**/*.html`], {
  ignore: [`./${dir.src}/**/_*.html`],
});
documents.forEach((document) => {
  const fileName = document.replace(`./${dir.src}/`, "");
  const key = fileName.replace("index.html", "main").replace("/main", "");

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
      $: "jquery",
      jQuery: "jquery",
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
            name: "removeViewBox",
          },
          {
            name: "removeEmptyAttrs",
            active: false,
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },

  server: {
    host: "0.0.0.0",
    port: 3000,
    open: true,
  },

  build: {
    outDir: dir.outDir,
    emptyOutDir: true,
    minify: false,
    rollupOptions: {
      input: { ...inputs },
      output: {
        entryFileNames: `assets/js/[name].js`,
        chunkFileNames: `assets/js/[name].js`,
        assetFileNames: (assetInfo) => {
          if (/\.( gif|jpeg|jpg|png|svg|webp| )$/.test(assetInfo.name)) {
            return "assets/images/[name].[ext]";
          }
          if (/\.css$/.test(assetInfo.name)) {
            return "assets/css/[name].[ext]";
          }
          return "assets/[name].[ext]";
        },
      },
    },
  },
});
