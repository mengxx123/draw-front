import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import About from '@/components/About'
import Help from '@/components/Help'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            component: HelloWorld
        },
        {
            path: '/about',
            component: About
        },
        {
            path: '/help',
            component: Help
        }
    ]
})
