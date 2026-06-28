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
      } else if (req.url.startsWith('/big')) {
        // Stream a large body (~1 MB) to exercise the response-size cap.
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end('"' + 'x'.repeat(1024 * 1024) + '"');
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

  // The local test server speaks plain http, so every call opts into cleartext.
  it('resolves the parsed JSON body on 2xx (GET)', async function () {
    const data = await httpTransport(base + '/ok', { allowInsecure: true });
    assert.equal(data.status, '1');
    assert.equal(data.result, '42');
  });

  it('sends a POST with a form-encoded body', async function () {
    const data = await httpTransport(base + '/echo', {
      method: 'POST',
      body: 'module=contract&action=verifysourcecode',
      allowInsecure: true,
    });
    assert.equal(data.method, 'POST');
    assert.equal(data.result, 'module=contract&action=verifysourcecode');
  });

  it('rejects on a non-2xx status', async function () {
    await assert.rejects(() => httpTransport(base + '/500', { allowInsecure: true }), /status code 500/);
  });

  it('rejects when the body is not valid JSON', async function () {
    await assert.rejects(() => httpTransport(base + '/bad-json', { allowInsecure: true }), /parse/i);
  });

  it('rejects when the request times out', async function () {
    await assert.rejects(() => httpTransport(base + '/slow', { timeout: 100, allowInsecure: true }), /timed out/);
  });

  it('refuses cleartext http:// by default (no allowInsecure)', async function () {
    await assert.rejects(() => httpTransport(base + '/ok'), /cleartext/i);
  });

  it('refuses cleartext regardless of scheme case (HTTP://)', async function () {
    const upper = base.replace('http://', 'HTTP://');
    await assert.rejects(() => httpTransport(upper + '/ok'), /cleartext/i);
  });

  it('does not leak the URL/api key in the cleartext-refusal error', async function () {
    await assert.rejects(
      () => httpTransport(base + '/v2/api?apikey=SECRETKEY'),
      (err) => {
        assert.match(err.message, /cleartext/i); // pin the intended rejection
        assert.ok(!err.message.includes('SECRETKEY'));
        assert.ok(!err.message.includes(base));
        return true;
      },
    );
  });

  it('rejects a streamed (multi-chunk) body that exceeds maxResponseBytes', async function () {
    await assert.rejects(
      () => httpTransport(base + '/big', { allowInsecure: true, maxResponseBytes: 1024 }),
      /exceeded maximum size/,
    );
  });

  it('rejects (without crashing) a single-chunk body over the cap', async function () {
    // The whole small body arrives in one 'data' event followed by 'end' — the
    // path that previously crashed the process / resolved truncated data.
    await assert.rejects(
      () => httpTransport(base + '/ok', { allowInsecure: true, maxResponseBytes: 5 }),
      /exceeded maximum size/,
    );
  });

  it('resolves a body that stays under maxResponseBytes', async function () {
    const data = await httpTransport(base + '/ok', { allowInsecure: true, maxResponseBytes: 1024 });
    assert.equal(data.result, '42');
  });
});
