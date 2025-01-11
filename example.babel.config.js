module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      ["module:react-native-dotenv", {
        "envName": "your_env_name",
        "moduleName": "your_env_module",
        "path": "path/to/your/enviourment_var",
        "safe": false,
        "allowUndefined": true,
        "verbose": false
      }]
    ]
  };