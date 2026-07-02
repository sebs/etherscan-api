import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from '../helpers.js';

const BLOCKNO = '16701588';

describe('block.getblockcountdown', function () {
  let transport;
  let result;

  beforeEach(async function () {
    const mocked = mockApi({ status: '1', result: 'ok' });
    transport = mocked.transport;
    const res = await mocked.api.block.getblockcountdown(BLOCKNO);
    result = res.result;
  });

  it('resolves with the API result', function () {
    assert.equal(result, 'ok');
  });

  it('targets the block module', function () {
    assert.equal(queryOf(transport).get('module'), 'block');
  });

  it('uses the getblockcountdown action', function () {
    assert.equal(queryOf(transport).get('action'), 'getblockcountdown');
  });

  it('sends the requested blockno', function () {
    assert.equal(queryOf(transport).get('blockno'), BLOCKNO);
  });
});
