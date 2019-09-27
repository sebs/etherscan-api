<template>
  <div class="example1">
    <prism-editor :code="code" language="js"></prism-editor>
    <h2>Result</h2>
    <md-tabs>
      <md-tab id="tab-pages" md-label="Data">
        <md-field>
          <label>Balance</label>
            <md-input :value="result.result"></md-input>
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
  name: 'Example1',
  data () {
    return {
      code: `const client = new EtherscanClient.Client(validApiKey);
const res = await client.account('balance')('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae', 'latest')`
    }
  },
  props: {
    msg: String
  },
  asyncComputed: {
    result: {
      get () {
        const client = new Client(validApiKey)
        const address = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'
        const tag = 'latest'
        return client.account('balance')(address, tag)
      },
      default: {
        result: 'pending'
      }
    }
  }
}
</script>
<style scoped></style>
