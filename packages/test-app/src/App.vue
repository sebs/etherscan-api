<template>
  <div id="app" class="page-container">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
         <div class="md-toolbar-row">
        <span class="md-title">Etherscan API - Example App</span>
      </div>
       <div class="md-toolbar-row">
         <md-tabs class="md-primary">
            <md-tab id="tab-home" md-label="Home" href="/"></md-tab>
            <md-tab id="tab-account" md-label="Accounts" href="/#/account"></md-tab>
            <md-tab id="tab-contract" md-label="Contracts" href="/#/contract"></md-tab>
            <md-tab id="tab-transaction" md-label="Transactions" href="/#/transaction"></md-tab>
            <md-tab id="tab-block" md-label="Blocks" href="/#/block"></md-tab>
            <md-tab id="tab-eventlog" md-label="Event Logs" href="/#/eventlog"></md-tab>
            <md-tab id="tab-proxy" md-label="Proxy" href="/#/proxy"></md-tab>
            <md-tab id="tab-token" md-label="Tokens" href="/#/token"></md-tab>
            <md-tab id="tab-stats" md-label="Stats" href="/#/stats"></md-tab>
        </md-tabs>
      </div>
      </md-app-toolbar>
    </md-app>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
