var commandLineArgs = process.argv;

function SettingsConfig() {
  this.settings = {};

  initializeSettings(this.settings);
}

function initializeSettings(settings) {
  createArgumentSettings(settings);
}

function createArgumentSettings(settings) {
  settings.sortFolder = commandLineArgs[2] ? commandLineArgs[2] : null;
  settings.outputFolder = commandLineArgs[3] ? commandLineArgs[3] : null;
}

var settingsConfig = new SettingsConfig();

module.exports = settingsConfig;
