'use strict';

const URL = require('url').URL;

module.exports = removeTrailingSlashes;

function removeTrailingSlashes(opts) {
    opts = opts || {};

    if (opts.defer !== false) {
        opts.defer = opts.defer || true;
    }

    if (opts.chained !== false) {
        opts.chained = opts.chained || true;
    }

    return async function(ctx, next) {
        if (opts.defer) {
            await next();
        }

        let path;
        let querystring = '';

        // We have already done a redirect and we will continue if we are in chained mode
        if (opts.chained && ctx.status === 301) {
            const location = ctx.response.get('Location') || '';

            // We can't use ctx.querystring because it may not be up to date
            const parsedLocation = location.match(/\?(.*)$/);
            if (parsedLocation && parsedLocation[1]) {
                querystring = parsedLocation[1];
            }

            path = getPath(location, querystring);
        } else if (ctx.status !== 301) {
            querystring = ctx.querystring;
            path = getPath(ctx.originalUrl, ctx.querystring);
        }

        if (path && haveSlash(path)) {
            path = path.slice(0, -1);
            const query = querystring.length ? '?' + querystring : '';

            try {
                const newURL = new URL(path + query, ctx.request.URL);
                if (ctx.origin === newURL.origin) {
                    ctx.status = 301;
                    ctx.redirect(path + query);
                }
            } catch (err) {
                // Intentionally left blank. Can't parse the requested path as URL
            }
        }

        if (!opts.defer) {
            await next();
        }
    };
}

function haveSlash(path) {
    return path !== '/' && path.slice(-1) === '/';
}

function getPath(original, querystring) {
    if (querystring.length) {
        return original.slice(0, -querystring.length - 1);
    }

    return original;
}
