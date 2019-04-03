/*eslint camelcase: ["error", {properties: "never"}]*/

import { flatten } from 'lodash';
import CBTConnector from 'cbt_tunnels';
import request from 'request-promise';
import wd from 'wd';

var openedBrowsers = {};
var webDriver;

const AUTH_FAILED_ERROR = 'Authentication failed. Please assign the correct username and access key ' +
    'to the CBT_TUNNELS_USERNAME and CBT_TUNNELS_AUTHKEY environment variables.';

const CBT_API_PATHS = {
    browserList: {
        url: 'https://crossbrowsertesting.com/api/v3/selenium/browsers?format=json'
    },
    tunnelInfo: {
        url: 'https://crossbrowsertesting.com/api/v3/tunnels?active=true'
    },
    deleteTunnel: id => ({
        url:    `https://crossbrowsertesting.com/api/v3/tunnels/${id}`,
        method: 'DELETE'
    }),
    seleniumTestHistory: {
        url: 'https://crossbrowsertesting.com/api/v3/selenium?active=true'
    },
    deleteBrowser: id => ({
        url:    `https://crossbrowsertesting.com/api/v3/selenium/${id}`,
        method: 'DELETE'
    })
};

function doRequest (apiPath) {
    var url = apiPath.url;

    var opts = {
        auth: {
            user: process.env['CBT_TUNNELS_USERNAME'],
            pass: process.env['CBT_TUNNELS_AUTHKEY'],
        },

        method: apiPath.method || 'GET'
    };

    return request(url, opts)
        .catch(error => {
            throw error;
        });
}

async function startBrowser (id, url, capabilities) {
    webDriver = wd.promiseChainRemote('hub.crossbrowsertesting.com', 80, process.env['CBT_TUNNELS_USERNAME'], process.env['CBT_TUNNELS_AUTHKEY']);
    openedBrowsers[id] = webDriver;

    try {
        await webDriver
        .init(capabilities)
        .get(url);
    }
    catch (error) {
        throw error;
    }
}

