import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
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

  describe('txlist still includes address alongside a filter when both are given', function () {
    let transport;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: [] });
      transport = mocked.transport;
      await mocked.api.account.txlist('0xabc', 0, 'latest', 1, 10, 'asc', { from: '0xfff' });
    });

    it('sends the address', function () {
      assert.equal(queryOf(transport).get('address'), '0xabc');
    });

    it('sends the from filter', function () {
      assert.equal(queryOf(transport).get('from'), '0xfff');
    });

    it('omits the to filter', function () {
      assert.equal(queryOf(transport).get('to'), null);
    });

    it('omits the fromto_opr filter', function () {
      assert.equal(queryOf(transport).get('fromto_opr'), null);
    });
  });

  describe('a filter with no defined fields adds nothing', function () {
    let transport;

    beforeEach(async function () {
      const mocked = mockApi({ status: '1', result: [] });
      transport = mocked.transport;
      await mocked.api.account.txlist('0xabc', undefined, undefined, undefined, undefined, undefined, {});
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
        await mocked.api.account[method](undefined, '0xcontract', 0, 'latest', 1, 10, 'desc', {
          from: '0xaaa',
          to: '0xbbb',
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
        assert.equal(queryOf(transport).get('contractaddress'), '0xcontract');
      });

      it('sends the from filter', function () {
        assert.equal(queryOf(transport).get('from'), '0xaaa');
      });

      it('sends the to filter', function () {
        assert.equal(queryOf(transport).get('to'), '0xbbb');
      });

      it('sends the fromto_opr filter', function () {
        assert.equal(queryOf(transport).get('fromto_opr'), 'and');
      });
    });
  }
});
