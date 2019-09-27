import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import 'prismjs'
import 'prismjs/themes/prism.css'
import VuePrismEditor from 'vue-prism-editor'
import 'vue-prism-editor/dist/VuePrismEditor.css'
import AsyncComputed from 'vue-async-computed'

Vue.component('prism-editor', VuePrismEditor)

Vue.use(VueMaterial)
Vue.use(AsyncComputed)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