export default {
    // Multiple browsers support
    isMultiBrowser: true,
    platformsInfo:  [],
    browserNames:   [],

    async _getDeviceList () {
        this.myArr = JSON.parse(await doRequest(CBT_API_PATHS.browserList));

        this.browserNames = this.myArr
            .map(info => {
                if (info['device'] === 'mobile') {
                    this.name = info['browsers'][0]['type'];
                    this.version = info['caps'].platformVersion;
                    this.OS = info['caps'].deviceName;
                    return `${this.name}@${this.version}:${this.OS}`;
                }

                this.arrList = [];
                this.OS = info['name'];

                for (var i = 0; i < info['browsers'].length; i++) {
                    this.name = info['browsers'][i]['type'];
                    this.version = info['browsers'][i]['version'];
                    this.arrList.push(`${this.name}@${this.version}:${this.OS}`);
                }
                return this.arrList;
            });

        this.browserNames = flatten(this.browserNames);
    },


    // Required - must be implemented
    // Browser control
    async openBrowser (id, pageUrl, browserName) {
        if (!process.env['CBT_TUNNELS_USERNAME'] || !process.env['CBT_TUNNELS_AUTHKEY'])
            throw new Error(AUTH_FAILED_ERROR);

        await CBTConnector.start({ 'username': process.env['CBT_TUNNELS_USERNAME'], 'authkey': process.env['CBT_TUNNELS_AUTHKEY'] }, async function (err) {
            if (!err) {

                // Would be better to external this list and import it
                const eslBrowsers = {
                    'chrome-73-mac14': {
                        'browserName':      'Chrome',
                        'version':          '73x64',
                        'platform':         'Mac OSX 10.14',
                        'screenResolution': '2560x1600'
                    },
                    'chrome-60-mac12': {
                        'browserName':      'Chrome',
                        'version':          '60x64',
                        'platform':         'Mac OSX 10.12',
                        'screenResolution': '2560x1600'
                    },
                    'chrome-73-win7': {
                        'browserName':      'Chrome',
                        'version':          '73x64',
                        'platform':         'Windows 7 64-Bit',
                        'screenResolution': '1366x768'
                    },
                    'chromeM-63-tablet': {
                        'browserName':       'Chrome',
                        'deviceName':        'Nexus 9',
                        'platformVersion':   '6.0',
                        'platformName':      'Android',
                        'deviceOrientation': 'portrait'
                    },
                    'chromeM-70-galaxyS8': {
                        'browserName':       'Chrome',
                        'deviceName':        'Galaxy S8',
                        'platformVersion':   '8.0',
                        'platformName':      'Android',
                        'deviceOrientation': 'portrait'
                    },
                    'chromeM-72-nexus6p': {
                        'browserName':       'Chrome',
                        'deviceName':        'Nexus 6P',
                        'platformVersion':   '6.0',
                        'platformName':      'Android',
                        'deviceOrientation': 'portrait'
                    },
                    'chromeM-67-galaxyS7': {
                        'browserName':       'Chrome',
                        'deviceName':        'Galaxy S7',
                        'platformVersion':   '7.0',
                        'platformName':      'Android',
                        'deviceOrientation': 'portrait'
                    },
                    'firefox-58-mac12': {
                        /* BROKEN
                        'browserName':      'Firefox',
                        'version':          '54',
                        'platform':         'Windows 8',
                        'screenResolution': '1400x1050'

                        'browserName':      'Firefox',
                        'version':          '54',
                        'platform':         'Mac OSX 10.11',
                        'screenResolution': '2560x1600'
                        */
                        'browserName':      'Firefox',
                        'version':          '58',
                        'platform':         'Mac OSX 10.12',
                        'screenResolution': '2560x1600'
                    },
                    'safari-11-mac13': {
                        'browserName':      'Safari',
                        'version':          '11',
                        'platform':         'Mac OSX 10.13',
                        'screenResolution': '1366x768'
                    },
                    'safari-12-ipad': {
                        'browserName':       'Safari',
                        'deviceName':        'iPad 6th Generation Simulator',
                        'platformVersion':   '12.0',
                        'platformName':      'iOS',
                        'deviceOrientation': 'portrait'

                    },
                    'safari-11-iph8': {
                        'browserName':       'Safari',
                        'deviceName':        'iPhone 8 Simulator',
                        'platformVersion':   '11.0',
                        'platformName':      'iOS',
                        'deviceOrientation': 'portrait'
                    },
                    'edge-16-win10': {
                        'browserName':      'MicrosoftEdge',
                        'version':          '16',
                        'platform':         'Windows 10',
                        'screenResolution': '2560x1600'
                    },
                    'ie-11-win8.1': {
                        'browserName':      'Internet Explorer',
                        'version':          '11',
                        'platform':         'Windows 8.1',
                        'screenResolution': '1366x768'
                    },
                };

                var capabilities;

                // ESL BROWSERS
                if (eslBrowsers.hasOwnProperty(browserName))
                    // capabilities is in the eslBrowsers list
                    capabilities = eslBrowsers[browserName];
                // Generate capibilities based on the browserName (jsonstrify)
                else if (browserName.indexOf('json:') > -1) {
                    // issue with spaces & " that are note passed.. :-(
                    // maybe would need to base64 the input string & un base here...
                    capabilities = JSON.parse(
                        browserName.substr(browserName.indexOf('json:') + 5)
                    );
                }
                else {
                    // pattern:
                    // desktop: <browserName@version:platform>
                    // mobile:  <browserName@platefromVersion:deviceName
                    var colon = browserName.indexOf(':');

                    if (colon > -1) {
                        var platform = browserName.substr(colon + 1);

                        browserName = browserName.substr(0, colon);
                    }
                    var at = browserName.indexOf('@');

                    if (at > -1) {
                        var version = browserName.substr(at + 1);

                        browserName = browserName.substr(0, at);
                    }

                    if (browserName !== 'Chrome Mobile' && browserName !== 'Mobile Safari') {
                        capabilities = {
                            browserName: browserName,
                            version:     version,
                            platform:    platform
                        };
                    }
                    else {
                        capabilities = {
                            browserName:     browserName,
                            platformVersion: version,
                            deviceName:      platform
                        };
                    }
                }

                // CrossBrowserTesting-Specific Capabilities
                capabilities.name = `TestCafe test run ${id}`;
                if (process.env.CBT_BUILD)
                    capabilities.build = process.env.CBT_BUILD;
                if (process.env.CBT_RECORD_VIDEO)
                    capabilities.record_video = process.env.CBT_RECORD_VIDEO.match(/true/i);
                if (process.env.CBT_RECORD_NETWORK)
                    capabilities.record_video = process.env.CBT_RECORD_NETWORK.match(/true/i);
                if (process.env.CBT_MAX_DURATION)
                    capabilities.max_duration = process.env.CBT_MAX_DURATION;

                if (browserName.indexOf('Chrome') !== -1 && process.env.CBT_CHROME_ARGS && process.env.CBT_CHROME_ARGS.length > 0)
                    capabilities.chromeOptions = { args: [process.env.CBT_CHROME_ARGS] };

                await startBrowser(id, pageUrl, capabilities);
            }

        });
    },

    async closeBrowser (id) {
        await openedBrowsers[id].quit();
    },


    // Optional - implement methods you need, remove other methods
    // Initialization
    async init () {
        if (!process.env['CBT_TUNNELS_USERNAME'] || !process.env['CBT_TUNNELS_AUTHKEY'])
            throw new Error(AUTH_FAILED_ERROR);

        await this._getDeviceList();
    },

    async dispose () {
        this.seleniumHistoryList = JSON.parse(await doRequest(CBT_API_PATHS.seleniumTestHistory));
        if (this.seleniumHistoryList.meta.record_count >= 1) {
            for (let i = 0; i < this.seleniumHistoryList.meta.record_count; i++) {
                this.seleniumTestID = this.seleniumHistoryList.selenium[i].selenium_test_id;
                await doRequest(CBT_API_PATHS.deleteBrowser(this.seleniumTestID));
            }
        }

        this.tunnelList = JSON.parse(await doRequest(CBT_API_PATHS.tunnelInfo));
        if (this.tunnelList.meta.record_count >= 1) {
            for (let i = 0; i < this.tunnelList.meta.record_count; i++) {
                this.tunnelID = this.tunnelList.tunnels[i].tunnel_id;
                await doRequest(CBT_API_PATHS.deleteTunnel(this.tunnelID));
            }
        }
    },

    // Browser names handling
    async getBrowserList () {
        return this.browserNames;
    },

    async isValidBrowserName (/* browserName */) {
        return true;
    },


    // Extra methods
    async resizeWindow (id, width, height /*, currentWidth, currentHeight*/) {
        await openedBrowsers[id].setWindowSize(width, height);
    },

    async maximizeWindow (id) {
        await openedBrowsers[id].maximize();
    },

    async takeScreenshot (/* id, screenshotPath, pageWidth, pageHeight */) {
        this.reportWarning('The screenshot functionality is not supported by the "crossbrowsertesting" browser provider.');
    }
};
