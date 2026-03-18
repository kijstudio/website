module.exports = {
  plugins: {
    "postcss-preset-env": {
      features: {
        "nesting-rules": true,
      },
      browsers: [">0.25%", "not dead"],
    },
  },
};
