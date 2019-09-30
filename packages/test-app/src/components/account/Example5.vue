<template>
  <div class="example5">
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
            <md-table-cell md-label="gasUsed" md-sort-by="gasUsed">{{ item.gasUsed }}</md-table-cell>
            <md-table-cell md-label="gas" md-sort-by="gas">{{ item.gas }}</md-table-cell>
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
  name: 'Example5',
  data () {
    return {
      code: `const client = new EtherscanClient.Client(validApiKey);
const txhash = '0x40eb908387324f2b575b4879cd9d7188f69c8fc9d87c901b9e2daaea4b442170'
const startblock = 0
const endblock = 999999
const sort = 'asc'
const promise = client.account('txlistinternaltxhash')(txhash, startblock, endblock, sort)`
    }
  },
  props: {
    msg: String
  },
  asyncComputed: {
    result: {
      get () {
        const client = new Client(validApiKey)
        const txhash = '0x40eb908387324f2b575b4879cd9d7188f69c8fc9d87c901b9e2daaea4b442170'
        const startblock = 0
        const endblock = 999999
        const sort = 'asc'
        return client.account('txlistinternaltxhash')(txhash, startblock, endblock, sort)
      },
      default: {
        result: []
      }
    }
  }
}
</script>
<style scoped></style>
