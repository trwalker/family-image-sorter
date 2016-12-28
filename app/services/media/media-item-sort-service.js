const mediaItemFolderFormat = '{year}-{month}';

var fs = require('fs');
var path = require('path');
var MediaItemModel = require('../../models/media/media-item-model');

function MediaItemSortService() {
}

function sort(sortFolder) {
  validateFolder(sortFolder);

  var mediaItems = readMediaItems(sortFolder);
  processAndSortMediaItems(mediaItems, sortFolder);
}

function validateFolder(sortFolder) {
  if (!fs.existsSync(sortFolder))
    throw 'Source folder does not exist: ' + sortFolder;
}

function readMediaItems(folder) {
  return fs.readdirSync(folder);
}

function processAndSortMediaItems(mediaItems, sortFolder) {

  var mediaItemModels = [];

  for(var i = 0, length = mediaItems.length; i < length; i++) {
    var mediaItemFileName = mediaItems[i];

    var mediaItemFullPath = path.resolve(sortFolder, mediaItemFileName);

    var mediaItemStats = fs.statSync(mediaItemFullPath);

    if(mediaItemStats.isFile() && !isSystemFile(mediaItemFileName)) {
      var mediaItemModel = new MediaItemModel();
      mediaItemModel.fileName = mediaItemFileName;
      mediaItemModel.fullPath = mediaItemFullPath;
      mediaItemModel.extension = path.extname(mediaItemFullPath);
      mediaItemModel.createDate = mediaItemStats.mtime;

      mediaItemModels.push(mediaItemModel);
    }
  }

  moveMediaItems(mediaItemModels, sortFolder);
}

function isSystemFile(fileName) {
  return fileName.indexOf('.') === 0 || fileName.toLowerCase() === 'thumbs.db';
}

function moveMediaItems(mediaItemModels, sortFolder) {
  if(mediaItemModels.length > 0) {
    var sortedFolderPath = createSortedFolder(sortFolder);
    moveImagesAndVideos(mediaItemModels, sortedFolderPath);
  }
}

function createSortedFolder(sortFolder) {
  var sortedItemsFolderPath = path.resolve(sortFolder, '_SortedItems');

  if (!fs.existsSync(sortedItemsFolderPath)){
    fs.mkdirSync(sortedItemsFolderPath);
  }

  return sortedItemsFolderPath;
}

function moveImagesAndVideos(mediaItemModels, sortedItemsFolderPath) {
  var imageMediaItemModels = [];
  var videoMediaItemModels = [];

  for(var i = 0, length = mediaItemModels.length; i < length; i++) {

    var mediaItemModel = mediaItemModels[i];

    if (isImage(mediaItemModel.extension)) {
      imageMediaItemModels.push(mediaItemModel);
    }
    else if (isVideo(mediaItemModel.extension)) {
      videoMediaItemModels.push(mediaItemModel);
    }
  }

  moveImages(imageMediaItemModels, sortedItemsFolderPath);
  moveVideos(videoMediaItemModels, sortedItemsFolderPath);
}

function isImage(extension) {
  switch(extension.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
    case '.png':
    case '.gif':
    case '.bmp':
      return true;
    default:
      return false;
  }
}

function isVideo(extension) {
  switch(extension.toLowerCase()) {
    case '.mp4':
    case '.m4v':
    case '.m4p':
    case '.mov':
    case '.wmv':
      return true;
    default:
      return false;
  }
}

function moveImages(imageMediaItemModels, sortedItemsFolderPath) {
  var imagesFolderPath = path.resolve(sortedItemsFolderPath, 'Pictures');

  if (!fs.existsSync(imagesFolderPath)){
    fs.mkdirSync(imagesFolderPath);
  }

  for(var i = 0, length = imageMediaItemModels.length; i < length; i++) {
    var imageMediaItemModel = imageMediaItemModels[i];
    moveMediaItem(imageMediaItemModel, imagesFolderPath);
  }
}

function moveVideos(videoMediaItemModels, sortedItemsFolderPath) {
  var videosFolderPath = path.resolve(sortedItemsFolderPath, 'Videos');

  if (!fs.existsSync(videosFolderPath)){
    fs.mkdirSync(videosFolderPath);
  }

  for(var i = 0, length = videoMediaItemModels.length; i < length; i++) {
    var videoMediaItemModel = videoMediaItemModels[i];
    moveMediaItem(videoMediaItemModel, videosFolderPath);
  }
}

function moveMediaItem(mediaItemModel, parentFolderPath) {
  var fullYear = mediaItemModel.createDate.getFullYear().toString();

  var yearFolderPath = path.resolve(parentFolderPath, fullYear);

  if (!fs.existsSync(yearFolderPath)){
    fs.mkdirSync(yearFolderPath);
  }

  var monthLeadingZero = (mediaItemModel.createDate.getMonth() + 1).toString();
  if(monthLeadingZero.length == 1) {
    monthLeadingZero = "0" + monthLeadingZero;
  }

  var mediaItemFolder = mediaItemFolderFormat.replace('{year}', fullYear).replace('{month}', monthLeadingZero);
  var mediaItemFolderPath = path.resolve(yearFolderPath, mediaItemFolder);

  if (!fs.existsSync(mediaItemFolderPath)){
    fs.mkdirSync(mediaItemFolderPath);
  }

  var newMediaItemPath = path.resolve(mediaItemFolderPath, mediaItemModel.fileName);

  fs.rename(mediaItemModel.fullPath, newMediaItemPath);
}

MediaItemSortService.prototype = {
  sort: sort
};

var mediaItemSortService = new MediaItemSortService();

module.exports = mediaItemSortService;
