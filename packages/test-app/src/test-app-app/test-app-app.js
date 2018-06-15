import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import 'etherscan-api/dist/bundle.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@webcomponents/shadycss/apply-shim.min.js';
import 'chartjs-web-components/src/base.js'
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

        base-chart {
      
          width: 300px;
          height: 300px;
        }
      </style>
      <h1>[[name]] SUPPLY [[supply]]</h1>
      <base-chart id="chart" type="bar" data="{{chartData}}" options="{{chartOptions}}"></base-chart>

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
    this._triggerHistory(this.tokens[token]);
  }
  _triggerHistory(token) {
    var me = this;
    fetch('http://coincap.io/history/1day/'+token.name)
      .then(function(response) {
        return response.json();
      })
      .then((data)=>{
        return data.price
      })
      .then(function(data) {
        var labels = data.map((row, index)=>{
          return index;
        });
        var data = data.map((row, index)=>{
          return row[1];
        });
        
        var data = {
          labels: labels,
          datasets: [
              {
                  data: data
              }]
      };
        me.chartData = data;
      });
  };
  
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
            name: 'TRX'
          }, {
            address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52', 
            name: 'BNB'
          }, {
            address: '0xd850942ef8811f2a866692a623011bde52a462c1', 
            name: 'VEN'
          },
          {
            address: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07', 
            name: 'OMG'
          }

        ]
      },      
      selectedToken: {
        type: Number, 
        notify: true, 
        observer: '_changeToken', 
        value: 0
      }, 
      chartData: {
        type: Object, 
        notify: true, 
        value: ()=>{
          return {}
        }
      },
      chartOptions: {
        type: Object, 
        notify: true, 
        value: ()=>{
          return {}
        }
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
