var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');
var url = require('url');
var http = require('http')

var readFileAsync = Promise.promisify(fs.readFile)

var cache = {};

module.exports = {
    reset: function(key) {
        if(key) {
            delete cache[key];
        } else {
            cache = {};
        }
    },
    process: function(data, support) {

        var result = {
            html: '<!-- Unable to resolve HTML include-->'
        };

        //read from cache
        if(data && ((data.url && cache[data.url]) || (data.file && cache[data.file]))) {
            result.html = cache[data.url] || cache[data.file];
            return Promise.resolve(result);
        }

        //read from fs
        if(data && data.file) {
            var filePath = path.resolve(support.basePath, data.file);
            var promise = readFileAsync(filePath, 'utf8');
            return promise.then(function(val) {
                cache[data.file] = val;
                result.html = val;
                return Promise.resolve(result);
            }).catch(function() {
                return Promise.resolve(result);
            });
        }

        //read from url
        else if(data && data.url) {
            var urlParts = url.parse(data.url);
            var requestOpts = {
                hostname: urlParts.hostname,
                port: urlParts.port,
                path: urlParts.path,
                method: 'GET'
            };

            return new Promise(function(resolve, reject) {
                var req = http.request(requestOpts, function(res) {
                    var body = '';

                    res.on('data', function(chunk) {
                        body += chunk;
                    });

                    res.on('end', function() {
                        cache[data.url] = body;
                        result.html = body;
                        resolve(result);
                    });
                });

                req.on('error', function(err) {
                    reject(err);
                });

                req.end();
            }).catch(function() {
                return Promise.resolve(result);
            });

        //read raw html
        } else if(data && data.html) {
            result.html = data.html;
            return Promise.resolve(result);
        }

        //nothing defined
        else {
            return Promise.resolve({
                html: '<!-- Nothing to include -->'
            });
        }


    },
    defaultData: {
        html: '<p>I am an HTML include</p>'
    }
};