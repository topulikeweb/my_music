<template>
  <div class="result-container">
    <div class="title-wrap">
      <!-- 标题 -->
      <h2 class="title">{{ $route.query.q }}</h2>
      <span class="sub-title">找到 {{ count }} 个结果</span>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲" name="songs">
        <table class="el-table">
          <thead>
          <th></th>
          <th>音乐标题</th>
          <th>歌手</th>
          <th>专辑</th>
          <th>时长</th>
          </thead>
          <tbody class="songtop">
          <tr
              v-for="(item, index) in songList"
              :key="index"
              class="el-table__row"
              @dblclick="playMusic(item.id)"
              id="songlist"
          >
            <td>1</td>
            <td>
              <div class="song-wrap">
                <div class="name-wrap">
                  <!-- 歌名 -->
                  <span>{{ item.name }}</span>
                  <!-- mv的图标 -->
                  <span v-if="item.mvid != 0" class="iconfont icon-mv"></span>
                </div>
                <!-- 二级标题 -->
                <span v-if="item.alias.length != 0">{{ item.alias[0] }}</span>
              </div>
            </td>
            <td>{{ item.artists[0].name }}</td>
            <td>{{ item.album.name }}</td>
            <td>{{ item.duration }}</td>
          </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="lists">
        <div class="items">
          <div
              v-for="(item, index) in playlists"
              :key="index"
              class="item"
              @click="toPlaylist(item.id)"
          >
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{ item.playCount }}</span>
              </div>
              <img :src="item.coverImgUrl" alt=""/>
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="MV" name="mv">
        <div class="items mv">
          <div v-for="(item, index) in mv" :key="index" class="item" @click="toMV(item.id)">
            <div class="img-wrap">
              <!-- 封面 -->
              <img :src="item.cover" alt=""/>
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <!-- 播放次数 -->
                <div class="num">{{ item.playCount }}</div>
              </div>
              <!-- 持续时间 -->
              <span class="time">{{ item.duration }}</span>
            </div>
            <div class="info-wrap">
              <!-- mv名 -->
              <div class="name">{{ item.name }}</div>
              <!-- 歌手名 -->
              <div class="singer">{{ item.artistName }}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "result",
  data () {
    return {
      // tab切换时 会改变的数据
      activeIndex: 'songs',
      // 保存 查询歌曲
      songList: [],
      // 保存歌单的字段
      playlists: [],
      // 保存mv的字段
      mv: [],
      // 搜索结果的总数
      count: 0,
      //播放地址
      url:''
    }
  },
  created () {
    axios({
      method: 'GET',
      url: 'https://autumnfish.cn/search',
      params: {
        /*接收top组件传过来的数据*/
        keywords: this.$route.query.q,
        type: 1,
        limit: 15
      }
    }).then(resolve => {
      console.log('zh', resolve)
      // console.log(this.$route.query.q)
      this.songList = resolve.data.result.songs
      /*处理获取的时间的格式*/
      // 计算歌曲时间
      for (let i = 0; i < this.songList.length; i++) {
        let min = parseInt(this.songList[i].duration / 1000 / 60)
        let sec = parseInt((this.songList[i].duration / 1000) % 60)
        if (min < 10) {
          min = '0' + min
        }
        if (sec < 10) {
          sec = '0' + sec
        }
        // console.log(min + '|' + sec)
        this.songList[i].duration = min + ':' + sec
      }
      this.count = resolve.data.result.songCount
    }).catch('失败')
  },
  watch: {
    activeIndex: {
      handler () {
        // songs 歌曲
        // lists 歌单
        // mv    mv
        let type = 1

        // 获取个数
        let limit = 10
        switch (this.activeIndex) {
          case 'songs':
            type = 1
            limit = 10
            break
          case 'lists':
            type = 1000
            limit = 10
            break
          case 'mv':
            type = 1004
            limit = 8
            break

          default:
            break
        }
        axios({
          method: 'GET',
          url: 'https://autumnfish.cn/search',
          params: {
            keywords: this.$route.query.q,
            type: type,
            limit: 8
          }
        }).then(resolve => {
          if (type === 1) {
            this.playlists = resolve.data.res.songs
            // 计算歌曲时间
            for (let i = 0; i < this.songList.length; i++) {
              let min = parseInt(this.songList[i].duration / 1000 / 60)
              let sec = parseInt((this.songList[i].duration / 1000) % 60)
              if (min < 10) {
                min = '0' + min
              }
              if (sec < 10) {
                sec = '0' + sec
              }
              // console.log(min + '|' + sec)
              this.songList[i].duration = min + ':' + sec
            }
            this.count = resolve.data.result.songCount
            /*如果是获取歌单的话*/
          } else if (type === 1000) {
            this.playlists = resolve.data.result.playlists
            /*总数*/
            this.count = resolve.data.result.playlistsCount
          } else {
            /*当选择mv时*/
            this.mv = resolve.data.result.mvs
            this.count = resolve.data.res.mvCount

            /*格式化时间*/
            for (let i = 0; i < this.mv.length; i++) {
              // 时间
              let min = parseInt(this.mv[i].duration / 1000 / 60)
              let sec = parseInt((this.mv[i].duration / 1000) % 60)
              if (min < 10) {
                min = '0' + min
              }
              if (sec < 10) {
                sec = '0' + sec
              }
              this.mv[i].duration = min + ':' + sec
            }
          }
        })
      }
    }
  },
  methods:{
    /*去往mv详情页*/
    toMV (id) {
      this.$route.push(`/mv?q=${id}`)
    },
    /*去往歌单详情页*/
    toPlaylist (id) {
      this.$route.push(`/playlist?q=${id}`)
    },
    playMusic (id) {
      axios({
        method:'GET',
        url:'https://autumnfish.cn/song/url',
        params:{
          id:id
        },
      }).then(resolve=>{
        this.url=resolve.data.data[0].url
        this.$parent.musicUrl=this.url
      })
    }
  }
}
</script>

<style scoped>
tr {
  height: 40px;
  margin: 10px auto;
}
</style>