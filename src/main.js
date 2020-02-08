import Vue from 'vue'
import App from './App.vue'
import ZeitUI from '@zeit-ui/vue'
import '@zeit-ui/vue/dist/zeit-ui.css' // require ui style
import 'remixicon/fonts/remixicon.css' // require icon style
import VueSkeletonLoader from 'vue-skeleton-loader'

Vue.use(VueSkeletonLoader)
Vue.use(ZeitUI)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
