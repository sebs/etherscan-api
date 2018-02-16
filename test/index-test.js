'use strict';
const assert = require('chai').assert;
describe('index.js', function() {
  it('can be required', function( ){
    require('../.');
  });
  it('has init', function( ){
    var res = require('../.');
    assert.ok(res.init);
  });
  it('init on mainnet', function(){
    var client = require('../.');
    assert.ok(client.init(null, 'mainnet'));
  });
});
