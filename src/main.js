import Vue from 'vue'
import App from './App.vue'

import Video from 'video.js'
import Config from './tempConfig'
import 'video.js/dist/video-js.css'
Vue.prototype.$video = Video
Vue.prototype.$config = new Config()

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
