/**
 * Bender configuration file
 * 
 * @param {Object}   applications       Applications used in current project
 * @param {Array}    browsers           List of browsers used for testing
 * @param {Number}   captureTimeout     Timeout before which a launched browser should connect to the server
 * @param {String}   certificate        Location of the certificate file
 * @param {Boolean}  debug              Enable debug logs
 * @param {Number}   defermentTimeout   Timeout before which a plugin should finish initializing on a test page
 * @param {String}   framework          Default framework used for the tests
 * @param {String}   hostname           Host on which the HTTP and WebSockets servers will listen
 * @param {Array}    manualBrowsers     List of browsers accepting manual tests
 * @param {Number}   manualTestTimeout  Timeout after which a manual test is marked as failed
 * @param {Array}    plugins            List of Bender plugins to load at startup (Required)
 * @param {Number}   port               Port on which the HTTP and WebSockets servers will listen
 * @param {String}   privateKey         Location of the private key file
 * @param {Boolean}  secure             Flag telling whether to serve contents over HTTPS and WSS
 * @param {Number}   slowAvgThreshold   Average test case duration threshold above which a test is marked as slow
 * @param {Number}   slowThreshold      Test duration threshold above which a test is marked as slow
 * @param {String}   startBrowser       Name of a browser to start when executing bender run command
 * @param {Number}   testRetries        Number of retries to perform before marking a test as failed
 * @param {Object}   tests              Test groups for the project (Required)
 * @param {Number}   testTimeout        Timeout after which a test will be fetched again
 */

var config = {
    applications: {
        ckeditor: {
            path: '.',
            files: [
                'ckeditor.js'
            ]
        }
    },

    framework: 'yui', // use for entire project

    plugins: [
        'benderjs-yui',
        'benderjs-jquery',
        'benderjs-sinon',
        'tests/_benderjs/ckeditor'
    ],

    tests: {
        nanospell: {
            applications: [ 'ckeditor' ],
            basePath: 'tests/',
            paths: [
                'smoke/**',
                '!**/_*/**'
            ],
            // Latest of the old API (1.8.3)
            // Latest of the 1.* branch
            // Latest of the 2.* branch
            jQuery: [ '1.8.3', '1.11.1', '2.1.1' ]
        }
    }

};

module.exports = config;
