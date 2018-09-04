const commandLineArgs = process.argv;

function SettingsConfig() {
    this.settings = {};

    initializeSettings(this.settings);
}

function initializeSettings(settings) {
    createArgumentSettings(settings);
}

function createArgumentSettings(settings) {
    settings.sortFolder = commandLineArgs[2] ? commandLineArgs[2] : null;
}

const settingsConfig = new SettingsConfig();

module.exports = settingsConfig;
