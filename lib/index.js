import HardSourceWebpackPlugin from "hard-source-webpack-plugin";

const isDev = process.env.NODE_ENV !== "production";

module.exports = function overclockModule() {
  this.options.build = {
    ...this.options.build,
    ...{
      cache: isDev,
      parallel: isDev,
      hardSource: isDev,
      cssSourceMap: false
    }
  };

  this.options.build.plugins.push(
    new HardSourceWebpackPlugin.ExcludeModulePlugin([
      {
        // HardSource works with mini-css-extract-plugin but due to how
        // mini-css emits assets, assets are not emitted on repeated builds with
        // mini-css and hard-source together. Ignoring the mini-css loader
        // modules, but not the other css loader modules, excludes the modules
        // that mini-css needs rebuilt to output assets every time.
        test: /mini-css-extract-plugin[\\/]dist[\\/]loader/
      }
    ])
  );

  this.extendBuild(config => {
    config.module.rules = config.module.rules.map(rule => {
      // sass-loader is only inside "oneOf" attribute
      if (!rule.oneOf) {
        return rule;
      }

      const newRule = rule;
      newRule.oneOf.map(r => {
        if (!r.use.some(l => l.loader === "sass-loader")) {
          return r;
        }
        const newLoaders = r;
        newLoaders.use = newLoaders.use.reduce((loaderAcc, loader) => {
          if (loader.loader !== "sass-loader") {
            return [...loaderAcc, ...[loader]];
          }

          return [
            ...loaderAcc,
            ...[
              {
                loader: "fast-sass-loader",
                options: loader.options
              }
            ]
          ];
        }, []);
        return newLoaders;
      });
      return newRule;
    });
  });
};
