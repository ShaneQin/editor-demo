import Vue from 'vue'
import App from './App.vue'
import vSelectMenu from 'v-selectmenu'
import Clipboard from 'v-clipboard'

Vue.use(vSelectMenu)

Vue.use(Clipboard)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
