import Vue from 'vue'
import App from './App.vue'
/*全局引入ElementUI，这里怕麻烦，就牺牲一下空间，就不部分引入*/
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 引入全局基础样式
import '@/assets/index.css'
/*接收路由*/
import router from '@/components/router'

/*关闭生产提示*/
Vue.config.productionTip = false
/*使用ElementUI*/
Vue.use(ElementUI);
new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
