<template>
  <div class="example1">
    <prism-editor :code="code" language="js"></prism-editor>
    <h2>Result</h2>
    <md-tabs>
      <md-tab id="tab-pages" md-label="Data">
        <md-field>
          <label>Balance for 0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a</label>
            <md-input :value="result.result[0].balance"></md-input>
        </md-field><br/>
        <md-field>
          <label>Balance for 0x198ef1ec325a96cc354c7266a038be8b5c558f67</label>
            <md-input :value="result.result[1].balance"></md-input>
        </md-field>
      </md-tab>
      <md-tab id="tab-home" md-label="JSON" exact>
        <vue-json-pretty :data="result"></vue-json-pretty>
      </md-tab>
    </md-tabs>
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
const Client = require('etherscan-api/dist/src/Client').Client
const validApiKey = 'TRU5Z5MNWIEYP4F6DPH2T53IJWZIZ5GT1W'

export default {
  components: {
    VueJsonPretty
  },
  name: 'Example2',
  data () {
    return {
      code: `const client = new EtherscanClient.Client(validApiKey);
const res = await client.account('balancemulti')(['0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'
], 'latest')`
    }
  },
  props: {
    msg: String
  },
  asyncComputed: {
    result: {
      get () {
        const client = new Client(validApiKey)
        const address = [
          '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a',
          '0x198ef1ec325a96cc354c7266a038be8b5c558f67' ]
        const tag = 'latest'
        return client.account('balancemulti')(address, tag)
      },
      default: {
        result: [
          {
            balance: 'pending'
          },
          {
            balance: 'pending'
          }
        ]
      }
    }
  }
}
</script>
<style scoped></style>
