"use strict";

var path = require("path");
var AdmZip = require("adm-zip");

var utils = require("./utilities");

var utilsApp = require("../utilities");

var constants = {
  googleServices: "google-services"
};

module.exports = function(context) {
  var cordovaAbove8 = utils.isCordovaAbove(context, 8);
  var cordovaAbove7 = utils.isCordovaAbove(context, 7);
  var defer;
  if (cordovaAbove8) {
    defer = require("q").defer();
  } else {
    defer = context.requireCordovaModule("q").defer();
  }
  
  var platform = context.opts.plugin.platform;
  var platformConfig = utils.getPlatformConfigs(platform);
  if (!platformConfig) {
    utils.handleError("Invalid platform", defer);
  }

  var wwwPath = utils.getResourcesFolderPath(context, platform, platformConfig);
  var sourceFolderPath = utils.getSourceFolderPath(context, wwwPath);
  
  var googleServicesZipFile = utils.getZipFile(sourceFolderPath, constants.googleServices);
  if (!googleServicesZipFile) {
    utils.handleError("No zip file found containing google services configuration file", defer);
  }

  var zip = new AdmZip(googleServicesZipFile);

  var targetPath = path.join(wwwPath, constants.googleServices);
  zip.extractAllTo(targetPath, true);

  var files = utils.getFilesFromPath(targetPath);
  if (!files) {
    utils.handleError("No directory found", defer);
  }

  var fileName = files.find(function (name) {
    return name.endsWith(platformConfig.firebaseFileExtension);
  });
  if (!fileName) {
    utils.handleError("No file found", defer);
  }

  var sourceFilePath = path.join(targetPath, fileName);
  var destFilePath = path.join(context.opts.plugin.dir, fileName);

  var androidPath =  "platforms/android/app";
  var iOSPath = "platforms/ios/" + utilsApp.getAppName(context) + "/Resources";

  var completeFilePath;

  var isAndroid = platform.localeCompare("android");
  var isIOS = platform.localeCompare("ios");

  if(isAndroid == 0){ //android code
    completeFilePath = path.join(context.opts.projectRoot, androidPath);
    console.log("PASSOU ANDROID: " + completeFilePath)
  }
  else if(isIOS == 0){ //iOS code
    completeFilePath = path.join(context.opts.projectRoot, iOSPath);
    console.log("PASSOU iOS: " + completeFilePath)
  }

  if(!utils.checkIfFolderExists(destFilePath)){
    console.log("ENTROU NO IF 1");
    console.log("DEST FILE PATH 1: " + destFilePath);
    utils.copyFromSourceToDestPath(defer, sourceFilePath, destFilePath);
  }

  /*
  if (cordovaAbove7) {
    console.log("ENTROU NO CORDOVA 7");
    var destPath = path.join(context.opts.projectRoot, "platforms", platform, "app");
    if (utils.checkIfFolderExists(destPath)) {
      var destFilePath = path.join(destPath, fileName);
      if(!utils.checkIfFolderExists(destPath)){
        utils.copyFromSourceToDestPath(defer, sourceFilePath, destFilePath);
      }
    }
    if (utils.checkIfFolderExists(completeFilePath)) {
      var destFilePath = path.join(completeFilePath, fileName);
      console.log("DEST FILE PATH 2: " + destFilePath);
      if(!utils.checkIfFolderExists(destFilePath)){
        console.log("FILE NAO EXISTE, VAI COPIAR");
        utils.copyFromSourceToDestPath(defer, sourceFilePath, destFilePath);
        console.log("PASSOU O COPY");
      }
    }
    */
  }
      
  return defer.promise;
}
