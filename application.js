var settingsConfig = require('./app/config/settings-config');
var mediaItemSortService = require('./app/services/media/media-item-sort-service');

mediaItemSortService.sort(settingsConfig.settings.sortFolder);



