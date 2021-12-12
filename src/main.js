import Vue from 'vue'
import App from './App.vue'
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'

Vue.use(contentmenu)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
