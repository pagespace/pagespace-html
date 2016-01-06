var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');
var url = require('url');
var http = require('http')

var readFileAsync = Promise.promisify(fs.readFile)

var cache = {};

module.exports = {
    /*
    reset: function(key) {
        if(key) {
            delete cache[key];
        } else {
            cache = {};
        }
    },
    process: function(config) {

        var result = {
            html: '<!-- Unable to resolve HTML include-->'
        };

        //read from cache
        if(config && ((config.url && cache[config.url]) || (config.file && cache[config.file]))) {
            result.html = cache[config.url] || cache[config.file];
            return Promise.resolve(result);
        }

        //read from fs
        if(config && config.file) {
            var filePath = path.resolve(pagespace.userBasePath, config.file);
            var promise = readFileAsync(filePath, 'utf8');
            return promise.then(function(val) {
                cache[config.file] = val;
                result.html = val;
                return Promise.resolve(result);
            }).catch(function() {
                return Promise.resolve(result);
            });
        }

        //read from url
        else if(config && config.url) {
            var urlParts = url.parse(config.url);
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
                        cache[config.url] = body;
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
        } else if(config && config.html) {
            result.html = config.html;
            return Promise.resolve(result);
        }

        //nothing defined
        else {
            return Promise.resolve({
                html: '<!-- Nothing to include -->'
            });
        }
    }*/
};