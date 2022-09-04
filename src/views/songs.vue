<template>
  <div class="songs-container">
    <div class="tab-bar">
      <span class="item" @click="tag = 0" :class="{ active: tag == 0 }">
        全部
      </span>
      <span class="item" @click="tag = 7" :class="{ active: tag == 7 }">
        华语
      </span>
      <span class="item" @click="tag = 96" :class="{ active: tag == 96 }">
        欧美
      </span>
      <span class="item" @click="tag = 8" :class="{ active: tag == 8 }">
        日本
      </span>
      <span class="item" @click="tag = 16" :class="{ active: tag == 16 }">
        韩国
      </span>
    </div>
    <!-- 底部的table -->
    <table class="el-table playlit-table" id="songslists">
      <thead>
      <th></th>
      <th></th>
      <th>音乐标题</th>
      <th>歌手</th>
      <th>专辑</th>
      <th>时长</th>
      </thead>
      <tbody>
      <tr v-for="(item, index) in lists" :key="index" class="el-table__row">
        <td>{{ index + 1 }}</td>
        <td>
          <div class="img-wrap">
            <img :src="item.album.picUrl" alt=""/>
            <!-- 播放按钮 -->
            <span @click="playMusic(item.id)" class="iconfont icon-play"></span>
          </div>
        </td>
        <td>
          <div class="song-wrap">
            <div class="name-wrap">
              <span>{{ item.name }}</span>
              <span class="iconfont icon-mv"></span>
            </div>
            <span></span>
          </div>
        </td>
        <td>{{ item.album.artists['0'].name }}</td>
        <td>{{ item.album.name }}</td>
        <td>{{ item.duration }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
import list from '@/components/list'

export default {
  name: "songs",
  data () {
    return {
      /*歌曲列表*/
      lists: [],
      tag: '0',
      url:''
    }
  },
  methods: {
    getlist () {
      axios({
        method: 'GET',
        url: 'https://autumnfish.cn/top/song',
        params: {
          /*传递 设置的数据*/
          type: this.tag
        }
      }).then(resolve => {
        this.lists = resolve.data.data
        /*处理获取的时间的格式*/
        for (let i = 0; i < this.lists.length; i++) {
          let duration = this.lists[i].duration
          let min = parseInt(duration / 1000 / 60);
          let second = parseInt(duration / 1000 % 60)
          /*判断是否小于10*/
          min = min < 10 ? '0' + min : min
          second = second < 10 ? '0' + second : second
          this.lists[i].duration = `${min}:${second}`
        }
      }).catch(reject => {
        console.log('获取音乐列表失败', reject.message);
      })
    },
    /*播放音乐*/
    playMusic (id) {
      axios({
        method: 'GET',
        url: 'https://autumnfish.cn/song/url',
        params: {
          /*把我点击的这首歌的id传过去，找到我想播放的音源*/
          id: id
        }
      }).then(resolve => {
        this.url=resolve.data.data
        /*直接将父组件的播放路径改变*/
        this.url = this.$parent.musicUrl
      })
    }
  },
  created () {
    this.getlist();
  },
  watch: {
    /*只要tag发生改变就会调用handle函数*/
    tag: {
      handle () {
        this.getlist();
      }
    }
  }
}
</script>

<style scoped>
#songslists {
  margin-top: 30px;
}

.item {
  margin: 10px auto;
  font-size: 25px;
}
</style>