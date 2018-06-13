import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import 'etherscan-api/dist/bundle.js';
import '@polymer/paper-input/paper-input.js';
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
      <h2>Hello [[prop1]]!</h2>
      <paper-input
        label="Account Address"
        value="{{address}}"
        on-change="_triggerBalance"
        ></paper-input>

      <ul>
        <li>{{result.status}}</li>
        <li>{{result.message}}</li>
        <li>{{result.result}}</li>
      </ul>
    `;
  }
  ready() {
    super.ready();
    this._triggerBalance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'); 
  }
  _triggerBalance(address) {
    var api = etherscanApi.init('');
    var balance = api.account.balance(address);
    var me = this; 
    balance.then(function(balanceData){
      me.result = balanceData
    }); 
  }
  static get properties() {
    return {
      result: {
        type: Object,
        notify: true
      },
      address: {
        type: String,
        value: 'test-app-app',
        notify: true, 
        value: '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'
      }
    };
  }
}

window.customElements.define('test-app-app', TestAppApp);
