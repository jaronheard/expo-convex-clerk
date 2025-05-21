module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      [
        "babel-preset-expo",
        {
          "react-compiler": {
            compilationMode: "strict",
            panicThreshold: "all_errors",
          },
        },
      ],
    ],
  };
};
