var fs = require('fs');
var path = require('path');

var mediaFolderFormat = '{year}-{month}-Random';

function MediaSortService() {
}

function sort(sourceFolder, outputFolder) {
  validateFolders(sourceFolder, outputFolder);

  var mediaItems = readMediaItems(sourceFolder);
  copyMediaToSortedFolder(mediaItems, outputFolder);
}

function validateFolders(sourceFolder, outputFolder) {
  if (!fs.existsSync(sourceFolder))
    throw 'Source folder does not exist: ' + sourceFolder;

  if (!fs.existsSync(outputFolder))
    throw 'Output folder does not exist: ' + outputFolder;
}

function readMediaItems(folder) {
  return fs.readdirSync(folder);
}

function copyMediaToSortedFolder(mediaItems, sourceFolder, outputFolder) {

  for(var i = 0, length = mediaItems.length; i < length; i++) {
    var mediaItem = mediaItems[i];
    var fullMediaItemPath = path.resolve(sourceFolder, mediaItem);

    var mediaItemStats = fs.statSync(fullMediaItemPath);

    if(mediaItemStats.isFile()) {
      var createDate = mediaItemStats.ctime;

      var year = createDate.getYear().toString();
      var month = createDate.getMonth().toString();
      var extension = path.extname(fullMediaItemPath);

      var images = [];
      var videos = [];

      if(isImage(extension)) {
        images.push(mediaItemStats);
      }
      else if(isVideo(extension)) {
        videos.push(mediaItemStats);
      }
      else {
        throw 'Unknown media type: ' + fullMediaItemPath;
      }
    }
  }
}

function isImage(extension) {
  switch(extension.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
      return true;
    default:
      return false;
  }
}

function isVideo(extension) {
  switch(extension.toLowerCase()) {
    case 'mp4':
    case 'm4v':
    case 'm4p':
    case 'mov':
    case 'wmv':
      return true;
    default:
      return false;
  }
}

function copyImages(imagePaths, outputFolder) {


  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
}

function copyVideos(videoPaths) {

}

MediaSortService.prototype = {
  sort: sort
};

var mediaSortService = new MediaSortService();

module.exports = mediaSortService;
