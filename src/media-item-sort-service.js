const fs = require('fs');
const path = require('path');
const MediaItemModel = require('./media-item-model');

const mediaItemFolderFormat = '{year}-{month}';

function MediaItemSortService() {
}

function sort(sortFolder) {
    validateFolder(sortFolder);

    const mediaItems = readMediaItems(sortFolder);
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

    const mediaItemModels = [];

    for (let i = 0, length = mediaItems.length; i < length; i++) {
        const mediaItemFileName = mediaItems[i];

        const mediaItemFullPath = path.resolve(sortFolder, mediaItemFileName);

        const mediaItemStats = fs.statSync(mediaItemFullPath);

        if (mediaItemStats.isFile() && !isSystemFile(mediaItemFileName)) {
            const mediaItemModel = new MediaItemModel();
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
    if (mediaItemModels.length > 0) {
        const sortedFolderPath = createSortedFolder(sortFolder);
        moveImagesAndVideos(mediaItemModels, sortedFolderPath);
    }
}

function createSortedFolder(sortFolder) {
    const sortedItemsFolderPath = path.resolve(sortFolder, '_SortedItems');

    if (!fs.existsSync(sortedItemsFolderPath)) {
        fs.mkdirSync(sortedItemsFolderPath);
    }

    return sortedItemsFolderPath;
}

function moveImagesAndVideos(mediaItemModels, sortedItemsFolderPath) {
    const imageMediaItemModels = [];
    const videoMediaItemModels = [];

    for (let i = 0, length = mediaItemModels.length; i < length; i++) {

        const mediaItemModel = mediaItemModels[i];

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
    switch (extension.toLowerCase()) {
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
    switch (extension.toLowerCase()) {
        case '.mp4':
        case '.m4v':
        case '.m4p':
        case '.mov':
        case '.wmv':
        case '.heic':
            return true;
        default:
            return false;
    }
}

function moveImages(imageMediaItemModels, sortedItemsFolderPath) {
    const imagesFolderPath = path.resolve(sortedItemsFolderPath, 'Pictures');

    if (!fs.existsSync(imagesFolderPath)) {
        fs.mkdirSync(imagesFolderPath);
    }

    for (let i = 0, length = imageMediaItemModels.length; i < length; i++) {
        const imageMediaItemModel = imageMediaItemModels[i];
        moveMediaItem(imageMediaItemModel, imagesFolderPath);
    }
}

function moveVideos(videoMediaItemModels, sortedItemsFolderPath) {
    const videosFolderPath = path.resolve(sortedItemsFolderPath, 'Videos');

    if (!fs.existsSync(videosFolderPath)) {
        fs.mkdirSync(videosFolderPath);
    }

    for (let i = 0, length = videoMediaItemModels.length; i < length; i++) {
        const videoMediaItemModel = videoMediaItemModels[i];
        moveMediaItem(videoMediaItemModel, videosFolderPath);
    }
}

function moveMediaItem(mediaItemModel, parentFolderPath) {
    const fullYear = mediaItemModel.createDate.getFullYear().toString();

    const yearFolderPath = path.resolve(parentFolderPath, fullYear);

    if (!fs.existsSync(yearFolderPath)) {
        fs.mkdirSync(yearFolderPath);
    }

    let monthLeadingZero = (mediaItemModel.createDate.getMonth() + 1).toString();
    if (monthLeadingZero.length === 1) {
        monthLeadingZero = "0" + monthLeadingZero;
    }

    const mediaItemFolder = mediaItemFolderFormat.replace('{year}', fullYear).replace('{month}', monthLeadingZero);
    const mediaItemFolderPath = path.resolve(yearFolderPath, mediaItemFolder);

    if (!fs.existsSync(mediaItemFolderPath)) {
        fs.mkdirSync(mediaItemFolderPath);
    }

    const newMediaItemPath = path.resolve(mediaItemFolderPath, mediaItemModel.fileName);

    fs.renameSync(mediaItemModel.fullPath, newMediaItemPath);
}

MediaItemSortService.prototype = {
    sort: sort
};

const mediaItemSortService = new MediaItemSortService();

module.exports = mediaItemSortService;
