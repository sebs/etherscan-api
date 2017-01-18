Mainnet:
balance-test.js - passes
eth-test.js - passes
index-test.js - passes
methods-test.js - passes
Testnet:
```javascript
var api = init('YourApiKeyToken','testnet');
testnet-balance-test.js - passes
testnet-eth-test.js - passes
testnet-methods-test.js - fail (cause internal transaction)
```



Testnet data:
address = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae' - this is test account with balance
address with mined blocks - 0x3D6F8823Ad21CD299814B62D198d9001E67E20B3 - because there
are no bloks mined by default address in testnet (return empty message, see reference in test).
0xCe9bb652DD190454B91CEe1f7D5fE6Bac3Ca85Fc - TestBotAttack
