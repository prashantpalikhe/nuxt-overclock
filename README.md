# Nuxt overclock

⚠️ Use with caution. Uses experimental tech.

Everything to speed up Nuxt's build time.

1. Parallel build using `thread-loader`
2. Cache webpack loader result using `cache-loader`
3. Disable CSS sourcemap
4. `fast-sass-loader` for significantly faster scss files compilation
5. `HardSourceWebpackPlugin` for extra Webpack caching

## Usage

Install with npm

```
npm install --save-dev nuxt-overclock
```

Or, with yarn

```
yarn add -D nuxt-overclock
```

Include the module in your `nuxt.config.js`

```js
module.exports = {
  buildModules: ["nuxt-overclock"]
};
```

## 📑 License

[MIT License](./LICENSE)
