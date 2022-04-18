const et = require('elementtree');
const path = require('path');
const fs = require('fs');
const plist =require('plist');
const { ConfigParser } = require('cordova-common');
const { Console } = require('console');

module.exports = function (context) {
    var projectRoot = context.opts.cordova.project ? context.opts.cordova.project.root : context.opts.projectRoot;
    var configXML = path.join(projectRoot, 'config.xml');
    var configParser = new ConfigParser(configXML);
    var userTrackingDescription = configParser.getGlobalPreference("USER_TRACKING_DESCRIPTION_IOS");

    if(userTrackingDescription != ""){
        var appNamePath = path.join(projectRoot, 'config.xml');
        var appNameParser = new ConfigParser(appNamePath);
        var appName = appNameParser.name();

        //Change info.plist
        var infoPlistPath = path.join(projectRoot, 'platforms/ios/' + appName + '/'+ appName +'-info.plist');
        var infoPlistFile = fs.readFileSync(infoPlistPath).toString();
        var etreeInfoPlist = et.parse(infoPlistFile);
        //var infoPlistTags = etreeInfoPlist.findall('./dict/key[text()="NSUserTrackingUsageDescription"]/following-sibling::string');

        var infoPlistTags = etreeInfoPlist.findall('./dict/string');

        for (var i = 0; i < infoPlistTags.length; i++) {
            console.log("entrou no for");
            if (infoPlistTags[i].text.includes("os_user_tracking_descrption_placeholder")) {
                console.log("entrou no if");
                infoPlistTags[i].text = infoPlistTags[i].text.replace('os_user_tracking_descrption_placeholder', userTrackingDescription);
            }
        }

        var resultXmlInfoPlist = etreeInfoPlist.write();
        fs.writeFileSync(infoPlistPath, resultXmlInfoPlist);
    }
};
