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
