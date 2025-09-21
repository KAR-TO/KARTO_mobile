module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Required by expo-router for improved route handling/typed routes
      require.resolve("expo-router/babel"),
      // MUST be last – required by react-native-reanimated
      "react-native-reanimated/plugin",
    ],
  };
};
