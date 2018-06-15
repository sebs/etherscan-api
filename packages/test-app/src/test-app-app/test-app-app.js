import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import 'etherscan-api/dist/bundle.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
/**
 * @customElement
 * @polymer
 */
class TestAppApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h1>[[name]] SUPPLY [[supply]]</h1>
      <paper-listbox selected="{{selectedToken}}">
        <template is="dom-repeat" items="{{tokens}}">
          <paper-item value="{{item.address}}">{{item.name}}</paper-item>
        </template>
        
      </paper-listbox>
    `;
  }
  ready() {
    super.ready();
    this._triggerTokenSupply(this.tokens[0]); 
  }

  _triggerTokenSupply(token) {
    var api = etherscanApi.init('');
    var supply = api.stats.tokensupply(null, token.address);
    supply.then((res)=>{
      this.name = token.name;
      this.supply = res.result
    })
  }

  _changeToken(token) {
    this._triggerTokenSupply(this.tokens[token])
  }

  _triggerBalance(address) {
   
    if (address.detail) {
      address = this.address;
    }
   
    var api = etherscanApi.init('');
    var balance = api.account.balance(address);
    var me = this; 
    balance.then(function(balanceData){
      me.status = balanceData.status
      me.result = balanceData.result;
      me.message = balanceData.message;
    }).catch((err)=>{
      me.status = 'err';
      me.result = 'err'
      me.message = err
    }); 
  }
  static get properties() {
    return {
      tokens: {
        type: Array, 
        notify: true, 
        value: [
          {
            address: '0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0',
            name: 'EOS'
          }, {
            address: '0xf230b790e05390fc8295f4d3f60332c93bed42e2', 
            name: 'Tronix'
          }, {
            address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52', 
            name: 'BNB'
          } 
        ]
      },      
      selectedToken: {
        type: Number, 
        notify: true, 
        observer: '_changeToken', 
        value: 0
      }, 
      supply: {
        type: Number, 
        notify: true
      }, 
      name: {
        type: String, 
        notify: true
      }
    };
  }
}

window.customElements.define('test-app-app', TestAppApp);
