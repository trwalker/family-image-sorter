const settingsConfig = require('./src/settings-config');
const mediaItemSortService = require('./src/media-item-sort-service');

mediaItemSortService.sort(settingsConfig.settings.sortFolder);



