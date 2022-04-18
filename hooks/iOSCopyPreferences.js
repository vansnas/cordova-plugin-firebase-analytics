const et = require('elementtree');
const path = require('path');
const fs = require('fs');
const { ConfigParser } = require('cordova-common');
const { Console } = require('console');

module.exports = function (context) {
    var projectRoot = context.opts.cordova.project ? context.opts.cordova.project.root : context.opts.projectRoot;
    var configXML = path.join(projectRoot, 'config.xml');
    var configParser = new ConfigParser(configXML);
    var userTrackingDescription = configParser.getGlobalPreference("USER_TRACKING_DESCRIPTION_IOS");

    //Change info.plist
    var infoPlistPath = path.join(projectRoot, 'platforms/ios/' + appName + '/'+ appName +'-info.plist');
    var infoPlistFile = fs.readFileSync(infoPlistPath).toString();
    var etreeInfoPlist = et.parse(infoPlistFile);
    var infoPlistTags = etreeInfoPlist.findall('./dict/array/string');

    for (var i = 0; i < infoPlistTags.length; i++) {
        if (infoPlistTags[i].text.includes("user_tracking_description_ios")) {
            infoPlistTags[i].text = infoPlistTags[i].text.replace('user_tracking_description_ios', userTrackingDescription)
        }
    }

    var resultXmlInfoPlist = etreeInfoPlist.write();
    fs.writeFileSync(infoPlistPath, resultXmlInfoPlist);

};
