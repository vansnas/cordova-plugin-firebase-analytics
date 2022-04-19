const path = require('path');
const fs = require('fs');
const plist = require('plist');
const { ConfigParser } = require('cordova-common');

module.exports = function (context) {
    var projectRoot = context.opts.cordova.project ? context.opts.cordova.project.root : context.opts.projectRoot;
    var configXML = path.join(projectRoot, 'config.xml');
    var configParser = new ConfigParser(configXML);
    var userTrackingDescription = configParser.getGlobalPreference("USER_TRACKING_DESCRIPTION_IOS");

    if(userTrackingDescription != ""){
        var appNamePath = path.join(projectRoot, 'config.xml');
        var appNameParser = new ConfigParser(appNamePath);
        var appName = appNameParser.name();

        var infoPlistPath = path.join(projectRoot, 'platforms/ios/' + appName + '/'+ appName +'-info.plist');

        var obj = plist.parse(fs.readFileSync(infoPlistPath, 'utf8'));
        obj['NSUserTrackingUsageDescription'] = userTrackingDescription;
        fs.writeFileSync(infoPlistPath, plist.build(obj));
    }
};
