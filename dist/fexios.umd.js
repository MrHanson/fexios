/**
 * @preserve
 * @mrhanson/fexios v0.0.0-development
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.fexios = global.fexios || {}, global.fexios.umd = factory()));
}(this, (function () { 'use strict';

    /**
     * @description Determines whether the specified URL is absolute
     * @param {string} url
     * @returns {boolean}
     */
    function isAbsoluteURL(url) {
        if (!url)
            return false;
        return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
    }
    /**
     * @description Creates a new URL by combining the specified URLs
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     * @returns {string} The combined URL
     */
    function combineURLs(baseURL, relativeURL) {
        return relativeURL
            ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
            : baseURL;
    }
    /**
     * @description Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     * @param {string} baseURL The base URL
     * @param {string} requestedURL Absolute or relative URL to combine
     * @returns {string} The combined full path
     */
    function buildFullPath(baseURL, requestedURL) {
        if (baseURL && !isAbsoluteURL(requestedURL)) {
            return combineURLs(baseURL, requestedURL);
        }
        return requestedURL || '';
    }
    /**
     * @description Creates a new URL by combining requestedURL with the query string
     * make sure the requestedURL is the asbolute URL.
     * @param {string} requestedURL
     * @param {object} params the params object need to be converted to query string
     */
    function buildQsPath(requestedURL, params) {
        var qs = params && Object.entries(params).map(function (_a) {
            var k = _a[0], v = _a[1];
            return k + "=" + v;
        }).join('&');
        return qs ? requestedURL + '?' + qs : requestedURL;
    }
    function mergeConfig(defaultConfig, userConfig) {
        if (defaultConfig === void 0) { defaultConfig = {}; }
        if (userConfig === void 0) { userConfig = {}; }
        var config = Object.create(null); // 创建空对象，作为最终的合并结果
        var defaultToUserConfig = [
            'baseURL',
            'transformRequest',
            'transformResponse',
            'timeout',
            'credentials',
            'validateStatus',
        ];
        defaultToUserConfig.forEach(function (prop) {
            if (typeof userConfig[prop] !== 'undefined') {
                config[prop] = userConfig[prop];
            }
            else if (typeof defaultConfig[prop] !== 'undefined') {
                config[prop] = defaultConfig[prop];
            }
        });
        var valueFromUserConfig = ['url', 'method', 'headers', 'params', 'data'];
        valueFromUserConfig.forEach(function (prop) {
            if (typeof userConfig[prop] !== 'undefined')
                config[prop] = userConfig[prop];
        });
        return config;
    }

    var InterceptorManager = /** @class */ (function () {
        function InterceptorManager() {
            this.task = [];
        }
        InterceptorManager.prototype.use = function (resolved, rejected) {
            this.task.push({
                resolved: resolved,
                rejected: rejected
            });
            return this.task.length - 1;
        };
        InterceptorManager.prototype.eject = function (id) {
            if (this.task[id]) {
                this.task[id] = null;
            }
        };
        return InterceptorManager;
    }());

    function warn(msg) {
        console.warn("%c Fexios warn %c " + msg, 'background:#f90;padding:1px;border-radius:3px;color:#fff', 'background:transparent');
    }

    if (!window.fetch) {
        warn('Your browser doesn\'t fetch, maybe u need the polyfill(https://github.com/github/fetch)');
    }
    if (!window.AbortController) {
        warn('Your browser doesn\'t AbortController');
    }
    function getAbort(abortPath) {
        // use AbortController to cancel fetch request
        var controller = new AbortController();
        var signal = controller.signal;
        signal.addEventListener('abort', function () { return warn("request " + (abortPath || '') + " has been canceled"); });
        return {
            signal: signal,
            abort: controller.abort
        };
    }
    function fetchRequest(config, abortConfig) {
        var url = config.url, _a = config.method, method = _a === void 0 ? 'get' : _a, baseURL = config.baseURL, _b = config.headers, requestHeaders = _b === void 0 ? {} : _b, params = config.params, data = config.data, _c = config.timeout, timeout = _c === void 0 ? 5000 : _c, _d = config.timeoutErrorMessage, timeoutErrorMessage = _d === void 0 ? 'request timeout!' : _d, _e = config.credentials, credentials = _e === void 0 ? 'omit' : _e;
        var finalPath = baseURL ? buildFullPath(baseURL, url) : url;
        return new Promise(function (resolve, reject) {
            if (!finalPath) {
                reject('parameter requestUrl is missing!');
                return;
            }
            if (params) {
                finalPath = buildQsPath(finalPath, params);
            }
            var _a = abortConfig || getAbort(finalPath), signal = _a.signal, abortRequest = _a.abort;
            var initConfig = {
                method: method,
                headers: requestHeaders,
                body: null,
                credentials: credentials,
                signal: signal
            };
            var lowerCaseMethod = method.toLocaleLowerCase();
            if (['post', 'put', 'patch'].includes(lowerCaseMethod)) {
                initConfig.body = data;
                if (!requestHeaders['Content-Type'])
                    initConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }
            var timeoutId;
            var fetchTask = window.fetch(finalPath, initConfig);
            var timeoutTask = new Promise(function (_, rj) {
                timeoutId = setTimeout(function () {
                    timeoutId && clearTimeout(timeoutId);
                    abortRequest();
                    rj(new Error(timeoutErrorMessage));
                }, timeout);
            });
            Promise.race([fetchTask, timeoutTask])
                .then(function (oriResponse) {
                var _a = oriResponse, body = _a.body, headers = _a.headers, status = _a.status, statusText = _a.statusText;
                // format response headers
                var responseHeaders = {};
                headers.forEach(function (v, k) { return responseHeaders[k] = v; });
                var response = {
                    data: body,
                    status: status,
                    statusText: statusText,
                    headers: responseHeaders,
                    config: config
                };
                var validateStatus = config.validateStatus;
                if (!status || !validateStatus || validateStatus(status)) {
                    resolve(response);
                }
                else {
                    reject(new Error('Request failded with status code ' + response.status));
                }
            })
                .catch(function (err) {
                reject(err);
            });
        });
    }

    function transform(config, fns) {
        if (!fns) {
            return config;
        }
        if (!Array.isArray(fns)) {
            fns = [fns];
        }
        fns.forEach(function (fn) {
            config = fn(config);
        });
        return config;
    }
    function dispatchRequest(config) {
        var transformRequest = config.transformRequest, transformResponse = config.transformResponse;
        transform(config, transformRequest);
        return fetchRequest(config).then(function (res) { return transform(res, transformResponse); });
    }

    var Fexios = /** @class */ (function () {
        function Fexios(instanceConfig) {
            this.defaults = instanceConfig;
            this.interceptors = {
                request: new InterceptorManager(),
                response: new InterceptorManager()
            };
        }
        Fexios.prototype.request = function (config) {
            config = mergeConfig(this.defaults, config);
            // to do: expose request cancel method
            var taskArr = [{
                    resolved: dispatchRequest,
                    rejected: undefined
                }];
            this.interceptors.request.task.forEach(function (interceptor) {
                if (interceptor) {
                    taskArr.unshift(interceptor);
                }
            });
            this.interceptors.response.task.forEach(function (interceptor) {
                if (interceptor) {
                    taskArr.push(interceptor);
                }
            });
            var promise = Promise.resolve(config);
            while (taskArr.length) {
                var requestTask = taskArr.shift();
                if (requestTask) {
                    var resolved = requestTask.resolved, rejected = requestTask.rejected;
                    promise = promise.then(resolved, rejected);
                }
            }
            return promise;
        };
        Fexios.prototype.getUri = function (config) {
            config = mergeConfig(this.defaults, config);
            var baseURL = config.baseURL, url = config.url, params = config.params;
            if (!url)
                return '';
            if (!baseURL)
                return buildQsPath(url, params);
            var fullPath = buildFullPath(baseURL, url);
            return buildQsPath(fullPath, params);
        };
        Fexios.prototype.get = function (url, config) {
            return this._requestMethodWithoutData('get', url, config);
        };
        Fexios.prototype.delete = function (url, config) {
            return this._requestMethodWithoutData('delete', url, config);
        };
        Fexios.prototype.head = function (url, config) {
            return this._requestMethodWithoutData('head', url, config);
        };
        Fexios.prototype.options = function (url, config) {
            return this._requestMethodWithoutData('options', url, config);
        };
        Fexios.prototype.post = function (url, data, config) {
            return this._requestMethodWithData('post', url, data, config);
        };
        Fexios.prototype.put = function (url, data, config) {
            return this._requestMethodWithData('post', url, data, config);
        };
        Fexios.prototype.patch = function (url, data, config) {
            return this._requestMethodWithData('post', url, data, config);
        };
        Fexios.prototype._requestMethodWithoutData = function (method, url, config) {
            return this.request(mergeConfig(config, { method: method, url: url }));
        };
        Fexios.prototype._requestMethodWithData = function (method, url, data, config) {
            return this.request(mergeConfig(config, { method: method, data: data, url: url }));
        };
        return Fexios;
    }());

    var defaults = {
        timeout: 0,
        headers: {
            'Accept': 'application/json, text/plain, */*'
        },
        transformRequest: [],
        transformResponse: [],
        credentials: 'same-origin',
        validateStatus: function validateStatus(status) {
            return status >= 200 && status < 300;
        }
    };

    /**
     * Create an instance of Fexios
     *
     * @param {Object} defaultConfig The default config for the instance
     * @return {Fexios} A new instance of Fexios
     */
    function createInstance(defaultConfig) {
        var context = new Fexios(defaultConfig);
        var fexios = Fexios.prototype.request.bind(context);
        return fexios;
    }
    var fexios = createInstance(defaults);
    fexios.create = function (config) {
        return createInstance(mergeConfig(defaults, config));
    };
    fexios.all = function (promises) {
        return Promise.all(promises);
    };

    return fexios;

})));
