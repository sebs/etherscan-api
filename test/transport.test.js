import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import httpTransport from '../lib/transport.js';

// Exercises the real built-in node:https/node:http transport against a local
// server — no third-party HTTP mocking, no external network.
describe('http transport', function () {
  let server;
  let base;

  before(async function () {
    server = http.createServer(function (req, res) {
      if (req.url.startsWith('/ok')) {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ status: '1', result: '42' }));
      } else if (req.url.startsWith('/bad-json')) {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end('not json');
      } else if (req.url.startsWith('/500')) {
        res.writeHead(500);
        res.end('boom');
      } else if (req.url.startsWith('/echo')) {
        // Echo back the method and the received request body.
        let received = '';
        req.on('data', (c) => { received += c; });
        req.on('end', () => {
          res.writeHead(200, { 'content-type': 'application/json' });
          res.end(JSON.stringify({ status: '1', method: req.method, result: received }));
        });
      } else if (req.url.startsWith('/slow')) {
        // never respond — the client should time out
      } else {
        res.writeHead(404);
        res.end('{}');
      }
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    base = 'http://127.0.0.1:' + server.address().port;
  });

  after(function () {
    return new Promise(resolve => server.close(resolve));
  });

  it('resolves the parsed JSON body on 2xx (GET)', async function () {
    const data = await httpTransport(base + '/ok');
    assert.equal(data.status, '1');
    assert.equal(data.result, '42');
  });

  it('sends a POST with a form-encoded body', async function () {
    const data = await httpTransport(base + '/echo', {
      method: 'POST',
      body: 'module=contract&action=verifysourcecode',
    });
    assert.equal(data.method, 'POST');
    assert.equal(data.result, 'module=contract&action=verifysourcecode');
  });

  it('rejects on a non-2xx status', async function () {
    await assert.rejects(() => httpTransport(base + '/500'), /status code 500/);
  });

  it('rejects when the body is not valid JSON', async function () {
    await assert.rejects(() => httpTransport(base + '/bad-json'), /parse/i);
  });

  it('rejects when the request times out', async function () {
    await assert.rejects(() => httpTransport(base + '/slow', { timeout: 100 }), /timed out/);
  });
});
