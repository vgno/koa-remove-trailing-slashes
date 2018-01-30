# koa-remove-trailing-slashes

Koa middleware that removes trailing slashes on paths.

**Notice: koa-remove-trailing-slashes@2 supports koa@2; if you want to use this module with koa@1, please use koa-remove-trailing-slashes@1.**

[![Build Status](https://img.shields.io/travis/vgno/koa-remove-trailing-slashes/master.svg?style=flat-square)](http://travis-ci.org/vgno/koa-remove-trailing-slashes) [![Coverage Status](https://img.shields.io/coveralls/vgno/koa-remove-trailing-slashes/master.svg?style=flat-square)](https://coveralls.io/r/vgno/koa-remove-trailing-slashes) [![npm](https://img.shields.io/npm/v/koa-remove-trailing-slashes.svg?style=flat-square)](https://www.npmjs.com/package/koa-remove-trailing-slashes)

## Installation
```
npm install koa-remove-trailing-slashes
```

## API
```js
const Koa = require('koa');
const app = Koa();
app.use(require('koa-remove-trailing-slashes')(opts));
```

* `opts` options object.

### Options

 - `defer` - If true, serves after yield next, allowing any downstream middleware to respond first. Defaults to `true`.
 - `chained` - If the middleware should continue modifying the url if it detects that a redirect already have been performed. Defaults to `true`.

## Example
```js
const Koa = require('koa');
const removeTrailingSlashes = require('koa-remove-trailing-slashes');

const app = new Koa();

app.use(removeTrailingSlashes());

app.use(ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```

## License
MIT
