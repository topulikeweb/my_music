<template>
  <div>
    <!-- 轮播图 -->
    <el-carousel indicator-position="outside">
      <el-carousel-item v-for="(item,index) in banners" :key="index">
        <h3><img :src="item.imageUrl" alt="" style="width: 100%"/></h3>
      </el-carousel-item>
    </el-carousel>
    <!-- 推荐列表   -->
    <ul class="recommend">
      <h2 class="title" >
        推荐歌单
      </h2>
      <div class="items">
        <li class="item" v-for="(item, index) in list" :key="index">
          <div class="img-wrap">
            <div class="desc-wrap">
              <span class="desc">{{ item.copywriter }}</span>
            </div>
            <img :src="item.picUrl" alt="" class="desc-img"/>
            <span class="iconfont icon-play" @click="toPlaylist(item.id)"></span>
          </div>
          <p class="name">{{ item.name }}</p>
        </li>
      </div>
    </ul>
    <!-- 最新音乐 -->
    <div class="news">
      <h2 class="title" id="songs">
        最新音乐
      </h2>
      <div class="items">
        <div class="item" v-for="(item, index) in songs" :key="index">
          <div class="img-wrap">
            <!-- 封面 -->
            <img :src="item.picUrl" alt="" class="songs"/>
            <span @click="playMusic(item.id)" class="iconfont icon-play"></span>
          </div>
          <div class="song-wrap">
            <!-- 歌名 -->
            <div class="song-name">{{ item.name }}</div>
            <!-- 歌手名 -->
            <div class="singer">{{ item.song.artists[0].name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/*引入axios*/
import axios from 'axios'

export default {
  name: "discovery",
  data () {
    return {
      banners: [],
      list: [],
      songs: [],
    }
  },
  /*创建的时候就调用*/
  created () {
    /*请求轮播图图片*/
    axios.get('https://autumnfish.cn/banner').then(resolve => {
      this.banners = resolve.data.banners.slice(0, 4);
      // console.log(resolve)
    }).catch(reject => {
      console.log('图片请求失败');
    })
    /*请求推荐列表数据*/
    axios({
      method: 'GET',
      url: 'https://autumnfish.cn/personalized',
      params: {
        /*限制请求到的数据的数量*/
        limit: 12
      }
    }).then(resolve => {
      this.list = resolve.data.result
      // console.log(resolve)
    }).catch(reject => {
      console.log('请求的推荐列表失败')
    })
    axios({
      method: 'GET',
      url: 'https://autumnfish.cn/personalized/newsong',
      /*限制请求到的数据的数量*/
      params:{
        limit: 8
      }
    }).then(resolve => {
      this.songs = resolve.data.result
    }).catch(reject => {
      console.log('请求最新歌曲失败')
    })
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

.desc-img {
  width: 240px;
  height: 250px;
  border-radius: 8px;
}

.item {
  float: left;
  margin-right: 20px;
  margin-top: 50px;
  margin-left: 20px;
}
.songs{
  width: 300px;
  height: 310px;
  border-radius: 8px;
}
#songs{
  position: relative;
  top: 1300px;
}
.news{
 position: relative;
  top: 100px;
}
</style>