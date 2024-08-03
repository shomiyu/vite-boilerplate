module.exports = {
  plugins: [
    require("autoprefixer")({
      grid: "autoplace", // IE11対応
    }),
    require("css-declaration-sorter")({
      order: "smacss", // alphabetical/ smacss / concentric-css
    }),
    require("postcss-sort-media-queries")({
      sort: "mobile-first", // mobile-first / desktop-first
    }),
  ],
};
