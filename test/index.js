'use strict';

var expect = require('expect');
var removeTrailingSlashes = require('../index.js');

describe('koa-remove-trailing-slashes', function() {
    describe('defer = false', function() {
        it('should redirect on url and path has trailing slash', function() {
            var mock = createMock('/foo/');
            var removeTrailingSlashesMock = removeTrailingSlashes({defer: false}).bind(mock.this);
            var removeTrailingSlashesMockGenerator = removeTrailingSlashesMock();
            removeTrailingSlashesMockGenerator.next();
            expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo');
            expect(mock.this.status).toBe(301);
        });
    });

    describe('chained = false', function() {
        it('should not redirect on url that already have been modified', function() {
            var mock = createMock('/fOo/');

            // Mock that something has made a redirect before us
            mock.this.status = 301;
            mock.this.body = 'Redirecting to …';
            mock.this.response = {
                get: function() {
                    return '/foo/';
                }
            };

            var removeTrailingSlashesMock = removeTrailingSlashes({chained: false}).bind(mock.this);
            var removeTrailingSlashesMockGenerator = removeTrailingSlashesMock();
            removeTrailingSlashesMockGenerator.next();
            removeTrailingSlashesMockGenerator.next();
            expect(mock.redirectMock).toNotHaveBeenCalled();
            expect(mock.this.status).toBe(301);
        });
    });

    describe('chained = true & defer = true', function() {
        describe('redirect', function() {
            it('should redirect on url that already have been modified and path has trailing slash', function() {
                var mock = createMock('/fOo/');

                // Mock that something has made a redirect before us
                mock.this.status = 301;
                mock.this.body = 'Redirecting to …';
                mock.this.response = {
                    get: function() {
                        return '/foo/';
                    }
                };

                var removeTrailingSlashesMock = removeTrailingSlashes().bind(mock.this);
                var removeTrailingSlashesMockGenerator = removeTrailingSlashesMock();
                removeTrailingSlashesMockGenerator.next();
                removeTrailingSlashesMockGenerator.next();
                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo');
                expect(mock.this.status).toBe(301);
            });

            it('should redirect on url and path has trailing slash', function() {
                var mock = createMock('/foo/');
                var removeTrailingSlashesMock = removeTrailingSlashes().bind(mock.this);
                var removeTrailingSlashesMockGenerator = removeTrailingSlashesMock();
                removeTrailingSlashesMockGenerator.next();
                removeTrailingSlashesMockGenerator.next();
                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo');
                expect(mock.this.status).toBe(301);
            });

            it('should redirect on url with query and path has trailing slash', function() {
                var mock = createMock('/foo/?hello=world', 'hello=world');
                var removeTrailingSlashesMock = removeTrailingSlashes().bind(mock.this);
                var removeTrailingSlashesMockGenerator = removeTrailingSlashesMock();
                removeTrailingSlashesMockGenerator.next();
                removeTrailingSlashesMockGenerator.next();
                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo?hello=world');
                expect(mock.this.status).toBe(301);
            });
        });

        describe('not redirect', function() {
            it('should not redirect on url that is the root', function() {
                var mock = createMock('/');
                var removeTrailingSlashesMock = removeTrailingSlashes().bind(mock.this);
                var removeTrailingSlashesMockGenerator = removeTrailingSlashesMock();
                removeTrailingSlashesMockGenerator.next();
                removeTrailingSlashesMockGenerator.next();
                expect(mock.redirectMock).toNotHaveBeenCalled();
                expect(mock.this.status).toBe(undefined);
            });

            it('should not redirect on url and url has no trailing slash', function() {
                var mock = createMock('/foo');
                var removeTrailingSlashesMock = removeTrailingSlashes().bind(mock.this);
                var removeTrailingSlashesMockGenerator = removeTrailingSlashesMock();
                removeTrailingSlashesMockGenerator.next();
                removeTrailingSlashesMockGenerator.next();
                expect(mock.redirectMock).toNotHaveBeenCalled();
                expect(mock.this.status).toBe(undefined);
            });

            it('should not redirect on url with query and path has no trailing slash', function() {
                var mock = createMock('/foo', 'hello=world');
                var removeTrailingSlashesMock = removeTrailingSlashes().bind(mock.this);
                var removeTrailingSlashesMockGenerator = removeTrailingSlashesMock();
                removeTrailingSlashesMockGenerator.next();
                removeTrailingSlashesMockGenerator.next();
                expect(mock.redirectMock).toNotHaveBeenCalled();
                expect(mock.this.status).toBe(undefined);
            });
        });
    });
});

function createMock(originalUrl, querystring) {
    querystring = querystring || '';
    var redirectMock = expect.createSpy();
    return {
        redirectMock: redirectMock,
        this: {
            querystring: querystring,
            originalUrl: originalUrl,
            status: undefined,
            redirect: redirectMock
        }
    };
}
