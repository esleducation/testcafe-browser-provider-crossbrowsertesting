'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var startBrowser = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(id, url, capabilities) {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        webDriver = _wd2.default.promiseChainRemote('hub.crossbrowsertesting.com', 80, process.env['CBT_TUNNELS_USERNAME'], process.env['CBT_TUNNELS_AUTHKEY']);
                        openedBrowsers[id] = webDriver;

                        _context.prev = 2;
                        _context.next = 5;
                        return webDriver.init(capabilities).get(url);

                    case 5:
                        _context.next = 10;
                        break;

                    case 7:
                        _context.prev = 7;
                        _context.t0 = _context['catch'](2);
                        throw _context.t0;

                    case 10:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[2, 7]]);
    }));

    return function startBrowser(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
}();

var _lodash = require('lodash');

var _cbt_tunnels = require('cbt_tunnels');

var _cbt_tunnels2 = _interopRequireDefault(_cbt_tunnels);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _wd = require('wd');

var _wd2 = _interopRequireDefault(_wd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint camelcase: ["error", {properties: "never"}]*/

var openedBrowsers = {};
var webDriver;

var AUTH_FAILED_ERROR = 'Authentication failed. Please assign the correct username and access key ' + 'to the CBT_TUNNELS_USERNAME and CBT_TUNNELS_AUTHKEY environment variables.';

var CBT_API_PATHS = {
    browserList: {
        url: 'https://crossbrowsertesting.com/api/v3/selenium/browsers?format=json'
    },
    tunnelInfo: {
        url: 'https://crossbrowsertesting.com/api/v3/tunnels?active=true'
    },
    deleteTunnel: function deleteTunnel(id) {
        return {
            url: 'https://crossbrowsertesting.com/api/v3/tunnels/' + id,
            method: 'DELETE'
        };
    },
    seleniumTestHistory: {
        url: 'https://crossbrowsertesting.com/api/v3/selenium?active=true'
    },
    deleteBrowser: function deleteBrowser(id) {
        return {
            url: 'https://crossbrowsertesting.com/api/v3/selenium/' + id,
            method: 'DELETE'
        };
    }
};

function doRequest(apiPath) {
    var url = apiPath.url;

    var opts = {
        auth: {
            user: process.env['CBT_TUNNELS_USERNAME'],
            pass: process.env['CBT_TUNNELS_AUTHKEY']
        },

        method: apiPath.method || 'GET'
    };

    return (0, _requestPromise2.default)(url, opts).catch(function (error) {
        throw error;
    });
}

exports.default = {
    // Multiple browsers support
    isMultiBrowser: true,
    platformsInfo: [],
    browserNames: [],

    _getDeviceList: function _getDeviceList() {
        var _this = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
            return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.t0 = JSON;
                            _context2.next = 3;
                            return doRequest(CBT_API_PATHS.browserList);

                        case 3:
                            _context2.t1 = _context2.sent;
                            _this.myArr = _context2.t0.parse.call(_context2.t0, _context2.t1);


                            _this.browserNames = _this.myArr.map(function (info) {
                                if (info['device'] === 'mobile') {
                                    _this.name = info['browsers'][0]['type'];
                                    _this.version = info['caps'].platformVersion;
                                    _this.OS = info['caps'].deviceName;
                                    return _this.name + '@' + _this.version + ':' + _this.OS;
                                }

                                _this.arrList = [];
                                _this.OS = info['name'];

                                for (var i = 0; i < info['browsers'].length; i++) {
                                    _this.name = info['browsers'][i]['type'];
                                    _this.version = info['browsers'][i]['version'];
                                    _this.arrList.push(_this.name + '@' + _this.version + ':' + _this.OS);
                                }
                                return _this.arrList;
                            });

                            _this.browserNames = (0, _lodash.flatten)(_this.browserNames);

                        case 7:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this);
        }))();
    },


    // Required - must be implemented
    // Browser control
    openBrowser: function openBrowser(id, pageUrl, browserName) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
            return _regenerator2.default.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            if (!(!process.env['CBT_TUNNELS_USERNAME'] || !process.env['CBT_TUNNELS_AUTHKEY'])) {
                                _context4.next = 2;
                                break;
                            }

                            throw new Error(AUTH_FAILED_ERROR);

                        case 2:
                            _context4.next = 4;
                            return _cbt_tunnels2.default.start({ 'username': process.env['CBT_TUNNELS_USERNAME'], 'authkey': process.env['CBT_TUNNELS_AUTHKEY'] }, function () {
                                var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(err) {
                                    var eslBrowsers, capabilities, colon, platform, at, version;
                                    return _regenerator2.default.wrap(function _callee3$(_context3) {
                                        while (1) {
                                            switch (_context3.prev = _context3.next) {
                                                case 0:
                                                    if (err) {
                                                        _context3.next = 11;
                                                        break;
                                                    }

                                                    // Would be better to external this list and import it
                                                    eslBrowsers = {
                                                        'chrome-73-mac12': {
                                                            'browserName': 'Chrome',
                                                            'version': '73x64',
                                                            'platform': 'Mac OSX 10.12',
                                                            'screenResolution': '2560x1600'
                                                        },
                                                        'chrome-60-win10': {
                                                            'browserName': 'Chrome',
                                                            'version': '60x64',
                                                            'platform': 'Windows 10',
                                                            'screenResolution': '1366x768'
                                                        },
                                                        'chromeM-63-tablet': {
                                                            'browserName': 'Chrome',
                                                            'deviceName': 'Nexus 9',
                                                            'platformVersion': '6.0',
                                                            'platformName': 'Android',
                                                            'deviceOrientation': 'portrait'
                                                        },
                                                        'chromeM-70-galaxyS8': {
                                                            'browserName': 'Chrome',
                                                            'deviceName': 'Galaxy S8',
                                                            'platformVersion': '8.0',
                                                            'platformName': 'Android',
                                                            'deviceOrientation': 'portrait'
                                                        },
                                                        'chromeM-72-nexus6p': {
                                                            'browserName': 'Chrome',
                                                            'deviceName': 'Nexus 6P',
                                                            'platformVersion': '6.0',
                                                            'platformName': 'Android',
                                                            'deviceOrientation': 'portrait'
                                                        },
                                                        'firefox-54-win8': {
                                                            'browserName': 'Firefox',
                                                            'version': '54',
                                                            'platform': 'Windows 8',
                                                            'screenResolution': '1400x1050'
                                                        },
                                                        'safari-11-mac13': {
                                                            'browserName': 'Safari',
                                                            'version': '11',
                                                            'platform': 'Mac OSX 10.13',
                                                            'screenResolution': '1366x768'
                                                        },
                                                        'safari-12-ipad': {
                                                            'browserName': 'Safari',
                                                            'deviceName': 'iPad 6th Generation Simulator',
                                                            'platformVersion': '12.0',
                                                            'platformName': 'iOS',
                                                            'deviceOrientation': 'portrait'
                                                        },
                                                        'edge-16-win10': {
                                                            'browserName': 'MicrosoftEdge',
                                                            'version': '16',
                                                            'platform': 'Windows 10',
                                                            'screenResolution': '2560x1600'
                                                        },
                                                        'ie-11-win8.1': {
                                                            'browserName': 'Internet Explorer',
                                                            'version': '11',
                                                            'platform': 'Windows 8.1',
                                                            'screenResolution': '1366x768'
                                                        }
                                                    };


                                                    // ESL BROWSERS
                                                    if (eslBrowsers.hasOwnProperty(browserName))
                                                        // capabilities is in the eslBrowsers list
                                                        capabilities = eslBrowsers[browserName];
                                                        // Generate capibilities based on the browserName (jsonstrify)
                                                    else if (browserName.indexOf('json:') > -1) {
                                                            // issue with spaces & " that are note passed.. :-(
                                                            // maybe would need to base64 the input string & un base here...
                                                            capabilities = JSON.parse(browserName.substr(browserName.indexOf('json:') + 5));
                                                        } else {
                                                            colon = browserName.indexOf(':');


                                                            if (colon > -1) {
                                                                platform = browserName.substr(colon + 1);


                                                                browserName = browserName.substr(0, colon);
                                                            }
                                                            at = browserName.indexOf('@');


                                                            if (at > -1) {
                                                                version = browserName.substr(at + 1);


                                                                browserName = browserName.substr(0, at);
                                                            }

                                                            if (browserName !== 'Chrome Mobile' && browserName !== 'Mobile Safari') {
                                                                capabilities = {
                                                                    browserName: browserName,
                                                                    version: version,
                                                                    platform: platform
                                                                };
                                                            } else {
                                                                capabilities = {
                                                                    browserName: browserName,
                                                                    platformVersion: version,
                                                                    deviceName: platform
                                                                };
                                                            }
                                                        }

                                                    // CrossBrowserTesting-Specific Capabilities
                                                    capabilities.name = 'TestCafe test run ' + id;
                                                    if (process.env.CBT_BUILD) capabilities.build = process.env.CBT_BUILD;
                                                    if (process.env.CBT_RECORD_VIDEO) capabilities.record_video = process.env.CBT_RECORD_VIDEO.match(/true/i);
                                                    if (process.env.CBT_RECORD_NETWORK) capabilities.record_video = process.env.CBT_RECORD_NETWORK.match(/true/i);
                                                    if (process.env.CBT_MAX_DURATION) capabilities.max_duration = process.env.CBT_MAX_DURATION;

                                                    if (browserName.indexOf('Chrome') !== -1 && process.env.CBT_CHROME_ARGS && process.env.CBT_CHROME_ARGS.length > 0) capabilities.chromeOptions = { args: [process.env.CBT_CHROME_ARGS] };

                                                    _context3.next = 11;
                                                    return startBrowser(id, pageUrl, capabilities);

                                                case 11:
                                                case 'end':
                                                    return _context3.stop();
                                            }
                                        }
                                    }, _callee3, this);
                                }));

                                return function (_x4) {
                                    return _ref2.apply(this, arguments);
                                };
                            }());

                        case 4:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this2);
        }))();
    },
    closeBrowser: function closeBrowser(id) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
            return _regenerator2.default.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.next = 2;
                            return openedBrowsers[id].quit();

                        case 2:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, _this3);
        }))();
    },


    // Optional - implement methods you need, remove other methods
    // Initialization
    init: function init() {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
            return _regenerator2.default.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            if (!(!process.env['CBT_TUNNELS_USERNAME'] || !process.env['CBT_TUNNELS_AUTHKEY'])) {
                                _context6.next = 2;
                                break;
                            }

                            throw new Error(AUTH_FAILED_ERROR);

                        case 2:
                            _context6.next = 4;
                            return _this4._getDeviceList();

                        case 4:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, _this4);
        }))();
    },
    dispose: function dispose() {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
            var i, _i;

            return _regenerator2.default.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            _context7.t0 = JSON;
                            _context7.next = 3;
                            return doRequest(CBT_API_PATHS.seleniumTestHistory);

                        case 3:
                            _context7.t1 = _context7.sent;
                            _this5.seleniumHistoryList = _context7.t0.parse.call(_context7.t0, _context7.t1);

                            if (!(_this5.seleniumHistoryList.meta.record_count >= 1)) {
                                _context7.next = 14;
                                break;
                            }

                            i = 0;

                        case 7:
                            if (!(i < _this5.seleniumHistoryList.meta.record_count)) {
                                _context7.next = 14;
                                break;
                            }

                            _this5.seleniumTestID = _this5.seleniumHistoryList.selenium[i].selenium_test_id;
                            _context7.next = 11;
                            return doRequest(CBT_API_PATHS.deleteBrowser(_this5.seleniumTestID));

                        case 11:
                            i++;
                            _context7.next = 7;
                            break;

                        case 14:
                            _context7.t2 = JSON;
                            _context7.next = 17;
                            return doRequest(CBT_API_PATHS.tunnelInfo);

                        case 17:
                            _context7.t3 = _context7.sent;
                            _this5.tunnelList = _context7.t2.parse.call(_context7.t2, _context7.t3);

                            if (!(_this5.tunnelList.meta.record_count >= 1)) {
                                _context7.next = 28;
                                break;
                            }

                            _i = 0;

                        case 21:
                            if (!(_i < _this5.tunnelList.meta.record_count)) {
                                _context7.next = 28;
                                break;
                            }

                            _this5.tunnelID = _this5.tunnelList.tunnels[_i].tunnel_id;
                            _context7.next = 25;
                            return doRequest(CBT_API_PATHS.deleteTunnel(_this5.tunnelID));

                        case 25:
                            _i++;
                            _context7.next = 21;
                            break;

                        case 28:
                        case 'end':
                            return _context7.stop();
                    }
                }
            }, _callee7, _this5);
        }))();
    },


    // Browser names handling
    getBrowserList: function getBrowserList() {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
            return _regenerator2.default.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            return _context8.abrupt('return', _this6.browserNames);

                        case 1:
                        case 'end':
                            return _context8.stop();
                    }
                }
            }, _callee8, _this6);
        }))();
    },
    isValidBrowserName: function isValidBrowserName() /* browserName */{
        var _this7 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
            return _regenerator2.default.wrap(function _callee9$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            return _context9.abrupt('return', true);

                        case 1:
                        case 'end':
                            return _context9.stop();
                    }
                }
            }, _callee9, _this7);
        }))();
    },


    // Extra methods
    resizeWindow: function resizeWindow(id, width, height /*, currentWidth, currentHeight*/) {
        var _this8 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
            return _regenerator2.default.wrap(function _callee10$(_context10) {
                while (1) {
                    switch (_context10.prev = _context10.next) {
                        case 0:
                            _context10.next = 2;
                            return openedBrowsers[id].setWindowSize(width, height);

                        case 2:
                        case 'end':
                            return _context10.stop();
                    }
                }
            }, _callee10, _this8);
        }))();
    },
    maximizeWindow: function maximizeWindow(id) {
        var _this9 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
            return _regenerator2.default.wrap(function _callee11$(_context11) {
                while (1) {
                    switch (_context11.prev = _context11.next) {
                        case 0:
                            _context11.next = 2;
                            return openedBrowsers[id].maximize();

                        case 2:
                        case 'end':
                            return _context11.stop();
                    }
                }
            }, _callee11, _this9);
        }))();
    },
    takeScreenshot: function takeScreenshot() /* id, screenshotPath, pageWidth, pageHeight */{
        var _this10 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
            return _regenerator2.default.wrap(function _callee12$(_context12) {
                while (1) {
                    switch (_context12.prev = _context12.next) {
                        case 0:
                            _this10.reportWarning('The screenshot functionality is not supported by the "crossbrowsertesting" browser provider.');

                        case 1:
                        case 'end':
                            return _context12.stop();
                    }
                }
            }, _callee12, _this10);
        }))();
    }
};
module.exports = exports['default'];