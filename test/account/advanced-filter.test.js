import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { EtherscanArgumentError } from '../../lib/index.js';
import { mockApi, queryOf } from '../helpers.js';

describe('account advanced filter (from/to/fromto_opr)', function () {

  describe('txlist sends from/to/fromto_opr and omits address when not given', function () {
    let transport;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: [] });
      transport = mocked.transport;
      await mocked.api.account.txlist(undefined, 0, 'latest', 1, 10, 'desc', {
        from: '0x73605779985A11B8Fe32E6eD5ae5F249FFD0D7f0',
        to: '0x71c7656ec7ab88b098defb751b7401b5f6d8976f',
        fromto_opr: 'or',
      });
    });

    it('targets the account module', function () {
      assert.equal(queryOf(transport).get('module'), 'account');
    });

    it('uses the txlist action', function () {
      assert.equal(queryOf(transport).get('action'), 'txlist');
    });

    it('omits the address', function () {
      assert.equal(queryOf(transport).get('address'), null);
    });

    it('sends the from filter', function () {
      assert.equal(queryOf(transport).get('from'), '0x73605779985A11B8Fe32E6eD5ae5F249FFD0D7f0');
    });

    it('sends the to filter', function () {
      assert.equal(queryOf(transport).get('to'), '0x71c7656ec7ab88b098defb751b7401b5f6d8976f');
    });

    it('sends the fromto_opr filter', function () {
      assert.equal(queryOf(transport).get('fromto_opr'), 'or');
    });

    it('sends the explicit sort', function () {
      assert.equal(queryOf(transport).get('sort'), 'desc');
    });
  });

  // Etherscan's rules, checked live: an address cannot be combined with
  // from/to; fromto_opr is required once from or to is set; 'and' needs both.
  describe('rejects an address combined with a from/to filter, before any request', function () {
    const calls = {
      txlist: (api) => api.account.txlist('0xabc0000000000000000000000000000000000000', { filter: { from: '0xfff0000000000000000000000000000000000000', fromto_opr: 'or' } }),
      'txlist (positional)': (api) => api.account.txlist('0xabc0000000000000000000000000000000000000', 0, 'latest', 1, 10, 'asc', { from: '0xfff0000000000000000000000000000000000000' }),
      txlistinternal: (api) => api.account.txlistinternal({ address: '0xabc0000000000000000000000000000000000000', filter: { to: '0xfff0000000000000000000000000000000000000' } }),
      tokentx: (api) => api.account.tokentx('0xabc0000000000000000000000000000000000000', { filter: { from: '0xfff0000000000000000000000000000000000000' } }),
      tokennfttx: (api) => api.account.tokennfttx('0xabc0000000000000000000000000000000000000', { filter: { to: '0xfff0000000000000000000000000000000000000' } }),
      token1155tx: (api) => api.account.token1155tx('0xabc0000000000000000000000000000000000000', { filter: { from: '0xfff0000000000000000000000000000000000000' } }),
    };
    for (const [name, call] of Object.entries(calls)) {
      it(name, async function () {
        const { api, transport } = mockApi({ status: '1', result: [] });
        await assert.rejects(() => call(api), (err) => err instanceof EtherscanArgumentError && err.argument === 'filter');
        assert.equal(transport.mock.callCount(), 0);
      });
    }
  });

  it('still sends an address with a filter that sets only fromto_opr', async function () {
    const { api, transport } = mockApi({ status: '1', result: [] });
    await api.account.txlist('0xabc0000000000000000000000000000000000000', { filter: { fromto_opr: 'and' } });
    assert.equal(queryOf(transport).get('address'), '0xabc0000000000000000000000000000000000000');
  });

  it('ignores the filter for a txhash lookup, so an address there is no conflict', async function () {
    const { api, transport } = mockApi({ status: '1', result: [] });
    await api.account.txlistinternal({ txhash: '0x1111111111111111111111111111111111111111111111111111111111111111', address: '0xabc0000000000000000000000000000000000000', filter: { from: '0xfff0000000000000000000000000000000000000', fromto_opr: 'or' } });
    assert.equal(queryOf(transport).get('txhash'), '0x1111111111111111111111111111111111111111111111111111111111111111');
  });

  describe('defaults fromto_opr to "or" when only one side is given', function () {
    for (const side of ['from', 'to']) {
      it('for ' + side, async function () {
        const { api, transport } = mockApi({ status: '1', result: [] });
        await api.account.txlist(undefined, { filter: { [side]: '0xfff0000000000000000000000000000000000000' } });
        assert.equal(queryOf(transport).get('fromto_opr'), 'or');
      });
    }

    it('for txlistinternal', async function () {
      const { api, transport } = mockApi({ status: '1', result: [] });
      await api.account.txlistinternal({ filter: { to: '0xfff0000000000000000000000000000000000000' } });
      assert.equal(queryOf(transport).get('fromto_opr'), 'or');
    });
  });

  it('keeps an explicit "or" with one side', async function () {
    const { api, transport } = mockApi({ status: '1', result: [] });
    await api.account.tokentx(undefined, { filter: { from: '0xfff0000000000000000000000000000000000000', fromto_opr: 'or' } });
    assert.equal(queryOf(transport).get('fromto_opr'), 'or');
  });

  it('rejects "and" with only one side, before any request', async function () {
    const { api, transport } = mockApi({ status: '1', result: [] });
    await assert.rejects(
      () => api.account.txlist(undefined, { filter: { from: '0xfff0000000000000000000000000000000000000', fromto_opr: 'and' } }),
      (err) => err instanceof EtherscanArgumentError && err.argument === 'fromto_opr',
    );
    assert.equal(transport.mock.callCount(), 0);
  });

  it('rejects from and to without fromto_opr, before any request', async function () {
    const { api, transport } = mockApi({ status: '1', result: [] });
    await assert.rejects(
      () => api.account.txlist(undefined, { filter: { from: '0xaaa0000000000000000000000000000000000000', to: '0xbbb0000000000000000000000000000000000000' } }),
      (err) => err instanceof EtherscanArgumentError && err.argument === 'fromto_opr',
    );
    assert.equal(transport.mock.callCount(), 0);
  });

  describe('a filter with no defined fields adds nothing', function () {
    let transport;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: [] });
      transport = mocked.transport;
      await mocked.api.account.txlist('0xabc0000000000000000000000000000000000000', undefined, undefined, undefined, undefined, undefined, {});
    });

    it('omits the from filter', function () {
      assert.equal(queryOf(transport).get('from'), null);
    });

    it('omits the to filter', function () {
      assert.equal(queryOf(transport).get('to'), null);
    });

    it('omits the fromto_opr filter', function () {
      assert.equal(queryOf(transport).get('fromto_opr'), null);
    });
  });

  describe('txlistinternal accepts a filter and omits an empty address', function () {
    let transport;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: [] });
      transport = mocked.transport;
      await mocked.api.account.txlistinternal(undefined, undefined, 0, 'latest', 'desc', {
        to: '0x71c7656ec7ab88b098defb751b7401b5f6d8976f',
      });
    });

    it('uses the txlistinternal action', function () {
      assert.equal(queryOf(transport).get('action'), 'txlistinternal');
    });

    it('omits the txhash', function () {
      assert.equal(queryOf(transport).get('txhash'), null);
    });

    it('omits the address', function () {
      assert.equal(queryOf(transport).get('address'), null);
    });

    it('still sends the startblock in filter-only mode', function () {
      assert.equal(queryOf(transport).get('startblock'), '0');
    });

    it('still sends the endblock in filter-only mode', function () {
      assert.equal(queryOf(transport).get('endblock'), 'latest');
    });

    it('sends the to filter', function () {
      assert.equal(queryOf(transport).get('to'), '0x71c7656ec7ab88b098defb751b7401b5f6d8976f');
    });

    it('sends the explicit sort', function () {
      assert.equal(queryOf(transport).get('sort'), 'desc');
    });
  });

  for (const method of ['tokentx', 'tokennfttx', 'token1155tx']) {
    describe(`${method} threads from/to/fromto_opr and contractaddress`, function () {
      let transport;

      beforeEach(async function () {
        const mocked = mockApi({ status: '1', result: [] });
        transport = mocked.transport;
        await mocked.api.account[method](undefined, '0xcccccccccccccccccccccccccccccccccccccccc', 0, 'latest', 1, 10, 'desc', {
          from: '0xaaa0000000000000000000000000000000000000',
          to: '0xbbb0000000000000000000000000000000000000',
          fromto_opr: 'and',
        });
      });

      it(`uses the ${method} action`, function () {
        assert.equal(queryOf(transport).get('action'), method);
      });

      it('omits the address', function () {
        assert.equal(queryOf(transport).get('address'), null);
      });

      it('sends the contract address', function () {
        assert.equal(queryOf(transport).get('contractaddress'), '0xcccccccccccccccccccccccccccccccccccccccc');
      });

      it('sends the from filter', function () {
        assert.equal(queryOf(transport).get('from'), '0xaaa0000000000000000000000000000000000000');
      });

      it('sends the to filter', function () {
        assert.equal(queryOf(transport).get('to'), '0xbbb0000000000000000000000000000000000000');
      });

      it('sends the fromto_opr filter', function () {
        assert.equal(queryOf(transport).get('fromto_opr'), 'and');
      });
    });
  }
});
