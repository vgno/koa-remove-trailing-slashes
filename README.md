# koa-remove-trailing-slashes

Koa middleware that removes trailing slashes on paths.

[![Build Status](https://img.shields.io/travis/vgno/koa-remove-trailing-slashes/master.svg?style=flat-square)](http://travis-ci.org/vgno/koa-remove-trailing-slashes) [![Coverage Status](https://img.shields.io/coveralls/vgno/koa-remove-trailing-slashes/master.svg?style=flat-square)](https://coveralls.io/r/vgno/koa-remove-trailing-slashes) [![npm](https://img.shields.io/npm/v/koa-remove-trailing-slashes.svg?style=flat-square)](https://www.npmjs.com/package/koa-remove-trailing-slashes)

## Installation
```
npm install koa-remove-trailing-slashes
```

## API
```js
var koa = require('koa');
var app = koa();
app.use(require('koa-remove-trailing-slashes')(opts));
```

* `opts` options object.

### Options

 - `defer` - If true, serves after yield next, allowing any downstream middleware to respond first. Defaults to `true`.
 - `chained` - If the middleware should continue modifying the url if it detects that a redirect already have been performed. Defaults to `true`.

## Example
```js
var koa = require('koa');
var removeTrailingSlashes = require('koa-remove-trailing-slashes');

var app = koa();

app.use(removeTrailingSlashes());

app.use(function *(){
  this.body = 'Hello World';
});

app.listen(3000);
```

## License
MIT
