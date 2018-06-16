import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import 'etherscan-api/dist/bundle.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@webcomponents/shadycss/apply-shim.min.js';
import 'chartjs-web-components/src/base.js'
import '@polymer/app-layout/app-toolbar/app-toolbar.js'
import '@polymer/paper-tabs/paper-tabs.js'
import '@polymer/paper-tabs/paper-tab.js'
import '@polymer/paper-input/paper-input.js'
import '@polymer/paper-slider/paper-slider.js'
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-dropdown/iron-dropdown.js';
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import './svg-sample-icons.js'
import { installOfflineWatcher } from 'pwa-helpers/network.js';
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
 
        iron-dropdown {
          width: 300px;
          background-color: white;
          color: green;
        }

        #statusicon[disabled], statusicon[disabled="disabled"] {
          border: 1px solid red;
        }
        body {
          margin: 0px;
        }
        app-header-layout {
          margin: 0px;
        }
        app-toolbar {
          /* Toolbar is the main header, so give it some color */
          background-color: #1E88E5;
          font-family: 'Roboto', Helvetica, sans-serif;
          color: white;
          --app-toolbar-font-size: 24px;
        }
      </style>

          <app-header-layout>
            <app-header fixed condenses effects="waterfall" slot="header">
            <app-toolbar>
            <paper-icon-button icon="svg-sample-icons:info" on-tap="_openInfo"></paper-icon-button>
            <paper-icon-button id="statusicon" icon="svg-sample-icons:online-status"></paper-icon-button>
            
            <div main-title>Token Explorer</div>
              <paper-icon-button icon="svg-sample-icons:cart" on-tap="_openBuy"></paper-icon-button>
              <iron-dropdown id="buy" horizontal-align="right" vertical-align="top">
                <div slot="dropdown-content">
                  <h2>Buy</h2>
                  <paper-input label="Buy [[name]]"></paper-input> 
                  <paper-button label="kaufen">Kaufen</paper-button>
                </div>
              </iron-dropdown>
              <paper-icon-button icon="svg-sample-icons:settings" on-tap="_openSettings"></paper-icon-button>
              <iron-dropdown id="settings" horizontal-align="right" vertical-align="top">
                <div slot="dropdown-content">
                  <h2>Settings</h2> 
                  <paper-checkbox checked="{{sendTelemetry}}">Send Telemetry Data</paper-checkbox>
                  <div>Uses Google Analytics</div>
                </div>
              </iron-dropdown>
            </app-toolbar>
           
            <app-toolbar>
                <div main-title>[[name]]</div>
                [[_durationForIndex(duration)]] <paper-slider min="0", max="5" value="{{duration}}"></paper-slider>
                <paper-listbox selected="{{dataset}}">
                <template is="dom-repeat" items="{{datasets}}">
                  <paper-icon-button icon="{{_symbolForIndex(index)}}">foo</paper-icon-button>
                </template> 
              </paper-listbox>
              </app-toolbar>
              <paper-tabs selected="{{selectedToken}}" sticky>
                <template is="dom-repeat" items="{{tokens}}">
                  <paper-tab value="{{item.address}}">{{item.name}}</paper-tab>
                </template> 
              </paper-tabs>
            </app-header>
            <div>

              <div>SUPPLY [[supply]]</div>
              <div id="chartbox"> 
                <base-chart
                  responsive 
                  id="chart" 
                  type="line" 
                  data="{{chartData}}" 
                  options="{{chartOptions}}">
                </base-chart>
              </div>          
            </div>
          </app-header-layout>
    `;
  }
  ready() {
    super.ready();
    this._triggerTokenSupply(this.tokens[0]); 
    installOfflineWatcher((offline) => {

      if (offline) {
        this.$.statusicon.setAttribute('disabled', true);
      } else {
        this.$.statusicon.removeAttribute('disabled');
      }
    })
  }

  _openSettings() {
    this.$.settings.toggle();
  }
  _openBuy() {
    this.$.buy.toggle();
  }

  _triggerTokenSupply(token) {
    var api = etherscanApi.init('');
    var supply = api.stats.tokensupply(null, token.address);
    supply.then((res)=>{
      this.name = token.name;
      this.supply = res.result
    })
  }
  _symbolForIndex(index) {
    return this.datasetsIcons[index]
  }
  _durationForIndex(index) {

    return this.durations[index]
  }
  _changeOption() {
     let token = this.tokens[this.selectedToken];
      this._triggerHistory(token);   
  }
  _changeToken(token) {
    this._triggerTokenSupply(this.tokens[token])
    this._triggerHistory(this.tokens[token]);
  }
  _triggerHistory(token) {
    var me = this;
    let url = `https://coincap.io/history/${this.durations[this.duration]}/${token.name}`;
    
    function _createLabel(token, dataset, duration) {
      return token.name + ' ' + dataset + ' ' + duration;
    }

    if (this.sendTelemetry == true) {
      ga('send', 'event', 'history', token.name, this.durations[this.duration], {
        nonInteraction: false
      });
    }
    
    fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then((data)=>{
        let pick = me.datasets[me.dataset]
        return data[pick]
      })
      .then(function(data) {
        var labels = data.map((row, index)=>{
          return index;
        });
        var data = data.map((row, index)=>{
          return row[1];
        });
        let dataset = me.datasets[me.dataset];
        let duration = me.durations[me.duration]; 
        
        var data = {
          labels: labels,
          datasets: [
              {   
                label: _createLabel(token, dataset, duration),
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
      sendTelemetry: {
        type: Boolean,  
        value: false
      },
      datasetsIcons: {
        type: Array, 
        value: [
          'euro-symbol', 'svg-sample-icons:cap', 'svg-sample-icons:volume'
        ]
      },
      datasets: {
        type: Array, 
        value: [
          'price', 'market_cap', 'volume'
        ]
      },
      dataset: {
        type: Number,
        notify: true,
        observer: '_changeOption',
        value: 0
      },
      duration: {
        type: Number,
        notify: true,
        observer: '_changeOption',
        value: 0
      },
      durations: {
        type: Array, 
        value: [
          '1day', '7day', '30day', '90day', '180day', '365day'
        ]
      },
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
          },{
            address: '0xb5a5f22694352c15b00323844ad545abb2b11028', 
            name: 'ICX'
          },{
            address: '0x05f4a42e251f2d52b8ed15e9fedaacfcef1fad27', 
            name: 'ZIL'
          },
          {
            address: '	0xcb97e65f07da24d46bcdd078ebebd7c6e6e3d750', 
            name: 'BTM'
          },
          
          
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
