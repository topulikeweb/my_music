import Vue from 'vue'
/*引人路由*/
import VueRouter from 'vue-router'
/*引入各组件*/
import discovery from '@/views/discovery'
import playlists from '@/views/playlists'
import mvs from '@/views/mvs'
import songs from '@/views/songs'
import playlist from '@/views/playlist'
import result from '@/views/result'
import mv from '@/views/mv'

Vue.use(VueRouter);
const vuerouter = new VueRouter({
  routes: [{
    /*设置默认组件*/
    path:'./',
    redirect:'/discovery'
  },{
    path: '/discovery',
    component: discovery
  },
    {
      path: '/mvs',
      component: mvs
    },
    {
      path: '/playlists',
      component: playlists
    },
    {
      path: '/songs',
      component: songs
    }, {
      path: '/mv',
      component:mv,
    },
    {
      path:'/result',
      component:result
    },
    {
      path:'/playlist',
      component:playlist
    }]
})
// const originalPush = VueRouter.prototype.push;
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }
// const originalReplace = VueRouter.prototype.place;
// VueRouter.prototype.place = function place(location) {
//   return originalReplace.call(this, location).catch(err => err)
// }
export default vuerouter