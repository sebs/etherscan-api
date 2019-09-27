<template>
  <div class="example1">
    <prism-editor :code="code" language="js"></prism-editor>
    <h2>Result</h2>
    <md-tabs>
      <md-tab id="tab-pages" md-label="Data">
        <md-table v-model="result.result" md-sort="blockNumber" md-sort-order="asc" md-card md-fixed-header>
          <md-table-toolbar>
            <h1 class="md-title">Users</h1>
          </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="blockNumber" md-sort-by="blockNumber" md-numeric>{{ item.blockNumber }}</md-table-cell>
        <md-table-cell md-label="timeStamp" md-sort-by="timeStamp">{{ item.timeStamp }}</md-table-cell>
        <md-table-cell md-label="hash" md-sort-by="hash">{{ item.hash }}</md-table-cell>
        <md-table-cell md-label="nonce" md-sort-by="nonce">{{ item.nonce }}</md-table-cell>

        <md-table-cell md-label="gas" md-sort-by="gas">{{ item.gas }}</md-table-cell>
        <md-table-cell md-label="gasPrice" md-sort-by="gasPrice">{{ item.gasPrice }}</md-table-cell>
      </md-table-row>
    </md-table>
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
const address = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'
const startblock = 0
const endblock = 99999999
const sort = 'asc'
const res = await client.account('txlist')(address, startblock, endblock, sort)`
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
        const startblock = 0
        const endblock = 99999999
        const sort = 'asc'
        return client.account('txlist')(address, startblock, endblock, sort)
      },
      default: {
        result: []
      }
    }
  }
}
</script>
<style scoped></style>
