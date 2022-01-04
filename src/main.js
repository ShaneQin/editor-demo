import Vue from 'vue'
import App from './App.vue'
import vSelectMenu from 'v-selectmenu'
import Clipboard from 'v-clipboard'
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

Vue.use(vSelectMenu)
Vue.component('vue-draggable-resizable', VueDraggableResizable)

Vue.use(Clipboard)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
