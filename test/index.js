'use strict';

const expect = require('expect');
const Koa = require('koa');
const request = require('supertest');
const removeTrailingSlashes = require('../');

describe('koa-remove-trailing-slashes', () => {
    describe('running in Koa', () => {
        it('should work in a normal scenarion', (done) => {
            const app = new Koa();
            app.use(removeTrailingSlashes());

            request(app.listen())
                .get('/foo/')
                .expect('Location', '/foo')
                .expect(301, done);
        });
    });

    describe('defer = false', () => {
        it('should redirect on url and path has trailing slash', async () => {
            const mock = createMock('/foo/');
            await removeTrailingSlashes({defer: false})(mock.ctx, mock.next);

            expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo');
            expect(mock.ctx.status).toBe(301);
        });
    });

    describe('chained = false', () => {
        it('should not redirect on url that already have been modified', async () => {
            const mock = createMock('/fOo/');

            // Mock that something has made a redirect before us
            mock.ctx.status = 301;
            mock.ctx.body = 'Redirecting to …';
            mock.ctx.response = {
                get() {
                    return '/foo/';
                }
            };

            await removeTrailingSlashes({chained: false})(mock.ctx, mock.next);

            expect(mock.redirectMock).toNotHaveBeenCalled();
            expect(mock.ctx.status).toBe(301);
        });
    });

    describe('chained = true & defer = true', () => {
        describe('redirect', () => {
            it('should redirect on url that already have been modified and path has trailing slash', async () => {
                const mock = createMock('/fOo/');

                // Mock that something has made a redirect before us
                mock.ctx.status = 301;
                mock.ctx.body = 'Redirecting to …';
                mock.ctx.response = {
                    get() {
                        return '/foo/';
                    }
                };

                await removeTrailingSlashes()(mock.ctx, mock.next);

                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo');
                expect(mock.ctx.status).toBe(301);
            });

            it('should correctly chain redirect if path has trailing slash and query params', async () => {
                const mock = createMock('/fOo/?baz=1', 'baz=1');

                // Mock that something has made a redirect before us
                mock.ctx.status = 301;
                mock.ctx.body = 'Redirecting to …';
                mock.ctx.response = {
                    get() {
                        return '/foo/?bar=1';
                    }
                };

                await removeTrailingSlashes()(mock.ctx, mock.next);

                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo?bar=1');
                expect(mock.ctx.status).toBe(301);
            });

            it('should not use old query params when processing chain redirects', async () => {
                const mock = createMock('/fOo/?baz=1', 'baz=1');

                // Mock that something has made a redirect before us
                mock.ctx.status = 301;
                mock.ctx.body = 'Redirecting to …';
                mock.ctx.response = {
                    get() {
                        return '/foo/barrr/';
                    }
                };

                await removeTrailingSlashes()(mock.ctx, mock.next);

                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo/barrr');
                expect(mock.ctx.status).toBe(301);
            });

            it('should redirect on url and path has trailing slash', async () => {
                const mock = createMock('/foo/');
                await removeTrailingSlashes()(mock.ctx, mock.next);

                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo');
                expect(mock.ctx.status).toBe(301);
            });

            it('should redirect on url with query and path has trailing slash', async () => {
                const mock = createMock('/foo/?hello=world', 'hello=world');
                await removeTrailingSlashes()(mock.ctx, mock.next);

                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo?hello=world');
                expect(mock.ctx.status).toBe(301);
            });
        });

        describe('not redirect', () => {
            it('should not redirect on url that is the root', async () => {
                const mock = createMock('/');
                await removeTrailingSlashes()(mock.ctx, mock.next);

                expect(mock.redirectMock).toNotHaveBeenCalled();
                expect(mock.ctx.status).toBe(undefined);
            });

            it('should not redirect on url and url has no trailing slash', async () => {
                const mock = createMock('/foo');
                await removeTrailingSlashes()(mock.ctx, mock.next);

                expect(mock.redirectMock).toNotHaveBeenCalled();
                expect(mock.ctx.status).toBe(undefined);
            });

            it('should not redirect on url with query and path has no trailing slash', async () => {
                const mock = createMock('/foo', 'hello=world');
                await removeTrailingSlashes()(mock.ctx, mock.next);

                expect(mock.redirectMock).toNotHaveBeenCalled();
                expect(mock.ctx.status).toBe(undefined);
            });
        });
    });
});

function createMock(originalUrl, querystring) {
    querystring = querystring || '';
    const redirectMock = expect.createSpy();
    return {
        redirectMock: redirectMock,
        ctx: {
            querystring: querystring,
            originalUrl: originalUrl,
            status: undefined,
            redirect: redirectMock
        },
        next: async () => {}
    };
}
