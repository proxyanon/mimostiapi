import * as http from 'http';
import * as supertest from 'supertest';
import * as test from 'tape';
import * as Koa from 'koa';

const app = new Koa()

const apptest = supertest(http.createServer(app.callback()))

test('GET /api/v1/usuarios', (t) => {

    apptest.get('/api/v1/usuarios')
        .expect(200)
        .expect(res => {
            t.equal(res.text, '')
        })
        .end(t.end.bind(t))
});
