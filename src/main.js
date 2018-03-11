import Vue from 'vue'
import App from './App'
import router from './router'
import './js/draw'
import './js/index'
import ui from './components/index'
// 全部加载
import YunserUI from 'yunser-ui-vue'
import 'yunser-ui-vue/dist/yunser-ui.css'
import './scss/main.scss'
Vue.use(YunserUI)
Vue.use(ui)

Vue.config.productionTip = false

// Vue.prototype.$http = http
// Vue.prototype.$qs = qs
// Vue.prototype.$storage = storage

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {App}
})
