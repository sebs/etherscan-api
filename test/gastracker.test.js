import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockApi, queryOf } from './helpers.js';

describe('gastracker namespace', function () {

  it('gasoracle', async function () {
    const { api, transport } = mockApi({ status: '1', result: 'ok' });

    const res = await api.gastracker.gasoracle();
    assert.equal(res.result, 'ok');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'gastracker');
    assert.equal(q.get('action'), 'gasoracle');
    assert.equal(q.get('apikey'), 'KEY');
  });

  it('gasestimate forwards the gas price', async function () {
    const { api, transport } = mockApi({ status: '1', result: '12' });

    const res = await api.gastracker.gasestimate(2000000000);
    assert.equal(res.result, '12');

    const q = queryOf(transport);
    assert.equal(q.get('module'), 'gastracker');
    assert.equal(q.get('action'), 'gasestimate');
    assert.equal(q.get('gasprice'), '2000000000');
  });
});
